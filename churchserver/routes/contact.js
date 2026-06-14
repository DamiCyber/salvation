const express   = require('express');
const router    = express.Router();
const Contact   = require('../Contact');
const adminAuth = require('../adminAuth');
const { sendMail } = require('../mailer');

// Public: submit a contact message
router.post('/', async (req, res) => {
  try {
    const msg = await Contact.create(req.body);

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendMail({
      subject: `📬 New Contact Message: ${req.body.subject || 'General Inquiry'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#1a3a6b;margin-bottom:4px;">New Contact Message</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">Received via the Salvation Series website contact form</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">

          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#555;width:130px;">Name:</td><td style="padding:8px 0;">${req.body.name || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${req.body.email}" style="color:#1a3a6b;">${req.body.email || '—'}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Subject:</td><td style="padding:8px 0;">${req.body.subject || 'General Inquiry'}</td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
          <h4 style="color:#1a3a6b;margin-bottom:8px;">Message:</h4>
          <div style="background:#fff;padding:16px;border-radius:6px;border-left:4px solid #1a3a6b;font-size:15px;line-height:1.6;color:#333;">
            ${(req.body.message || '').replace(/\n/g, '<br>')}
          </div>

          <p style="font-size:12px;color:#aaa;margin-top:24px;">
            This message was saved to your MongoDB database (ID: ${msg._id}). Reply directly to the sender's email above.
          </p>
        </div>
      `,
    }).catch(err => console.warn('Contact email send failed (non-fatal):', err.message));

    res.status(201).json({ message: 'Message received. We will respond soon.', id: msg._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: list all messages
router.get('/', adminAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: delete a message
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
