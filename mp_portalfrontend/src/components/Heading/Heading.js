import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import emblemDark from "../../assets/images/landing/emblem-dark.png";
import swachhBharatLogo from "../../assets/images/header/Swachh_Bharat_Mission_Logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Heading.css";
import api, { baseURLImage } from "../../api";

const Header = () => {
  const [header, setHeader] = useState([]);

  const fetchHeader = async () => {
    try {
      const response = await api.get("/header");
      setHeader(response.data);
    } catch (error) {
      console.error("Error fetching header data ", error);
    }
  };

  useEffect(() => {
    fetchHeader();
  }, []);

  return (
    <nav className="main-menu-container head nav nav-pills sub-open py-2">
      <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap">
        <div className="d-flex align-items-center flex-shrink-1 logo-left">
          <img
            src={`${baseURLImage}${header[0]?.websitelogo}`}
            alt="favicon-logo"
            className="me-3 logosize"
          />
          <div>
            <span className="fs-16 d-block mb-0 fw-bold">
              {header[0]?.websitename &&
                header[0]?.websitename
                  .split(" ")
                  .reduce((acc, word, index) => {
                    if (index % 2 === 0) {
                      acc.push([]);
                    }
                    acc[acc.length - 1].push(word);
                    return acc;
                  }, [])
                  .map((pair, idx) => (
                    <React.Fragment key={idx}>
                      {pair.join(" ")}
                      <br />
                    </React.Fragment>
                  ))}
            </span>
            <span className="text-muted fs-12">
              Government of {header[0]?.govtname}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center  justify-content-center mx-auto logos-center">
          <img width="40" src={emblemDark} alt="emblem-logo" className="me-3" />
          <img width="120" src={swachhBharatLogo} alt="swachh-bharat-logo" />
        </div>

        <div className="d-flex align-items-center flex-shrink-1 logo-right">
          <Link to="/login" className="btn btn-primary gradient-btn">
            LOGIN
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
