// MongoDB connection
const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGODB_URI;

const connectDB = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(console.log("MongoDB connected!"))
    .catch((err) => {
      console.log("err here");
      console.error(err);
      process.exit(1);
    });
};

module.exports = connectDB;
