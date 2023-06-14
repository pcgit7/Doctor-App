import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const baseUrl = "https://doctor-app-backend-yap2.onrender.com";

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `${baseUrl}/api/doctor/get-appointments-by-doctor-id`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/doctor/change-appointment-status`,
        {
          appointmentId: record._id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      //console.log(response);
      if (response.data.success) {
        dispatch(hideLoading());
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },

    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => {
        return <span>{record.userInfo.name}</span>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (text, record) => {
        return <span>{record.doctorInfo.phoneNumber}</span>;
      },
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => {
        return (
          <span>
            {moment(record.date).format("DD-MM-YYYY")}{" "}
            {moment(record.time).format("HH:mm")}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="d-flex">
            {record.status === "pending" && (
              <div className="d-flex">
                <h1
                  className="anchor"
                  onClick={() => {
                    changeAppointmentStatus(record, "approved");
                  }}
                >
                  Approve
                </h1>
                <h1
                  className="anchor px-2"
                  onClick={() => {
                    changeAppointmentStatus(record, "rejected");
                  }}
                >
                  Reject
                </h1>
              </div>
            )}
          </div>
        );
      },
    },
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
};

export default DoctorAppointment;
