import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

const ApplyDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const baseUrl = "http://localhost:5000";

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(`${baseUrl}/api/user/apply-doctor-account`, {
        ...values,
        userId: user._id,
        timings : [
          moment(values.timings[0].$d).format("HH:mm"),
          moment(values.timings[1].$d).format("HH:mm"),
       ]
      },
      {
        headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) 
      {
        toast.success(response.data.message);
        navigate("/");
      } 
      else toast.error(response.data.message);
    } 
    catch (error) 
    {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish}/>
    </Layout>
  );
};

export default ApplyDoctor;
