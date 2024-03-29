import axios from "axios";
import React, { useState,useEffect } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm";
import moment from "moment";

const Profile = () => {
  const baseUrl = "https://doctor-app-backend-yap2.onrender.com";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  
  const onFinish = async (values) => {
    try {
      
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/doctor/update-doctor-profile`,
        {
            userId: user._id,  
            ...values,
             timings : [
                moment(values.timings[0].$d).format("HH:mm"),
                moment(values.timings[1].$d).format("HH:mm"),
             ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting to login page");
        navigate("/");
      } else toast.error(response.data.message);
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/doctor/get-doctor-info-by-user-id`,{},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor}/>}
    </Layout>
  );
};

export default Profile;
