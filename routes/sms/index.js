var createError = require("http-errors");
var express = require("express");
var router = express.Router();
var { sendSMS, validateSendSMSBody } = require("./sms-helper");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: SMS",
    name: "SMS",
    endpoints: ["POST /send"],
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

module.exports = router;
