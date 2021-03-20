const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

router.get("/rfp/:id", async (req, res) => {
  try {
    const rfp = await Agreement.find({ vendor: req.params.id, stage: "rfp" });
    res.json({ rfp });
  } catch (err) {
    res.send("Error!");
  }
});

router.get("/pending/:id", async (req, res) => {
  try {
    const pendingAgreements = await Agreement.find({
      vendor: req.params.id,
      stage: "proposal",
    });
    res.json({ pendingAgreements });
  } catch (err) {
    res.send("Error!");
  }
});

router.get("/updates/:id", async (req, res) => {
  try {
    const updates = await Agreement.find({
      status: "proposal",
      lastUpdatedBy: "manufacturer",
    });
    res.json({ updates });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/send-proposal/:id", async (req, res) => {
  const { costPerUnit, startDate, endDate, deliveryMode, comment } = req.body;

  try {
    await Agreement.findByIdAndUpdate(req.params.id, {
      costPerUnit,
      startDate,
      endDate,
      comment,
      deliveryMode,
      lastUpdatedBy: "vendor",
      stage: "proposal",
    });
    const proposal = await Agreement.findById(req.params.id);
    res.json({ proposal });
  } catch (err) {
    res.send("Error!");
  }
});

router.get("/accepted-agreements/:id", async (req, res) => {
  try {
    const acceptedAgreements = await Agreement.find({
      vendor: req.params.id,
      stage: "accepted",
    });
    res.json({ acceptedAgreements });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

module.exports = router;
