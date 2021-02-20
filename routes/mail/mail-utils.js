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
  } else if (!hasValue(options.text) && !hasValue(options.html)) {
    return createError(400, "a non-empty 'text' or 'html' param is required");
  }
  const OPTIONAL_EMAIL_FIELDS = [
    "from_email", 
    "cc_email", 
    "bcc_email", 
    "reply_to_email"
  ];
  for (let field in OPTIONAL_EMAIL_FIELDS) {
    if (hasValue(options[field])) {
      if (!isValidEmail(options[field])) {
        return createError(400, `a valid email is required for '${field}'`);
      }
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
      from: {
        email: options.from_email || "no-reply@tugan.dev",
        name: options.from_name || "Gan Tu"
      },
      cc: options.cc_email,
      bcc: options.bcc_email,
      replyTo: options.reply_to_email,
      subject: options.subject,
      text: options.text || options.html,
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
