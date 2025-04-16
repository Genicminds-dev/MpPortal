import React, { useState, useEffect } from "react";
import api, { baseURLImage } from "../api";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const HeaderModel = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHeaderData, setEditHeaderData] = useState({
    id: "",
    websitename: "",
    govtname: "",
    websitelogo: "",
    websitelogoPreview: "",
  });
  const [header, setHeader] = useState([]);

  const API_URL = "/header";

  useEffect(() => {
    fetchHeader();
  }, []);

  useEffect(() => {
    initLightbox();
  }, [header]);

  const initLightbox = () => {
    GLightbox({
      selector: ".glightbox",
    });
  };

  const fetchHeader = () => {
    api
      .get(API_URL)
      .then((response) => {
        setHeader(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("websitename", editHeaderData.websitename);
    formData.append("govtname", editHeaderData.govtname);

    if (editHeaderData.websitelogo instanceof File) {
      formData.append("websitelogo", editHeaderData.websitelogo);
    }

    const updatedHeader = header.map((header) =>
      header.id === editHeaderData.id
        ? {
            ...header,
            websitename: editHeaderData.websitename,
            govtname: editHeaderData.govtname,
            websitelogo:
              editHeaderData.websitelogo instanceof File
                ? URL.createObjectURL(editHeaderData.websitelogo)
                : header.websitelogo,
          }
        : header
    );
    setHeader(updatedHeader);

    api
      .put(`${API_URL}/${editHeaderData.id}`, formData)
      .then((response) => {
        setHeader(
          header.map((header) =>
            header.id === editHeaderData.id ? response.data : header
          )
        );
        setShowEditModal(false);
        fetchHeader();
      })
      .catch((error) => {
        console.error("Error updating header:", error);
      });
  };

  const openEditModal = (header) => {
    setEditHeaderData({
      id: header.id,
      websitename: header.websitename,
      govtname: header.govtname,
      websitelogo: header.websitelogo,
    });
    setShowEditModal(true);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>{" "}
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Header
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Header</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Govt. Website Name</th>
                          <th>Govt. Name</th>
                          <th>Govt. Website Logo</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {header.map((header, index) => (
                          <tr key={header.id}>
                            <td>{index + 1}</td>
                            <td>{header.websitename}</td>
                            <td>{header.govtname}</td>
                            <td>
                              <Link
                                to={`${baseURLImage}${
                                  header.websitelogo
                                }`}
                                className="glightbox"
                                data-gallery="web-links-gallery"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURLImage}${
                                    header.websitelogo
                                  }`}
                                  alt={header.id}
                                  style={{ borderRadius: "5px" }}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm m-t-10"
                                onClick={() => openEditModal(header)}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`modal fade ${showEditModal ? "show" : ""}`}
            style={{ display: showEditModal ? "block" : "none" }}
            id="editModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="editModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <h5 className="mb-3">Edit Header</h5>
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label htmlFor="websitename">Website Name</label>
                      <input
                        type="text"
                        id="websitename"
                        className="form-control"
                        value={editHeaderData.websitename}
                        onChange={(e) =>
                          setEditHeaderData({
                            ...editHeaderData,
                            websitename: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">Govt. Name</label>
                      <select
                        id="govtname"
                        className="form-control"
                        value={editHeaderData.govtname || ""}
                        onChange={(e) =>
                          setEditHeaderData({
                            ...editHeaderData,
                            govtname: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select State
                        </option>
                        {indianStates.map((state, index) => (
                          <option key={index} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="websitelogo">Website Logo</label>
                      <input
                        type="file"
                        id="websitelogo"
                        className="form-control"
                        onChange={(e) =>
                          setEditHeaderData({
                            ...editHeaderData,
                            websitelogo: e.target.files[0],
                          })
                        }
                      />
                      {editHeaderData.websitelogoPreview && (
                        <img
                          src={editHeaderData.websitelogoPreview}
                          alt="Preview"
                          width="100px"
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowEditModal(false)}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-sm btn-primary">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderModel;
