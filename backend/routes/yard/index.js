const express = require('express');
const router = express.Router();

/*
 * Home page
 */
router.get('/', function (req, res, next) {
  try {
    res.render('index');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
