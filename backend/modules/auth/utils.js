const Crypto = require('crypto');

function generatePassword() {
  return Math.random().toString(36).slice(-8);

}

function generateHash(inputString, salt) {
  const string = inputString + salt;

  return Crypto.createHash('sha256').update(string, 'utf8').digest('hex');
}

module.exports = {
  generatePassword,
  generateHash
};
