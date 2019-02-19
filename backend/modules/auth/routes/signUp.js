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
    res.render('auth/sign-up', {
      message: {
        type: 'error',
        text: 'You typed invalid email. Please, try again.'
      }
    });
    return;
  }

  try {
    const newUser = await UserModel.add(newUserEmail);

    console.log(newUser);
    const renderParams = {
      password: newUser.password,
      settingsLink: process.env.SERVER_URL + '/garage/settings'
    };

    res.render('notifies/email/join', renderParams, async function (err, html) {
      if (err) {
        res.send(500);
        return;
      }
      try {
        await email.send(newUserEmail, 'Welcome to Hawk.so', html);
        res.redirect('/garage');
      } catch (e) {
        res.send(500);
      }
    });
  } catch (e) {
    console.log(e);
    res.render('auth/sign-up', {
      message: {
        type: 'error',
        text: 'This email is already registered. Please, <a href="/login">login</a>.'
      }
    });
  }
});

module.exports = router;
