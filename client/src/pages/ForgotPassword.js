import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Form, Input, Button, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const baseUrl = "https://doctor-app-backend-yap2.onrender.com";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { id, token } = useParams();

  const dispatch = useDispatch();
  const setVal = (e) => {
    setPassword(e.target.value);
  };

  const userValid = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${baseUrl}/api/user/forgotPassword/${id}/${token}`);
      dispatch(hideLoading());
      if (response.data.success === false) {
        // Handle invalid link
        toast.error(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Link expires, generate a new link");
      navigate("/");
    }
  };

  const sendPassword = async (e) => {
    try {
      e.preventDefault();
      dispatch(showLoading());
      const response = await axios.post(`${baseUrl}/api/user/password/${id}/${token}`,{password});
      dispatch(hideLoading());
      
      if (response.data.success===false) {
        toast.error(response.data.message);
      } else {
        setPassword("");
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {

      dispatch(hideLoading());
      toast.error('Link expires, generate a new link');
    }
  };

  useEffect(() => {
    userValid();
  }, []);

  return (
    <section>
      <div className="authentication">
        <div className="authentication-form card p-3">
        <h1 className="card-title">Enter New Password</h1>
        
        <Form layout="vertical">
          <Form.Item label="New Password" name="password">
            <Input
              type="password"
              value={password}
              onChange={setVal}
              placeholder="Enter New Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="primary-button my-2 full-width-btn"
              onClick={sendPassword}
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

export default ForgotPassword;

