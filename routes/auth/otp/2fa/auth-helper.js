var { authenticator } = require("otplib");

const SECRET = process.env.SECRET_2FA || authenticator.generateSecret();

function generateToken(secret = undefined) {
  return authenticator.generate(secret || SECRET);
}

function verifyToken(token, secret = undefined) {
  return authenticator.verify({ token, secret: secret || SECRET });
}

function timeUsed() {
  return authenticator.timeUsed();
}

function getTimeRemaining() {
  return authenticator.timeRemaining();
}

/** Generate a Google Authenticator compatible Key URL.
 *  https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */
function getKeyUrl(accountName, issuer, secret = undefined) {
  return authenticator.keyuri(accountName, issuer, secret || SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
  timeUsed,
  getTimeRemaining,
  getKeyUrl,
};
