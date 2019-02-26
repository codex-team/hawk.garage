const express = require('express');
const router = express.Router();
const UserModel = require('../model');

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
    return res.redirect('/garage');
  } catch (e) {
    console.log('Error while getting user from DB', e);
    res.sendStatus(500);
    return res.end();
  }
});

module.exports = router;
