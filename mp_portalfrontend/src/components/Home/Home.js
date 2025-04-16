import React from "react";
import slider from "../assets/images/landing/slider.jpg";
import slider1 from "../assets/images/landing/slider01.png";
import slider02 from "../assets/images/landing/slider02.png";
import slider01 from "../assets/images/landing/slider01.png";
import praniti from "../assets/images/landing/praniti-shinde.png";
import img1 from "../assets/images/gallery/img1.jpg";
import img2 from "../assets/images/gallery/img2.jpg";
import img3 from "../assets/images/gallery/img3.jpg";
import img4 from "../assets/images/gallery/img4.jpg";
import img5 from "../assets/images/gallery/img5.jpg";
import img6 from "../assets/images/gallery/img6.jpg";
import img7 from "../assets/images/gallery/img7.jpg";
import img8 from "../assets/images/gallery/img8.jpg";

const Home = () => {
  return (
    <>
      <div
        id="carouselExampleCaptions"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={slider} className="d-block w-100" alt="slider1" />
          </div>
          <div className="carousel-item">
            <img src={slider1} className="d-block w-100" alt="slider2" />
          </div>
          <div className="carousel-item">
            <img src={slider02} className="d-block w-100" alt="slider2" />
          </div>
          <div className="carousel-item">
            <img src={slider01} className="d-block w-100" alt="slider1" />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <section className="section-bg" id="expectations">
        <div className="container">
          <div className="row gx-5 mx-0">
            <div className="col-xl-3">
              <div className="home-proving-image">
                <img
                  src={praniti}
                  alt="about-img"
                  className="img-fluid pt-3 about-image d-none d-xl-block"
                />
              </div>
              <div className="proving-pattern-1"></div>
            </div>
            <div className="col-xl-9 my-auto">
              <div className="heading-section text-start mb-4">
                <p className="fs-15 fw-medium text-start text-success mb-1">
                  <span className="landing-section-heading text-danger">
                    Inroduction
                  </span>
                </p>
                <h4 className="mt-3 fw-semibold mb-2">
                  Praniti Sushilkumar Shinde
                </h4>
                <h6 className="mb-4 fw-bold">
                  Hon. Member of Parliament, Solapur Lok Sabha Constituency.
                </h6>
                <div className="heading-description fs-14">
                  <p>
                    <b>Praniti Sushilkumar Shinde</b> is an esteemed Indian
                    politician representing Maharashtra. Currently serving as a
                    Member of Parliament for the Solapur Lok Sabha constituency,
                    she is affiliated with the Indian National Congress Party.
                    With a distinguished political career.
                  </p>
                  <p>
                    <b>Praniti Shinde</b> has also served three terms as a
                    Member of the Maharashtra Legislative Assembly, representing
                    the Solapur City Central constituency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img1.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img1} alt="img1" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img2.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img2} alt="img2" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img3.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img3} alt="img3" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img4.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img4} alt="img4" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img5.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img5} alt="img" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img6.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img6} alt="img6" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img7.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img7} alt="img7" />
              </a>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-6">
              <a
                href="assets/images/gallery/img8.jpg"
                className="glightbox card"
                data-gallery="gallery1"
              >
                <img src={img8} alt="img8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
