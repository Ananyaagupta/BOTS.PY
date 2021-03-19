const express = require("express");
const router = express.Router;
const Agreement = require("./../models/Agreement");

router.get("/:id", async (req, res) => {
  try {
    const agreements = Agreement.find({ procurement: req.params.id });
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

module.exports = router;
