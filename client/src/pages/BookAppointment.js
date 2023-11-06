import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {

  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const { user } = useSelector((state) => state.user);

  const [isAvailable, setIsAvailable] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const params = useParams();
  const dispatch = useDispatch();
  const baseUrl = "http://localhost:5000";

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/doctor/get-doctor-info-by-id`,
        {
          doctorId: params.doctorId,
        },
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

  const bookNow = async () => {
    try {
      
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          date: date,
          time: time,
          doctorInfo: doctor,
          userInfo: user,
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
        navigate('/appointments')
      }
    } catch (error) {
      toast.error("error in booking appointment ");
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/user/check-booking-availability`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          date: date,
          time: time,
          doctorInfo: doctor,
          userInfo: user,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setIsAvailable(true);
        toast.success(response.data.message);
      } else {
        setIsAvailable(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("error in checking appointment ");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />

          <Row gutter={20} align="middle" className="mt-5">
            <Col span={12} xs={24} lg={8} sm={24}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                width="100%"
                height="300"
              />
            </Col>
            <Col span={12} xs={24} lg={8} sm={24}>
              <h1 className="normal-text mt-4">
                <b>Timings : </b> {doctor.timings[0]} to {doctor.timings[1]}
              </h1>
              <p className="card-text">
                <b>Phone Number : </b> {doctor.phoneNumber}
              </p>
              <p className="card-text">
                <b>Address :</b> {doctor.address}
              </p>
              <p className="card-text">
                <b>Fee per visit :</b> {doctor.feePerCunsultation}
              </p>
              <p className="card-text">
                <b>Website :</b> {doctor.website}
              </p>

              <div className="d-flex flex-column mt-2 pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(moment(value.$d).format("DD-MM-YYYY"));
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value.$d).format("HH:mm"));
                  }}
                />

                {!isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-btn"
                    onClick={checkAvailability}
                  >
                    Check-Availability
                  </Button>
                )}
                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-btn"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
};

export default BookAppointment;
