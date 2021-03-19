// MongoDB connection
const mongoose = require("mongoose");

const db =
  process.env.MONGODB_URI ||
  "mongodb+srv://zacker:eIzyTR563HCosLKT@cluster0.bcnug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
