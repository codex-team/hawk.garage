const express = require('express');
const router = express.Router();

module.exports = function (params) {
  /**
   * Router setup
   */
  const signUp = require('./routes/signUp');

  router.use('/', signUp(params.signUp));
  return router;
};
