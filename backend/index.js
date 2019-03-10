const path = require('path');
/**
 * Read environment settings
 */

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressPino = require('express-pino-logger');
const utils = require('./modules/utils');
const { logger } = require('./modules/logger');

const app = express();
const publicDir = path.resolve(__dirname, '../frontend');
const templatesPath = path.resolve(__dirname, '../frontend/yard/views');

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

mongoose.connect(utils.getMongoUrl(mongodbOptions), { useNewUrlParser: true });

/**
 * Setup logging
 */
app.use(expressPino({ logger }));

/**
 * Setup necessary middlewares
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.use(
  '/garage',
  express.static(path.resolve(__dirname, '../frontend/garage/views'))
);

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
