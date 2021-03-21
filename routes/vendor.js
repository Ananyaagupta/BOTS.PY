const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

router.get("/rfp", async (req, res) => {
  try {
    const rfps = await Agreement.find({
      vendor: req.session.currentUser._id,
      stage: "rfp",
    }).populate("manufacturer");
    // console.log(rfps);
    res.render("vendorProfile", {
      currentVendor: req.session.currentUser,
      rfps,
    });
  } catch (err) {
    res.send("Error!");
  }
});

router.get("/pending", async (req, res) => {
  try {
    const pendingAgreements = await Agreement.find({
      vendor: req.session.currentUser._id,
      stage: "proposal",
    }).populate("manufacturer");
    res.render("pending", {
      agreements: pendingAgreements,
      currentMan: null,
      currentVendor: req.session.currentUser,
    });
  } catch (err) {
    res.send("Error!");
  }
});

router.get("/updates", async (req, res) => {
  try {
    const updates = await Agreement.find({
      stage: "proposal",
      lastUpdatedBy: "manufacturer",
      vendor: req.session.currentUser._id,
    }).populate("manufacturer");
    console.log(updates);
    res.render("pending", {
      agreements: updates,
      currentMan: null,
      currentVendor: req.session.currentUser,
    });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.get("/send-proposal/:id", async (req, res) => {
  try {
    const rfp = await Agreement.findById(req.params.id).populate(
      "manufacturer"
    );
    console.log(rfp);
    res.render("proposal", {
      currentVendor: req.session.currentUser,
      rfp,
      currentMan: null,
    });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/send-proposal/:id", async (req, res) => {
  const { costPerUnit, startDate, endDate, deliveryMode, comment } = req.body;

  var newDates = {};
  if (startDate) {
    newDates.startDate = startDate;
  }
  if (endDate) {
    newDates.endDate = endDate;
  }
  try {
    await Agreement.findByIdAndUpdate(req.params.id, {
      ...newDates,
      costPerUnit,
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

router.get("/accepted-agreements", async (req, res) => {
  try {
    const acceptedAgreements = await Agreement.find({
      vendor: req.session.currentUser._id,
      stage: "accepted",
    }).populate("manufacturer");
    res.render("pending", {
      agreements: acceptedAgreements,
      currentMan: null,
      currentVendor: req.session.currentUser,
    });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

module.exports = router;
