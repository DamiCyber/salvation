const express   = require('express');
const router    = express.Router();
const Prayer    = require('../Prayer');
const adminAuth = require('../adminAuth');

// Public: list approved and praise-report prayers
router.get('/', async (req, res) => {
  try {
    const prayers = await Prayer.find({ status: { $in: ['Approved', 'Praise Report'] } }).sort({ createdAt: -1 });
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: submit a new prayer request (starts as Pending)
router.post('/', async (req, res) => {
  try {
    const prayer = await Prayer.create({ ...req.body, status: 'Pending' });
    res.status(201).json(prayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Public: increment pray count
router.patch('/:id/pray', async (req, res) => {
  try {
    const prayer = await Prayer.findByIdAndUpdate(req.params.id, { $inc: { prayCount: 1 } }, { new: true });
    if (!prayer) return res.status(404).json({ error: 'Prayer not found.' });
    res.json(prayer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: list all prayers (including pending) for moderation
router.get('/all', adminAuth, async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.json(prayers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update status / answer
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { status, answer } = req.body;
    const prayer = await Prayer.findByIdAndUpdate(req.params.id, { status, answer }, { new: true, runValidators: true });
    if (!prayer) return res.status(404).json({ error: 'Prayer not found.' });
    res.json(prayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete a prayer request
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const prayer = await Prayer.findByIdAndDelete(req.params.id);
    if (!prayer) return res.status(404).json({ error: 'Prayer not found.' });
    res.json({ message: 'Prayer request deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
