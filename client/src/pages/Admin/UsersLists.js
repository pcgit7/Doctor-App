import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import moment from "moment";

const UsersLists = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const baseUrl = "https://doctor-app-backend-yap2.onrender.com";

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`${baseUrl}/api/admin/get-all-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        dispatch(hideLoading());
        dispatch(setUsers(response.data.data));
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render : (record,text) => {
        return (
          moment(record.createdAt).format("DD-MM-YYYY")
        )
      }
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return(
        <div className="d-flex">
          <h1 className="anchor">Block</h1>
        </div>
      )},
    },
  ];
  
  return (
    <Layout>
      <h1 className="page-header">Users Lists</h1>
      <Table columns={columns} dataSource={users}/>
    </Layout>
  );
};

export default UsersLists;
