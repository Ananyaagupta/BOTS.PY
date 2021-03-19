const mongoose = require("mongoose");

const ProcurementSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  agreements: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agreement",
  },
});

module.exports = new mongoose.model("procurement", ProcurementSchema);
