/**
 * GET /api/download/:filename
 * Forces a file download with Content-Disposition: attachment
 * so browsers save the file instead of opening it in a new tab.
 */
const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;

  // Sanitise — prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(UPLOAD_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found.' });
  }

  // Force download on all browsers / devices
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.sendFile(filePath);
});

module.exports = router;
