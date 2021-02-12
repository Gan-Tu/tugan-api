var express = require("express");
var router = express.Router();

var otpRouter = require("./otp");

router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: Authentication",
    name: "Authentication",
  });
});

router.use("/otp", otpRouter);

module.exports = router;
