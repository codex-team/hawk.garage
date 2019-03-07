const express = require('express');
const router = express.Router();
const UserModel = require('./model');
const jwt = require('jsonwebtoken');

router.use(/^\/(garage|login|sign-up)?$/, async function (req, res, next) {
  const token = req.cookies.accessToken;

  console.log('token is ', token);

  if (!token) {
    return next();
  }

  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET_STRING);
    next();
  } catch (err) {
    console.log(err);
    next();
  }
});

/**
 * Router setup
 */
const signUp = require('./routes/signUp');
const login = require('./routes/login');

router.use('/', login);
router.use('/', signUp);

module.exports = router;
