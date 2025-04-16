const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/personal_assistants", (req, res) => {
  const { name, mobile } = req.body;
  const query = "INSERT INTO personal_assistants (name, mobile) VALUES (?, ?)";
  db.query(query, [name, mobile], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, name, mobile });
  });
});

router.get("/personal_assistants", (req, res) => {
  db.query("SELECT * FROM personal_assistants", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/personal_assistants/:id", (req, res) => {
  const { id } = req.params;
  const { name, mobile } = req.body;
  const query =
    "UPDATE personal_assistants SET name = ?, mobile = ? WHERE id = ?";
  db.query(query, [name, mobile, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, name, mobile });
  });
});

router.delete("/personal_assistants/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM personal_assistants WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

router.post("/booths", (req, res) => {
  const { booth_no } = req.body;
  const query = "INSERT INTO booths (booth_no) VALUES (?)";
  db.query(query, [booth_no], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, booth_no });
  });
});

router.get("/booths", (req, res) => {
  db.query("SELECT * FROM booths", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/booths/:id", (req, res) => {
  const { id } = req.params;
  const { booth_no } = req.body;
  const query = "UPDATE booths SET booth_no = ? WHERE id = ?";
  db.query(query, [booth_no, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, booth_no });
  });
});

router.delete("/booths/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM booths WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

router.post("/subjects", (req, res) => {
  const { subject_name } = req.body;
  const query = "INSERT INTO subjects (subject_name) VALUES (?)";
  db.query(query, [subject_name], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, subject_name });
  });
});

router.get("/subjects", (req, res) => {
  db.query("SELECT * FROM subjects", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/subjects/:id", (req, res) => {
  const { id } = req.params;
  const { subject_name } = req.body;
  const query = "UPDATE subjects SET subject_name = ? WHERE id = ?";
  db.query(query, [subject_name, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, subject_name });
  });
});

router.delete("/subjects/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM subjects WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

router.post("/talukas", (req, res) => {
  const { taluka_name } = req.body;
  const query = "INSERT INTO talukas (taluka_name) VALUES (?)";
  db.query(query, [taluka_name], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, taluka_name });
  });
});

router.get("/talukas", (req, res) => {
  db.query("SELECT * FROM talukas", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/talukas/:id", (req, res) => {
  const { id } = req.params;
  const { taluka_name } = req.body;
  const query = "UPDATE talukas SET taluka_name = ? WHERE id = ?";
  db.query(query, [taluka_name, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, taluka_name });
  });
});

router.delete("/talukas/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM talukas WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

router.post("/complaint_senders", (req, res) => {
  const { sender } = req.body;
  const query = "INSERT INTO complaint_senders (sender) VALUES (?)";
  db.query(query, [sender], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, sender });
  });
});

router.get("/complaint_senders", (req, res) => {
  db.query("SELECT * FROM complaint_senders", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/complaint_senders/:id", (req, res) => {
  const { id } = req.params;
  const { sender } = req.body;
  const query = "UPDATE complaint_senders SET sender = ? WHERE id = ?";
  db.query(query, [sender, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, sender });
  });
});

router.delete("/complaint_senders/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM complaint_senders WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

router.post("/application_status", (req, res) => {
  const { status } = req.body;
  const query = "INSERT INTO application_status (status) VALUES (?)";
  db.query(query, [status], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, status });
  });
});

router.get("/application_status", (req, res) => {
  db.query("SELECT * FROM application_status", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/application_status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = "UPDATE application_status SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, status });
  });
});

router.delete("/application_status/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM application_status WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

router.post("/whatsapp_groups", (req, res) => {
  const { group_name } = req.body;
  const query = "INSERT INTO whatsapp_groups (group_name) VALUES (?)";
  db.query(query, [group_name], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: results.insertId, group_name });
  });
});

router.get("/whatsapp_groups", (req, res) => {
  db.query("SELECT * FROM whatsapp_groups", (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

router.put("/whatsapp_groups/:id", (req, res) => {
  const { id } = req.params;
  const { group_name } = req.body;
  const query = "UPDATE whatsapp_groups SET group_name = ? WHERE id = ?";
  db.query(query, [group_name, id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ id, group_name });
  });
});

router.delete("/whatsapp_groups/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM whatsapp_groups WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(204).send();
  });
});

module.exports = router;
