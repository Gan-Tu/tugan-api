const createError = require("http-errors");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

/* -------------------------------------------------------------------------- */
/*                                VALIDATION                                  */
/* -------------------------------------------------------------------------- */

function hasValue(val) {
  return !!val && val.length > 0;
}

function isValidEmail(val) {
  return hasValue(val) && !!val.match(/^\S+@\S+\.\S+$/);
}

function validateMailParams(options) {
  if (!isValidEmail(options.to_email)) {
    return createError(400, "a valid 'to_email' param is required");
  } else if (!hasValue(options.subject)) {
    return createError(400, "a non-empty 'subject' param is required");
  } else if (!hasValue(options.text)) {
    return createError(400, "a non-empty 'text' param is required");
  } else if (hasValue(options.from_email)) {
    if (!isValidEmail(options.from_email)) {
      return createError(400, "a valid 'from_email' param is required");
    }
  }
}

function sendMail(options, callback) {
  let validation_error = validateMailParams(options);
  if (validation_error) {
    return callback(validation_error);
  }
  sendgrid
    .send({
      to: options.to_email,
      from: options.from_email || "no-reply@tugan.dev",
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    })
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      callback(error);
    });
}

module.exports = { sendMail };
