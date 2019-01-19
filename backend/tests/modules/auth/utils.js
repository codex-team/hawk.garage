const chai = require('chai');
const assert = chai.assert;
const utils = require('../../../modules/auth/utils');

module.exports = function () {
  describe('Testing generatePassword()', () => {
    it('Generated passwords must not be equal', () => {
      const password1 = utils.generatePassword();
      const password2 = utils.generatePassword();
      const password3 = utils.generatePassword();

      assert(password1 !== password2 !== password3);
    });
  });
};
