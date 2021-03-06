// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

const saltRounds = 10;
const User = require('../models/user.model');

///////////////////////////////////////////////////////////////////////
///////////////////////////// SIGNUP //////////////////////////////////
///////////////////////////////////////////////////////////////////////

// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup-form.hbs'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
  //deconstruct req.body
  const { username, email, password } = req.body;

  // Check if username, password, and email are not empty
  if (!username || !email || !password) {
    res.json({
      status: false,
      errorMessage: 'All fields are mandatory. Please provide your username, email and password.'
    });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.json({
      status: false,
      errorMessage: 'Passwords must contain at least 6 characters, one number, one lowercase letter, and one uppercase letter.'
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      // res.redirect('/login');
      res.json({
        status: true
      });
      return;
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.json({
          status: false,
          errorMessage: error.message
        });
      } else if (error.code === 11000) {
        res.json({
          status: false,
          errorMessage: 'Either username or email is already used.'
        });
      } else {
        next(error);
      }
    }); // close .catch()
}); // close router.post()

///////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ///////////////////////////////////
///////////////////////////////////////////////////////////////////////

// .get() route ==> to display the login form to users
router.get('/login', (req, res) => {
  res.render('auth/login-form.hbs', { "errorMessage": req.flash("error") });
});

// .post() login route ==> to process form data
router.post("/login", 
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), 
  (req, res) => {
  res.redirect(`/${req.user.username}`);
});

///////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT //////////////////////////////////
///////////////////////////////////////////////////////////////////////

// GET logout and end passport session
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
