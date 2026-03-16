import React, { useState } from "react";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AuthContext } from "../Customhooks/AuthProvider.jsx";

function Login() {
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { Login: authLogin } = useContext(AuthContext);
  
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  // Added loading state to disable button during request
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = login;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for cookies/sessions
          body: JSON.stringify(login),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
        setIsLoading(false); // Stop loading on error
        return;
      }
      if (data.user) {
        authLogin(data.user);
      } else {
        authLogin(data);
      }

      toast.success("Login successful!");

      // Role-based navigation
      const role = data.role;
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      // console.error("Login Error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false); // Ensure loading stops regardless of outcome
    }
  };

  return (
    <div className="container">
      <form className="form1" onSubmit={handleSubmit}>
        <h4>Login</h4>

        <div className="input0">
          <label>Email</label>
          <input
            type="email" // Better for mobile keyboards and validation
            className="input1"
            name="email"
            value={login.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input0">
          <label>Password</label>
          <input
            type="password" // IMPORTANT: Masks the password
            className="input1"
            name="password"
            value={login.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Submit"}
        </button>
        <br />
        
        <span1 style={{width:"auto",}}  >
         Forgot Password ? <Link to="/forgot-password">Click here</Link>
        </span1>

        <span1 style={{width:"auto"}} >
          Don't have an account? <Link to="/signup">Sign up</Link>
        </span1>
      </form>

      {/* ToastContainer configuration */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    

  );

}

export default Login;
