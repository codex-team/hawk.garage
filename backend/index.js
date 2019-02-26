const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const utils = require('./modules/utils');

const app = express();
const publicDir = path.resolve(__dirname, '../frontend/build');
const templatesPath = path.resolve(__dirname, '../frontend/yard/views');

/**
 * Read environment settings
 */
require('dotenv').config({path: path.resolve(__dirname, '../.env')});

/**
 * Setup mongoose
 */
const mongodbOptions = {
  protocol: 'mongodb://',
  user: process.env.MONGODB_ROOT_USERNAME,
  password: process.env.MONGODB_ROOT_PASSWORD,
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_LOCAL_PORT,
  authSource: process.env.MONGODB_AUTH_SOURCE,
  dbName: process.env.MONGODB_DATABASE
};

mongoose.connect(utils.getMongoUrl(mongodbOptions), {useNewUrlParser: true});

/**
 * Setup necessary middlewares
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * View engine setup
 */
app.set('views', templatesPath);
app.set('view engine', 'twig');

/**
 * Auth module setup
 */
const authModule = require('./modules/auth');

app.use(authModule);

/**
 * Yard
 */
const index = require('./routes/yard');

app.use('/', index);

/**
 * Garage
 */
const garage = require('./routes/garage');

app.use(/\/garage.*/, garage);

/**
 * Simple API example
 */
 app.get('/api/test', (req, res) => {
 	res.send({
 		ok: true
 	});
 });

/**
 * Serve static files
 */
app.use(express.static(publicDir));

/**
 * Start server
 */
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server running at ${process.env.HOST}:${process.env.PORT}/`);
});
