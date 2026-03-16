import React, { useState } from "react";
import "../css/Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Otpverify() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Get email passed from ForgotPassword page
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ If no email — go back to forgot password
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      toast.success("OTP Verified!");

      // ✅ Pass email + otp to reset password page
      setTimeout(() => {
        navigate("/reset-password", { state: { email, otp } });
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
        <h4>Verify OTP</h4>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" ,background:"none"}}>
          OTP sent to <strong style={{background:"none"}}>{email}</strong>
        </p>

        <div className="input0">
          {/* <label style={{width:"auto"}}>Enter OTP</label> */}
          <input
            type="text"
            className="input1"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            placeholder="Enter 6 digit OTP"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
        <br />

        <span1 style={{width:"auto"}}>
          Didn't get OTP? <Link to="/forgot-password">Resend</Link>
        </span1>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Otpverify;
