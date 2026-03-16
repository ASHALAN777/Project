import React from "react";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Please enter your email");
        return;
      }
      toast.success("OTP sent to your email");

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1500);
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form1" onSubmit={handleSubmit}>
        {" "}
        <h4> Forgot Password</h4>{" "}
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          Enter your email and we'll send you an OTP! </p>
          <div className="input0"><label>Email</label> <input type="email" className="input1" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
          <button type="submit" disabled = {isLoading}> {isLoading?"Sending OTP..." : "Send OTP"}</button>
          <br />
          <span1 style={{width:"auto"}}>  Remember password? <Link to ="/login" >Login</Link></span1>
      </form>

      <ToastContainer position = "top-right" autoClose = {3000} />
    </div>
  );
}



export default  ForgotPassword;