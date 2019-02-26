const express = require('express');
const router = express.Router();

/**
 * Router setup
 */
const signUp = require('./routes/signUp');
const login = require('./routes/login');

router.use('/', login);
router.use('/', signUp);

module.exports = router;
