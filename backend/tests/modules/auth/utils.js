const chai = require('chai');
const assert = chai.assert;
const utils = require('../../../modules/auth/utils');

module.exports = function () {
  describe('generatePassword function', function () {
    it('Should generate non-equal passwords', function () {
      const password1 = utils.generatePassword();
      const password2 = utils.generatePassword();
      const password3 = utils.generatePassword();

      assert(password1 !== password2 !== password3);
    });
  });

  /**
   * @type {string} - using for generateHash and checkPasswords tests
   */
  const valueToHash = 'Hello, Hawk';

  /**
   * @type {string} - saved hashed string from generateHashed function. Using for checkPasswords function later
   */
  let hashedString;

  describe('generateHash function', function () {
    it('Should return hash without error', function () {
      return utils.generateHash(valueToHash, 10).then(hash => {
        hashedString = hash;
        assert.isOk(hash);
      });
    });
  });

  describe('checkPasswords function', function () {
    it('Should return true if passwords are equal', function () {
      return utils.checkPasswords(valueToHash, hashedString).then(res => {
        assert.isTrue(res);
      });
    });

    it('Should return false if passwords are non-equal', function () {
      return utils.checkPasswords('bla-bla-bla', hashedString).then(res => {
        assert.isFalse(res);
      });
    });
  });
};
