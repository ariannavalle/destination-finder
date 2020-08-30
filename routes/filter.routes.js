require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;
const openCageAPIKey = process.env.OPENCAGEDATA_API_KEY;

router.get('/', (req, res) => res.render('index'));

router.post('/find-destination', (req, res, next) => {

  function getAvgRating(citiesArray) {
    return Object.values(citiesArray.reduce(function (obj, elem) {
      if (!elem.city) return obj
      if (elem.city in obj) {
        obj[elem.city].count++;
        obj[elem.city].total_rating += elem.rating
        obj[elem.city].rate = Math.round(obj[elem.city].total_rating / obj[elem.city].count)
      }
      else {
        obj[elem.city] = {
          name: elem.city,
          count: 1,
          total_rating: elem.rating,
          rate: elem.rating
        }
      }
      return obj;
    }, {}))
    // return Object.keys(cityAndRatings).map(e => {return {[e]: cityAndRatings[e].total_rating/cityAndRatings[e].count}});
  }

  //calling this api returns different locations based on the coordinates and categories provided
  axios
    //@todo remove "&limit=100" before deploying
    .get(`https://api.opentripmap.com/0.1/en/places/bbox?${req.body.coordinates}&kinds=${req.body.categories}&apikey=${opentripAPIKey}&limit=100`)
    .then(response => {
      // console.log(response.data.features[0].geometry.coordinates);
      // console.log(response.data.features[0].properties.rate);
      // console.log(response.data.features[0].properties.name);

      const placeObj = [];
      const cities = [];
      response.data.features.forEach((place) => {
        //get coordinates of the locations returned and aggregates them by city
        const prom = axios
          .get(`https://api.opencagedata.com/geocode/v1/json?q=${place.geometry.coordinates[1]},${place.geometry.coordinates[0]}&key=${openCageAPIKey}&pretty=1&limit=1`);
        cities.push(prom);
      });

      Promise.all(cities).then(citiesAPIResponse => {
        citiesAPIResponse.forEach((data, i) => {
          // console.log(i, data.data.results[0].components.city)

          placeObj.push({
            coordinates: response.data.features[i].geometry.coordinates, 
            rating: response.data.features[i].properties.rate,
            name: response.data.features[i].properties.name, 
            categories: response.data.features[i].properties.kinds, 
            city: data.data.results[0].components.city
          });
        });
        // console.log(placeObj)
        // console.log(getAvgRating(placeObj));

        res.render('destinations/destination-list', { places: getAvgRating(placeObj) });
      })
        .catch(err => console.log(`Error finding the location's city: ${err}`));

    })
    .catch(err => console.log(`Error finding destination: ${err}`));
});

module.exports = router;
