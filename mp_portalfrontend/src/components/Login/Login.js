import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api, { baseURLImage } from "../../api";
import {
  RiUserLine,
  RiEyeOffLine,
  RiEyeLine,
  RiLockLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [inputStyles, setInputStyles] = useState({
    username: "form-control",
    password: "form-control",
  });
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([]);
  const [form, setForm] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/login-profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching login profile data ", error);
    }
  };

  const fetchForm = async () => {
    try {
      const response = await api.get("/login-form");
      setForm(response.data);
    } catch (error) {
      console.error("Error fetching login form data ", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchForm();
  }, []);

  const handleChange = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });

    if (e.target.name === "username") {
      setInputStyles({
        ...inputStyles,
        username: e.target.value ? "form-control input-filled" : "form-control",
      });
    } else if (e.target.name === "password") {
      setInputStyles({
        ...inputStyles,
        password: e.target.value ? "form-control input-filled" : "form-control",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username) newErrors.username = "Username is required";
    if (!userData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      // Make the login request
      const response = await api.post("/login", userData);
  
      // Extract user data from the response
      const { username, name, user_permission } = response.data.user;
  
      // Set values in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({ username, name, user_permission })
      );
  
      // Show success notification and navigate to the dashboard
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login Successfully",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (err) {
      // Show error message on failure
      alert(err.response?.data?.msg || "An error occurred during login");
    }
  };
  

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="landing-body">
      <div className="row authentication authentication-cover-main mx-0">
        <div className="col-xxl-6 col-xl-7">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xxl-7 col-xl-9 col-lg-6 col-md-6 col-sm-8 col-12">
              <div className="card custom-card my-auto border">
                <div className="card-body p-5">
                  <div className="d-flex mb-3 justify-content-between gap-2 flex-wrap flex-lg-nowrap">
                    <button className="btn btn-lg btn-light-ghost d-flex align-items-center justify-content-center flex-fill">
                      <img
                        width="150"
                        src={`${baseURLImage}${form[0]?.image_path}`}
                        alt="congress-logo"
                      />
                    </button>
                  </div>
                  <h5 className="text-dark mb-1 text-center fw-medium mb-3">
                    Welcome to {form[0]?.title}
                  </h5>
                  <p className="h4 mb-2 text-center text-danger">LOGIN</p>
                  <p className="mb-4 text-dark op-9 fw-normal text-center">
                    Please enter your details to Sign In
                  </p>
                  <form onSubmit={onSubmit}>
                    <div className="row gy-3">
                      <div className="col-xl-12 mb-2">
                        <div className="mb-3">
                          <label className="form-label fs-14 text-dark">
                            Username
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <RiUserLine />
                            </div>
                            <input
                              type="text"
                              className={inputStyles.username}
                              name="username"
                              value={userData.username}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.username && (
                            <div className="text-danger">{errors.username}</div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label fs-14 text-dark">
                            Password
                          </label>
                          <div className="input-group">
                            <div className="input-group-text">
                              <RiLockLine />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              className={inputStyles.password}
                              name="password"
                              value={userData.password}
                              onChange={handleChange}
                            />
                            <a
                              className="show-password-button text-muted"
                              href="#."
                              onClick={(e) => {
                                e.preventDefault();
                                togglePasswordVisibility();
                              }}
                            >
                              {showPassword ? (
                                <RiEyeLine className="align-middle" />
                              ) : (
                                <RiEyeOffLine className="align-middle" />
                              )}
                            </a>
                          </div>
                          {errors.password && (
                            <div className="text-danger">{errors.password}</div>
                          )}
                        </div>

                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="rememberCheck"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberCheck"
                          >
                            Remember password ?
                          </label>
                        </div>

                        <div className="d-grid gap-2 col-6 mx-auto">
                          <button
                            type="submit"
                            className="btn btn-primary01-gradient text-center"
                          >
                            LOGIN
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xxl-6 col-xl-5 col-lg-12 d-xl-block d-none px-0 text-center">
          <div className="authentication-cover overflow-hidden">
            <div className="aunthentication-cover-content d-flex align-items-center justify-content-center">
              <div className="login-rightside">
                <img
                  className="mb-4"
                  src={`${baseURLImage}${profile[0]?.image_path}`}
                  alt="praniti-photo"
                />
                <h3 className="text-fixed-white mb-3 fw-medium">
                  {profile[0]?.name}
                </h3>
                <h5 className="text-fixed-white mb-1">
                  {profile[0]?.designation}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
