const mongoose = require("mongoose");

const RawMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
  ],
});

module.exports = mongoose.model("rawMaterial", RawMaterialSchema);
