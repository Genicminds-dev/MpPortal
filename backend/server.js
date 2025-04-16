const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const navMenuRoutes = require("./Routes/navMenuRoutes");
const loginRoutes = require("./Routes/loginRoutes");
const formRoutes = require("./Routes/formRoutes");
const masterRoutes = require("./Routes/masterRoutes");
const grievanceRoutes = require("./Routes/grievanceRoutes");
const addUserRoutes = require("./Routes/addUserRoutes");
const fileUploadRoutes = require("./Routes/fileuploadRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const sliderRoutes = require("./Routes/sliderRoutes");
const galleryRoutes = require("./Routes/galleryRoutes");
const dashboardUserRoutes = require("./Routes/dashboardUserRoutes");
const dashboardLoginRoutes = require("./Routes/dashboardLoginRoutes");
const headerRoutes = require("./Routes/headerRoutes");
const footerRoutes = require("./Routes/footerRoutes");
const mpProfileRoutes = require("./Routes/mpProfileRoutes");
const mpProfileDescRoutes = require("./Routes/mpProfileDescRoutes");
const loginFormRoutes = require("./Routes/loginFormRoutes");
const loginProfileRoutes = require("./Routes/loginProfileRoutes");

app.use("/api/navmenu", navMenuRoutes);
app.use("/api/login", loginRoutes);
app.use("/api", formRoutes);
app.use("/api", masterRoutes);
app.use("/api", grievanceRoutes);
app.use("/api", addUserRoutes);
app.use("/api", fileUploadRoutes);
app.use("/api", notificationRoutes);
app.use("/api", sliderRoutes);
app.use("/api", galleryRoutes);
app.use("/api", dashboardUserRoutes);
app.use("/api", dashboardLoginRoutes);
app.use("/api", headerRoutes);
app.use("/api", footerRoutes);
app.use("/api", mpProfileRoutes);
app.use("/api", mpProfileDescRoutes);
app.use("/api", loginFormRoutes);
app.use("/api", loginProfileRoutes);

const PORT = 5505;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
