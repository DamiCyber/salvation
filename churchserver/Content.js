const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  type:    { type: String, enum: ['Blog', 'Devotional', 'Testimony'], default: 'Blog' },
  title:   { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  image:   { type: String, default: '' },
  date:    { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
}, { timestamps: true });

module.exports = mongoose.model('Content', ContentSchema);
