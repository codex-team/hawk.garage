const express = require('express');
const router = express.Router();
const UserModel = require('../model');
const email = require('../../email');

module.exports = function (params) {
  router.get('/sign-up', (req, res) => {
    if (res.locals.user) {
      res.redirect(params.redirect);
      return;
    }

    res.render(params.viewPath);
  });

  router.post('/sign-up', async (req, res) => {
    if (res.locals.user) {
      res.redirect(params.redirect);
      return;
    }

    const newUserEmail = req.body.email;
    const regExp = /.+@.+\..+/i;

    if (!regExp.test(newUserEmail)) {
      res.render(params.wrongEmailError.viewPath, params.wrongEmailError.options);
      return;
    }

    try {
      const newUser = await UserModel.add(newUserEmail);
      const renderParams = {
        password: newUser.password,
        ...params.renderParams
      };

      res.render(params.email.templatePath, renderParams, async function (err, html) {
        if (err) {
          res.send(500);
          return;
        }
        try {
          await email.send(newUserEmail, params.email.subject, html);
          res.redirect(params.redirect);
        } catch (e) {
          res.send(500);
        }
      });
    } catch (e) {
      console.log(e);
      res.render(params.userExistsError.viewPath, params.userExistsError.options);
    }
  });
  return router;
};
