const express    = require('express');
const router     = express.Router();
const Enrollment = require('../Enrollment');
const adminAuth  = require('../adminAuth');

// Public: submit an enrollment
router.post('/', async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json({ message: 'Enrollment received. We will be in touch shortly.', id: enrollment._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: list all enrollments
router.get('/', adminAuth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete an enrollment
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found.' });
    res.json({ message: 'Enrollment deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
