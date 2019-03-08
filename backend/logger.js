/**
 * File for defining logger
 * so you can use it throughout your project
 */
const pino = require('pino');

module.exports = {
  logger: pino({
    prettyPrint: process.env.NODE_ENV === 'development'
  })
};
