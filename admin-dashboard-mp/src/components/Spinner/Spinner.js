import React from "react";
import "./Spinner.css"; 
import { FadeLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <FadeLoader color="#FF4E4E" size={50} />
      <p className="spinner-text">MP PORTAL</p>
    </div>
  );
};

export default Spinner;
