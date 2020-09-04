require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const ddg = require("duckduckgo-images-api");
const opentripAPIKey = process.env.OPENTRIPMAP_API_KEY;
const openCageAPIKey = process.env.OPENCAGEDATA_API_KEY;

router.get('/', (req, res) => res.render('index'));

router.post('/find-destination', (req, res, next) => {

  async function searchImage(searchQuery){
    const results = await ddg.image_search({
      query: searchQuery,
      iterations: 1,
      moderate: true
    })
console.log('20', results[0].image)
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
        console.log('37', pic)
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
    console.log('48', result);
    return Object.values(result);               
  }

  //calling this api returns different locations based on the coordinates and categories provided
  axios
    //@todo remove "&limit=100" before deploying
    .get(`https://api.opentripmap.com/0.1/en/places/bbox?${req.body.coordinates}&kinds=${req.body.categories}&apikey=${opentripAPIKey}&limit=1`)
    .then(response => {
      console.log(response.data.features[0].geometry.coordinates);
      // console.log(response)
      const placeObj = [];
      const cities = [];
      response.data.features.forEach((place) => {
        //get coordinates of the locations returned and aggregates them by city
        const prom = axios
          .get(`https://api.opencagedata.com/geocode/v1/json?q=${place.geometry.coordinates[1]},${place.geometry.coordinates[0]}&key=${openCageAPIKey}&pretty=1&limit=1`);
        cities.push(prom);
      });
      // console.log(cities)
      Promise.all(cities).then( async citiesAPIResponse => {
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

        const places = await getCityInfo(placeObj)
        console.log('82',places);
        res.render('destinations/destination-list', { places });
      })
        .catch(err => console.log(`Error finding the location's city: ${err}`));

    })
    .catch(err => console.log(`Error finding destination: ${err}`));
});

module.exports = router;
