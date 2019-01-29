const express = require('express');
const router = express.Router();

module.exports = function (params) {
  function get(req, res, next) {
    if (res.locals.user) {
      res.redirect(params.redirectIfAuthed);
      return;
    }

    res.render(params.viewPath);
  }

  router.get('/sign-up', get);
  return router;
};
