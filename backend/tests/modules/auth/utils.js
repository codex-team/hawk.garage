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

  describe('generateHash function', function () {
    it('Should return hash without error', function () {
      const valueToHash = 'Hello, Hawk';

      return utils.generateHash(valueToHash, 10).then(hash => {
        assert.isOk(hash);
      });
    });
  });

  describe('getMongoUrl function', function () {
    it('Should return right answer', function () {
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
