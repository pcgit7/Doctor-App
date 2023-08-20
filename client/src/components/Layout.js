import React, { useState } from "react";
import "./layout.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/Appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Apply Doctor",
      path: "/Apply-Doctor",
      icon: "ri-hospital-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/Appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: "ri-user-star-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">DA</h1>
            <h1 className="role">{role}</h1>
          </div>

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;

              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i class={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name} </Link>}
                </div>
              );
            })}

            <div
              className={`d-flex menu-item`}
              onClick={() => {
                dispatch(setUser(null));
                localStorage.clear();
              }}
            >
              <i class="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {!collapsed ? (
              <i
                className="ri-close-line header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            ) : (
              <i
                className="ri-menu-line header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge count={user?.unseenNotifications.length} onClick = { () => {
                navigate('/notifications')
              }}>
              <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>
              <Link className="anchor mx-2" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
