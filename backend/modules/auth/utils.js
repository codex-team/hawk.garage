const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

module.exports = {
  generatePassword,
  generateHash,
  checkPasswords
};
