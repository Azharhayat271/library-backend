// fine.js
const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  finePerDay: {
    type: Number,
    required: true,
    default: 10, // Default fine per day value
  },
});

const Fine = mongoose.model('Fine', fineSchema);

module.exports = Fine;
