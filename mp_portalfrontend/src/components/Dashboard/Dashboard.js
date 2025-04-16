import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineChartBar } from "react-icons/hi";
import { BiListPlus } from "react-icons/bi";
import { BiWindowClose } from "react-icons/bi";
import { BsPersonXFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import api from "../../api";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [completedGrievance, setCompletedGrievance] = useState([]);
  const [rejectedGrievance, setRejectedGrievance] = useState([]);
  const [inprogressGrievance, setInProgressGrievance] = useState([]);
  const [processedGrievance, setProcessedGrievance] = useState([]);
  const [filteredGrievance, setFilteredGrievance] = useState([]);
  const [clearDateRange, setClearDateRange] = useState("");

  const fetchGrievances = async () => {
    try {
      const response = await api.get("/grievances");
      setGrievances(response.data);

      const completedGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "Completed"
      );
      setCompletedGrievance(completedGrievances);

      const rejectedGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "Rejected"
      );
      setRejectedGrievance(rejectedGrievances);

      const inprogressGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "In Progress"
      );
      setInProgressGrievance(inprogressGrievances);

      const processedGrievances = response.data.filter(
        (grievance) => grievance.applicationStatus === "Processed"
      );
      setProcessedGrievance(processedGrievances);
      setFilteredGrievance(processedGrievances);
    } catch (error) {
      console.error("Error fetching grievances: ", error);
    }
  };

  const filterByDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      setFilteredGrievance(processedGrievance);
      return;
    }

    const filtered = processedGrievance.filter((grievance) => {
      const grievanceDate = new Date(grievance.date);
      return grievanceDate >= startDate && grievanceDate <= endDate;
    });

    setFilteredGrievance(filtered);
  };

  const clearDate = () => {
    setClearDateRange("");
    document.getElementById("daterange").value = "";
    setFilteredGrievance(processedGrievance);
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    flatpickr("#daterange", {
      mode: "range",
      dateFormat: "Y-m-d",
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          const startDate = selectedDates[0];
          const endDate = selectedDates[1];

          filterByDateRange(startDate, endDate);

          const formattedStartDate = startDate.toISOString().split("T")[0];
          const formattedEndDate = endDate.toISOString().split("T")[0];
          document.getElementById(
            "daterange"
          ).value = `${formattedStartDate} to ${formattedEndDate}`;

          setClearDateRange(`${formattedStartDate} to ${formattedEndDate}`);
        } else {
          document.getElementById("daterange").value = "";
          setFilteredGrievance(processedGrievance);
          setClearDateRange("");
        }
      },
    });
    //eslint-disable-next-line
  }, [processedGrievance]);

  return (
    <>
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <h1 class="page-title fw-medium fs-18 mb-0">Dashboard</h1>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-text bg-white border">
                    <i className="ri-calendar-line"></i>
                  </div>
                  <input
                    type="text"
                    className="form-control breadcrumb-input flatpickr-input"
                    id="daterange"
                    placeholder="Search By Date Range"
                    readOnly="readonly"
                  />
                  {clearDateRange && (
                    <button
                      onClick={clearDate}
                      className="btn btn-link bg-light position-absolute"
                      style={{
                        right: "4px",
                        top: "50%",
                        padding: "0px",
                        transform: "translateY(-50%)",
                        fontSize: "1.3rem",
                        color: "#006CA5",
                        fontWeight: "500",
                        textDecoration: "none",
                      }}
                      title="Clear"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12">
              <div class="row">
                <div class="col-xxl-3 col-xl-3 col-md-6 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/all-grievance-list">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted d-block mb-1">
                              Total Grievance
                            </span>
                            <h4 class="fw-medium mb-0">{grievances.length}</h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-info-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-info">
                              <BiListPlus />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div class="col-xxl-3 col-xl-3 col-md-6 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/completed-grievance">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="d-block text-muted mb-1">
                              Closed Grievance
                            </span>
                            <h4 class="fw-medium mb-0">
                              {completedGrievance.length}
                            </h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-success-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-success">
                              <BiWindowClose />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div class="col-xxl-3 col-xl-3 col-md-6 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/rejected-grievance">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted d-block mb-1">
                              Rejected Grievance
                            </span>
                            <h4 class="fw-medium mb-0">
                              {rejectedGrievance.length}
                            </h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-danger-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-danger">
                              <BsPersonXFill />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div class="col-xxl-3 col-xl-3 col-md-6 col-6">
                  <div class="card custom-card overflow-hidden main-content-card">
                    <Link to="/in-progress-grievance">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div>
                            <span class="text-muted d-block mb-1">
                              In Progress Grievance
                            </span>
                            <h4 class="fw-medium mb-0">
                              {inprogressGrievance.length}
                            </h4>
                          </div>
                          <div class="lh-1 p-2 border border-primary border-opacity-10 bg-warning-transparent rounded-pill">
                            <span class="avatar avatar-md avatar-rounded bg-warning">
                              <HiOutlineChartBar className="fs-5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-12">
              <div class="card custom-card overflow-hidden">
                <div class="card-header justify-content-between">
                  <div class="card-title">Recent Grievance</div>
                  <Link
                    to="/all-grievance-list"
                    class="btn btn-light btn-wave btn-sm text-muted waves-effect waves-light"
                  >
                    View All
                  </Link>
                </div>
                <div class="card-body p-0">
                  <div class="table-responsive">
                    <table class="table text-nowrap table-bordered border-primary">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Inward No.</th>
                          <th>Subject</th>
                          <th>Complainer</th>
                          <th>Case Handled by</th>
                          <th>Complaint Send to</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGrievance.map((grievance, index) => (
                          <tr className="table-light" key={index}>
                            <td className="sorting_1">
                              {(index + 1).toString().padStart(2, "0")}
                            </td>

                            <td>{grievance.inwardNo}</td>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div>
                                  <span className="d-block fw-medium">
                                    {grievance.subject}
                                  </span>
                                  <span className="d-block fs-11 text-muted">
                                    {grievance.remark}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div>
                                  <span className="d-block fw-medium">
                                    {grievance.fullName}
                                  </span>
                                  <span className="d-block fs-11 text-muted">
                                    {grievance.mobileNo}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div>
                                  <span className="d-block fw-medium">
                                    {grievance.handledBy}
                                  </span>
                                  <span className="d-block fs-11 text-muted">
                                    PA {index + 1}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div>
                                  <span className="d-block fw-medium">
                                    {grievance.complaintSentTo}
                                  </span>
                                  <span className="d-block fs-11 text-muted">
                                    Electricity Department
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {new Date(grievance.date)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .replace(/ /g, ", ")}
                            </td>
                            <td>
                              <span className="badge bg-info-transparent ">
                                Processed
                              </span>
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
