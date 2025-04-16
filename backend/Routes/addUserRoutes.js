const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add-user", async (req, res) => {
  const { name, mobile, user_permission, username, password } = req.body;
  const query =
    "INSERT INTO users (name, mobile, user_permission, username, password) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, mobile, user_permission, username, password],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({
          id: results.insertId,
          name,
          mobile,
          user_permission,
          username,
        });
    }
  );
});

router.get("/add-user", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/add-user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, mobile, user_permission, username, password } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "UPDATE users SET name = ?, mobile = ?, user_permission = ?, username = ?, password = ? WHERE id = ?";
  db.query(
    query,
    [name, mobile, user_permission, username, password, id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ id, name, mobile, user_permission, username });
    }
  );
});

router.delete("/add-user/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

module.exports = router;
