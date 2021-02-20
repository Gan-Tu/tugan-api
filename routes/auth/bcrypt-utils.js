const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

function hashSecret(plaintext, callback) {
  bcrypt.hash(plaintext, SALT_ROUNDS, function (err, hash) {
    callback(err, hash);
  });
}

function hashSecretAndReturnSalt(plaintext, callback) {
  bcrypt.genSalt(SALT_ROUNDS, function (saltError, salt) {
    if (saltError) return callback(saltError);
    bcrypt.hash(plaintext, salt, function (err, hash) {
      if (err) return callback(err);
      callback(null, { salt, hash });
    });
  });
}

function compareSecret(plaintext, hash, callback) {
  bcrypt.compare(plaintext, hash, function (err, result) {
    if (err) return callback(err);
    callback(null, result);
  });
}

module.exports = { hashSecret, hashSecretAndReturnSalt, compareSecret };
