var { authenticator } = require("otplib");

var SECRET = process.env.SECRET_2FA || authenticator.generateSecret();
const ISSUER = "api.tugan.app OTP/2FA service";

function generateToken() {
  return authenticator.generate(SECRET);
}

function verifyToken(token) {
  return authenticator.verify({ token, secret: SECRET });
}

function timeUsed() {
  return authenticator.timeUsed();
}

function timeRemaining() {
  return authenticator.timeRemaining();
}

function resetSecret() {
  SECRET = authenticator.generateSecret();
}

/** Generate a Google Authenticator compatible Key URL.
 *  https://github.com/google/google-authenticator/wiki/Key-Uri-Format
 */
function getKeyUrl(accountName) {
  return authenticator.keyuri(accountName, ISSUER, SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
  timeUsed,
  timeRemaining,
  resetSecret,
  getKeyUrl,
};
