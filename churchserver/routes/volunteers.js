const express   = require('express');
const router    = express.Router();
const Volunteer = require('../Volunteer');
const adminAuth = require('../adminAuth');

// Public: submit volunteer application
router.post('/', async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ message: 'Volunteer application received.', id: volunteer._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: list all volunteers
router.get('/', adminAuth, async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) return res.status(404).json({ error: 'Volunteer not found.' });
    res.json({ message: 'Volunteer deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
