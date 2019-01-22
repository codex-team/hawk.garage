const bcrypt = require('bcrypt');

/**
 * Generate random password
 * @returns {string} - generated password
 */
function generatePassword() {
  return Math.random().toString(36).slice(-8);
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

/**
 * Create URL to connect to MongoDB
 * @param {string} protocol - connection protocol (for example, mongodb://)
 * @param {string} host - host where MongoDB is running
 * @param {string} port - port where MongoDB is running
 * @param {string} dbName - database name for connection
 * @param {string} [user] - username for authentication
 * @param {string} [password] - password for authentication
 * @param {string} [authSource} - database name for authentication
 * @returns {string} - URL to connect to MongoDB
 */
function getMongoUrl({protocol, host, port, dbName, user, password, authSource}) {
  if (user && password && authSource) {
    return `${protocol + user}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`;
  }
  return `${protocol + host}:${port}/${dbName}`;
}

module.exports = {
  generatePassword,
  generateHash,
  getMongoUrl
};
