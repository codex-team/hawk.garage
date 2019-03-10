/**
 * File for defining logger
 * so you can use it throughout your project
 *
 * See more info about logger class at https://github.com/pinojs/pino
 */
const pino = require('pino');

module.exports = {
  logger: pino({
    prettyPrint: process.env.NODE_ENV === 'development'
  })
};
