const express = require("express");
const router = express.Router();
const Manufacturer = require("./../models/Manufacturer");
const Vendor = require("./../models/Vendor");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/signup", async (req, res) => {
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
  console.log(req.body);
  try {
    if (type === "manufacturer") {
      const manufacturer = await Manufacturer.findOne({ email });
      if (manufacturer) {
        const isMatched = await bcrypt.compare(password, manufacturer.password);
        if (!isMatched) {
          return req.json({ msg: "Not Authorized!" });
        }
        req.session.currentUser = manufacturer;
        return res.redirect("/manufacturer/expiring-agreements");
      } else {
        res.json({ msg: "Not Found!" });
      }
    } else if (type === "vendor") {
      const vendor = await Vendor.findOne({ email });
      if (vendor) {
        const isMatched = await bcrypt.compare(password, vendor.password);
        if (!isMatched) {
          return res.json({ msg: "Not Authorized!" });
        }
        req.session.currentUser = vendor;
        return res.redirect("/vendor/rfp");
      } else {
        res.json({ msg: "Not Found!" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send("Error!");
  }
});

router.get("/logout", (req, res) => {
  req.session.currentUser = null;
  res.redirect("/auth");
});

module.exports = router;
