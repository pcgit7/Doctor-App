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

  const onFinish = async (values) => {
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
      toast.error("Something went wrong");
    }
  };

  const validateEmail = (rule, value, callback) => {
    if (!value || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
      callback();
    } else {
      callback("Invalid email format");
    }
  };

  const validatePassword = (rule, value, callback) => {
    if (!value || value.length >= 6) {
      callback();
    } else {
      callback("Password must be at least 6 characters long");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome Back</h1>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { validator: validateEmail },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { validator: validatePassword },
            ]}
          >
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
