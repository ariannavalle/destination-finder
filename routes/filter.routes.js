require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const City = require('../models/city.model');

//API Key
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;

router.get('/', (req, res) => res.render('index'));

router.post('/find-destination', (req, res, next) => {

  //this function takes care of getting the count for each city
  function getCityInfo(citiesArray) {
    const result = citiesArray.reduce((obj, elem) => {
      if (!elem.city) return obj;
      if (elem.city in obj) {
        obj[elem.city].count++;
      }
      else {
        obj[elem.city] = {
          name: elem.city,
          country_name: elem.country,
          count: 1,
          img: elem.img,
          population: elem.population,
          _id: elem._id
        }
      }
      return obj;
    }, {});
    return Object.values(result);
  }

  //calling this api returns different locations based on the coordinates and categories provided
  axios
    .get(`https://api.opentripmap.com/0.1/en/places/bbox?${req.body.coordinates}&kinds=${req.body.categories}&apikey=${opentripAPIKey}`)
    .then(response => {
      // console.log("coordinates from opentripmap", response.data.features[0].geometry.coordinates);
      const placeObj = [];
      const cities = [];

      response.data.features.forEach((place) => {
        const prom =

          //$nearSphere — MongoDB geospatial query operator that returns geospatial objects in proximity to a point on a sphere
          City.findOne(
            {
              loc: {
                $near: {
                  $geometry: {
                    type: "Point",
                    // coordinates : [ <longitude>, <latitude> ]    
                    coordinates: [place.geometry.coordinates[0], place.geometry.coordinates[1]]
                  },
                  $maxDistance: 10000
                }
              }
            }
          )

        cities.push(prom);
      });

      Promise.all(cities).then(async citiesAPIResponse => {

        citiesAPIResponse.forEach((data, i) => {
          if (data) {
            placeObj.push({
              coordinates: response.data.features[i].geometry.coordinates,
              city: data.city_ascii,
              country: data.country,
              img: data.img,
              population: data.population,
              _id: data._id
            })
          }
        });

        //sort by count
        let places = await getCityInfo(placeObj);
        places.sort((a, b) => {
          return b.count - a.count;
        });
        //only return the top 10 places
        places = places.slice(0, 10);

        res.render('destinations/destination-list', { places });
      })
        .catch(err => console.log(`Error finding the location's city: ${err}`));
    })
    .catch(err => console.log(`Error finding destination: ${err}`));
});

module.exports = router;