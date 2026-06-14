const mongoose = require('mongoose');

const SermonSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  type:     { type: String, enum: ['Audio', 'Video'], default: 'Audio' },
  url:      { type: String, required: true },
  duration: { type: String, default: '' },
  notes:    { type: String, default: '' },
  date:     { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
}, { timestamps: true });

module.exports = mongoose.model('Sermon', SermonSchema);
