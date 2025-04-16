import React from "react";
import { Link } from "react-router-dom";

const FooterAdmin = () => {
  return (
    <footer
      className="footer mt-auto py-3 bg-white"
      style={{ zIndex: 9, position: "relative" }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-6 text-lg-start text-center">
            <p className="mb-0">
              Copyright © <span id="year">2024</span> All Rights Reserved,
              Citizen Grievance Management System.
            </p>
          </div>

          <div className="col-lg-6 col-md-6 text-lg-end text-center">
            <p className="mb-0">
              Designed &amp; Developed{" "}
              <span className="fa fa-heart text-danger"></span> by
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://infoigy.com/"
                className="text-black ms-1"
              >
                Genicminds.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterAdmin;
