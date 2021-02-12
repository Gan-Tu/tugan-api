var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var { sendSMS, validateSendSMSBody, lookupIntNumber } = require("./sms-helper");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: SMS",
    name: "SMS",
    endpoints: ["POST /send", "GET /lookup"],
  });
});

/* Send a SMS message. */
router.post("/send", validateSendSMSBody, function (req, res, next) {
  sendSMS(req.body.to_number, req.body.message, (err, sid) => {
    if (err) {
      console.error(err);
      next(createError(500, "Failed to send message"));
    } else {
      res.json({ sent: true, sid });
    }
  });
});

/** Lookup a phone number */
router.get("/lookup", function (req, res, next) {
  if (!req.query.number) {
    return next(
      createError(
        400,
        "Must provide a phone number in E.164 format in query string"
      )
    );
  }
  lookupIntNumber(req.query.number, (err, metadata) => {
    if (err) {
      console.error(err);
      return next(createError(500, "Failed to look up phone number"));
    }
    res.json(metadata);
  });
});

module.exports = router;
