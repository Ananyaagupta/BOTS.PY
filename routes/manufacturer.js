const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

router.get("/:id", async (req, res) => {
  try {
    const agreements = await Agreement.find({ manufacturer: req.params.id });
    const currDate = Date.now;
    const expiringAgreements = agreements.map((agreement) => {
      const diff = agreement.endDate.getTime() - currDate.getTime();
      const diffDays = diff / (1000 * 3600 * 24);
      if (diffDays < 15) {
        return agreement;
      }
    });
    res.json({ expiringAgreements });
  } catch (err) {
    res.send("Error!");
  }
});

router.post("/send-rfp", async (req, res) => {
  const { rawMaterial, startDate, endDate, deadline, vendors } = req.body;
  for (const vendor of vendors) {
    const newAgreement = new Agreement({
      rawMaterial,
      startDate,
      endDate,
      deadline,
      manufacturer: req.user._id,
      vendor: vendor._id,
    });

    await newAgreement.save();
  }
  res.send("RFP sent!");
});

module.exports = router;
