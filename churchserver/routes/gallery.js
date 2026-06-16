const express     = require('express');
const router      = express.Router();
const path        = require('path');
const GalleryItem = require('../Gallery');
const adminAuth   = require('../adminAuth');
const { uploadSingle } = require('../upload');

const SERVER_BASE = process.env.SERVER_URL || '';

// ─── Public: list gallery items ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const filter = req.query.mediaType ? { mediaType: req.query.mediaType } : {};
    const items  = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: add gallery item ──────────────────────────────────────────────────
// Accepts multipart/form-data with a 'file' field for local upload,
// OR plain JSON / form field 'url' for YouTube embed / external URL.
router.post('/', adminAuth, async (req, res) => {
  try {
    await uploadSingle(req, res);
  } catch (err) {
    console.error('Multer error:', err.message);
    return res.status(400).json({ error: err.message });
  }

  console.log('Gallery POST — req.file:', req.file);
  console.log('Gallery POST — req.body:', req.body);
  console.log('Gallery POST — content-type:', req.headers['content-type']);

  try {
    let url;

    if (req.file) {
      // Local file — build the public URL served by Express static middleware
      url = `${SERVER_BASE}/uploads/${req.file.filename}`;
    } else if (req.body.url) {
      url = req.body.url;
    } else {
      return res.status(400).json({ error: 'Please upload a file or provide a URL.' });
    }

    const mediaType = req.body.mediaType ||
      (req.file && req.file.mimetype.startsWith('video/') ? 'video' : 'photo');

    const item = await GalleryItem.create({
      url,
      mediaType,
      title:    req.body.title    || '',
      category: req.body.category || 'General',
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: delete ────────────────────────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found.' });
    // Optionally delete file from disk if it's a local upload
    if (item.url && item.url.includes('/uploads/')) {
      const fs       = require('fs');
      const filePath = require('path').join(__dirname, '..', 'uploads', path.basename(item.url));
      fs.unlink(filePath, () => {}); // ignore errors if file already gone
    }
    res.json({ message: 'Gallery item deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
