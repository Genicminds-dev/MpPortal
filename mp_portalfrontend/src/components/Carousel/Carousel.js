import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api, { baseURLImage } from "../../api";

const Carousel = () => {
  const [slider, setSlider] = useState([]);

  const fetchSlider = async () => {
    try {
      const response = await api.get("/sliders");
      setSlider(response.data);
    } catch (error) {
      console.error("Error fetching slider data", error);
    }
  };

  useEffect(() => {
    fetchSlider();
  }, []);

  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {slider.map((sliderItem, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={index}
          >
            <img
              src={`${baseURLImage}${sliderItem.file_path}`}
              className="d-block w-100"
              alt={`slider-${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
