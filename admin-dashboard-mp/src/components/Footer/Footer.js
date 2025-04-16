import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [footerData, setFooterData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFooter, setSelectedFooter] = useState(null);

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const response = await api.get("/footer");
      setFooterData(response.data);
    } catch (error) {
      toast.error("Failed to fetch footer data!");
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/footer/${selectedFooter.id}`, {
        websitename: selectedFooter.websitename,
        developedby: selectedFooter.developedby,
      });

      const updatedFooter = footerData.map((footer) =>
        footer.id === selectedFooter.id ? selectedFooter : footer
      );
      setFooterData(updatedFooter);
      setShowEditModal(false);
      toast.success("Footer updated successfully!");
    } catch (error) {
      toast.error("Failed to update the footer!");
    }
  };

  const handleEditClick = (footer) => {
    setSelectedFooter({ ...footer });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedFooter({ ...selectedFooter, [name]: value });
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
                Footer
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Footer</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Website Name</th>
                          <th>Developed By</th>
                          <th width="15%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {footerData.length > 0 ? (
                          footerData.map((footer, index) => (
                            <tr key={footer.id}>
                              <td>{index + 1}</td>
                              <td>{footer.websitename}</td>
                              <td>{footer.developedby}</td>
                              <td>
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(footer)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No footer data available.
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
                    <h5 className="modal-title">Edit Footer</h5>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Website name</label>
                        <input
                          type="text"
                          className="form-control form-control-md"
                          name="websitename"
                          value={selectedFooter?.websitename || ""}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Developed by</label>
                        <textarea
                          className="form-control form-control-md"
                          name="developedby"
                          value={selectedFooter?.developedby || ""}
                          onChange={handleEditChange}
                        ></textarea>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleEditSave}
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

export default Footer;
