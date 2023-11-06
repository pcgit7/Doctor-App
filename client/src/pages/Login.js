import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  const onfinish = async (values) => {

    try {
      dispatch(showLoading());
      const response = await axios.post(`${baseUrl}/api/user/login`, values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else toast.error(response.data.message);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome Back</h1>

        <Form onFinish={onfinish} layout="vertical">
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button my-2 full-width-btn" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/password-reset" className="anchor">
            FORGOT PASSWORD
          </Link>
          
          <Link to="/register" className="anchor">
            CLICK HERE TO REGISTER
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;
