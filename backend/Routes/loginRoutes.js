const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { v4: uuidv4 } = require("uuid");

const generateUniqueId = (req, res, next) => {
  req.uniqueId = uuidv4();
  next();
};

router.post("/", generateUniqueId, (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length > 0) {
      const user = result[0]; 
      res.json({
        message: "Login successful",
        user: {
          username: user.username,
          name: user.name,
          user_permission: user.user_permission,
        },
        uniqueId: req.uniqueId,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

module.exports = router;
