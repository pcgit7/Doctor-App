import React from 'react'
import {Form ,Input ,Button} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';


const Register = () => {

  const baseUrl = "http://localhost:5000";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onfinish = async (values) => {
    try
    {
      dispatch(showLoading());

      const response = await axios.post(`${baseUrl}/api/user/register`,values);
      dispatch(hideLoading());
      if(response.data.success)
      {
        toast.success(response.data.message);
        navigate('/login');
      }

      else 
      toast.error(response.data.message);
    } 
    catch (error) 
    {
      dispatch(hideLoading());
      toast.error('something went wrong');
    }
  };

  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>
        <h1 className='card-title'>Nice To Meet U</h1>

        <Form layout='vertical' onFinish={onfinish}>
          <Form.Item label='Name' name='name'>
            <Input placeholder='Name'/>
          </Form.Item>

          <Form.Item label='Email' name='email'>
            <Input placeholder='Email'/>
          </Form.Item>

          <Form.Item label='Password' name='password' >
            <Input placeholder='Password'type='password'/>
          </Form.Item>

          <Button className="primary-button my-2 full-width-btn" htmlType='submit'>REGISTER</Button>

          <Link to = '/login' className='anchor mt-2'>CLICK HERE TO LOGIN</Link>
        </Form>
      </div>
    </div>
  )
}

export default Register
