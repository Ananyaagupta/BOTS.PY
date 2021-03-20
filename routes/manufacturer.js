const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");
const RawMaterials = require("../models/RawMaterials");
const Vendors = require("./../models/Vendor");

router.get("/all-agreements", async (req, res) => {
  try {
    const agreements = await Agreement.find({ stage: "accepted" }).populate(
      "vendor"
    );
    res.render("agreements", {
      currentMan: req.session.currentUser,
      agreements,
    });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.get("/expiring-agreements", async (req, res) => {
  try {
    const agreements = await Agreement.find({
      manufacturer: req.session.currentUser._id,
      stage: "accepted",
    }).populate("vendor");
    const currDate = new Date();
    const expiringAgreements = agreements.map((agreement) => {
      const diff = agreement.endDate.getTime() - currDate.getTime();
      const diffDays = diff / (1000 * 3600 * 24);
      if (diffDays < 15) {
        return agreement;
      }
    });
    console.log(expiringAgreements);
    res.render("profile", {
      expiringAgreements,
      currentMan: req.session.currentUser,
    });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.get("/agreement/:id", async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id).populate(
      "vendor"
    );
    const rawMaterial = await RawMaterials.findOne({
      name: agreement.rawMaterial,
    });
    const { vendors } = rawMaterial;
    var vendorsList = [];
    for (const vendor of vendors) {
      const foundVendor = await Vendors.findById(vendor);
      vendorsList.push(foundVendor);
    }
    res.render("new-agreement", { agreement, vendorsList });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/send-rfp", async (req, res) => {
  const {
    rawMaterial,
    startDate,
    endDate,
    deadline,
    vendors,
    comment,
  } = req.body;
  const stage = "rfp";
  for (const vendor of vendors) {
    const newAgreement = new Agreement({
      rawMaterial,
      startDate,
      endDate,
      deadline,
      stage,
      comment,
      lastUpdatedBy: "manufacturer",
      manufacturer: req.session.currentUser._id,
      vendor: vendor,
    });

    await newAgreement.save();
  }
  res.send("RFP sent!");
});

// router.get("/vendors/:name", async (req, res) => {
//   try {
//     const rawMaterial = await RawMaterials.findOne({ name: req.params.name });
//     const { vendors } = rawMaterial;
//     var vendorsList = [];
//     for (const vendor of vendors) {
//       const foundVendor = await Vendors.findById(vendor);
//       vendorsList.push(foundVendor);
//     }

//     res.json({ vendorsList });
//   } catch (err) {
//     console.log(err);
//     res.send("Error!");
//   }
// });

router.get("/pending/:id", async (req, res) => {
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

router.get("/updates/:id", async (req, res) => {
  try {
    const updates = await Agreement.find({
      manufacturer: req.params.id,
      stage: "proposal",
      lastUpdatedBy: "vendor",
    });
    res.json({ updates });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/update-proposal/:id", async (req, res) => {
  const { costPerUnit, startDate, endDate, deliveryMode, comment } = req.body;

  try {
    await Agreement.findOneAndUpdate(
      { _id: req.params.id },
      {
        costPerUnit,
        startDate,
        endDate,
        deliveryMode,
        lastUpdatedBy: "manufacturer",
        comment,
      }
    );
    const proposal = await Agreement.findById(req.params.id);
    res.json({ proposal });
  } catch (err) {
    res.send("Error!");
  }
});

router.post("/accept/:id", async (req, res) => {
  try {
    await Agreement.findByIdAndUpdate(req.params.id, { stage: "accepted" });
    res.json({ msg: "Acceped!" });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    await Agreement.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted!" });
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

module.exports = router;
