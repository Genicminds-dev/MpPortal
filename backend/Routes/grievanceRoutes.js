const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/grievances", (req, res) => {
  const {
    inwardNo,
    subject,
    fullName,
    mobileNo,
    boothNo,
    handledBy,
    complaintSentTo,
    date,
    applicationStatus,
    district,
    taluka,
    village,
    city,
    pincode,
    whatsappGroup,
    remark,
  } = req.body;

  const grievanceDate = date || new Date().toISOString().split("T")[0];

  const sql = `
        INSERT INTO grievances 
        (inwardNo, subject, fullName, mobileNo, boothNo, handledBy, complaintSentTo, date, applicationStatus, district, taluka, village, city, pincode, whatsappGroup, remark) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      inwardNo,
      subject,
      fullName,
      mobileNo,
      boothNo,
      handledBy,
      complaintSentTo,
      grievanceDate,
      applicationStatus,
      district,
      taluka,
      village,
      city,
      pincode,
      whatsappGroup,
      remark,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting grievance:", err);
        return res
          .status(500)
          .json({ error: "Failed to insert grievance", details: err.message });
      }
      res.status(201).json({ id: results.insertId, inwardNo });
    }
  );
});

router.get("/grievances", (req, res) => {
  db.query("SELECT * FROM grievances", (err, results) => {
    if (err) {
      console.error("Error fetching grievances:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch grievances", details: err.message });
    }
    res.status(200).json(results);
  });
});

router.get("/grievances/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM grievances WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error fetching grievance:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch grievance", details: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    // Format the date
    const grievance = result[0];
    grievance.date = new Date(grievance.date).toLocaleDateString("en-US");
    res.status(200).json(grievance);
  });
});

router.put("/grievances/:id", (req, res) => {
  const { id } = req.params;
  const {
    subject,
    fullName,
    mobileNo,
    boothNo,
    handledBy,
    complaintSentTo,
    date,
    applicationStatus,
    district,
    taluka,
    village,
    city,
    pincode,
    whatsappGroup,
    remark,
  } = req.body;

  const grievanceDate = date || new Date().toISOString().split("T")[0];

  const query = `
        UPDATE grievances
        SET subject = ?, fullName = ?, mobileNo = ?, boothNo = ?, handledBy = ?, complaintSentTo = ?, date = ?, applicationStatus = ?, district = ?, taluka = ?, village = ?, city = ?, pincode = ?, whatsappGroup = ?, remark = ?
        WHERE id = ?
    `;

  db.query(
    query,
    [
      subject,
      fullName,
      mobileNo,
      boothNo,
      handledBy,
      complaintSentTo,
      grievanceDate,
      applicationStatus,
      district,
      taluka,
      village,
      city,
      pincode,
      whatsappGroup,
      remark,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating grievance:", err);
        return res
          .status(500)
          .json({ error: "Failed to update grievance", details: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Grievance not found" });
      }
      res.status(200).json({
        message: "Grievance updated successfully",
        id,
      });
    }
  );
});

router.delete("/grievances/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM grievances WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting grievance:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete grievance", details: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.status(204).send();
  });
});

module.exports = router;
