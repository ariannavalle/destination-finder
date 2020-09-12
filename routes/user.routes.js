// routes/user.routes.js

const { Router } = require('express');
const router = new Router();
const fileUploader = require('../configs/cloudinary.config');

// route protection through passport's req.isAuthenticated() method
const ensureAuthentication = require('../configs/route-guard.config');

const User = require('../models/user.model');
const Post = require('../models/post.model');

////////////////////////////////////////////////////////////////////////
////////////////////////// user routes /////////////////////////////////
////////////////////////////////////////////////////////////////////////

// GET user profile page
router.get('/:username', ensureAuthentication, (req, res) => {

  User
    .findById(req.user._id)
    .populate('posts')
    .then(loggedInUser => {

      if (loggedInUser.posts.length === 0) {
        res.render('users/user-profile');
      } else {
        console.log('user.posts', loggedInUser.posts[0].title);
        res.render('users/user-profile', {loggedInUser});
      }
      
    })
    .catch(err => console.log(err));
  
});

// GET user update page
router.get('/:username/settings', ensureAuthentication, (req, res) => {
  res.render('users/user-profile-settings');
});

//GET contact-form
router.get('/:username/contact-form', (req, res) =>{
  res.render('users/contact-form.hbs');
});

// POST updated user info
router.post('/:username/update', fileUploader.single('image'), (req, res, next) => {
  const { username, email } = req.body;
  const { _id } = req.user;
  let image = "";
  
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
          errorMessage: 'Username and email need to be unique. Either username or email is already in use.'
        });
      } else {
        next(error);
      }
    });

});

// POST add place to fav list
router.post('/fav', (req, res) => {
  const { cityId } = req.body;
  const user = req.user;
  let isFav = true;

  console.log('>>>>> fav <<<<<');

  User
    .findById(user._id)
    .then(userFromDB => {
      if (!userFromDB.favorites.includes(cityId)) {
        userFromDB.favorites.push(cityId);
      }
      else {
        const index = userFromDB.favorites.indexOf(cityId);
        userFromDB.favorites.splice(index, 1);
        console.log('>>>>', userFromDB.favorites);
        isFav = false;
      }

      userFromDB
        .save()
        .then(() => {

          console.log("fav list", userFromDB.favorites.length);

          res.json({isFav});

        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.get('/:username/delete', ensureAuthentication, (req, res) => {

  User
    .findByIdAndDelete(req.user._id)
    .then(() => {
      console.log('user was deleted');
      req.logout();
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

router.post('/userfav', (req, res, next) => {
  const user = req.user;
  const { cityId } = req.body;

  User
    .findById(user._id)
    .then(userFromDB => {

      const isFav = userFromDB.favorites.includes(cityId);
      res.json({isFav});

    })
    .catch(err => console.log(err));
});

module.exports = router;