const express   = require('express');
const router    = express.Router();
const Volunteer = require('../Volunteer');
const adminAuth = require('../adminAuth');
const { sendMail } = require('../mailer');

// Public: submit volunteer application
router.post('/', async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);

    sendMail({
      subject: `🤝 New Volunteer Application: ${req.body.interest || 'General'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#1a3a6b;margin-bottom:4px;">New Volunteer Application</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">Submitted via the Salvation Series website Support page</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#555;width:130px;">Name:</td><td>${req.body.name || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Email:</td><td><a href="mailto:${req.body.email}" style="color:#1a3a6b;">${req.body.email || '—'}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Area of Interest:</td><td>${req.body.interest || '—'}</td></tr>
          </table>
          ${req.body.message ? `
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
          <h4 style="color:#1a3a6b;margin-bottom:8px;">Message:</h4>
          <div style="background:#fff;padding:16px;border-radius:6px;border-left:4px solid #1a3a6b;font-size:15px;line-height:1.6;color:#333;">
            ${req.body.message.replace(/\n/g, '<br>')}
          </div>` : ''}
          <p style="font-size:12px;color:#aaa;margin-top:24px;">Reply to this email to follow up with the volunteer.</p>
        </div>
      `,
    }).catch(err => console.warn('Volunteer email failed (non-fatal):', err.message));

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
