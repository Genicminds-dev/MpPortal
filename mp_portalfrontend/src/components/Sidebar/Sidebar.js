import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/header/logo.png";
import "./Sidebar.css";
import { FaChevronDown } from "react-icons/fa";
import "remixicon/fonts/remixicon.css";

const Sidebar = ({ user }) => {
  const sidebarRef = useRef(null);
  //eslint-disable-next-line
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      const sidebarElement = document.getElementById("sidebarMenu");
      if (sidebarElement && sidebarElement.classList.contains("show")) {
        sidebarElement.classList.remove("show");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSidebarItemClick = (item) => {
    setSelectedItem(item);
    const sidebarElement = document.getElementById("sidebarMenu");
    if (sidebarElement && sidebarElement.classList.contains("show")) {
      sidebarElement.classList.remove("show");
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const sidebarElement = document.getElementById("sidebar-scroll");
    if (sidebarElement) {
      if (isOpen) {
        sidebarElement.classList.add("scroll");
        sidebarElement.classList.remove("no-scroll");
      } else {
        sidebarElement.classList.add("no-scroll");
        sidebarElement.classList.remove("scroll");
        sidebarElement.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const menuLabels = document.querySelectorAll(".side-menu__label");
  const menuIcons = document.querySelectorAll(".side-menu__icon");
  const menuItems = document.querySelectorAll(".slider-child");
  const menuHeader = document.querySelectorAll(".main-sidebar-header");
  const allMenuItems = [
    ...menuLabels,
    ...menuIcons,
    ...menuItems,
    ...menuHeader,
  ];

  allMenuItems.forEach((item) => {
    item.addEventListener("click", function () {
      allMenuItems.forEach((element) => element.classList.remove("active"));

      this.classList.add("active");
    });
  });

  return (
    <>
      <div
        id="sidebarMenu"
        className="sidebar collapse d-lg-block"
        ref={sidebarRef}
      >
        <aside class="app-sidebar sticky" id="sidebar">
          <div class="main-sidebar-header">
            <Link to="/dashboard" class="header-logo">
              <img src={logo} alt="logo" class="desktop-logo" />
              <img src={logo} alt="logo" class="toggle-dark" />
              <img src={logo} alt="logo" class="desktop-dark" />
              <img src={logo} alt="logo" class="toggle-logo" />
              <img src={logo} alt="logo" class="toggle-white" />
              <img src={logo} alt="logo" class="desktop-white" />
            </Link>
          </div>

          <div
            className="main-sidebar no-scroll simplebar-scrollable-x d-lg-block "
            id="sidebar-scroll"
            data-simplebar="init"
          >
            <div
              className="simplebar-wrapper "
              style={{ margin: "-8px 0px -80px" }}
            >
              <div className="simplebar-mask">
                <div
                  className="simplebar-offset"
                  style={{ right: "0px", bottom: "0px" }}
                >
                  <div
                    className="simplebar-content-wrapper"
                    tabIndex="0"
                    role="region"
                    aria-label="content"
                    style={{ height: "100%", overflow: "hidden" }}
                  >
                    <div
                      className="simplebar-content"
                      style={{ padding: "8px 0px 80px" }}
                    >
                      <nav class="main-menu-container nav nav-pills flex-column sub-open">
                        <div class="slide-left active" id="slide-left">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#7b8191"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            {" "}
                            <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>{" "}
                          </svg>
                        </div>
                        <ul class="main-menu">
                          {user === "Clerk" && (
                            <>
                              <li class="slide">
                                <Link
                                  to="/dashboard"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                    ></path>
                                  </svg>
                                  <span
                                    className={`side-menu__label ${
                                      location.pathname === "/dashboard"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Dashboard
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/add-new-entry"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    Add New Entry
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/scan-gallary"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    {" "}
                                    Scan Application
                                  </span>
                                </Link>
                              </li>
                              
                              <li className="slide">
                                <Link
                                  to="/add-new-grievance"
                                  className="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <i className="ri-file-add-line side-menu__icon"></i>
                                  <span className="side-menu__label">
                                    Add New Grievance
                                  </span>
                                </Link>
                              </li>
                            </>
                          )}
                          {user === "Admin" && (
                            <>
                              <li class="slide">
                                <Link
                                  to="/dashboard"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                    ></path>
                                  </svg>
                                  <span
                                    className={`side-menu__label ${
                                      location.pathname === "/dashboard"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Dashboard
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/add-new-entry"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    Add New Entry
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/scan-gallary"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    {" "}
                                    Scan Application
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/add-new-grievance"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    Add New Grievance
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/all-grievance-list"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    All Grievance List
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/completed-grievance"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    Completed Grievance
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/in-progress-grievance"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    In Progress Grievance
                                  </span>
                                </Link>
                              </li>
                              <li class="slide">
                                <Link
                                  to="/rejected-grievance"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">
                                    Rejected Grievance
                                  </span>
                                </Link>
                              </li>
                              <li
                                className={`slide has-sub ${
                                  isOpen ? "open" : ""
                                }`}
                              >
                                <Link
                                  className="side-menu__item"
                                  onClick={toggleDropdown}
                                >
                                  <FaChevronDown
                                    className="side-menu__angle"
                                    size={11}
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                                    ></path>
                                  </svg>
                                  <span className="side-menu__label">
                                    Master
                                  </span>
                                </Link>
                                {isOpen && (
                                  <ul
                                    className="slide-menu child1"
                                    style={{
                                      position: "relative",
                                      left: "0px",
                                      top: "0px",
                                      margin: "0px",
                                      transform: "translate3d(8px, 144px, 0px)",
                                      display: "block",
                                      boxSizing: "border-box",
                                    }}
                                    data-popper-placement="top"
                                  >
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-personal_assistance"
                                        className="side-menu__item slider-child"
                                      >
                                        Add Personal Assistant
                                      </Link>
                                    </li>
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-booth-number"
                                        className="side-menu__item slider-child"
                                      >
                                        Add Booth No.
                                      </Link>
                                    </li>
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-subject"
                                        className="side-menu__item slider-child"
                                      >
                                        Add Subject
                                      </Link>
                                    </li>
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-taluka"
                                        className="side-menu__item slider-child"
                                      >
                                        Add Taluka
                                      </Link>
                                    </li>
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-complaint-sender"
                                        className="side-menu__item slider-child"
                                      >
                                        Add Complaint Sender
                                      </Link>
                                    </li>
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-app-status"
                                        className="side-menu__item slider-child"
                                      >
                                        Add App. Status
                                      </Link>
                                    </li>
                                    <li
                                      className="slide"
                                      onClick={() => handleSidebarItemClick()}
                                    >
                                      <Link
                                        to="/add-whatsapp-group"
                                        className="side-menu__item slider-child"
                                      >
                                        Add Whatsapp Group
                                      </Link>
                                    </li>
                                  </ul>
                                )}
                              </li>
                              <li class="slide">
                                <Link
                                  to="/add-user"
                                  class="side-menu__item"
                                  onClick={() => handleSidebarItemClick()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-6 h-6 side-menu__icon"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                    ></path>
                                  </svg>
                                  <span class="side-menu__label">User</span>
                                </Link>
                              </li>
                            </>
                          )}
                        </ul>
                        <div class="slide-right" id="slide-right">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#7b8191"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            {" "}
                            <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>{" "}
                          </svg>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div
                class="simplebar-placeholder"
                style={{ width: "239px", height: "580px" }}
              ></div>
            </div>
            <div
              class="simplebar-track simplebar-horizontal"
              style={{ visibility: "visible" }}
            >
              <div
                class="simplebar-scrollbar"
                style={{
                  width: "25px",
                  transform: "translate3d(0px, 0px, 0px)",
                  display: "block",
                }}
              ></div>
            </div>
            <div
              class="simplebar-track simplebar-vertical"
              style={{ visibility: "hidden" }}
            >
              <div
                class="simplebar-scrollbar"
                style={{ height: "0px", display: "none" }}
              ></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
