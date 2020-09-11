const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const filterSchema = new Schema(
  {
    continent: {
      type: String,
      required: [true, 'Please select a region to continue.']
    },
    categories: {
      type: String,
      required: [true, 'Please select one or more categories to continue']
    }
  },
  {
    timestamps: true
  }
);

const Filter = model('Filter', filterSchema);

module.exports = Filter;
