const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    unique: true, // Ensure registration number is unique
  },
  semester: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
