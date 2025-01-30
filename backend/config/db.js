const mongoose = require("mongoose");

const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  return mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
};

module.exports = connectDB;
