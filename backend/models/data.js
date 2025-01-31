const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: Date,
  verified: String,
  //add other fields here
});

module.exports = mongoose.model("Data", dataSchema);
