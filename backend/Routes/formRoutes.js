// controllers/entryController.js
const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/entries", (req, res) => {
  const query = "SELECT * FROM entries";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching entries", error: err });
    }
    res.json(results);
  });
});

router.get("/entries/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM entries WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching entry by ID:", err);
      return res
        .status(500)
        .json({ message: "Error fetching entry", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(results[0]);
  });
});

const PDFDocument = require("pdfkit");

router.get("/entries/:id/pdf", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM entries WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching entry for PDF:", err);
      return res
        .status(500)
        .json({ message: "Error fetching entry", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const entry = results[0];
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=entry_${id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text(`Entry Details - ID: ${id}`, { align: "center" });
    doc.moveDown();
    Object.entries(entry).forEach(([key, value]) => {
      doc.fontSize(12).text(`${key}: ${value}`);
    });

    doc.end();
  });
});

router.get("/subjects", (req, res) => {
  const query = "SELECT * FROM subjects";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching subjects", error: err });
    }
    res.json(results);
  });
});

router.post("/add-entry", (req, res) => {
  const { inwardNo, entryDate, subject, description } = req.body;
  const query =
    "INSERT INTO entries (inward_no, entry_date, subject, description) VALUES (?, ?, ?, ?)";

  db.query(
    query,
    [inwardNo, entryDate, subject, description],
    (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        return res
          .status(500)
          .json({ message: "Error adding entry", error: err });
      }
      res.status(200).json({ inwardNo: inwardNo });
    }
  );
});

module.exports = router;
