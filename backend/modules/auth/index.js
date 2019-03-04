const express = require('express');
const router = express.Router();
const UserModel = require('./model');

// router.use('/', async function (req, res, next) {
//   res.locals.user = {};
//
//   const userEmail = req.cookies.email;
//   const userPassword = req.cookies.password;
//
//   try {
//     const user = await UserModel.checkUser(userEmail, userPassword);
//
//     if (user) {
//       res.locals.user = user;
//     }
//     next();
//   } catch (e) {
//     console.log('Error while getting user from DB', e);
//     next();
//   }
// });

/**
 * Router setup
 */
const signUp = require('./routes/signUp');
const login = require('./routes/login');

router.use('/', login);
router.use('/', signUp);

module.exports = router;
