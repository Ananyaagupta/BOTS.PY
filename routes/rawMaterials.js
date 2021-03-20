const express = require("express");
const router = express.Router();
const RawMaterials = require("./../models/RawMaterials");

router.post("/add", async (req, res) => {
  const { name, vendors } = req.body;
  try {
    var rawMaterialVendor = new RawMaterials({
      name,
      vendors,
    });
    await rawMaterialVendor.save();
    res.json({ rawMaterialVendor });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
