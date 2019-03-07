const express = require('express');
const router = express.Router();
const UserModel = require('../model');
const utils = require('../utils');

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
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

    return utils.signTokenAndRedirect(user._id, res);
  } catch (e) {
    console.log('Error while getting user from DB', e);
    res.sendStatus(500);
    return res.end();
  }
});

module.exports = router;
