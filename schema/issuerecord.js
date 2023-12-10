const mongoose = require('mongoose');

const bookissueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true, // Ensure registration number is unique
  },
  title: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
  },
  issueDate: {
    type: String,
    required: true,
    
  },
  returnDate: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model('bookissue', bookissueSchema);

module.exports = Student;
