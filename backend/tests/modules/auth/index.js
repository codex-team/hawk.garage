const mongoose = require('mongoose');
const utils = require('../../../modules/utils');
const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, '../../../../.env')});

const mongodbOptions = {
  protocol: 'mongodb://',
  user: process.env.MONGO_ROOT_USERNAME,
  password: process.env.MONGO_ROOT_PASSWORD,
  host: 'localhost',
  port: process.env.MONGODB_LOCAL_PORT,
  authSource: 'admin',
  dbName: 'hawk_test'
};

mongoose.Promise = global.Promise;

describe('MODULE.AUTH', function () {
  before(function (done) {
    mongoose.connect(utils.getMongoUrl(mongodbOptions), {useNewUrlParser: true}, function (error) {
      if (!error) {
        done();
      }
    });
  });
  describe('Auth utils', require('./utils').bind(this));
  describe('Auth model', require('./model').bind(this));
});
