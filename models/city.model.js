const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const citySchema = new Schema(
  {
    city: {
      type: String
    },
    city_ascii: {
      type: String
    },
    lat: {
      type: String
    },
    lng: {
      type: String
    },
    country: {
      type: String
    },
    iso2: {
      type: String
    },
    admin_name: {
      type: String
    },
    capital: {
      type: String
    },
    population: {
      type: Number
    },
    id: {
      type: String
    },
    loc: {
      type: { type: String }
      , coordinates: []
    }
  },
  {
    timestamps: true
  }
);

citySchema.index({ loc: '2dsphere' });
const City = model('City', citySchema);

module.exports = City;
