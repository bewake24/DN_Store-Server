const express = require("express");
const router = express.Router();
const path = require("path");
const limiter = require("../middleware/rateLimit.middleware");

router.get("^/$|/index(.html)?", limiter("15m", 100), (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
