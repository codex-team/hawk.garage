const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use(/^\/(garage|login|sign-up)/, async function (req, res, next) {
  const token = req.cookies.accessToken;

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
 * If user already authorized redirect to /garage
 */
router.use(/^\/(login|sign-up)$/, function (req, res, next) {
  if (res.locals.user) {
    return res.redirect('/garage');
  }
  next();
});

/**
 * If user is unauthorized redirect to login page
 */
router.use('/garage*', function (req, res, next) {
  if (!res.locals.user) {
    return res.redirect('/login');
  }
  next();
});

/**
 * Router setup
 */
const signUp = require('./routes/signUp');
const login = require('./routes/login');

router.use('/', login);
router.use('/', signUp);

module.exports = router;
