const mysql = require('mysql');
  require('dotenv').config();

const db = mysql.createConnection({
    host:"127.0.0.1",
    user:"genicminds_mp_portal_new",
    password:"Kh*)4yK+gPIr",
    database:"genicminds_mp_portal_new"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

module.exports = db;
