import React, { useEffect, useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import api from "../../api";

const Addpa = () => {
  const [assistants, setAssistants] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", mobile: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [Error, setError] = useState({ name: "", mobile: "" });

  const fetchAssistants = async () => {
    try {
      const response = await api.get("/personal_assistants");
      setAssistants(response.data);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "mobile") {
      if (/^[0-9]*$/.test(value) || value === "") {
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
        await api.put(`/personal_assistants/${formData.id}`, formData);
      } else {
        await api.post("/personal_assistants", formData);
      }
      resetForm();
      fetchAssistants();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const validateForm = () => {
    const newError = { name: "", mobile: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newError.name = "*Name is required.";
      isValid = false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!formData.mobile) {
      newError.mobile = "*Mobile number is required.";
      isValid = false;
    } else if (!mobilePattern.test(formData.mobile)) {
      newError.mobile = "*Mobile number must be 10 digits.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleFocus = (field) => {
    setError((prevError) => ({ ...prevError, [field]: "" }));
  };

  const handleEdit = (assistant) => {
    setFormData(assistant);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/personal_assistants/${deleteId}`);
      fetchAssistants();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting assistant:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", mobile: "" });
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
                    Add Personal Assistant Name
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
                        <label className="form-label">
                          Personal Assistant Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          maxLength={20}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter PA Name"
                          onFocus={() => handleFocus("name")}
                        />
                        {Error.name && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.name}
                          </p>
                        )}
                      </div>
                      <div className="col-xl-4 col-md-4">
                        <label className="form-label">Mobile No.</label>
                        <input
                          type="text"
                          maxLength={10}
                          className="form-control"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter Mobile No."
                          onFocus={() => handleFocus("mobile")}
                        />
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
                          <th>Personal Assistant Name</th>
                          <th>Mobile No.</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assistants.length > 0 ? (
                          assistants.map((assistant, index) => (
                            <tr key={assistant.id} className="table-light">
                              <td>{index + 1}</td>
                              <td>{assistant.name}</td>
                              <td>{assistant.mobile}</td>
                              <td>
                                <div className="btn-list">
                                  <button
                                    className="btn btn-sm btn-icon btn-success-gradient"
                                    onClick={() => handleEdit(assistant)}
                                  >
                                    <i className="ri-pencil-line"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-icon btn-danger-gradient"
                                    onClick={() => {
                                      setDeleteId(assistant.id);
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
                              No Personal Assistants found
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
                <h6 className="modal-title">Edit Personal Assistant</h6>
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
                    <label className="form-label">
                      Personal Assistant Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter PA Name"
                    />
                  </div>
                  <div className="col-xl-4 col-md-4">
                    <label className="form-label">Mobile No.</label>
                    <input
                      type="text"
                      className="form-control "
                      maxLength={10}
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter Mobile No."
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

export default Addpa;
