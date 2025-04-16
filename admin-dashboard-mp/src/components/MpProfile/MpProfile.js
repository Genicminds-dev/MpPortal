import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { baseURLImage } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

const MpProfile = () => {
  const [descriptionData, setDescriptionData] = useState([]);
  const [mpData, setMpData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editData, setEditData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDescriptionData();
    fetchMpData();
  }, []);

  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".glightbox",
    });
    return () => {
      lightbox.destroy();
    };
  }, [mpData]);

  const fetchDescriptionData = async () => {
    try {
      const response = await api.get("/mp-profile-desc");
      setDescriptionData(response.data);
    } catch (error) {
      toast.error("Failed to fetch description data!");
    }
  };

  const fetchMpData = async () => {
    try {
      const response = await api.get("/mp-profile");
      setMpData(response.data);
    } catch (error) {
      toast.error("Failed to fetch MP data!");
    }
  };

  const openEditModal = (item, type) => {
    setSelectedItem(item);
    setEditData(
      type === "description" ? { description: item.description } : { ...item }
    );
    setImagePreview(type === "mp" ? `${baseURLImage}${item.image_path}` : "");
    setModalType(type);
    setShowEditModal(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    setEditData({});
    setImagePreview("");
  };

  const handleSaveChanges = async () => {
    try {
      if (modalType === "description") {
        await api.put(`/mp-profile-desc/${selectedItem.id}`, {
          description: editData.description,
        });
        setDescriptionData(
          descriptionData.map((item) =>
            item.id === selectedItem.id
              ? { ...item, description: editData.description }
              : item
          )
        );
        fetchDescriptionData();
      } else if (modalType === "mp") {
        const formData = new FormData();
        formData.append("name", editData.name);
        formData.append("designation", editData.designation);

        if (editData.imageFile) {
          formData.append("image", editData.imageFile);
        }

        await api.put(`/mp-profile/${selectedItem.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setMpData(
          mpData.map((item) =>
            item.id === selectedItem.id ? { ...item, ...editData } : item
          )
        );
        fetchMpData();
      }
      toast.success(
        `${
          modalType === "description" ? "Description" : "MP"
        } updated successfully!`
      );
      navigate("/mp-profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the entry!");
    }
    closeModal();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditData({ ...editData, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                MP Profile
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">MP Profile</h4>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Image</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mpData.length > 0 ? (
                          mpData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.designation}</td>
                              <td>
                                <Link
                                  className="glightbox"
                                  to={`${baseURLImage}${item.image_path}`}
                                >
                                  <img
                                    src={`${baseURLImage}${item.image_path}`}
                                    alt={item.name}
                                    style={{
                                      width: "75px",
                                    }}
                                  />
                                </Link>
                              </td>
                              <td>
                                <button
                                  onClick={() => openEditModal(item, "mp")}
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No Mp Profile Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <hr className="m-t-30" />

                  <div className="row m-t-30">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">MP Profile Description</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Description</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {descriptionData.length > 0 ? (
                          descriptionData.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.description}</td>
                              <td>
                                <button
                                  onClick={() =>
                                    openEditModal(item, "description")
                                  }
                                  className="btn btn-success btn-sm m-t-10"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No Description Data Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEditModal && (
            <div
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {modalType === "description"
                        ? "Edit MP Description"
                        : "Edit MP Profile"}
                    </h5>
                  </div>
                  <div className="modal-body">
                    {modalType === "description" ? (
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          className="form-control"
                          id="description"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="designation">Designation</label>
                          <input
                            type="text"
                            className="form-control"
                            id="designation"
                            value={editData.designation}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                designation: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="image">Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="image"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: "75px",
                                marginTop: "10px",
                              }}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MpProfile;
