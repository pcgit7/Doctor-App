import React from "react";
import {  Navigate , useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { showLoading,hideLoading } from "../redux/alertsSlice";

const ProtectedRoutes = (props) => {
    
  const { user } = useSelector((state) => state.user);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const baseUrl = "https://doctor-app-backend-yap2.onrender.com";
       dispatch(showLoading()); 
       const response = await axios.post(
        `${baseUrl}/api/user/get-user-info-by-id`,
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) 
      {
        dispatch(setUser(response.data.data));
      }
       else
       {
        localStorage.clear();
        navigate("/login");
       } 
       
    } 
    
    catch (error) 
    {
      localStorage.clear();  
      dispatch(hideLoading());
      navigate("/login");
    }
  };

  useEffect(() => {
    if(!user)
    getUser();
  }, [user]);

  if (localStorage.getItem("token")) 
  return props.children;

  else {
    return <Navigate to="/login"/>
  }
};

export default ProtectedRoutes;
