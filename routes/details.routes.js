const express = require('express');
const router = express.Router();
const axios = require('axios');
const City = require('../models/city.model');

// GET city detials page
router.get('/:location', (req, res) => {
  const location = req.params.location;
  const user = req.user;

  axios
    .get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${location}`)
    .then(response => {
      const cityWiki = response.data.query.pages;
      const cityWikiKeys = Object.keys(cityWiki);
      const cityInfo = cityWiki[cityWikiKeys[0]].extract;      

      City
        .findOne({ city_ascii: location.split(',_')[0] })
        .populate('posts')
        .populate({
          path: 'posts',
          populate: {
            path: 'user'
          }
        })
        .then(cityFromDB => {

          cityFromDB.posts.forEach(post => {
            if (user) post.owner = user.posts.includes(post._id);
          });
          
          const cityDetails = {
            description: cityInfo,
            details: cityFromDB
          };

          console.log(cityDetails.details);

          res.render('destinations/destination-details', {city: cityDetails});
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});


module.exports = router;