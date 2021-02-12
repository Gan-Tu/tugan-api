var express = require("express");
var router = express.Router();

var twoFactorRouter = require("./2fa");

router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: OTP Authentication",
    name: "One Time Password Authentication",
    endpoints: ["GET /", "GET /2fa"],
  });
});

router.use("/2fa", twoFactorRouter);

module.exports = router;
