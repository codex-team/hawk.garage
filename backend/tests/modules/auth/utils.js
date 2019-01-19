const chai = require('chai');
const assert = chai.assert;
const utils = require('../../../modules/auth/utils');

module.exports = function () {
  describe('Testing generatePassword()', function () {
    it('Generated passwords must not be equal', function () {
      const password1 = utils.generatePassword();
      const password2 = utils.generatePassword();
      const password3 = utils.generatePassword();

      assert(password1 !== password2 !== password3);
    });
  });

  describe('Test generateHash()', function () {
    it('Method should return right answer ', function () {
      const valueToHash = 'Hello, Hawk';
      const salt = 'blablabla';
      const result = utils.generateHash(valueToHash, salt);

      assert.strictEqual(result, '71545e3c5c4d1a81cf7bf5817769ad2b25bc1e5553dd0566bdbfbdebee0670ad');
    });
  });

  describe('Testing getMongoUrl()', function () {
    it('Method should return right answer', function () {
      const options = {
        protocol: 'mongodb://',
        user: 'root',
        password: 'root',
        host: 'localhost',
        port: '27017',
        authSource: 'admin',
        dbName: 'hawk'
      };
      const url = utils.getMongoUrl(options);

      assert.strictEqual(url, 'mongodb://root:root@localhost:27017/hawk?authSource=admin');
    });
  });
};
