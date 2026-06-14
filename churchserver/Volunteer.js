const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  interest: { type: String, default: 'Mission Trip Participation' },
  message:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', VolunteerSchema);
