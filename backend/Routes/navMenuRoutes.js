const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/", (req, res) => {
  const query = "SELECT * FROM nav_menu_info LIMIT 1";
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

router.post("/", (req, res) => {
  const {
    logo_url,
    system_title,
    system_subtitle,
    emblem_url,
    swachh_bharat_logo_url,
  } = req.body;

  const query =
    "INSERT INTO nav_menu_info (logo_url, system_title, system_subtitle, emblem_url, swachh_bharat_logo_url) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      logo_url,
      system_title,
      system_subtitle,
      emblem_url,
      swachh_bharat_logo_url,
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Nav menu info added successfully!", data: result });
    }
  );
});

module.exports = router;
