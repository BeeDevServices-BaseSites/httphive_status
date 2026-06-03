require("dotenv").config();

const express = require("express");
const path = require("path");
const statusRoutes = require("./routes/statusRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", statusRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTPHive Status running on port ${PORT}`);
});