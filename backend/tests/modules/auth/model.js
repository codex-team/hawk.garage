const mongodbOptions = {
  protocol: 'mongodb://',
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: '27017',
  authSource: 'admin',
  dbName: 'hawk'
};
const utils = require('../../../modules/auth/utils');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(utils.getMongoUrl(mongodbOptions), {useNewUrlParser: true});

const UserModel = require('../../../modules/auth/model');

const chai = require('chai');
const assert = chai.assert;

module.exports = function () {
  it('Should add new user', function () {
    return UserModel.add('test@example.com').then((user) => {
      assert.isObject(user, 'result must be object');
      assert(user._id && user.email === 'test@example.com' && user.password, 'user object is invalid');
    });
  });
};
