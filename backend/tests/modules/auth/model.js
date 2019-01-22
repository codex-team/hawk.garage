const utils = require('../../../modules/auth/utils');
const mongoose = require('mongoose');
const UserModel = require('../../../modules/auth/model');
const chai = require('chai');
const bcrypt = require('bcrypt');

const assert = chai.assert;
const mongodbOptions = {
  protocol: 'mongodb://',
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: '27017',
  authSource: 'admin',
  dbName: 'hawk_test'
};

mongoose.connect(utils.getMongoUrl(mongodbOptions), {useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = function () {
  /**
   * @type {string} - saved non-hashed user password from add() function. Using for authenticate user later
   */
  let userPassword;

  before(function () {
    return mongoose.connection.db.dropDatabase();
  });

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
};
