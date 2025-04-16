import React, { useState } from "react";
import "./Login.css";
import img from "../../assets/img/login/congress-logo.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";

const Login = ({ onLogin }) => {
  const [userData, setData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username) newErrors.username = "Username is required";
    if (!userData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const endpoint = "/";
      const response = await api.post(endpoint, userData);
      const { uniqueId, username } = response.data;
      localStorage.setItem("authToken", uniqueId);
      localStorage.setItem("username", username);
      onLogin();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.msg || "Login failed",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="row row1 m-0 h-100">
        <div className="col-md-6 d-none d-md-block left-side"></div>

        <div className="col-md-6 d-flex align-items-center justify-content-center right-side">
          <div className="form-container form-container1">
            {/* <img src={img} alt="Logo" className="mb-4" /> */}
            <h4
              className="text-center fw-medium mb-3"
              style={{
                fontFamily: "'Poppins', sans-serif", // Modern, clean font
                fontSize: "1.3rem",
                fontWeight: "600",
                color: "#2c3e50", // Dark slate for a professional look
                // textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "20px",
                marginTop:'10px',
              }}
            >
              Welcome to Citizen Grievance Management System
            </h4>
            <p
              className="text-center"
              style={{
                fontFamily: "'Roboto Slab', serif", // Bold and elegant for titles
                fontSize: "1.8rem",
                fontWeight: "700",
                color: "#e74c3c", // Bright red for emphasis
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
                marginBottom: "15px",
              }}
            >
              LOGIN
            </p>
            <form onSubmit={onSubmit}>
              <div className="mb-3 text-start">
                <label className="mb-2 label1">Username</label>
                <input
                  type="text"
                  className="form-control form-control1 "
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>
              <div className="mb-3 text-start">
                <label className="mb-2 label1">Password</label>
                <input
                  type="password"
                  className="form-control form-control1"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>
              <div className="d-flex justify-content-between mb-4">
                <div></div>
                <Link to="#" className="a1 text-decoration-none">
                  Forget your Password?
                </Link>
              </div>
              <div className="button-container mb-2">
                <button type="submit" className="btn btn-primary btn1">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
