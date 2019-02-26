const mongoose = require('mongoose');
const UserModel = require('../../../modules/auth/model');
const chai = require('chai');
const bcrypt = require('bcrypt');

const assert = chai.assert;

module.exports = function () {
  /**
   * @type {string} - saved non-hashed user password from add() function. Using for authenticate user later
   */
  let userPassword;

  before(function () {
    return mongoose.connection.db.dropDatabase();
  });

  describe('add function', function () {
    it('Should add new user with email test@example.com', function () {
      return UserModel.add('test@example.com').then((user) => {
        assert.isObject(user, 'result must be object');
        assert(user._id && user.email === 'test@example.com' && user.password, 'user object is invalid');
        userPassword = user.password;
      });
    });

    it('Shouldn\'t add new user with email test@example.com', function () {
      return UserModel.add('test@example.com').then(user => {
        assert.isNotOk(user, 'user must not be added');
      }).catch(err => {
        assert.isOk(err);
      });
    });
  });

  describe('getByEmail function', function () {
    it('Should return user by email with right password', function (done) {
      UserModel.getByEmail('test@example.com').then(user => {
        assert.isObject(user, 'result must be object');
        assert(user._id && user.email === 'test@example.com' && user.password, 'user object is invalid');

        const hashedPassword = user.password;

        bcrypt.compare(userPassword, hashedPassword).then(res => {
          assert.isTrue(res);
          done();
        });
      });
    });

    it('Should\'t return non-exists user', function () {
      return UserModel.getByEmail('test-bla-bla@example.com').then(user => {
        assert.isNotOk(user);
      });
    });
  });

  describe('checkUser function', function () {
    it('Should return user by email and password', function () {
      return UserModel.checkUser('test@example.com', userPassword).then(user => {
        assert.isObject(user, 'result must be object');
        assert(user._id && user.email === 'test@example.com' && user.password, 'user object is invalid');
      });
    });

    it('Should\'t return non-exists user', function () {
      return UserModel.checkUser('test-bla-bla@example.com', userPassword).then(user => {
        assert.isNotOk(user);
      });
    });

    it('Should\'t return user with wrong password', function () {
      return UserModel.checkUser('test@example.com', 'bla-bla-pass').then(user => {
        assert.isNotOk(user);
      });
    });
  });
};
