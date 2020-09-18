const { Router } = require('express');
const router = new Router();

// route protection through passport's req.isAuthenticated() method
const ensureAuthentication = require('../configs/route-guard.config');

// require models
const User = require('../models/user.model');
const Post = require('../models/post.model');
const City = require('../models/city.model');

// POST create new post
router.post('/create/:cityId', (req, res) => {
  const { content } = req.body;
  const { cityId } = req.params;
  const user = req.user;

  console.log(user);
  if (user === undefined) {
    console.log('>>>>>>>>>>user is not loged in<<<<<<<<<<<<');
    res.json({data: '/login'});
    return;
  }

  const newPost = {
          city: cityId,
          content,
          user: user._id
        };

  Post
    .create(newPost)
    .then(newPostDoc => {      
      User
        .findById(user._id)
        .then(userFromDB => {
          userFromDB.posts.push(newPostDoc._id);
          userFromDB
            .save()
            .then(() => {
              City
                .findById(cityId)
                .then(cityFromDB => {
                  cityFromDB.posts.unshift(newPostDoc._id);
                  cityFromDB
                    .save()
                    .then(() => {
                      // console.log({newPostDoc});
                      // console.log({user});
                      console.log(newPostDoc.createdAt);
                      const postDate = newPostDoc.createdAt.toString().split(" ").splice(1, 3).join(" ");
                      const newComment = `<div class="media border p-3 ftco-animate fadeInUp ftco-animated">
                                            <img src=${userFromDB.image} alt=${userFromDB.username} class="mr-3 mt-3 rounded-circle" style="width:60px; height:60px;">
                                            <div class="media-body">
                                              <h4>${userFromDB.username} <small><i>${postDate}</i></small></h4>
                                              <p>${newPostDoc.content}</p>
                                            </div>
                                            <a class="btn" href="/post/edit/${newPostDoc._id}">Edit</a>
                                            <p class="btn delete-btn" city-id=${cityFromDB._id} comment-id=${newPostDoc._id}>Delete</p>
                                          </div>`;
        
                      // res.redirect('back');
                      res.json({data: newComment});
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
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
      // console.log(`post to edit: ${postFromDB}`);
      res.render('posts/post-edit', {post : postFromDB});

    })
    .catch(err => console.log(err));

});

router.post('/edit/:blogPostId', ensureAuthentication, (req, res) => {
  const { content } = req.body;
  const { blogPostId } = req.params;

  const updatedPost = {
          content
        };

  Post
    .findByIdAndUpdate(blogPostId, updatedPost, {new: true})
    .then(postFromDB => {
      City
        .findById(postFromDB.city)
        .then(cityFromDB => {
          const cityUrl = `/city/${cityFromDB.city_ascii},_${cityFromDB.country}`;
          // console.log({postFromDB});
          res.redirect(cityUrl);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

});

// delete a post, route protected
// -USBAT delete thier post when logged in
router.post('/delete', ensureAuthentication, (req, res) => {
  const { postId, cityId } = req.body;

  console.log({postId});
  console.log({cityId});

  User
    .findByIdAndUpdate(req.user._id, {$pull: {posts: {$in: [postId]}}}, {new: true})
    .then(userFromDB => {
      City
        .findByIdAndUpdate(cityId, {$pull: {posts: {$in: [postId]}}}, {new: true})
        .then(cityFromDB => {
          Post
            .findByIdAndDelete(postId)
            .then(() => {    
              console.log(`post was deleted from ${userFromDB.username} and ${cityFromDB.city}`);
              // res.redirect('back');
              res.json({wasDeleted: true});
            })
            .catch(err => console.log(err)); 
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  
});

module.exports = router;