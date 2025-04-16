const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../config/db.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/mp-profile", upload.single("image"), (req, res) => {
  const { name, designation } = req.body;

  if (!name || !designation) {
    return res
      .status(400)
      .json({ message: "Name and designation are required" });
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO mp_profile (name, designation, image_path) VALUES (?, ?, ?)";
  db.query(sql, [name, designation, imagePath], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({
      message: "Mp profile added successfully",
      mpprofileId: result.insertId,
    });
  });
});

router.get("/mp-profile", (req, res) => {
  const sql = "SELECT * FROM mp_profile";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/mp-profile/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM mp_profile WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Mp profile not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/mp-profile/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, designation } = req.body;

  let updateSql = "UPDATE mp_profile SET";
  const updateParams = [];

  if (name) {
    updateSql += " name = ?";
    updateParams.push(name);
  }
  if (designation) {
    updateSql +=
      updateParams.length > 0 ? ", designation = ?" : " designation = ?";
    updateParams.push(designation);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
    updateSql +=
      updateParams.length > 0 ? ", image_path = ?" : " image_path = ?";
    updateParams.push(imagePath);
  }

  if (updateParams.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT image_path FROM mp_profile WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Fire station not found" });
    }

    const oldImagePath = result[0].image_path;

    db.query(updateSql, updateParams, (err, updateResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (req.file && oldImagePath) {
        const fullPath = path.join(
          __dirname,
          "..",
          oldImagePath.replace(/^\//, "")
        );
        fs.unlink(fullPath, (fsErr) => {
          if (fsErr) {
            console.error("Error deleting old image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Mp profile updated successfully" });
    });
  });
});

router.delete("/mp-profile/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT image_path FROM mp_profile WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Mp profile not found" });
    }

    const imagePath = result[0].image_path;

    const deleteSql = "DELETE FROM mp_profile WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (imagePath) {
        fs.unlink(path.join(__dirname, "..", imagePath), (fsErr) => {
          if (fsErr) {
            console.error("Error deleting image:", fsErr);
          }
        });
      }

      res.status(200).json({ message: "Mp profile deleted successfully" });
    });
  });
});

module.exports = router;
