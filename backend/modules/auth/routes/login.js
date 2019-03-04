const express = require('express');
const router = express.Router();
const UserModel = require('../model');
const jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
  if (res.locals.user) {
    return res.redirect('/garage');
  }

  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  if (res.locals.user) {
    return res.redirect('/garage');
  }

  const userEmail = req.body.email;
  const userPassword = req.body.password;

  try {
    const user = await UserModel.checkUser(userEmail, userPassword);

    if (!user) {
      return res.render('auth/login', {
        message: {
          type: 'error',
          text: 'The email or password is invalid.'
        }
      });
    }

    const oneMinute = Math.floor(Date.now() / 1000) + (60 * 60);
    const token = jwt.sign({
      exp: oneMinute,
      userId: user._id
    }, process.env.JWT_SECRET_STRING);
    console.log(token);
    res.cookie('accessToken', token, {expires: oneMinute, httpOnly: true});
    return res.redirect('/garage');
  } catch (e) {
    console.log('Error while getting user from DB', e);
    res.sendStatus(500);
    return res.end();
  }
});

module.exports = router;
