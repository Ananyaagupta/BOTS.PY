const mongoose = require("mongoose");

const AgreementSchema = new mongoose.Schema({
  rawMaterial: {
    type: String,
    required: true,
  },
  costPerUnit: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  deliveryMode: {
    type: String,
  },
  deadline: {
    type: Date,
  },
  stage: {
    type: String,
    required: true,
  },
  lastUpdatedBy: {
    type: String,
  },
  comment: {
    type: String,
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manufacturer",
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendor",
  },
});

module.exports = mongoose.model("agreement", AgreementSchema);
