import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Get email + otp passed from VerifyOTP page
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newpassword, setNewpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ If no email or otp — go back to forgot password
  if (!email || !otp) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newpassword || !confirmpassword) {
      toast.error("All fields are required");
      return;
    }

    if (newpassword !== confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newpassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newpassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Password changed successfully!");

      // ✅ Go to login after success!
      setTimeout(() => {
        navigate("/login");
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
        <h4>Reset Password</h4>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px",  background:"none"}}>
          Enter your new password!
        </p>

        <div className="input0">
          <label>New Password</label>
          <input
            type="password"
            className="input1"
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
            required
          />
        </div>

        <div className="input0">
          <label>Confirm Password</label>
          <input
            type="password"
            className="input1"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
          />
        </div>

        <button style={{width:"auto"}} type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ResetPassword;
