const express = require('express');
const router = express.Router();

/**
 * Router setup
 */
const signUp = require('./routes/signUp');

router.use('/', signUp);

module.exports = router;
