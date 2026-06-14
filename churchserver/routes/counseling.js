const express    = require('express');
const router     = express.Router();
const Counseling = require('../Counseling');
const adminAuth  = require('../adminAuth');
const { sendMail } = require('../mailer');

// Public: submit a counseling request
router.post('/', async (req, res) => {
  try {
    const request = await Counseling.create(req.body);

    // Send email notification (non-blocking)
    sendMail({
      subject: `🙏 New Counselling Request: ${req.body.topic || 'General Counselling'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#1a3a6b;margin-bottom:4px;">New Counselling Session Request</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">Received via the Salvation Series website counselling form</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">

          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#555;width:160px;">Name:</td><td style="padding:8px 0;">${req.body.name || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${req.body.email}" style="color:#1a3a6b;">${req.body.email || '—'}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Phone:</td><td style="padding:8px 0;">${req.body.phone || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Topic / Focus Area:</td><td style="padding:8px 0;">${req.body.topic || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Preferred Date:</td><td style="padding:8px 0;">${req.body.message?.replace('Preferred date: ', '') || '—'}</td></tr>
          </table>

          ${req.body.description ? `
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
          <h4 style="color:#1a3a6b;margin-bottom:8px;">Description / Notes:</h4>
          <div style="background:#fff;padding:16px;border-radius:6px;border-left:4px solid #d4af37;font-size:15px;line-height:1.6;color:#333;">
            ${req.body.description.replace(/\n/g, '<br>')}
          </div>` : ''}

          <p style="font-size:12px;color:#aaa;margin-top:24px;">
            This request was saved to your MongoDB database (ID: ${request._id}). Reply directly to the sender's email above to confirm the session.
          </p>
        </div>
      `,
    }).catch(err => console.warn('Counseling email send failed (non-fatal):', err.message));

    res.status(201).json({ message: 'Counseling request received.', id: request._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: list all counseling requests
router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = await Counseling.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: update request status
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const request = await Counseling.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const request = await Counseling.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    res.json({ message: 'Counseling request deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
