require('dotenv').config();

const express = require('express');
const router = express.Router();

const axios = require('axios');
const ddg = require("duckduckgo-images-api");

const City = require('../models/city.model');

//API Keys
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;
const openCageAPIKey = process.env.OPENCAGEDATA_API_KEY;


router.get('/', (req, res) => res.render('index'));

router.post('/find-destination', (req, res, next) => {

  async function searchImage(searchQuery) {
    const results = await ddg.image_search({
      query: searchQuery,
      iterations: 1,
      moderate: true
    })
    if (results.length > 0) {
      return results[0].image;
    }
    return ''
  }

  async function getCityInfo(citiesArray) {
    const result = await citiesArray.reduce(async (obj, elem) => {
      if (!elem.city) return obj
      if (elem.city in obj) {
        obj[elem.city].count++;
        obj[elem.city].total_rating += elem.rating
        obj[elem.city].rate = Math.round(obj[elem.city].total_rating / obj[elem.city].count)
      }
      else {
        const pic = await searchImage(elem.city);
        obj[elem.city] = {
          name: elem.city,
          count: 1,
          total_rating: elem.rating,
          rate: elem.rating,
          img: pic
        }
      }
      return obj;
    }, {});
    return Object.values(result);
  }

  //calling this api returns different locations based on the coordinates and categories provided
  axios
    //@todo remove "&limit=" before deploying
    .get(`https://api.opentripmap.com/0.1/en/places/bbox?${req.body.coordinates}&kinds=${req.body.categories}&apikey=${opentripAPIKey}&limit=3`)
    .then(response => {
      console.log("coordinates from opentripmap", response.data.features[0].geometry.coordinates);
      const placeObj = [];
      const cities = [];

      response.data.features.forEach((place) => {
        const prom = 
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

      // console.log(cities)
      Promise.all(cities).then(async citiesAPIResponse => {
        citiesAPIResponse.forEach((data, i) => {
          // console.log(i, data.data.results[0].components.city)

          placeObj.push({
            coordinates: response.data.features[i].geometry.coordinates,
            rating: response.data.features[i].properties.rate,
            name: response.data.features[i].properties.name,
            categories: response.data.features[i].properties.kinds,
            // city: data.data.results[0].components.city
            cities: cities[i]
          });
        });



        console.log(placeObj)
        const places = await getCityInfo(placeObj)
        // console.log('82',places);
        res.render('destinations/destination-list', { places });
      })
        .catch(err => console.log(`Error finding the location's city: ${err}`));

    })
    .catch(err => console.log(`Error finding destination: ${err}`));
});

module.exports = router;
