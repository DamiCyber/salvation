const mongoose = require('mongoose');

const PrayerSchema = new mongoose.Schema({
  name:       { type: String, default: 'Anonymous' },
  text:       { type: String, required: true },
  status:     { type: String, enum: ['Pending', 'Approved', 'Praise Report'], default: 'Pending' },
  answer:     { type: String, default: '' },
  prayCount:  { type: Number, default: 0 },
  date:       { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
}, { timestamps: true });

module.exports = mongoose.model('Prayer', PrayerSchema);
