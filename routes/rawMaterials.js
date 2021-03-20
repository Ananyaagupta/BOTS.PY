const express = require("express");
const router = express.Router();
const RawMaterials = require("./../models/RawMaterials");

router.post("/rawMaterials", async (req, res) => {
  const { rawMaterial ,vendors } = req.body;
  try {
      var rawMaterialVendor = new RawMaterials({
          rawMaterial,
          vendors
      });
      await rawMaterialVendor.save();
      res.json({ rawMaterialVendor });
    
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error!");
  }
});
module.exports = router;