import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api, { baseURLImage } from "../../api";
import "./Gallary.css";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const fetchGallery = async () => {
    try {
      const response = await api.get("/gallerys");
      setGallery(response.data);
    } catch (error) {
      console.error("Error fetching gallery data", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = (event) => {
    event.stopPropagation();
    setSelectedImageIndex((selectedImageIndex + 1) % gallery.length);
  };

  const prevImage = (event) => {
    event.stopPropagation();
    setSelectedImageIndex(
      (selectedImageIndex - 1 + gallery.length) % gallery.length
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="main-content pt-3">
      <div className="container">
        <div className="text-center">
          <p className="fs-15 fw-medium text-success mb-1">
            <span className="landing-section-heading text-danger">
              Awesome Picture
            </span>
          </p>
          <h4 className="fw-semibold mt-3 mb-3">Gallery</h4>
        </div>
        <div className="row">
          {gallery.map((img, index) => (
            <div key={index} className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="#!"
                onClick={() => openModal(index)}
                className="glightbox card"
              >
                <img
                  src={`${baseURLImage}${img.file_path}`}
                  alt={`image-${index + 1}`}
                  className="img-fluid"
                />
              </a>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal-overlay" role="dialog">
            <button type="button" className="close-modal" onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button>
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              ref={modalRef}
            >
              <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                  {gallery.map((imgSrc, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === selectedImageIndex ? "active" : ""
                      }`}
                    >
                      <img
                        src={`${baseURLImage}${imgSrc.file_path}`}
                        className="d-block w-100"
                        alt={`image-${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              onMouseDown={prevImage}
              aria-label="Previous"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              className="carousel-control-next"
              onMouseDown={nextImage}
              aria-label="Next"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
