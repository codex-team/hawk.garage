const express = require('express');
const router = express.Router();

module.exports = function (params) {
  router.get('/sign-up', (req, res, next) => {
    if (res.locals.user) {
      res.redirect(params.authedRedirect);
      return;
    }

    res.render(params.viewPath);
  });
  return router;
};
