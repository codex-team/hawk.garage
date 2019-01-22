const utils = require('./utils');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {unique: true}
  },
  password: {
    type: String,
    required: true
  }
});

const mongooseUserModel = mongoose.model('user', userSchema);

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
  static async add(email) {
    const password = utils.generatePassword();
    const passwordHashed = await utils.generateHash(password);
    const user = {
      email,
      password: passwordHashed
    };

    const mongooseUser = await mongooseUserModel.create(user);

    return {_id: mongooseUser._id, email, password};
  }

  /**
   * Returns User object by email field
   * @param {string} email - user email to search
   * @returns {Promise<User>} - founded user
   */
  static async getByEmail(email) {
    return mongooseUserModel.findOne({email});
  }
}

module.exports = UserModel;
