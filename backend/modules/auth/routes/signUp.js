const express = require('express');
const router = express.Router();
const utils = require('../utils');
const UserModel = require('../model');
const email = require('../../email');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up');
});

router.post('/sign-up', async (req, res) => {
  const newUserEmail = req.body.email;
  const regExp = /.+@.+\..+/i;

  if (!regExp.test(newUserEmail)) { // if typed email address is invalid
    return res.render('auth/sign-up', {
      message: {
        type: 'error',
        text: 'You typed invalid email. Please, try again.'
      }
    });
  }

  try {
    res.locals.user = await UserModel.add(newUserEmail);
  } catch (e) {
    console.log('Error while adding user in DB', e);
    return res.render('auth/sign-up', {
      message: {
        type: 'error',
        text: 'This email is already registered. Please, <a href="/login">login</a>.'
      }
    });
  }

  const renderParams = {
    password: res.locals.user.password,
    settingsLink: process.env.SERVER_URL + '/garage/settings'
  };

  email.sendFromTemplate(newUserEmail, 'Welcome to Hawk.so', 'notifies/email/join', renderParams);

  try {
    return utils.signTokenAndRedirect(res);
  } catch (e) {
    console.log('Error while creating JWT', e);
  }
});

module.exports = router;
