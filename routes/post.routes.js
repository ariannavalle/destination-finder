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

      postsFromDB.forEach(post => {
        // console.log(post.user);
        if (req.user) {
          if (post.user._id === req.user._id) post.owner = true;
        }
        console.log({post});
      });

      console.log(postsFromDB[0]);
      res.render('blog/blog-page.hbs', {posts: postsFromDB});

    })
    .catch(err => console.log(err));
});

// create a post, route protected
// -USBAT write about there expirence, add an image, and rate the location only if they are logged in
router.get('/create', ensureAuthentication, (req, res) => {
  res.render('blog/blog-post-create.hbs');
});

// POST create new post
router.post('/create', fileUploader.single('image'), (req, res) => {
  const { title, content, location } = req.body;
  let loggedInUser = "";

  if (req.user) {
    loggedInUser = req.user._id;
  }
  
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
      
      User
        .findById(loggedInUser)
        .then(user => {
          user.posts.push(newPostDoc._id);
          user
            .save()
            .then(() => {

              console.log({newPostDoc});
              console.log({user});
              res.redirect('/blog');

            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// update a post, route protected
// -USBAT updated any part of their post when logged in
router.get('/edit/:blogPostId', ensureAuthentication, (req, res) => {
  const { blogPostId } = req.params;

  Post
    .findById(blogPostId)
    .then(postFromDB => {
      console.log(`post to edit: ${postFromDB}`);
      res.render('blog/blog-edit-page.hbs', {post : postFromDB});
    })
    .catch(err => console.log(err));

});

// delete a post, route protected
// -USBAT delete thier post when logged in

module.exports = router;