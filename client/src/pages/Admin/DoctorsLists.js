import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading,hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";

const DoctorsLists = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const baseUrl = "https://doctor-app-backend-yap2.onrender.com";

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${baseUrl}/api/admin/get-all-doctors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setDoctors(response.data.data));
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const changeDoctorStatus = async (record,status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(`${baseUrl}/api/admin/change-doctor-status`,{
        userId : record.userId,
        doctorId : record._id,
        status : status,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      //console.log(response);
      if (response.data.success) {
        dispatch(hideLoading());
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <h1 className="normal-text">
            {record.firstName} {record.lastName}
          </h1>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },

    {
      title: "status",
      dataIndex: "status",
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="d-flex">
            {record.status === "pending" && <h1 className="anchor" onClick={()=>{changeDoctorStatus(record,'approved')}}>Approve</h1> }
            {record.status === "approved" && <h1 className="anchor" onClick={()=>{changeDoctorStatus(record,'blocked')}}>Block</h1> }
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <h1 className="page-header">Doctor Lists</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default DoctorsLists;
