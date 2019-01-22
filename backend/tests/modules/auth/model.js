const utils = require('../../../modules/auth/utils');
const mongoose = require('mongoose');
const UserModel = require('../../../modules/auth/model');
const chai = require('chai');

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
  it('Should add new user', function () {
    return UserModel.add('test@example.com').then((user) => {
      assert.isObject(user, 'result must be object');
      assert(user._id && user.email === 'test@example.com' && user.password, 'user object is invalid');
    });
  });
};
