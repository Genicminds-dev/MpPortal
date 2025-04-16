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

const upload = multer({ storage });

router.post("/header", upload.single("websitelogo"), (req, res) => {
  const { websitename, govtname } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  if (!websitename || !govtname) {
    return res
      .status(400)
      .json({ message: "Website name and govt name are required" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const sql =
    "INSERT INTO header (websitename, govtname, websitelogo) VALUES (?, ?, ?)";

  db.query(sql, [websitelink, filePath], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "Website name and logo uploaded successfully",
      logoUrl: filePath,
    });
  });
});

router.get("/header", (req, res) => {
  const sql = "SELECT * FROM header";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/header/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM header WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Header not found" });
    }

    const link = result[0];
    res.status(200).json({
      id: link.id,
      websitename: link.websitename,
      govtname: link.govtname,
      websitelogo: link.websitelogo,
    });
  });
});

router.delete("/header/:id", (req, res) => {
  const { id } = req.params;

  const selectSql = "SELECT websitelogo FROM header WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Header not found" });
    }

    const filePath = result[0].websitelogo;

    const deleteSql = "DELETE FROM header WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      fs.unlink(path.join(__dirname, "..", filePath), (fsErr) => {
        if (fsErr) {
          console.error("Error deleting file:", fsErr);
        }
      });

      res.status(200).json({ message: "Header deleted successfully" });
    });
  });
});

router.put("/header/:id", upload.single("websitelogo"), (req, res) => {
  const { id } = req.params;
  const { websitename, govtname } = req.body;

  let updateSql = "UPDATE header SET";
  const updateParams = [];

  if (websitename) {
    updateSql += " websitename = ?";
    updateParams.push(websitename);
  }

  if (govtname) {
    updateSql += updateParams.length > 0 ? ", govtname = ?" : " govtname = ?";
    updateParams.push(govtname);
  }

  let newFilePath = null;
  if (req.file) {
    newFilePath = `/uploads/${req.file.filename}`;
    updateSql +=
      updateParams.length > 0 ? ", websitelogo = ?" : " websitelogo = ?";
    updateParams.push(newFilePath);
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  const selectSql = "SELECT websitelogo FROM header WHERE id = ?";

  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Header not found" });
    }

    const oldFilePath = result[0].websitelogo;

    db.query(updateSql, updateParams, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (newFilePath) {
        const fullPath = path.resolve(__dirname, "..", oldFilePath);

        fs.access(fullPath, fs.constants.F_OK, (accessErr) => {
          if (!accessErr) {
            fs.unlink(fullPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting old file:", unlinkErr);
              }
            });
          } else {
            console.warn(
              "Old file does not exist, skipping deletion:",
              fullPath
            );
          }
        });
      }

      res.status(200).json({ message: "Header updated successfully" });
    });
  });
});

module.exports = router;
