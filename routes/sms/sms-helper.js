var createError = require("http-errors");
const twilio = require("twilio");
var twilioClient, twilioFromPhoneNumber;

if (process.env.NODE_ENV === "test") {
  twilioClient = new twilio(
    process.env.TWILIO_TEST_SID,
    process.env.TWILIO_TEST_AUTH_TOKEN
  );
  twilioFromPhoneNumber = process.env.TWILIO_TEST_NUMBER;
} else {
  twilioClient = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  twilioFromPhoneNumber = process.env.TWILIO_NUMBER;
}

function validateSendSMSBody(req, res, next) {
  if (
    !req.body ||
    !req.body.to_number ||
    !req.body.message ||
    req.body.to_number.length === 0 ||
    req.body.message.length === 0
  ) {
    return next(
      createError(
        400,
        "POST /sms/send expects both 'to_number' and 'message' in body"
      )
    );
  }
  next();
}

function sendSMS(to_number, message, callback) {
  twilioClient.messages
    .create({
      to: to_number,
      from: twilioFromPhoneNumber,
      body: message,
    })
    .then((message) => callback(null, message.sid))
    .catch((err) => callback(err));
}

module.exports = { sendSMS, validateSendSMSBody };
