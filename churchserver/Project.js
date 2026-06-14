const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  goal:        { type: Number, default: 0 },
  raised:      { type: Number, default: 0 },
  image:       { type: String, default: '' },
  campaign:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
