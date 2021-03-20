const express = require("express");
const router = express.Router();
const Agreement = require("../models/Agreement");

router.get("/vendor/:id", async (req, res) => {
  try {
    const rfp = await Agreement.find({ vendor: req.params.id , stage: "rfp" });
    res.json({ rfp })
  }
  catch (err) {
    res.send("Error!");
  }
});

module.exports = router;