import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import Main from "../inpages/Main1";
import "../css/Admin.css";
import { Outlet } from "react-router-dom";
import Navbar from "../inpages/Navbar";
import { useContext } from "react";
import { AuthContext } from "../Customhooks/AuthProvider";
import EMSidebar from "../inpages/Employe Sidebar";
import axios from "axios";

const Dashboard = () => {
  const { user, loading, Login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const scheduleref = (expire) => {
    const refreshtime = (expire - 60) * 1000;

    setTimeout(async () => {
      try {
        await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );
        // console.log("Token proactively refreshed! ✅");
        scheduleref(20 * 60);
      } catch {
        navigate("/login");
      }
    }, refreshtime);
  };

  useEffect(() => {
    if (user) {
      scheduleref(30);
    }
  }, [user]);

  useEffect(() => {
  

    if (!user) {
      axios
        .post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true })
        .then(() => {
          return axios.get(`${API_URL}/api/auth/me`, {
            withCredentials: true,
          });
        })
        .then((res) => {
          Login(res.data.user);
        })
        .catch((err) => {
          navigate("/login");
        });
    } else {
    }
  }, [user, loading]);
  if (loading) return; <p> Loading... </p>;

  if (!user) return null;

  return (
    <div>
      <div style={{ display: "flex", height: "100vh" }}>
        <EMSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />

          <div style={{ flex: 1, overflowY: "auto" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
