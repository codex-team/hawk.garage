const options = {
  mongodb: {
    protocol: 'mongodb://',
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: '27017',
    authSource: 'admin',
    dbname: 'hawk',
    collection: 'test',
    get connection() {
      if (this.user && this.password && this.authSource) {
        return `${this.protocol + this.user}:${this.password}@${this.host}:${this.port}/${this.dbname}?authSource=${this.authSource}`;
      }
      return `${this.protocol + this.host}:${this.port}/${this.dbname}`;
    }
  }
};
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(options.mongodb.connection, {useNewUrlParser: true});

const UserModel = require('../../../modules/auth/model')();

const chai = require('chai');
const assert = chai.assert;

describe('MODULE.AUTH', () => {
  describe('Testing auth model', () => {
    it('Try to add new user with email test@example.com', () => {
      return UserModel.add('test@example.com').then((user) => {
        assert.isObject(user, 'result must be object');
        assert(user._id && user.email === 'test@example.com' && user.password);
      });
    });
  });
});
