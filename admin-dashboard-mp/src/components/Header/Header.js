import React, { useState, useEffect } from "react";
import img from "../../assets/img/user.jpg";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Header.css";

const Header = ({ onLogout, username }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // eslint-disable-next-line
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 990);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 990;
      setIsScreenLarge(isLarge);
      if (isLarge) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".dropdown-toggle") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const [activeDropdownItem, setActiveDropdownItem] = useState(null);

  const handleDropdownItemClick = (item) => {
    setActiveDropdownItem(item);
  };

  return (
    <>
      <Link
        id="mobile_btn"
        className="mobile_btn float-left"
        to="#"
        onClick={(e) => {
          e.preventDefault();
          toggleSidebar();
        }}
      >
        <i className="fa fa-bars"></i>
      </Link>
      <div className="main-wrapper">
        <div className="header">
          <div className="header-left">
            <Link to="#." className="logo">
              MP PORTAL
            </Link>
          </div>
          <Link
            id="mobile_btn"
            className="mobile_btn float-left"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              toggleSidebar();
            }}
          >
            <i className="fa fa-bars"></i>
          </Link>
          <ul className="nav user-menu float-right">
            <li className="nav-item dropdown d-none d-sm-block">
              <Link
                to="#."
                className="dropdown-toggle nav-link user-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen((prev) => !prev);
                }}
              >
                <span className="user-img">
                  <img
                    className="rounded-circle"
                    src={img}
                    width="24"
                    alt="Admin"
                  />
                  <span className="status online"></span>{" "}
                </span>
                <span className="mx-1">{username}</span>{" "}
                <i className="fa fa-angle-down ml-1"></i>
              </Link>
              {isUserDropdownOpen && (
                <div className="dropdown-menu show dropdown-keep-visible">
                  <Link
                    className={`dropdown-item ${
                      activeDropdownItem === "My Profile" ? "active" : ""
                    }`}
                    to="#."
                    onClick={() => handleDropdownItemClick("My Profile")}
                  >
                    My Profile
                  </Link>
                  <Link
                    className={`dropdown-item ${
                      activeDropdownItem === "Logout" ? "active" : ""
                    }`}
                    to="#."
                    onClick={onLogout}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </li>

            <div className="dropdown mobile-user-menu float-right d-block d-sm-none">
              <Link
                to="#."
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen((prev) => !prev);
                }}
              >
                <i className="fa fa-ellipsis-v"></i>
              </Link>
              {isUserDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-right show mx-2 dropdown-keep-visible">
                  <Link
                    className={`dropdown-item ${
                      activeDropdownItem === "My Profile" ? "active" : ""
                    }`}
                    to="#."
                    onClick={() => handleDropdownItemClick("My Profile")}
                  >
                    My Profile
                  </Link>
                  <Link
                    className={`dropdown-item ${
                      activeDropdownItem === "Logout" ? "active" : ""
                    }`}
                    to="#."
                    onClick={() => {
                      handleDropdownItemClick("Logout");
                      onLogout();
                    }}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
    </>
  );
};

export default Header;
