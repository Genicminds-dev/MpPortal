import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { BiSliderAlt } from "react-icons/bi";
import { GrGallery } from "react-icons/gr";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import { FiLogIn } from "react-icons/fi";

const Sidebar = ({ isOpen, closeSidebar, userDepartment }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [activeItem, setActiveItem] = useState("/");

  const toggleSubmenu = (menuId) => {
    setOpenSubmenu((prevId) => (prevId === menuId ? null : menuId));
  };

  const handleItemClick = (path) => {
    setActiveItem(path);
    if (isOpen) {
      closeSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay opened" onClick={closeSidebar} />
      )}
      <div className={`sidebar  ${isOpen ? "opened" : ""}`}>
        <div className="sidebar-inner">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li
                className={activeItem === "/" ? "active" : ""}
                onClick={() => handleItemClick("/")}
              >
                <Link to="/home">
                  <i className="fa fa-dashboard"></i> Header
                </Link>
              </li>
              <li
                className={activeItem === "/slider" ? "active" : ""}
                onClick={() => handleItemClick("/slider")}
              >
                <Link to="/slider">
                  <i className="fa">
                    <BiSliderAlt />
                  </i>{" "}
                  Slider
                </Link>
              </li>
              <li
                className={activeItem === "/mp-profile" ? "active" : ""}
                onClick={() => handleItemClick("/mp-profile")}
              >
                <Link to="/mp-profile">
                  <i className="fa">
                    <RiAccountCircleLine />
                  </i>{" "}
                  MP Profile
                </Link>
              </li>
              <li className="submenu">
                <Link to="#." onClick={() => toggleSubmenu("gallery")}>
                  <i className="fa">
                    <GrGallery />
                  </i>{" "}
                  <span>Gallery </span>{" "}
                  <span
                    className={`menu-arrow ${
                      openSubmenu === "gallery" ? "rotate" : ""
                    }`}
                  ></span>
                </Link>
                <ul className={openSubmenu === "gallery" ? "open" : ""}>
                  <li
                    className={activeItem === "/photo-gallery" ? "active" : ""}
                    onClick={() => handleItemClick("/photo-gallery")}
                  >
                    <Link to="/photo-gallery">Photo Gallery</Link>
                  </li>
                </ul>
              </li>
              <li className="submenu">
                <Link to="#." onClick={() => toggleSubmenu("login")}>
                  <i className="fa">
                    <FiLogIn />
                  </i>{" "}
                  <span>Login </span>{" "}
                  <span
                    className={`menu-arrow ${
                      openSubmenu === "login" ? "rotate" : ""
                    }`}
                  ></span>
                </Link>
                <ul className={openSubmenu === "login" ? "open" : ""}>
                  <li
                    className={activeItem === "/login-form" ? "active" : ""}
                    onClick={() => handleItemClick("/login-form")}
                  >
                    <Link to="/login-form">Login Form</Link>
                  </li>
                  <li
                    className={activeItem === "/login-profile" ? "active" : ""}
                    onClick={() => handleItemClick("/login-profile")}
                  >
                    <Link to="/login-profile">Login Profile</Link>
                  </li>
                </ul>
              </li>
              <li
                className={activeItem === "/dashboard-user" ? "active" : ""}
                onClick={() => handleItemClick("/dashboard-user")}
              >
                <Link to="/dashboard-user">
                  <i className="fa">
                    <IoPersonAdd />
                  </i>{" "}
                  Add User
                </Link>
              </li>
              <li
                className={activeItem === "/footer" ? "active" : ""}
                onClick={() => handleItemClick("/footer")}
              >
                <Link to="/footer">
                  <i className="fa">
                    <CgWebsite />
                  </i>{" "}
                  Footer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
