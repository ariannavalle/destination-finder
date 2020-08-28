require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;

router.get('/', (req, res) => res.render('index'));

router.post('/find-destination', (req, res, next) => {
  axios
    .get(`https://api.opentripmap.com/0.1/en/places/bbox?lon_min=-180&lon_max=180&lat_min=-85&lat_max=85&kinds=${req.body.categories}&apikey=${opentripAPIKey}`)
    .then(response => {
      console.log(response.data.features[0].geometry.coordinates);
      console.log(response.data.features[0].properties.rate);
      console.log(response.data.features[0].properties.name);

      const placeObj = [];
      response.data.features.forEach(place => {
        placeObj.push({ coordinates: place.geometry.coordinates, rating: place.properties.rate, name: place.properties.name, categories: place.properties.kinds });
      });

      res.render('destinations/destination-list', { places: placeObj });
    })
    .catch(err => console.log(`Error deleting movie: ${err}`));
});

module.exports = router;
