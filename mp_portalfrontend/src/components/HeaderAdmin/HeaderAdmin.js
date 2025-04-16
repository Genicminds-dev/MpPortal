import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../../assets/images/header/no-profile-img.jpg";
import { FiUser } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import favicon from "../../assets/images/header/favicon.png";
import { formatDistanceToNow } from "date-fns";
import api from "../../api";
import "./HeaderAdmin.css";

const HeaderAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const notificationsToShow = showAll
    ? notifications
    : notifications.slice(0, 5);
  const navigate = useNavigate();
  const [name, setName] = useState("Guest");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user")
    );
    if (storedUser && storedUser.name) {
      setName(storedUser.name);
    }
    if (storedUser && storedUser.user_permission) {
      setDesignation(storedUser.user_permission);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const fetchNotify = async () => {
    try {
      const response = await api.get("/notification");
      const data = response.data.reverse();
      setNotifications(data);
      const unreadCount = data.filter(
        (notification) => notification.readed === 0
      ).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotify();
    const interval = setInterval(() => {
      fetchNotify();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notification/${id}`);
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      fetchNotify();
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/update/${id}`, { readed: 1 });
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, readed: 1 } : notification
      );
      setNotifications(updatedNotifications);
      setUnreadCount(
        updatedNotifications.filter((notification) => notification.readed === 0)
          .length
      );
    } catch (error) {
      console.error("Error updating notification status", error);
    }
  };

  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      )
    ) {
      const googleTranslateScript = document.createElement("script");
      googleTranslateScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(googleTranslateScript);
    }

    window.googleTranslateElementInit = () => {
      if (
        !document.getElementById("google_translate_element").childNodes.length
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,mr,hi",
            layout:
              window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    const googleTranslateDropdown = document.querySelector(".goog-te-combo");
    if (googleTranslateDropdown) {
      googleTranslateDropdown.value = selectedLanguage;
      googleTranslateDropdown.dispatchEvent(new Event("change"));
    }
  };

  return (
    <header class="app-header sticky sticky-pin" id="header">
      <div class="main-header-container container-fluid">
        <div class="header-content-left">
          <div class="header-element">
            <div class="horizontal-logo">
              <Link to="/" class="header-logo">
                <img src={favicon} alt="logo" class="desktop-logo" />
                <img src={favicon} alt="logo" class="toggle-dark" />
                <img src={favicon} alt="logo" class="desktop-dark" />
                <img src={favicon} alt="logo" class="toggle-logo" />
                <span class="d-none">Citizen Grievance Management System</span>
              </Link>
            </div>
          </div>
          <div className="header-element mx-lg-0 mx-2 d-lg-none d-block my-auto">
            <Link
              aria-label="Toggle Sidebar"
              className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              to="#"
            >
              <span></span>
            </Link>
          </div>
        </div>

        <ul class="header-content-right list-unstyled">
          <li className="">
            <div className="pt-2 pt-xl-0 lang-dropdown">
              <label className="visually-hidden" htmlFor="autoSizingSelect">
                Preference
              </label>
              <select
                className="form-select text-center"
                id="autoSizingSelect"
                onChange={handleLanguageChange}
              >
                <option value="en" selected>English</option>
                <option value="mr">Marathi</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <div
              id="google_translate_element"
              style={{ display: "none" }}
            ></div>
          </li>

          <li className="header-element notifications-dropdown d-xl-block d-none dropdown">
            <Link
              to="#"
              className="header-link dropdown-toggle"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 header-link-icon"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                ></path>
              </svg>
              <span className="header-icon-pulse bg-primary2 rounded pulse pulse-secondary"></span>
            </Link>

            <div className="main-header-dropdown dropdown-menu dropdown-menu-end">
              <div className="p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <p className="mb-0 fs-15 fw-medium">Notifications</p>
                  <span className="badge bg-secondary text-fixed-white">
                    {unreadCount} Unread
                  </span>
                </div>
              </div>
              <div className="dropdown-divider"></div>

              <ul
                className="list-unstyled mb-0 custom-scrollbar"
                id="header-notification-scroll"
                style={{
                  maxHeight: showAll ? "300px" : "auto",
                  overflowY: showAll ? "auto" : "hidden",
                }}
              >
                {notificationsToShow.length > 0 ? (
                  notificationsToShow.map((notification, index) => (
                    <li
                      key={index}
                      className={`dropdown-item ${notification.readed === 0 ? "bg-light-blue" : ""
                        }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                      style={{ padding: "10px 15px" }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="pe-2 lh-1">
                          <span className="avatar avatar-md avatar-rounded bg-primary">
                            <img src={Profile} alt="user1" />
                          </span>
                        </div>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-0 fw-medium">
                              <Link to="#.">{notification.heading}</Link>
                            </p>
                            <div className="text-muted fw-normal fs-12 header-notification-text text-truncate">
                              {notification.description}
                            </div>
                            <div className="fw-normal fs-10 text-muted op-8">
                              {formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true }
                              )}
                            </div>
                          </div>
                          <div>
                            <Link
                              className="min-w-fit-content dropdown-item-close1"
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                            >
                              <i className="ri-close-line"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">
                    <div className="text-center">
                      <span className="avatar avatar-xl avatar-rounded bg-secondary-transparent">
                        <i className="ri-notification-off-line fs-2"></i>
                      </span>
                      <h6 className="fw-medium mt-3">No New Notifications</h6>
                    </div>
                  </li>
                )}
              </ul>

              <div className="p-3 empty-header-item1 border-top ">
                {notifications.length > 5 && !showAll && (
                  <div className="d-grid">
                    <button
                      className="btn btn-primary btn-wave view-all-btn"
                      onClick={() => setShowAll(true)}
                    >
                      View All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>

          <li class="header-element dropdown">
            <Link
              to=""
              class="header-link dropdown-toggle"
              id="mainHeaderProfile"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              <div class="d-flex align-items-center">
                <div>
                  <img src={Profile} alt="img" class="avatar avatar-sm" />
                </div>
              </div>
            </Link>
            <ul
              class="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
              aria-labelledby="mainHeaderProfile"
            >
              <li>
                <div class="dropdown-item text-center border-bottom">
                  <span>{name || "Guest"}</span>
                  <span className="d-block fs-12 text-muted">
                    {designation || "Designation"}
                  </span>
                </div>
              </li>
              <li>
                <Link class="dropdown-item d-flex align-items-center" to="#.">
                  <FiUser className="p-1 rounded-circle bg-primary-transparent me-2 fs-16" />
                  Profile
                </Link>{" "}
              </li>
              <li>
                <Link
                  to="/login"
                  className="dropdown-item d-flex align-items-center"
                  onClick={onLogout}
                >
                  <FiLock className="p-1 rounded-circle bg-primary-transparent me-2 fs-16" />
                  Log Out
                </Link>
              </li>{" "}
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default HeaderAdmin;
