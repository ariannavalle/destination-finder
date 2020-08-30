const { Router } = require('express');
const router = new Router();
const fileUploader = require('../configs/cloudinary.config');

// route protection through passport's req.isAuthenticated() method
const ensureAuthentication = require('../configs/route-guard.config');

// require models
const User = require('../models/user.model');
const Post = require('../models/post.model');

// read the posts, blog page or posts on a details page
// -all USBAT read all posts
router.get('/', (req, res) => {
  console.log('blog page GET route');
  Post
    .find()
    .populate('user')
    .then(postsFromDB => {

      console.log({postsFromDB});
      res.render('blog/blog-page.hbs', {posts: postsFromDB});

    })
    .catch(err => console.log(err));
});

// create a post, route protected
// -USBAT write about there expirence, add an image, and rate the location only if they are logged in
router.get('/create', ensureAuthentication, (req, res) => {
  res.render('blog/blog-post-create.hbs');
});

router.post('/create', fileUploader.single('image'), (req, res) => {
  const { title, content, location } = req.body;
  let newPost = {};

  if (req.file) {
    newPost = {
      title,
      content,
      location,
      image: req.file.path,
      user: req.user._id
    };
  } else {
    newPost = {
      title,
      content,
      location,
      user: req.user._id
    };
  }  

  Post
    .create(newPost)
    .then(newPostDoc => {
      console.log({newPostDoc});
      res.redirect('/blog');
    })
    .catch(err => console.log(err));

});

// update a post, route protected
// -USBAT updated any part of their post when logged in

// delete a post, route protected
// -USBAT delete thier post when logged in

module.exports = router;