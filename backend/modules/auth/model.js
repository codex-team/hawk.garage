const utils = require('./utils');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String
});

const mongooseUserModel = mongoose.model('user', userSchema);

module.exports = function (params) {
  /**
   * @typedef {Object} User
   * @property {string} _id - user id
   * @property {string} email - user email
   * @property {string} password - hashed user password
   */

  /**
   * @class UserModel - model for working with database
   */
  class UserModel {
    /**
     * Add new user to database
     * @param {string} email - user email
     * @returns {Promise<User>} - added user
     */
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
