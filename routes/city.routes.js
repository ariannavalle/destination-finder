const express = require('express');
const router = express.Router();
const axios = require('axios');
const City = require('../models/city.model');
const Post = require('../models/post.model');

//API Key
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;

router.get('/:location', (req, res) => {
  const location = req.params.location;

  axios
    .get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${location}`)
    .then(response => {
      const cityWiki = response.data.query.pages;
      const cityWikiKeys = Object.keys(cityWiki);
      const cityInfo = cityWiki[cityWikiKeys[0]].extract;      

      City
        .find({ city: location.split(',_')[0] })
        .populate('comments')
        .then(cityFromDB => {
          
          const cityDetails = {
            description: cityInfo,
            info: cityFromDB[0]
          };

          console.log(cityDetails.info);

          res.render('destinations/destination-city', {city: cityDetails});
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});


module.exports = router;