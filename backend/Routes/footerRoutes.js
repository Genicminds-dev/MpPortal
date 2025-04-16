const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/footer", (req, res) => {
  const { websitename, developedby } = req.body;

  const sql = "INSERT INTO footer (websitename, developedby) VALUES (?, ?)";
  db.query(sql, [websitename, developedby], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Failed to add footer" });
    }
    res.status(201).json({ id: result.insertId, websitename, developedby });
  });
});

router.get("/footer", (req, res) => {
  const sql = "SELECT * FROM footer";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch footer data" });
    }
    res.json(results);
  });
});

router.delete("/footer/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM footer WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ error: "Failed to delete footer" });
    }
    res.json({ message: "Footer deleted successfully" });
  });
});

router.put("/footer/:id", (req, res) => {
  const { id } = req.params;
  const { websitename, developedby } = req.body;

  const sql = "UPDATE footer SET websitename = ?, developedby = ? WHERE id = ?";
  db.query(sql, [websitename, developedby, id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ error: "Failed to update footer" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Footer not found" });
    }

    res.json({ message: "Footer updated successfully" });
  });
});

module.exports = router;
