import React from "react";
import Layout from "../components/Layout";
import { notification, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { setUser } from "../redux/userSlice";

const Notification = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `${baseUrl}/api/user/mark-all-notifications-as-seen`,
        {
          userId: user._id,
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
        dispatch(setUser(response.data.data));
      } else toast.error(response.data.message);
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      
      const response = await axios.post(
        `${baseUrl}/api/user/delete-all-notifications-as-seen`,
        {
          userId: user._id,
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
        dispatch(setUser(response.data.data));
      } else toast.error(response.data.message);
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  return (
    <Layout>
      <h1>Notification</h1>
      <hr/>
      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end">
            <h1 className="subtitle cursor-pointer" onClick={markAllAsSeen}>
              Mark all as seen
            </h1>
          </div>

          {user?.unseenNotifications.map((notification) => {
            return (
              <div
                className="card p-2 mt-2 cursor-pointer"
                onClick={() => navigate(notification.onclickPath)}
              >
                <div className="card-text">{notification.message}</div>
              </div>
            );
          })}
        </Tabs.TabPane>

        <Tabs.TabPane tab="Seen" key={1}>
          <div className="d-flex justify-content-end cursor-pointer">
            <h1 className="subtitle" onClick={deleteAll}>Delete All</h1>
          </div>
          {user?.seenNotifications.map((notification) => {
            return (
              <div
                className="card p-2 mt-2 cursor-pointer"
                onClick={() => navigate(notification.onclickPath)}
              >
                <div className="card-text">{notification.message}</div>
              </div>
            );
          })}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default Notification;
