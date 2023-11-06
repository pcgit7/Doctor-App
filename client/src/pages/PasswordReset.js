import React, { useState } from "react";
import { Form, Input, Button} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { CheckCircleFilled } from "@ant-design/icons";
import {useDispatch} from 'react-redux';
import { hideLoading, showLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";


const PasswordReset = () => {
  const baseUrl = "http://localhost:5000";
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const setVal = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = async (e) => {
    try {
        dispatch(showLoading());
      const response = await axios.post(`${baseUrl}/api/user/sendPasswordResetLink`,{email} );
      dispatch(hideLoading());
      if (response.data.success) {
        setEmail("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
        console.log(error);
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };

  return (
    <section>
      <div className="authentication">
        <div className="authentication-form card p-3">
          <h1 className="card-title">Enter Your Email</h1>

          <Form onFinish={sendLink} layout="vertical">
            <Form.Item label="Email" name="email">
              <Input
                value={email}
                onChange={setVal}
                name="email"
                placeholder="Enter Your Email Address"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="primary-button my-2 full-width-btn"
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default PasswordReset;
