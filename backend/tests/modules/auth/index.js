const mongoose = require('mongoose');
const utils = require('../../../modules/utils');
const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, '../../../../.env')});

const mongodbOptions = {
  protocol: 'mongodb://',
  user: process.env.MONGODB_ROOT_USERNAME,
  password: process.env.MONGODB_ROOT_PASSWORD,
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_LOCAL_PORT,
  authSource: process.env.MONGODB_AUTH_SOURCE,
  dbName: process.env.MONGODB_DATABASE_TEST
};

describe('MODULE.AUTH', function () {
  before(function (done) {
    mongoose.connect(utils.getMongoUrl(mongodbOptions), {useNewUrlParser: true}, function (error) {
      done(error);
    });
  });
  describe('Auth utils', require('./utils').bind(this));
  describe('Auth model', require('./model').bind(this));
});
