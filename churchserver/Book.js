const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  description:     { type: String, default: '' },
  price:           { type: Number, default: 0 },
  coverUrl:        { type: String, default: '' },
  previewChapters: { type: [String], default: [] },
  downloadUrl:     { type: String, default: '#' },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
