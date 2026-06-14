const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  mediaType: { type: String, enum: ['photo', 'video'], required: true },
  url:       { type: String, required: true },
  title:     { type: String, default: '' },
  category:  { type: String, default: 'General' },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
