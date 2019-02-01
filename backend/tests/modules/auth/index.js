const mongoose = require('mongoose');
const utils = require('../../../modules/utils');

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

describe('MODULE.AUTH', function () {
  describe('Auth utils', require('./utils').bind(this));
  describe('Auth model', require('./model').bind(this));
});
