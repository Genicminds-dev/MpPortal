import React, { useState, useEffect } from "react";
import Carousel from "../Carousel/Carousel";
import Gallery from "../Gallary/Gallery";
import api, { baseURLImage } from "../../api";

const Main = () => {
  const [profile, setProfile] = useState([]);
  const [profileDesc, setProfileDesc] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/mp-profile");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  };

  const fetchProfileDesc = async () => {
    try {
      const response = await api.get("/mp-profile-desc");
      setProfileDesc(response.data);
    } catch (error) {
      console.error("Error fetching profile description data", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProfileDesc();
  }, []);

  return (
    <div>
      <Carousel />
      <section className="section-bg" id="expectations">
        <div className="container">
          <div className="row gx-5 mx-0">
            <div className="col-xl-3">
              <div className="home-proving-image">
                <img
                  src={`${baseURLImage}${profile[0]?.image_path}`}
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
                    Introduction
                  </span>
                </p>
                <h4 className="mt-3 fw-semibold mb-2">{profile[0]?.name}</h4>
                <h6 className="mb-4 fw-bold">{profile[0]?.designation}</h6>
                <div className="heading-description fs-14">
                  {profileDesc.map((desc, index) => (
                    <p key={index}>
                      <b>{profile[0]?.name}</b> {desc.description}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Gallery />
    </div>
  );
};

export default Main;
