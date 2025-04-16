import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import api from "../../api";

const AddTaluka = () => {
  const [talukas, setTalukas] = useState([]);
  const [formData, setFormData] = useState({ id: null, taluka_name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [Error, setError] = useState({ taluka_name: "" });

  const fetchTalukas = async () => {
    try {
      const response = await api.get("/talukas");
      setTalukas(response.data);
    } catch (error) {
      console.error("Error fetching talukas:", error);
    }
  };

  useEffect(() => {
    fetchTalukas();
  }, []);

  const validateForm = () => {
    const newError = { sender: "" };
    let isValid = true;

    if (!formData.taluka_name.trim()) {
      newError.taluka_name = "*taluka name is required";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleFocus = (field) => {
    setError((prevError) => ({ ...prevError, [field]: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "taluka_name") {
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (isEditing) {
        await api.put(`/talukas/${formData.id}`, formData);
      } else {
        await api.post("/talukas", formData);
      }
      resetForm();
      fetchTalukas();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (taluka) => {
    setFormData(taluka);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/talukas/${deleteId}`);
      fetchTalukas();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting taluka:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, taluka_name: "" });
    setIsEditing(false);
  };

  return (
    <>
      <div className="main-content app-content">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol className="breadcrumb mb-1">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Master</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Taluka
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="card custom-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row gy-3">
                      <div className="col-xl-4 col-md-4">
                        <label className="form-label">Taluka Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="taluka_name"
                          value={formData.taluka_name}
                          onChange={handleChange}
                          placeholder="Enter Taluka Name"
                          onFocus={() => handleFocus("taluka_name")}
                        />
                        {Error.taluka_name && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.taluka_name}
                          </p>
                        )}
                      </div>
                      <div className="mt-5 col-xl-4">
                        <button className="btn btn-purple-gradient">
                          Submit
                        </button>
                        <button
                          className="btn btn-danger-gradient mx-1"
                          type="button"
                          onClick={resetForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table text-nowrap table-bordered border-primary">
                      <thead className="table-warning">
                        <tr>
                          <th>Sr. No.</th>
                          <th>Taluka Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {talukas.length > 0 ? (
                          talukas.map((taluka, index) => (
                            <tr key={taluka.id} className="table-light">
                              <td>{index + 1}</td>
                              <td>{taluka.taluka_name}</td>
                              <td>
                                <div className="btn-list">
                                  <button
                                    className="btn btn-sm btn-icon btn-success-gradient"
                                    onClick={() => handleEdit(taluka)}
                                  >
                                    <i className="ri-pencil-line"></i>
                                  </button>

                                  <button
                                    className="btn btn-sm btn-icon btn-danger-gradient"
                                    onClick={() => {
                                      setDeleteId(taluka.id);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No Taluka found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}

      {showEditModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Edit Taluka Name</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row gy-3">
                  <div className="col-xl-8 col-md-8">
                    <label className="form-label">Taluka Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="taluka_name"
                      value={formData.taluka_name}
                      onChange={handleChange}
                      placeholder="Enter Taluka Name"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-purple-gradient"
                  onClick={handleSubmit}
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn btn-danger-gradient"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-body">
                <h6>Are you sure you want to delete this item?</h6>
              </div>
              <div className="modal-footer d-block">
                <button
                  type="button"
                  className="btn btn-success-gradient"
                  onClick={handleDelete}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger-gradient"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaluka;
