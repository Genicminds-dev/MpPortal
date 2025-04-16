const express = require("express");
const multer = require("multer");
const path = require("path");
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

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileName = req.file.filename;
  const filePath = `/uploads/${fileName}`;
  const sql = "INSERT INTO uploaded_images (filename, file_path) VALUES (?, ?)";
  db.query(sql, [fileName, filePath], (err, result) => {
    if (err) throw err;
    res.status(201).json({
      message: "Image uploaded  successfully",
      imageUrl: filePath,
    });
  });
});

router.get("/images", (req, res) => {
  const sql = "SELECT * FROM uploaded_images ORDER BY uploaded_at DESC";
  db.query(sql, (err, results) => {
    if (err) throw err;
    const formattedResults = results.map((row, index) => {
      const date = new Date(row.uploaded_at);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2);
      const formattedId = `IN/${String(index + 1).padStart(
        4,
        "0"
      )}/${day}-${month}-${year}`;
      return {
        id: row.id,
        filename: row.filename,
        file_path: row.file_path,
        uploaded_at: row.uploaded_at,
        formattedId: formattedId,
      };
    });
    res.status(200).json(formattedResults);
  });
});

module.exports = router;
