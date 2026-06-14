const express   = require('express');
const router    = express.Router();
const Stream    = require('../Stream');
const adminAuth = require('../adminAuth');

// Public: get current stream config
router.get('/', async (req, res) => {
  try {
    // There is only ever one stream document; create it if absent
    let config = await Stream.findOne();
    if (!config) {
      config = await Stream.create({});
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update stream config (upsert)
router.put('/', adminAuth, async (req, res) => {
  try {
    const config = await Stream.findOneAndUpdate({}, req.body, { returnDocument: 'after', upsert: true, runValidators: true });
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
