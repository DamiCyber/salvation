const express   = require('express');
const router    = express.Router();
const Donation  = require('../Donation');
const adminAuth = require('../adminAuth');
const { sendMail } = require('../mailer');

// Public: record a donation
router.post('/', async (req, res) => {
  try {
    const donation = await Donation.create(req.body);

    sendMail({
      subject: `💛 New Donation: ₦${Number(req.body.amount || 0).toLocaleString()} — ${req.body.campaign || 'General Support'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#1a3a6b;margin-bottom:4px;">New Donation Received</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">Recorded via the Salvation Series website</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#555;width:130px;">Donor:</td><td>${req.body.name || 'Anonymous'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Campaign:</td><td>${req.body.campaign || 'General Support'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Amount:</td><td style="font-size:18px;font-weight:700;color:#c9973e;">₦${Number(req.body.amount || 0).toLocaleString()}</td></tr>
          </table>
          <p style="font-size:12px;color:#aaa;margin-top:24px;">This donation has been recorded in your admin ledger.</p>
        </div>
      `,
    }).catch(err => console.warn('Donation email failed (non-fatal):', err.message));

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
