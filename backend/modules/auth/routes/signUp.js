const express = require('express');
const router = express.Router();
const UserModel = require('../model');
const email = require('../../email');

module.exports = function (params) {
  router.get('/sign-up', (req, res, next) => {
    if (res.locals.user) {
      res.redirect(params.redirect);
      return;
    }

    res.render(params.viewPath);
  });

  router.post('/sign-up', async (req, res, next) => {
    if (res.locals.user) {
      res.redirect(params.redirect);
      return;
    }

    const newUserEmail = req.body.email;
    const regExp = /.+@.+\..+/i;

    if (!regExp.test(newUserEmail)) {
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
      const renderParams = {
        password: newUser.password,
        ...params.renderParams
      };

      res.render(params.email.templatePath, renderParams, function (err, html) {
        if (err) {
          res.send(500);
          return;
        }
        email.send(newUserEmail, params.email.subject, 'Your password...', html);
        res.redirect(params.redirect);
      });
    } catch (e) {
      console.log(e);
      res.end(500);
    }
  });
  return router;
};
