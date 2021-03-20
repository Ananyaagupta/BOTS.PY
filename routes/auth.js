const express = require("express");
const router = express.Router();
const Manufacturer = require("./../models/Manufacturer");
const Vendor = require("./../models/Vendor");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  const { name, email, password, type, rawMaterials } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    if (type === "manufacturer") {
      var manufacturer = new Manufacturer({
        name,
        email,
        password: hashPassword,
      });
      await manufacturer.save();
      req.session.currentUser = manufacturer;
      res.json({ manufacturer });
    } else if (type === "vendor") {
      var vendor = new Vendor({
        name,
        email,
        password: hashPassword,
        rawMaterials,
      });

      await vendor.save();
      req.session.currentUser = vendor;
      res.json({ vendor });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error!");
  }
});

router.post("/login", async (req, res) => {
  const { email, password, type } = req.body;
  // console.log(req.body);
  try {
    if (type === "Manufacturer") {
      const manufacturer = await Manufacturer.findOne({ email });
      if (manufacturer) {
        const isMatched = await bcrypt.compare(password, manufacturer.password);
        if (!isMatched) {
          return req.json({ msg: "Not Authorized!" });
        }
        req.session.currentUser = manufacturer;
        return res.json({ manufacturer });
      } else {
        res.json({ msg: "Not Found!" });
      }
    } else if (type === "Vendor") {
      const vendor = await Vendor.findOne({ email });
      if (vendor) {
        const isMatched = await bcrypt.compare(password, vendor.password);
        if (!isMatched) {
          return req.json({ msg: "Not Authorized!" });
        }
        req.session.currentUser = vendor;
        return res.json({ vendor });
      } else {
        res.json({ msg: "Not Found!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

module.exports = router;
