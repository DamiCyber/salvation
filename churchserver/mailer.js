/**
 * mailer.js
 * Shared nodemailer transporter.
 *
 * Uses Gmail with an App Password (not your regular Gmail password).
 * To generate an App Password:
 *  1. Go to https://myaccount.google.com/security
 *  2. Enable 2-Step Verification
 *  3. Search "App passwords" → create one for "Mail"
 *  4. Paste the 16-char password into the GMAIL_APP_PASSWORD env var (or below).
 */
const nodemailer = require('nodemailer');

const GMAIL_USER = process.env.GMAIL_USER || 'salvationseriesworldoutreach1@gmail.com';
const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD || ''; // Set this in your .env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * sendMail({ subject, html })
 * Sends an email to the ministry inbox.
 * Returns a promise — errors are non-fatal (caller decides whether to rethrow).
 */
const sendMail = ({ subject, html }) =>
  transporter.sendMail({
    from: `"Salvation Series Website" <${GMAIL_USER}>`,
    to:   GMAIL_USER,
    subject,
    html,
  });

module.exports = { sendMail };
