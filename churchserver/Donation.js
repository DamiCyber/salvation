const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  name:     { type: String, default: 'Anonymous Partner' },
  amount:   { type: Number, required: true },
  campaign: { type: String, default: 'General Support' },
  type:     { type: String, enum: ['One-Time Giving', 'Monthly Partnership'], default: 'One-Time Giving' },
  receipt:  { type: String, default: '' },
  date:     { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
