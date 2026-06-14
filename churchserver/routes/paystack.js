/**
 * POST /api/paystack/verify
 * Body: { reference, bookId }
 * Verifies a book purchase.
 *
 * POST /api/paystack/verify-donation
 * Body: { reference }
 * Verifies a donation payment.
 */
const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const Book    = require('../Book');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';

// ── Helper: verify reference with Paystack ──────────────────────────────────
async function verifyRef(reference) {
  if (!PAYSTACK_SECRET) throw new Error('Paystack secret key not configured on server.');
  const psRes = await axios.get(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
  );
  const txn = psRes.data.data;
  if (!txn || txn.status !== 'success') throw new Error('Payment not confirmed by Paystack.');
  return txn;
}

// ── Book purchase verification ──────────────────────────────────────────────
router.post('/verify', async (req, res) => {
  const { reference, bookId } = req.body;
  if (!reference || !bookId) return res.status(400).json({ error: 'reference and bookId are required.' });
  try {
    const txn  = await verifyRef(reference);
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found.' });
    res.json({
      success:     true,
      downloadUrl: book.downloadUrl,
      bookTitle:   book.title,
      amountPaid:  txn.amount / 100,
      reference:   txn.reference,
      paidAt:      txn.paid_at,
    });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed: ' + (err.response?.data?.message || err.message) });
  }
});

// ── Donation verification ───────────────────────────────────────────────────
router.post('/verify-donation', async (req, res) => {
  const { reference } = req.body;
  if (!reference) return res.status(400).json({ error: 'reference is required.' });
  try {
    const txn = await verifyRef(reference);
    res.json({
      success:    true,
      amountPaid: txn.amount / 100,
      reference:  txn.reference,
      paidAt:     txn.paid_at,
    });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed: ' + (err.response?.data?.message || err.message) });
  }
});

module.exports = router;
