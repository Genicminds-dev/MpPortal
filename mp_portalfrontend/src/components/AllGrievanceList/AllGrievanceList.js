import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import api from "../../api";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../assets/css/clipboard.css";

const AllGrievanceList = () => {
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 8;

  const fetchGrievances = async () => {
    try {
      const response = await api.get("/grievances");
      setGrievances(response.data);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/grievances/${deleteId}`);
      fetchGrievances();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting grievance:", error);
    }
  };

  const filteredData = grievances.filter(
    (item) =>
      item.inwardNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.handledBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.complaintSentTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortData = (data, column, direction) => {
    const sortedData = [...data].sort((a, b) => {
      const isAsc = direction === "asc";
      if (a[column] < b[column]) {
        return isAsc ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };

  const sortedData = sortColumn
    ? sortData(filteredData, sortColumn, sortDirection)
    : filteredData;

  const offset = currentPage * itemsPerPage;
  const displayedGrievances = sortedData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = `
        <html>
          <head>
            <title>Rejected Grievances</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <h2>All Grievance List</h2>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Inward No.</th>
                  <th>Subject</th>
                  <th>Complainer</th>
                  <th>Handled By</th>
                  <th>Complaint Sent to</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${grievances
                  .map(
                    (grievance, index) => `
                  <tr>
                    <td>${(index + 1 + offset)
                      .toString()
                      .padStart(2, "0")} </td>
                    <td>${grievance.inwardNo}</td>
                    <td>${grievance.subject}</td>
                    <td>${grievance.fullName}</td>
                    <td>${grievance.handledBy}</td>
                    <td>${grievance.complaintSentTo}</td>
                    <td>${new Date(grievance.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, ", ")}</td>
                    <td><span class="badge bg-danger">${
                      grievance.applicationStatus
                    }</span></td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const [showPopup, setShowPopup] = useState(false);
  const copyToClipboard = () => {
    const tableHeadings =
      "Sr. No.\tInward No.\tSubject\tComplainer\tHandled By\tComplaint Sent to\tDate\tStatus";

    const dataStr = grievances
      .map(
        (grievance, index) =>
          `${(index + 1 + offset).toString().padStart(2, "0")}\t${
            grievance.inwardNo
          }\t${grievance.subject}\t${grievance.fullName}\t${
            grievance.handledBy
          }\t${grievance.complaintSentTo}\t${new Date(grievance.date)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, ", ")}\t${grievance.applicationStatus}`
      )
      .join("\n");

    const fullDataStr = `${tableHeadings}\n${dataStr}`;

    navigator.clipboard
      .writeText(fullDataStr)
      .then(() => {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy data: ", err);
      });
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      grievances
        .map(
          (grievance) =>
            `${grievance.inwardNo},${grievance.subject},${grievance.fullName},${
              grievance.handledBy
            },${grievance.complaintSentTo},${new Date(grievance.date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, ", ")},${grievance.applicationStatus}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "allGrievancesList.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const formattedGrievances = grievances.map((grievance, index) => ({
      "S.No.": (index + 1 + offset).toString().padStart(2, "0"),
      "Inward No.": grievance.inwardNo,
      Subject: grievance.subject,
      Complainer: grievance.fullName,
      "Handled By": grievance.handledBy,
      "Complaint Sent to": grievance.complaintSentTo,
      Date: new Date(grievance.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, ", "),
      Status: grievance.applicationStatus,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedGrievances);

    const wscols = [
      { wpx: 50 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 150 },
      { wpx: 100 },
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Grievances List");

    XLSX.writeFile(wb, "allGrievancesList.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    const title = "Citizen Grievance Management System";
    const titleWidth = doc.getTextWidth(title);
    const titleXPosition = (pageWidth - titleWidth) / 2;

    doc.text(title, titleXPosition, 15);

    autoTable(doc, {
      head: [
        [
          "Sr. No.",
          "Inward No.",
          "Subject",
          "Complainer",
          "Handled By",
          "Complaint Sent to",
          "Date",
          "Status",
        ],
      ],
      body: grievances.map((grievance, index) => [
        (index + 1 + offset).toString().padStart(2, "0"),
        grievance.inwardNo,
        grievance.subject,
        grievance.fullName,
        grievance.handledBy,
        grievance.complaintSentTo,
        new Date(grievance.date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, ", "),
        grievance.applicationStatus,
      ]),
      styles: {
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [4, 54, 71],
        textColor: [255, 255, 255],
        halign: "center",
        valign: "middle",
        cellPadding: 1,
        fontSize: 9,
      },
      bodyStyles: {
        cellPadding: 1,
        overflow: "linebreak",
        fontSize: 9,
      },
      margin: { top: 20 },
    });

    doc.save("allGrievancesList.pdf");
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  return (
    <>
      <div className="main-content app-content">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol className="breadcrumb mb-1">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <HiOutlineArrowNarrowRight className="mx-2 mt-1" />
                  </div>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Grievance List
                  </li>
                </ol>
              </nav>
            </div>
            <div className="btn-list">
              <Link
                to="/add-new-grievance"
                className="btn btn-success-gradient btn-wave waves-effect waves-light"
              >
                <i className="ri-share-forward-line me-1"></i> Add New Grievance
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="card custom-card">
                <div className="card-header">
                  <div className="card-title fs-18">All Grievance List</div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <div
                      id="file-export_wrapper"
                      className="dataTables_wrapper dt-bootstrap5 no-footer"
                    >
                      <div className="dt-buttons">
                        <button
                          className="dt-button buttons-copy buttons-html5"
                          tabindex="0"
                          aria-controls="file-export"
                          style={{ background: "#21CE9E", marginLeft: "0px" }}
                          onClick={copyToClipboard}
                        >
                          {showPopup && (
                            <div className="popup">
                              <span className="popup-title">
                                Copy to clipboard
                              </span>
                              <hr className="popup-divider" />
                              <p className="popup-subtitle">
                                Copied {grievances.length} rows to clipboard
                              </p>
                            </div>
                          )}
                          <span>Copy</span>
                        </button>
                        <button
                          className="dt-button buttons-csv buttons-html5"
                          tabindex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#FF8E6F", marginLeft: "8px" }}
                          onClick={downloadCSV}
                        >
                          <span>CSV</span>
                        </button>
                        <button
                          className="dt-button buttons-excel buttons-html5"
                          tabindex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#FFC658", marginLeft: "8px" }}
                          onClick={downloadExcel}
                        >
                          <span>Excel</span>
                        </button>
                        <button
                          className="dt-button buttons-pdf buttons-html5"
                          tabindex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#FB4242", marginLeft: "8px" }}
                          onClick={downloadPDF}
                        >
                          <span>PDF</span>
                        </button>
                        <button
                          className="dt-button buttons-print"
                          tabindex="0"
                          aria-controls="file-export"
                          type="button"
                          style={{ background: "#5C67F7", marginLeft: "8px" }}
                          onClick={handlePrint}
                        >
                          <span>Print</span>
                        </button>{" "}
                      </div>

                      <div
                        id="file-export_filter"
                        className="dataTables_filter"
                      >
                        <label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control form-control-sm mb-3"
                              placeholder="Search..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                              <button
                                onClick={clearSearch}
                                className="btn btn-link position-absolute"
                                style={{
                                  right: "4px",
                                  top: "50%",
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
                        </label>
                      </div>
                      <table className="table table-bordered text-nowrap w-100">
                        <thead>
                          <tr>
                            <th
                              onClick={() => handleSort("id")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Sr. No.
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "5px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("id")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("inwardNo")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Inward No.
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("inwardNo")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("subject")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Subject
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("subject")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("complainer")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Complainer
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("complainer")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("handledBy")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Handled By
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("handledBy")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("complaintTo")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Complaint Send to
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("complaintTo")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("date")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Date
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("receiveDate")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("status")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Status
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("status")}
                              </span>
                            </th>
                            <th
                              onClick={() => handleSort("action")}
                              style={{
                                cursor: "pointer",
                                justifyContent: "space-between",
                              }}
                            >
                              Actions
                              <span
                                style={{
                                  opacity: 0.2,
                                  paddingLeft: "20px",
                                  fontSize: "12px",
                                }}
                              >
                                {renderSortIcon("action")}
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedGrievances.length > 0 ? (
                            displayedGrievances.map((grievance, index) => (
                              <tr
                                key={grievance.id}
                                className={`table-${
                                  grievance.applicationStatus === "Completed"
                                    ? "success"
                                    : grievance.applicationStatus === "Rejected"
                                    ? "danger"
                                    : grievance.applicationStatus ===
                                      "In Progress"
                                    ? "warning"
                                    : ""
                                }`}
                              >
                                <td>
                                  {(index + 1 + offset)
                                    .toString()
                                    .padStart(2, "0")}
                                </td>

                                <td>{grievance.inwardNo}</td>
                                <td className="fw-semibold">
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
                                <td className="fw-semibold">
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
                                <td className="fw-semibold">
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
                                <td className="fw-semibold">
                                  <div className="d-flex align-items-center gap-3">
                                    <div>
                                      <span className="d-block fw-medium">
                                        {grievance.complaintSentTo}
                                      </span>
                                      <span className="d-block fs-11 text-muted">
                                        Electrucity Department
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
                                  <span
                                    className={`badge bg-${
                                      grievance.applicationStatus ===
                                      "Completed"
                                        ? "success"
                                        : grievance.applicationStatus ===
                                          "Rejected"
                                        ? "danger"
                                        : grievance.applicationStatus ===
                                          "In Progress"
                                        ? "warning"
                                        : grievance.applicationStatus ===
                                          "Processed"
                                        ? "info-transparent"
                                        : ""
                                    }`}
                                  >
                                    {grievance.applicationStatus}
                                  </span>
                                </td>

                                <td>
                                  <div className="btn-list">
                                    <Link
                                      to={`/view-application/${grievance.id}`}
                                      className="btn btn-sm btn-icon btn-purple-gradient"
                                    >
                                      <i className="ri-eye-line"></i>
                                    </Link>
                                    <Link
                                      to={`/edit-application/${grievance.id}`}
                                      className="btn btn-sm btn-icon btn-success-gradient"
                                    >
                                      <i className="ri-pencil-line"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-icon btn-danger-gradient"
                                      onClick={() => {
                                        setDeleteId(grievance.id);
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
                              <td colSpan="10" className="text-center">
                                No entries found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <div className="row mt-3">
                        <div className="col-md-6">
                          <p className="text-muted">
                            Showing {offset + 1} to{" "}
                            {Math.min(offset + itemsPerPage, sortedData.length)}{" "}
                            of {sortedData.length} entries
                          </p>
                        </div>

                        <div className="col-md-6 d-flex justify-content-end">
                          <ReactPaginate
                            previousLabel={"Previous"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
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
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

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

export default AllGrievanceList;
