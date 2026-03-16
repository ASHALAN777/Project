import React from "react";
import "../inpages-src/Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../Customhooks/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const API_URL = import.meta.env.VITE_API_URL;

  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return null;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      navigate("/login");
    } catch (err) {
      // console.error("Logout failed", err);
    }
  };

  const titlechange = () => {
    if (user.role === "Employee") {
      return "Employee Dashboard";
    } else {
      return "Admin Dashboard";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="welcome-message">Welcome {user.name}</h1>
        <h3 className="dashboard-title">{titlechange()}</h3>
        <button className="logout-btn1" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
