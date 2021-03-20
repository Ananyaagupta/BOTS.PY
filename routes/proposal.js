const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

router.get("/vendor/:id", async (req, res) => {
  try {
    const pendingAgreements = await Agreement.find({
      vendor: req.params.id,
      stage: "pending",
    });
    res.json({ pendingAgreements });
  } catch (err) {
    res.send("Error!");
  }
});

router.post("/send-proposal/:id", async (req, res) => {
  const {
    costPerUnit,
    rawMaterial,
    startDate,
    endDate,
    deliveryMode,
  } = req.body;

  try {
    const res = await Agreement.findByIdAndUpdate(req.params.id, {
      costPerUnit,
      rawMaterial,
      startDate,
      endDate,
      deliveryMode,
      stage: "proposal",
    });
    res.send("Proposal sent!");
  } catch (err) {
    res.send("Error!");
  }
});

module.exports = router;
