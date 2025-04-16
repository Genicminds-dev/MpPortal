import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./assets/css/bootstrap-datetimepicker.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/dataTables.bootstrap4.min.css";
import "./assets/css/font-awesome.min.css";
import "./assets/css/fullcalendar.min.css";
import "./assets/css/select2.min.css";
import "./assets/css/tagsinput.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Spinner from "./components/Spinner/Spinner";
import Login from "./components/Login/Login";
import Slider from "./components/Slider/Slider";
import AddSlider from "./components/Slider/AddSlider";
import HeaderModel from "./components/HeaderModel/HeaderModel";
import DashboardUsers from "./components/DashboardUser/DashboardUsers";
import AddDashboardUsers from "./components/DashboardUser/AddDashboardUsers";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import AddPhotoGallery from "./components/PhotoGallery/AddPhotoGallery";
import Footer from "./components/Footer/Footer";
import MpProfile from "./components/MpProfile/MpProfile";
import LoginForm from "./components/LoginForm/LoginForm";
import LoginProfile from "./components/LoginProfile/LoginProfile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    if (isAuthenticated) {
      setUsername(localStorage.getItem("username") || "");
    } else {
      setUsername("");
    }
  }, [isAuthenticated]);

  const handleLogin = (loggedInUsername) => {
    setLoading(true);
    setIsAuthenticated(true);
    setUsername(loggedInUsername);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Header username={username} onLogout={handleLogout} />
              <div>
                <Sidebar />
                <div>
                  <Routes>
                    <Route path="/home" element={<HeaderModel />} />
                    <Route path="/slider" element={<Slider />} />
                    <Route path="/add-slider" element={<AddSlider />} />
                    <Route
                      path="/add-dashboard-user"
                      element={<AddDashboardUsers />}
                    />
                    <Route
                      path="/dashboard-user"
                      element={<DashboardUsers />}
                    />
                    <Route path="/footer" element={<Footer />} />
                    <Route path="/photo-gallery" element={<PhotoGallery />} />
                    <Route
                      path="/add-photos-gallery"
                      element={<AddPhotoGallery />}
                    />

                    <Route path="/mp-profile" element={<MpProfile />} />
                    <Route path="/login-form" element={<LoginForm />} />
                    <Route path="/login-profile" element={<LoginProfile />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                  </Routes>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Router>
  );
}

export default App;
