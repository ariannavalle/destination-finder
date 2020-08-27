const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const filterSchema = new Schema(

);

const Filter = model('Filter', filterSchema);

module.exports = Filter;
