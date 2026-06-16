const express   = require('express');
const router    = express.Router();
const Content   = require('../Content');
const adminAuth = require('../adminAuth');
const { uploadSingle } = require('../upload');

const SERVER_BASE = process.env.SERVER_URL || '';

// Public: list all content items
router.get('/', async (req, res) => {
  try {
    const items = await Content.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: create content (supports optional image file upload)
router.post('/', adminAuth, async (req, res) => {
  try { await uploadSingle(req, res); } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  console.log('Content POST — req.file:', req.file);
  console.log('Content POST — req.body:', req.body);
  try {
    const body = req.body;
    // If a file was uploaded use its URL, otherwise use the text url field
    const image = req.file
      ? `${SERVER_BASE}/uploads/${req.file.filename}`
      : (body.image || '');

    const item = await Content.create({
      type:    body.type    || 'Blog',
      title:   body.title,
      excerpt: body.excerpt || '',
      content: body.content || '',
      image,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: update content (supports optional image file upload)
router.put('/:id', adminAuth, async (req, res) => {
  try { await uploadSingle(req, res); } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  try {
    const body   = req.body;
    const update = { ...body };

    if (req.file) {
      update.image = `${SERVER_BASE}/uploads/${req.file.filename}`;
    }
    // Remove internal fields that shouldn't overwrite the doc
    delete update._id;

    const item = await Content.findByIdAndUpdate(
      req.params.id,
      update,
      { returnDocument: 'after', runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Content not found.' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete content
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Content not found.' });
    res.json({ message: 'Content deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
