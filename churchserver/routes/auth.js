/**
 * POST /api/auth/login
 * Body: { password: string }
 * Returns: { token: string } on success, 401 on failure.
 *
 * The "token" is simply the admin password used as a bearer value.
 * The frontend must send it back as the x-admin-token header on
 * every protected request.
 */
const express = require('express');
const router  = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password.' });
  }
  return res.json({ token: ADMIN_PASSWORD });
});

module.exports = router;
