const express = require('express');
const router = express.Router();
const UserModel = require('../model');
const email = require('../../email');

router.get('/sign-up', (req, res) => {
  if (res.locals.user) {
    res.redirect('/garage');
    return;
  }

  res.render('auth/sign-up');
});

router.post('/sign-up', async (req, res) => {
  if (res.locals.user) {
    res.redirect('/garage');
    return;
  }

  const newUserEmail = req.body.email;
  const regExp = /.+@.+\..+/i;

  if (!regExp.test(newUserEmail)) { // if typed email address is invalid sh
    return res.render('auth/sign-up', {
      message: {
        type: 'error',
        text: 'You typed invalid email. Please, try again.'
      }
    });
  }

  try {
    const newUser = await UserModel.add(newUserEmail);

    const renderParams = {
      password: newUser.password,
      settingsLink: process.env.SERVER_URL + '/garage/settings'
    };

    try {
      email.sendFromTemplate(newUserEmail, 'Welcome to Hawk.so', 'notifies/email/join', renderParams);
      return res.redirect('/garage');
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
      return res.end();
    }
  } catch (e) {
    console.log(e);
    return res.render('auth/sign-up', {
      message: {
        type: 'error',
        text: 'This email is already registered. Please, <a href="/login">login</a>.'
      }
    });
  }
});

module.exports = router;
