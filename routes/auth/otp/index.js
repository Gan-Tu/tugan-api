var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var {
  getKeyUrl,
  verifyToken,
  generateToken,
  getTimeRemaining,
} = require("./auth-helper");

router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: OTP Authentication",
    name: "Two Factor Authentication",
    endpoints: ["GET /", "GET /setup", "GET /generate", "GET /verify"],
  });
});

router.get("/setup", function (req, res, next) {
  if (!req.query || !req.query.userId || !req.query.userId.length === 0) {
    return next(createError(400, "Must provide a userId in query string"));
  }
  let issuer = req.query.issuer || "api.tugan.app OTP service";
  let keyUrl = getKeyUrl(req.query.userId, issuer, req.query.secret);
  if (req.query.showKeyUrlOnly) {
    return res.json({ url: keyUrl });
  } else {
    res.render("qr-code.pug", {
      title: "2FA QR Code",
      purpose: "Two Factor Auth (2FA)",
      data: encodeURIComponent(keyUrl),
    });
  }
});

router.get("/generate", function (req, res, next) {
  res.json({
    token: generateToken(req.query.secret),
    timeRemaining: getTimeRemaining(),
  });
});

router.get("/verify", function (req, res, next) {
  if (!req.query || !req.query.token || !req.query.token.length === 0) {
    return next(createError(400, "Must provide a token in query string"));
  }
  res.json({ valid: verifyToken(req.query.token, req.query.secret) });
});

module.exports = router;
