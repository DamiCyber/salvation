// middleware/adminAuth.js
// Simple password-based admin guard.
// In production swap this for JWT or a session library.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

module.exports = function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: admin access required.' });
  }
  next();
};
