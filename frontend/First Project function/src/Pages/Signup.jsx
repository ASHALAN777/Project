import React, { useState } from "react";
import "../css/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, role } = signup;

    if (!name || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signup),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }
      toast.success("Signup successful");
      setTimeout(() => {
        navigate("/login");
      }, 1200);

      setSignup({
        name: "",
        email: "",
        password: "",
        role: "",
        adminCode: "",
      });
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="container">
      <form className="form1" onSubmit={handleSubmit}>
        <h4>Sign-up</h4>

        <div className="input0">
          <label>Name</label>
          <input
            className="input1"
            name="name"
            value={signup.name}
            onChange={handleChange}
          />
        </div>

        <div className="input0">
          <label>Email</label>
          <input
            className="input1"
            name="email"
            value={signup.email}
            onChange={handleChange}
          />
        </div>

        <div className="input0">
          <label>Password</label>
          <input
            className="input1"
            name="password"
            type="password"
            value={signup.password}
            onChange={handleChange}
          />
        </div>


        <div className="input0">
          <label>Role</label>
          <select name="role" value={signup.role} onChange={handleChange}>
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
          {signup.role === "Admin" && (
          <div className="input0">
          
            <input
              className="input1"
              name="adminCode"
              type="password"
              placeholder="Enter Admin code"
              value={signup.adminCode}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit">Submit</button>
        <br />

        <span1 style={{width:"auto"}} >
          Already have an account? <Link to="/login">Login</Link>
        </span1>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Signup;
