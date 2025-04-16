import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

const Footer = () => {
  const [footer, setFooter] = useState([]);

  const fetchFooter = async () => {
    try {
      const response = await api.get("/footer");
      setFooter(response.data);
    } catch (error) {
      console.error("Error fetching footer data ", error);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  return (
    <footer className="landing-main-footer py-3 text-light">
      <div className="container">
        <div className="row text-center text-lg-start">
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center align-items-lg-start mb-0 mb-lg-0">
            <p className="mb-0">
              Copyright © <span id="year">2024</span> All Rights Reserved,{" "}
              {footer[0]?.websitename}.
            </p>
          </div>
          <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center align-items-lg-end">
            <p className="mb-0">
              Designed &amp; Developed{" "}
              <span className="fa fa-heart text-danger"></span> by
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to="https://infoigy.com/"
                className="text-white ms-1"
              >
                {footer[0]?.developedby}.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
