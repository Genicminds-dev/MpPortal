const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/mp-profile-desc", (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "INSERT INTO mp_desc (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Mp Description added successfully",
      mpDescId: result.insertId,
    });
  });
});

router.get("/mp-profile-desc", (req, res) => {
  const sql = "SELECT * FROM mp_desc";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/mp-profile-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM mp_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Mp Description not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/mp-profile-desc/:id", (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  const sql = "UPDATE mp_desc SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mp Description not found" });
    }
    res.status(200).json({ message: "Mp Description updated successfully" });
  });
});

router.delete("/mp-profile-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mp_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mp Description not found" });
    }
    res.status(200).json({ message: "Mp Description deleted successfully" });
  });
});

module.exports = router;
