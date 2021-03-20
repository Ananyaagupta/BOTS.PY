const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");
const Vendors = require("./../models/Vendor");

router.get("/:id", async (req, res) => {
  try {
    const agreements = await Agreement.find({
      manufacturer: req.params.id,
      stage: "accepted",
    });
    const currDate = new Date();
    const expiringAgreements = agreements.map((agreement) => {
      const diff = agreement.endDate.getTime() - currDate.getTime();
      const diffDays = diff / (1000 * 3600 * 24);
      if (diffDays < 15) {
        return agreement;
      }
    });
    res.json({ expiringAgreements });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/send-rfp/:id", async (req, res) => {
  const { rawMaterial, startDate, endDate, deadline, vendors } = req.body;
  const stage = "rfp";
  for (const vendor of vendors) {
    const newAgreement = new Agreement({
      rawMaterial,
      startDate,
      endDate,
      deadline,
      stage,
      manufacturer: req.params.id,
      vendor: vendor._id,
    });

    await newAgreement.save();
  }
  res.send("RFP sent!");
});

// router.get("/:name/vendors", async (req, res) => {
//   try {
//     const vendors = await Vendors.find({});
//     const supplyVendor = vendors.map
//   } catch (err) {

//   }
// });

router.get("/proposals/:id", async (req, res) => {
  try {
    const proposals = await Agreement.find({
      manufacturer: req.params.id,
      stage: "proposal",
    });
    res.json({ proposals });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/make-agreement", async (req, res) => {
  try {
    const newAgreement = new Agreement({ ...req.body });
    await newAgreement.save();
    res.json({ newAgreement });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

module.exports = router;
