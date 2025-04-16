import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import api from "../../api";
import jsPDF from "jspdf";
import ReactPaginate from "react-paginate";
import "./ScanGallary.css";

const ScanGallery = () => {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 6;

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await api.get("/entries");
      setEntries(response.data.reverse());
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${day}-${month}-${year}`;
  };

  const fetchEntryById = async (entryId) => {
    try {
      const response = await api.get(`/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching entry by ID:", error);
      return null;
    }
  };

  const handleDownloadPDF = async (entryId) => {
    const entry = await fetchEntryById(entryId);
    if (entry) {
      const doc = new jsPDF();

      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      };

      const entryDate = entry.entry_date ? formatDate(entry.entry_date) : "N/A";

      doc.setFontSize(20);
      doc.setTextColor(34, 153, 84);
      doc.text(`Entry Details: ${entryId}`, 105, 20, null, null, "center");

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text(`Date: ${entryDate}`, 105, 30, null, null, "center");

      const startY = 40;
      const tableX = 10;
      const columnWidths = [80, 100];
      const rowHeight = 10;

      doc.setFillColor(51, 122, 183);
      doc.setDrawColor(0, 0, 0);
      doc.rect(tableX, startY, columnWidths[0], rowHeight, "FD");
      doc.rect(
        tableX + columnWidths[0],
        startY,
        columnWidths[1],
        rowHeight,
        "FD"
      );

      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("Field Name", tableX + 5, startY + 7);
      doc.text(
        "Value",
        tableX + columnWidths[0] + columnWidths[1] / 2,
        startY + 7,
        null,
        null,
        "center"
      );

      let yPosition = startY + rowHeight;
      let alternateRowColor = true;
      Object.keys(entry).forEach((key) => {
        let value = entry[key];
        if (key.toLowerCase().includes("date") && value) {
          value = formatDate(value);
        }

        if (alternateRowColor) {
          doc.setFillColor(240, 240, 240);
        } else {
          doc.setFillColor(255, 255, 255);
        }
        alternateRowColor = !alternateRowColor;
        doc.rect(tableX, yPosition, columnWidths[0], rowHeight, "FD");
        doc.rect(
          tableX + columnWidths[0],
          yPosition,
          columnWidths[1],
          rowHeight,
          "FD"
        );

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(key, tableX + 5, yPosition + 7);
        doc.text(
          `${value}`,
          tableX + columnWidths[0] + columnWidths[1] / 2,
          yPosition + 7,
          null,
          null,
          "center"
        );

        yPosition += rowHeight;
      });

      const totalHeight = Object.keys(entry).length * rowHeight;
      doc.setDrawColor(0, 0, 0);
      doc.rect(
        tableX,
        startY,
        columnWidths[0] + columnWidths[1],
        totalHeight + rowHeight
      );

      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        "Generated using our system.",
        105,
        yPosition + 10,
        null,
        null,
        "center"
      );
      doc.save(`Entry_${entryId}.pdf`);
    }
  };

  const handleCopy = async (entryId) => {
    const entry = await fetchEntryById(entryId);
    if (entry) {
      const textToCopy = Object.keys(entry)
        .map((key) => `${key}: ${entry[key]}`)
        .join("\n");

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showCopyMessage(
            "🎉 Data for Entry " + entryId + " has been copied successfully!"
          );
        })
        .catch((err) => {
          console.error("Error copying text: ", err);
          showCopyMessage(
            "❌ Failed to copy data to clipboard. Please try again!"
          );
        });
    }
  };

  const showCopyMessage = (message) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;

    messageDiv.style.position = "fixed";
    messageDiv.style.top = "50%";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translate(-50%, -50%)";
    messageDiv.style.backgroundColor = "#fff";
    messageDiv.style.padding = "20px";
    messageDiv.style.fontSize = "16px";
    messageDiv.style.color = "#000";
    messageDiv.style.borderRadius = "12px";
    messageDiv.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
    messageDiv.style.zIndex = "1000";
    messageDiv.style.textAlign = "center";
    messageDiv.style.border = "2px solid #ccc";
    messageDiv.style.width = "300px";
    messageDiv.style.height = "150px";
    messageDiv.style.display = "flex";
    messageDiv.style.flexDirection = "column";
    messageDiv.style.justifyContent = "center";
    messageDiv.style.alignItems = "center";

    const heading = document.createElement("div");
    heading.textContent = "Success!";
    heading.style.fontSize = "18px";
    heading.style.fontWeight = "bold";
    heading.style.marginBottom = "10px";
    heading.style.color = "#4CAF50";

    messageDiv.prepend(heading);

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.opacity = "0";
      setTimeout(() => {
        messageDiv.remove();
      }, 500);
    }, 2000);
  };

  const handlePrint = async (entryId) => {
    const entry = await fetchEntryById(entryId);
    if (entry) {
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      };

      const formattedEntry = Object.keys(entry).reduce((acc, key) => {
        acc[key] =
          key.toLowerCase().includes("date") && entry[key]
            ? formatDate(entry[key])
            : entry[key];
        return acc;
      }, {});

      const printWindow = window.open("", "", "width=600,height=400");
      const content = `
                <html>
                    <head>
                        <title>Print Entry</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                                color: #333;
                            }
                            h1 {
                                color: #0066cc;
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }
                            table th, table td {
                                border: 1px solid #ccc;
                                padding: 10px;
                                text-align: left;
                            }
                            table th {
                                background-color: #f4f4f4;
                                color: #333;
                            }
                            table td {
                                background-color: #fff;
                            }
                            table tr:nth-child(even) td {
                                background-color: #f9f9f9;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Entry Details: ${entryId}</h1>
                        <p>Below is the detailed entry data:</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Field Name</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.keys(formattedEntry)
                                  .map(
                                    (key) => `
                                            <tr>
                                                <td><strong>${key}</strong></td>
                                                <td>${formattedEntry[key]}</td>
                                            </tr>`
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const indexOfLastEntry = (currentPage + 1) * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
          <div>
            <nav>
              <ol className="breadcrumb mb-1">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                <li className="breadcrumb-item active" aria-current="page">
                  Entries
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row">
          {currentEntries.map((entry) => (
            <div key={entry.id} className="col-lg-4 col-md-6 col-sm-12 mb-5">
              <div className="custom-card">
                <div className="custom-card-header">
                  ✨ Scanned Application ✨
                </div>
                <div className="custom-card-body">
                  {Object.keys(entry)
                    .filter(
                      (key) =>
                        key !== "user_id" &&
                        key !== "created_at" &&
                        key !== "id"
                    )
                    .map((key) => (
                      <p key={key}>
                        <strong>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>
                        {key === "entry_date"
                          ? formatDate(entry[key])
                          : entry[key]}
                      </p>
                    ))}
                </div>
                <div className="custom-card-footer">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleCopy(entry.id)}
                  >
                    Copy Data
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary mx-2"
                    onClick={() => handlePrint(entry.id)}
                  >
                    Print
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleDownloadPDF(entry.id)}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="col-12 text-center no-entries">
              No entries available
            </div>
          )}
        </div>

        {entries.length > entriesPerPage && (
          <div className="d-flex justify-content-left">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={Math.ceil(entries.length / entriesPerPage)}
              onPageChange={handlePageChange}
              containerClassName={
                "pagination pagination-sm justify-content-center"
              }
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanGallery;
