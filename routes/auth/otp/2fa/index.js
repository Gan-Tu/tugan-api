var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var { getKeyUrl, verifyToken } = require("./auth-helper");

router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: OTP/2FA Authentication",
    endpoint: "Two Factor Authentication",
  });
});

router.get("/generate", function (req, res, next) {
  if (!req.query || !req.query.userId || !req.query.userId.length === 0) {
    return next(createError(400, "Must provide a userId in query string"));
  }
  let issuer = req.query.issuer || "api.tugan.app OTP/2FA service";
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

router.get("/verify", function (req, res, next) {
  if (!req.query || !req.query.token || !req.query.token.length === 0) {
    return next(createError(400, "Must provide a token in query string"));
  }
  res.json({ valid: verifyToken(req.query.token, req.query.secret) });
});

module.exports = router;
