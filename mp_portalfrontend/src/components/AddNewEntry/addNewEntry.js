import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { FcDocument } from "react-icons/fc";
import api from "../../api";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";

const AddEntryPage = () => {
  const [entries, setEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    inwardNo: "",
    entryDate: "",
    subject: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    inwardNo: "",
    entryDate: "",
    subject: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 5;

  useEffect(() => {
    fetchEntries();
    fetchSubjects();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get("/entries");
      setEntries(response.data.reverse());
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date[0], "yyyy-MM-dd");
    setFormData({ ...formData, entryDate: formattedDate });

    setErrors({ ...errors, entryDate: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.inwardNo) {
      newErrors.inwardNo = "Inward No. is required.";
      isValid = false;
    }

    if (!formData.entryDate) {
      newErrors.entryDate = "Entry Date is required.";
      isValid = false;
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required.";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await api.post("/add-entry", formData);
      const inwardNo = response.data.inwardNo;

      await api.post("/notification", {
        heading: "Added New Entry",
        description: `Added new entry ${inwardNo}`,
        readed: 0,
      });

      fetchEntries();
      setFormData({
        inwardNo: "",
        entryDate: "",
        subject: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding entry or sending notification:", error);
    }
  };

  const offset = currentPage * entriesPerPage;
  const currentEntries = entries.slice(offset, offset + entriesPerPage);
  const pageCount = Math.ceil(entries.length / entriesPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <nav>
            <ol className="breadcrumb d-flex align-items-center mb-1">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Home</Link>
              </li>
              <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
              <li className="breadcrumb-item active" aria-current="page">
                Add New Entry
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title fs-5">Add New Entry</div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} autocomplete="off">
                  <div className="row gy-3">
                    <div className="col-xl-4 col-md-4">
                      <label className="form-label">
                        Inward No. <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="inwardNo"
                        value={formData.inwardNo}
                        onChange={handleChange}
                        placeholder="IN/0001/23-8-24"
                      />
                      {errors.inwardNo && (
                        <div className="text-danger">{errors.inwardNo}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">
                        Entry Date <span className="text-danger">*</span>
                      </label>
                      <Flatpickr
                        className="flatpickr-input form-control"
                        placeholder="Select Entry Date"
                        value={formData.entryDate}
                        onChange={handleDateChange}
                        options={{
                          dateFormat: "Y-m-d",
                          appendTo: document.body,
                        }}
                      />
                      {errors.entryDate && (
                        <div className="text-danger">{errors.entryDate}</div>
                      )}
                    </div>

                    <div className="col-xl-4 col-md-4">
                      <label className="form-label">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Subject
                        </option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject.subject_name}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>

                      {errors.subject && (
                        <div className="text-danger">{errors.subject}</div>
                      )}
                    </div>

                    <div className="col-xl-8 col-md-6">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter Description"
                      />
                      {errors.description && (
                        <div className="text-danger">{errors.description}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="submit"
                      className="btn btn-purple-gradient btn-wave waves-effect waves-light"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger-gradient btn-wave waves-effect waves-light mx-1"
                      onClick={() =>
                        setFormData({
                          inwardNo: "",
                          entryDate: "",
                          subject: "",
                          description: "",
                        })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card overflow-hidden">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table text-nowrap table-bordered border-primary">
                    <thead className="table-warning">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Inward No.</th>
                        <th>Entry Date</th>
                        <th>Subject</th>
                        <th>Description</th>
                        <th width="10%">Documents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntries.map((entry, index) => (
                        <tr key={entry.id} className="table-light">
                          <td>{(index + 1).toString().padStart(2, "0")}</td>
                          <td>{entry.inward_no}</td>
                          <td>
                            {new Date(entry.entry_date)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              .replace(/\//g, "-")}
                          </td>
                          <td>{entry.subject}</td>
                          <td>{entry.description}</td>
                          <td className="text-center">
                            <Link to="/scan-gallary" rel="noopener noreferrer">
                              <FcDocument className="fs-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination pagination-sm mt-3"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEntryPage;
