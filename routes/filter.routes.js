require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const City = require('../models/city.model');

//API Key
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;

router.get('/', (req, res) => res.render('index'));

router.post('/find-destination', (req, res, next) => {

  //this function takes care of calculating the average rating for each city
  async function getCityInfo(citiesArray) {
    const result = await citiesArray.reduce((obj, elem) => {
      if (!elem.city) return obj
      if (elem.city in obj) {
        obj[elem.city].count++;
        obj[elem.city].total_rating += elem.rating
        obj[elem.city].rate = Math.round(obj[elem.city].total_rating / obj[elem.city].count)
      }
      else {
        obj[elem.city] = {
          name: elem.city,
          country_name: elem.country,
          count: 1,
          total_rating: elem.rating,
          rate: elem.rating,
          img: elem.img
        }
      }
      return obj;
    }, {});
    return Object.values(result);
  }

  //calling this api returns different locations based on the coordinates and categories provided
  axios
    //@todo remove "&limit=" before deploying
    .get(`https://api.opentripmap.com/0.1/en/places/bbox?${req.body.coordinates}&kinds=${req.body.categories}&apikey=${opentripAPIKey}&limit=100`)
    .then(response => {
      // console.log("coordinates from opentripmap", response.data.features[0].geometry.coordinates);
      const placeObj = [];
      const cities = [];

      response.data.features.forEach((place) => {
        const prom =

          //$nearSphere — MongoDB geospatial query operator that returns geospatial objects in proximity to a point on a sphere
          City.find(
            {
              loc: {
                $near: {
                  $geometry: {
                    type: "Point",
                    // coordinates : [ <longitude>, <latitude> ]    
                    coordinates: [place.geometry.coordinates[0], place.geometry.coordinates[1]]
                  },
                  // if we set a max distance, we might not get any results
                  // $maxDistance: 900000
                }
              }
            }
          )
        cities.push(prom);
      });

      Promise.all(cities).then(async citiesAPIResponse => {
        citiesAPIResponse.forEach((data, i) => {
          placeObj.push({
            coordinates: response.data.features[i].geometry.coordinates,
            rating: response.data.features[i].properties.rate,
            name: response.data.features[i].properties.name,
            categories: response.data.features[i].properties.kinds,
            city: data[i].city,
            country: data[i].country,
            img: data[i].img
          });
        });
        const places = await getCityInfo(placeObj)
        res.render('destinations/destination-list', { places });
      })
        .catch(err => console.log(`Error finding the location's city: ${err}`));
    })
    .catch(err => console.log(`Error finding destination: ${err}`));
});

module.exports = router;