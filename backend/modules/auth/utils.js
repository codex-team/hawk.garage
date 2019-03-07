const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate random password
 * @returns {string} - generated password
 */
function generatePassword() {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * Generate hash from input string and salt
 * @param {string} inputString - value to hash
 * @param {number} [saltRounds=12] - cost factor: the higher the number, the more difficult is brute-forcing.
 * @returns {string} - hashed value
 */
function generateHash(inputString, saltRounds) {
  return bcrypt.hash(inputString, saltRounds || 12);
}

/**
 * Compare to passwords and return true if they are equal and false if not
 * @param {string} plainPassword - password to check
 * @param {string} hashedPassword - password to be compared to
 * @returns {Promise<true|false>}
 */
function checkPasswords(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Create and sign jwt, set cookie and redirect to /garage
 * @param {object} res - express response object
 * @returns {Response}
 */
function signTokenAndRedirect(res) {
  const token = jwt.sign({
    userId: res.locals.user._id
  }, process.env.JWT_SECRET_STRING, {
    expiresIn: 60 * 15
  });

  res.cookie('accessToken', token, {maxAge: 1000 * 60 * 15});
  return res.redirect('/garage');
}

module.exports = {
  generatePassword,
  generateHash,
  checkPasswords,
  signTokenAndRedirect
};
