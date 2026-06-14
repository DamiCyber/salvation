const mongoose = require('mongoose');

// Single document — we always upsert the one stream config record.
const StreamSchema = new mongoose.Schema({
  isLive:      { type: Boolean, default: false },
  streamUrl:   { type: String, default: '' },
  streamTitle: { type: String, default: 'Sunday Service – Live' },
}, { timestamps: true });

module.exports = mongoose.model('Stream', StreamSchema);
