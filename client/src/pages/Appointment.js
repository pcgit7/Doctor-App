import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading,showLoading } from "../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

const Appointment = () => {

    const baseUrl = "http://localhost:5000";
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    
    const getAppointmentsData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(`${baseUrl}/api/user/get-appointments-by-user-id`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
      }
    };

    const columns = [
        {
            title : "Id",
            dataIndex : "_id",
        },

        {
            title : "Doctor",
            dataIndex : "name",
            render : (text,record) => {
                return (
                    <span>
                        {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                    </span>
                )
            },
        },
        {
          title: "Phone",
          dataIndex: "phoneNumber",
          render : (text,record) => {
            return (
                <span>
                    {record.doctorInfo.phoneNumber}
                </span>
            )
        },
        },
        {
          title: "Date & Time",
          dataIndex: "createdAt",
          render : (text,record) => {
            const utcTime = moment.utc(record.time).format('l LT');
            return (
                <span>
                    {moment(record.date).format("DD-MM-YYYY")} {moment(utcTime).format("HH:mm")}
                </span>
            )
        },
        },
        {
            title : "Status",
            dataIndex : "status",
        }
      ];

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr/>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default Appointment
