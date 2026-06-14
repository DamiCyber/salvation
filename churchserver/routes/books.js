const express   = require('express');
const router    = express.Router();
const Book      = require('../Book');
const adminAuth = require('../adminAuth');
const { uploadBookFiles } = require('../upload');

const SERVER_BASE = process.env.SERVER_URL || 'http://localhost:5000';

// ─── Public: list all books ──────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin: create a book ────────────────────────────────────────────────────
router.post('/', adminAuth, async (req, res) => {
  try {
    await uploadBookFiles(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const body = req.body;
    if (!body.title) return res.status(400).json({ error: 'Title is required.' });

    let coverUrl = body.coverUrl || '';
    if (req.files && req.files.coverFile) {
      coverUrl = `${SERVER_BASE}/uploads/${req.files.coverFile[0].filename}`;
    }

    let downloadUrl = body.downloadUrl || '#';
    if (req.files && req.files.downloadFile) {
      downloadUrl = `${SERVER_BASE}/uploads/${req.files.downloadFile[0].filename}`;
    }

    let previewChapters = [];
    if (body.previewChapters) {
      try { previewChapters = JSON.parse(body.previewChapters); }
      catch { previewChapters = String(body.previewChapters).split('\n').filter(Boolean); }
    }

    const book = await Book.create({
      title:          body.title,
      description:    body.description  || '',
      price:          parseFloat(body.price) || 0,
      coverUrl,
      downloadUrl,
      previewChapters,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Admin: update a book ────────────────────────────────────────────────────
router.put('/:id', adminAuth, async (req, res) => {
  try {
    await uploadBookFiles(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const body   = req.body;
    const update = { ...body };

    if (req.files && req.files.coverFile) {
      update.coverUrl = `${SERVER_BASE}/uploads/${req.files.coverFile[0].filename}`;
    }
    if (req.files && req.files.downloadFile) {
      update.downloadUrl = `${SERVER_BASE}/uploads/${req.files.downloadFile[0].filename}`;
    }
    if (body.previewChapters) {
      try { update.previewChapters = JSON.parse(body.previewChapters); }
      catch { update.previewChapters = String(body.previewChapters).split('\n').filter(Boolean); }
    }
    if (body.price !== undefined) update.price = parseFloat(body.price) || 0;

    const book = await Book.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after', runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Admin: delete a book ────────────────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.json({ message: 'Book deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
