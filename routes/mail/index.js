var express = require("express");
var router = express.Router();
var { sendMail } = require("./mail-helper");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("api-landing", {
    title: "API Endpoint: Mail",
    name: "Mail",
    endpoints: ["POST /send"],
  });
});

/* Send a mail. */
router.post("/send", function (req, res, next) {
  sendMail(
    {
      to_email: req.body.to_email,
      from_email: req.body.from_email,
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
