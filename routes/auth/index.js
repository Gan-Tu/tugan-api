var express = require("express");
var router = express.Router();

var otpRouter = require("./otp");
var {
  hashSecret,
  hashSecretAndReturnSalt,
  compareSecret,
} = require("./bcrypt-utils");

router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: Authentication",
    name: "Authentication",
    endpoints: ["GET /", "GET /otp"],
  });
});

router.post("/encrypt", function (req, res, next) {
  if (req.query.returnSalt) {
    hashSecretAndReturnSalt(req.body.plaintext, (err, { salt, hash }) => {
      if (err) return next(err);
      res.json({ salt, hash });
    });
  } else {
    hashSecret(req.body.plaintext, (err, hash) => {
      if (err) return next(err);
      res.json({ hash });
    });
  }
});

router.post("/verify", function (req, res, next) {
  compareSecret(req.body.plaintext, req.body.hash, (err, result) => {
    if (err) return next(err);
    res.json({ match: result });
  });
});

router.use("/otp", otpRouter);

module.exports = router;
