import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import "react-toastify/ReactToastify.css";
import AuthProvider  from "./Customhooks/AuthProvider.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
   <AuthProvider>
   <BrowserRouter>

   
      <App />
  
  </BrowserRouter>
   </AuthProvider>
);
