const express    = require('express');
const router     = express.Router();
const Enrollment = require('../Enrollment');
const adminAuth  = require('../adminAuth');
const { sendMail } = require('../mailer');

// Public: submit an enrollment
router.post('/', async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);

    sendMail({
      subject: `📚 New Bible School Enrollment: ${req.body.course || 'Unknown Course'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#1a3a6b;margin-bottom:4px;">New Bible School Enrollment</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">Submitted via the Salvation Series website Bible School page</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;color:#555;width:130px;">Name:</td><td>${req.body.name || '—'}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Email:</td><td><a href="mailto:${req.body.email}" style="color:#1a3a6b;">${req.body.email || '—'}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#555;">Course:</td><td>${req.body.course || '—'}</td></tr>
          </table>
          <p style="font-size:12px;color:#aaa;margin-top:24px;">Reply to this email to follow up with the student.</p>
        </div>
      `,
    }).catch(err => console.warn('Enrollment email failed (non-fatal):', err.message));

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
