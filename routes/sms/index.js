var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("api-landing", { title: "API Endpoint: SMS", endpoint: "SMS" });
});

module.exports = router;
