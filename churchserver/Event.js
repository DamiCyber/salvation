const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  date:        { type: String, required: true },
  location:    { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
