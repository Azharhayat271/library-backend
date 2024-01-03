const mongoose = require('mongoose');

const BookReturnSchema = new mongoose.Schema({
  regNo: String,
  name: String,
  ISBN: String,
  title: String,
  issueDate: Date,
  returnDate: Date,
  date: Date,
  fine: Number,
  totalFine: Number,
  additionalFine: Number,
  reason: String,
});

const BookReturn = mongoose.model('BookReturn', BookReturnSchema);

module.exports = BookReturn;
