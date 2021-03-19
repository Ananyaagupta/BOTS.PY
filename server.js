const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const manufacturerRoutes = require("./routes/manufacturer");
const authRoutes = require("./routes/auth");

connectDB();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API running!");
});

app.use("/manufacturer", manufacturerRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
