const express = require("express");
const router = express.Router();
// we use router.get instead of app.get
router.get("/", (req, res) => {
  res.json({ status: "OK" });
});
module.exports = router;
