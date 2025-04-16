import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import api from "../../api";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    mobile: "",
    user_permission: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [Error, setError] = useState({
    name: "",
    mobile: "",
    user_permission: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newError = {
      name: "",
      mobile: "",
      user_permission: "",
      username: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.name) {
      newError.name = "*Subject name is required";
      isValid = false;
    }

    if (!formData.username) {
      newError.username = "*User name is required";
      isValid = false;
    }
    if (!formData.user_permission) {
      newError.user_permission = "*User permission is required";
      isValid = false;
    }
    if (!formData.mobile) {
      newError.mobile = "*Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newError.mobile = "*Mobile number must be 10 digits";
      isValid = false;
    }

    if (!formData.password) {
      newError.password = "*Password is required";
      isValid = false;
    } else if (
      !/[A-Za-z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      newError.password = "*Password must contain both letters and numbers";
      isValid = false;
    } else if (formData.password.length < 8 || formData.password.length > 15) {
      newError.password = "*Password must be between 8 and 15 characters long";
      isValid = false;
    } else {
      newError.password = "";
    }

    if (!formData.confirmPassword) {
      newError.confirmPassword = "*COnfirm password number is required";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleFocus = (field) => {
    setError((prevError) => ({ ...prevError, [field]: "" }));
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/add-user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error Fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newError = {};

    if (
      name === "name" ||
      name === "subject" ||
      name === "user_permission" ||
      name === "username"
    ) {
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "mobile") {
      if (/^[0-9]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      } else {
        newError[name] = `*Only numbers are allowed for ${name}`;
      }
    }

    if (name === "password") {
      setFormData({ ...formData, [name]: value });

      if (
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/.test(
          value
        )
      ) {
        newError[name] = "";
      } else {
        newError[name] =
          "*Password must be 8-15 characters long, and contain both letters and numbers";
      }
    }

    if (name === "confirmPassword") {
      setFormData({ ...formData, [name]: value });

      if (
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/.test(
          value
        )
      ) {
        newError[name] = "";
      } else {
        newError[name] =
          "*Password must be 8-15 characters long, and contain both letters and numbers";
      }

      if (formData.password && value !== formData.password) {
        newError["confirmPassword"] = "*Passwords do not match";
      } else {
        newError["confirmPassword"] = "";
      }
    }
    setError((prevError) => ({ ...prevError, ...newError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { confirmPassword, ...dataToPost } = formData;

    try {
      if (isEditing) {
        await api.put(`/add-user/${formData.id}`, dataToPost);
      } else {
        await api.post("/add-user", dataToPost);
      }

      resetForm();
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/add-user/${deleteId}`);
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      mobile: "",
      user_permission: "User",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  return (
    <>
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol class="breadcrumb mb-1">
                  <li class="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item active" aria-current="page">
                    Add User
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12">
              <div class="card custom-card">
                <div class="card-body">
                  <form onSubmit={handleSubmit}>
                    <div class="row gy-3">
                      <div class="col-xl-4 col-md-4">
                        <label for="input-rounded" class="form-label">
                          User Full Name
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter User Full Name"
                          onFocus={() => handleFocus("name")}
                        />
                        {Error.name && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.name}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 col-md-4">
                        <label for="input-rounded" class="form-label">
                          Mobile No.
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          maxLength={10}
                          id="input-rounded"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter Mobile No."
                          onFocus={() => handleFocus("mobile")}
                        />
                        {Error.mobile && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.mobile}
                          </p>
                        )}
                      </div>
                      <div className="col-xl-4 col-md-4">
                        <label htmlFor="user-select" className="form-label">
                          User Permission <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="user-select"
                          name="user_permission"
                          value={formData.user_permission}
                          onChange={handleChange}
                          onFocus={() => handleFocus("user_permission")}
                        >
                          <option value="">Select user permission</option>
                          <option value="Admin">Admin</option>
                          <option value="Clerk">Clerk</option>
                        </select>
                        {Error.user_permission && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.user_permission}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 color-selection">
                        <label for="product-color-add" class="form-label">
                          Create User Name
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter User Name"
                          onFocus={() => handleFocus("username")}
                        />
                        {Error.username && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.username}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 color-selection">
                        <label for="product-color-add" class="form-label">
                          Create User Password
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter User Password"
                          onFocus={() => handleFocus("password")}
                        />
                        {Error.password && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.password}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 color-selection">
                        <label for="product-color-add" class="form-label">
                          Confirm User Password
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Enter Confirm Password"
                          onFocus={() => handleFocus("confirmPassword")}
                        />
                        {Error.confirmPassword && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.confirmPassword}
                          </p>
                        )}
                      </div>
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
                  </form>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table text-nowrap table-bordered border-primary">
                      <thead class="table-warning">
                        <tr>
                          <th>Sr. No.</th>
                          <th>User Full Name</th>
                          <th>Mobile No.</th>
                          <th>User Permission</th>
                          <th>Create User Name</th>
                          <th>Create User Password</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user, index) => (
                            <tr key={user.id} className="table-light">
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.mobile}</td>
                              <td>{user.user_permission}</td>
                              <td>{user.username}</td>
                              <td>{user.password}</td>
                              <td>
                                <div className="btn-list">
                                  <button
                                    className="btn btn-sm btn-icon btn-success-gradient"
                                    onClick={() => handleEdit(user)}
                                  >
                                    <i className="ri-pencil-line"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-icon btn-danger-gradient"
                                    onClick={() => {
                                      setDeleteId(user.id);
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
                              No Users found
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
                <h6 className="modal-title">Edit User</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div class="modal-body">
                <div class="row gy-3">
                  <div class="col-xl-12 col-md-12">
                    <label className="form-label">User Full Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input-rounded"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter User Full Name"
                    />
                  </div>
                  <div class="col-xl-6 col-md-6">
                    <label for="input-rounded" class="form-label">
                      Mobile No.
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="input-rounded"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter Mobile No."
                    />
                  </div>
                  <div class="col-xl-6 col-md-6">
                    <label for="input-rounded" class="form-label">
                      User Permission
                    </label>
                    <select
                      className="form-select"
                      id="user-select"
                      name="user_permission"
                      value={formData.user_permission}
                      onChange={handleChange}
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Clerk">Clerk</option>

                    </select>
                  </div>
                  <div class="col-xl-6 col-md-6">
                    <label for="input-rounded" class="form-label">
                      Create User Password
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="input-rounded"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter User Name"
                    />
                  </div>
                  <div class="col-xl-6 col-md-6">
                    <label for="input-rounded" class="form-label">
                      Confirm User Password
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="input-rounded"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Enter Confirm Password"
                      onFocus={() => handleFocus("confirmPassword")}
                    />
                    {Error.confirmPassword && (
                      <p style={{ color: "red", fontSize: "11px" }}>
                        {Error.confirmPassword}
                      </p>
                    )}
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

export default AddUser;
