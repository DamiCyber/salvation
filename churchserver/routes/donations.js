const express   = require('express');
const router    = express.Router();
const Donation  = require('../Donation');
const adminAuth = require('../adminAuth');

// Public: record a donation
router.post('/', async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Public: get campaign totals (summary only — no individual names)
router.get('/summary', async (req, res) => {
  try {
    const result = await Donation.aggregate([
      { $group: { _id: '$campaign', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    const grandTotal = result.reduce((acc, cur) => acc + cur.total, 0);
    res.json({ grandTotal, campaigns: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: full ledger
router.get('/', adminAuth, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
