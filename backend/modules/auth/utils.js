const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Generate random password
 * @returns {string} - generated password
 */
function generatePassword() {
  return crypto.randomBytes(128).toString('hex');
}

/**
 * Generate hash from input string and salt
 * @param {string} inputString - value to hash
 * @param {number} [saltRounds=10] - cost factor: the higher the number, the more difficult is brute-forcing.
 * @returns {string} - hashed value
 */
function generateHash(inputString, saltRounds) {
  return bcrypt.hash(inputString, saltRounds || 10);
}

module.exports = {
  generatePassword,
  generateHash
};
