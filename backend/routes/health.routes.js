const express = require("express");
const router = express.Router();
const db = require("../db");
// we use router.get instead of app.get
router.get("/", async (req, res) => {
  const isDbUp = await db.checkConnection();
  res.json({
    status: isDbUp ? "ok" : "degraded",
    db: isDbUp ? "up" : "down",
  });
});
module.exports = router;
