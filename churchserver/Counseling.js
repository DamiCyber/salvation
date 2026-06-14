const mongoose = require('mongoose');

const CounselingSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String, default: '' },
  topic:   { type: String, default: 'General' },
  message: { type: String, required: true },
  status:  { type: String, enum: ['Pending', 'In Review', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Counseling', CounselingSchema);
