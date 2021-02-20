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
  lookupIntNumber(req.body.to_number, (err, info) => {
    if (err) {
      next(err);
    } else if (!info.valid) {
      next(
        createError(
          404,
          "'to_number' either does not exist, or is not a valid number in " +
            `E.164 format: ${req.body.to_number}`
        )
      );
    } else {
      next();
    }
  });
}

function lookupIntNumber(number, callback) {
  twilioClient.lookups.v1
    .phoneNumbers(number)
    .fetch()
    .then((metadata) => callback(null, { valid: true, metadata }))
    .catch((err) => {
      if (err && err.status === 404) {
        callback(null, { valid: false, metadata: null });
      } else {
        callback(err);
      }
    });
}

function sendSMS(to_number, message, callback) {
  twilioClient.messages
    .create({
      to: to_number,
      from: twilioFromPhoneNumber,
      body: message,
    })
    .then((msg) => callback(null, msg.sid))
    .catch((err) => callback(err));
}

module.exports = { sendSMS, validateSendSMSBody, lookupIntNumber };
