import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api, { baseURLImage } from "../api";

const LoginForm = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [loginForm, setLoginForm] = useState([]);
  const [editData, setEditData] = useState({
    title: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const lightbox = GLightbox({ selector: ".glightbox" });
    return () => {
      lightbox.destroy();
    };
  }, [loginForm]);

  const fetchLoginForm = () => {
    api
      .get("/login-form")
      .then((response) => setLoginForm(response.data))
      .catch((error) => {
        console.error("Error fetching login form!", error);
        toast.error("Failed to load login form.");
      });
  };

  useEffect(() => {
    fetchLoginForm();
  }, []);

  const handleEditModalOpen = (form) => {
    setEditData(form);
    setImagePreview(`${baseURLImage}${form.image_path}`);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("title", editData.title);
    if (editData.image) {
      formData.append("image", editData.image);
    }

    try {
      await api.put(`/login-form/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchLoginForm();
      setShowEditModal(false);
      toast.success("Login Form updated successfully!");
    } catch (error) {
      console.error("Error updating login form!", error);
      toast.error("Failed to update login form.");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData({ title: "", image: null });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
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
                Login Form
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Login Form</h4>
                    </div>
                  </div>
                  <div className="table-responsive m-t-10">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Tilte</th>
                          <th>Logo</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginForm.map((form, index) => (
                          <tr key={form.id}>
                            <td>{index + 1}</td>
                            <td>{form.title}</td>
                            <td>
                              <Link
                                to={`${baseURLImage}${form.image_path}`}
                                className="glightbox"
                                data-gallery="slider-images"
                              >
                                <img
                                  width="100px"
                                  src={`${baseURLImage}${form.image_path}`}
                                  alt={`form-img${form.image_path}`}
                                />
                              </Link>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleEditModalOpen(form)}
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

          {showEditModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Login Form</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editData.title}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Image</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="preview"
                            width="100"
                            className="mt-2"
                          />
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={handleCloseEditModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleEditSubmit}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
