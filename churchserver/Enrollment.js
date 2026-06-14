const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, default: '' },
  course:  { type: String, default: 'General Bible School' },
  message: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
