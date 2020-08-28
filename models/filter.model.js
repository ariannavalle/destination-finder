const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const filterSchema = new Schema(
  {
    continent: {
      type: String
    },
    citySize: {
      type: Number
    },
    budget: {
      type: Number
    },
    categories: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Filter = model('Filter', filterSchema);

module.exports = Filter;
