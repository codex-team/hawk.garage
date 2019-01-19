const utils = require('./utils');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

const mongooseUserModel = mongoose.model('user', userSchema);

module.exports = function (params) {
  class UserModel {
    add(email) {
      const password = utils.generatePassword();
      const passwordHashed = utils.generateHash(password);
      const user = {
        email,
        password: passwordHashed
      };

      return mongooseUserModel.create(user);
    }
  }

  return new UserModel();
};
