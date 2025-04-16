const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/dashboard-user", (req, res) => {
  const { username, password } = req.body;

  const query = "INSERT INTO dashboarduser (username, password) VALUES (?, ?)";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ message: "Error adding user" });
    }
    res.status(201).json({ id: results.insertId, username });
  });
});

router.get("/dashboard-user", (req, res) => {
  const query = "SELECT * FROM dashboarduser";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Error fetching users" });
    }
    res.json(results);
  });
});

router.get("/dashboard-user:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM dashboarduser WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Error fetching user" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]);
  });
});

router.put("/dashboard-user:id", (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  const query =
    "UPDATE dashboarduser SET username = ?, password = ? WHERE id = ?";
  db.query(query, [username, password, id], (err, results) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Error updating user" });
    }
    res.json({ message: "User updated successfully", username });
  });
});

router.delete("/dashboard-user:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM dashboarduser WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Error deleting user" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;
