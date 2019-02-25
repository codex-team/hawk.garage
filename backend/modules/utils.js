/**
 * Create URL to connect to MongoDB
 * @param {string} protocol - connection protocol (for example, mongodb://)
 * @param {string} host - host where MongoDB is running
 * @param {string} port - port where MongoDB is running
 * @param {string} dbName - database name for connection
 * @param {string} [user] - username for authentication
 * @param {string} [password] - password for authentication
 * @param {string} [authSource] - database name for authentication
 * @returns {string} - URL to connect to MongoDB
 */
function getMongoUrl({protocol, host, port, dbName, user, password, authSource}) {
  if (user && password && authSource) {
    return `${protocol + user}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`;
  }
  return `${protocol + host}:${port}/${dbName}`;
}

module.exports = {
  getMongoUrl
};
