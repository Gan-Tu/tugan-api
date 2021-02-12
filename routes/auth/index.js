var express = require("express");
var router = express.Router();

var otpRouter = require("./otp");

router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: Authentication",
    name: "Authentication",
    endpoints: ["GET /", "GET /otp"],
  });
});

router.use("/otp", otpRouter);

module.exports = router;
