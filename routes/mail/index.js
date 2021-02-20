var express = require("express");
var router = express.Router();
var { sendMail } = require("./mail-utils");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: Mail",
    name: "Mail",
    endpoints: ["POST /send"],
  });
});

router.get("/send", function (req, res, next) {
  res.json({
    msg: "This endpoint only alllows POST method",
    required_fields: ["to_email", "subject", "text or html"],
    optional_fields: [
      "cc_email",
      "bcc_email",
      "from_email",
      "from_name",
      "reply_to_email",
    ],
  });
});

/* Send a mail. */
router.post("/send", function (req, res, next) {
  sendMail(
    {
      to_email: req.body.to_email,
      cc_email: req.body.cc_email,
      bcc_email: req.body.bcc_email,
      from_email: req.body.from_email,
      from_name: req.body.from_name,
      reply_to_email: req.body.reply_to_email,
      subject: req.body.subject,
      text: req.body.text,
      html: req.body.html,
    },
    (err) => {
      if (err) {
        console.error(err);
        next(err);
      } else {
        res.json({ sent: true });
      }
    }
  );
});

module.exports = router;
