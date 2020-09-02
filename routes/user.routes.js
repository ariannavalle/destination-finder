// routes/user.routes.js

const { Router } = require('express');
const router = new Router();
const fileUploader = require('../configs/cloudinary.config');

// route protection through passport's req.isAuthenticated() method
const ensureAuthentication = require('../configs/route-guard.config');

const User = require('../models/user.model');

////////////////////////////////////////////////////////////////////////
////////////////////////// user routes /////////////////////////////////
////////////////////////////////////////////////////////////////////////

// GET user profile page
router.get('/:username', ensureAuthentication, (req, res) => {

  User
    .findById(req.user._id)
    .populate('posts')
    .then(loggedInUser => {
      console.log('user.posts', loggedInUser.posts[0].title);
      res.render('users/user-profile', {loggedInUser});
    })
    .catch(err => console.log(err));
  
});

// GET user update page
router.get('/:username/settings', ensureAuthentication, (req, res) => {
  res.render('users/user-profile-settings');
});

// POST updated user info
router.post('/:username/update', fileUploader.single('image'), (req, res, next) => {
  const { username, email } = req.body;
  const { _id } = req.user;
  let image = "";

  // console.log(`req.file: ${req.file}`);
  // console.log(req.body);
  
  // if the image field is blank, the current image url is used
  if (req.file) image = req.file.path;
  else image = req.user.image;

  const newUserInfo ={
    username,
    email,
    image
  };

  User
    .findByIdAndUpdate(_id, newUserInfo, { new: true })
    .then(updatedUser => {
      console.log({updatedUser});
      res.redirect(`/${req.user.username}`);
    })
    .catch(error => {
      if (error.code === 11000) {
        res.status(500).render('users/user-profile-settings', {
          errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    });

});

// POST add place to fav list
router.post('/:username/fav/:coordinates', (req, res) => {
  const { username, coordinates } = req.params;

  User
    .find({username})
    .then(userFromDB => {
      console.log("addFav", userFromDB);
    })
    .catch(err => console.log(err));
});

module.exports = router;