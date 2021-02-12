var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Gan's Personal API" });
});

/* GET ping pong. */
router.get("/ping", function (req, res, next) {
  res.status(200).end("pong");
});

module.exports = router;
