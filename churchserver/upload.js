/**
 * upload.js
 * Shared multer v2 middleware helpers.
 * Files are saved to  /uploads/<timestamp>-<originalname>
 * and served publicly at  http://localhost:5000/uploads/<filename>
 *
 * Multer v2 uses promise-based handlers instead of callbacks.
 * Use the exported wrappers in your route handlers with await.
 */
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'application/pdf', 'application/epub+zip',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

// Single-file upload — field name 'file'
const _uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
}).single('file');

// Multi-field upload — coverFile + downloadFile (for books)
const _uploadBookFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 },
}).fields([
  { name: 'coverFile',    maxCount: 1 },
  { name: 'downloadFile', maxCount: 1 },
]);

/**
 * Promise wrapper for single file upload (multer v2 compatible).
 * Usage in route: await uploadSingle(req, res);
 */
const uploadSingle = (req, res) =>
  new Promise((resolve, reject) => {
    _uploadSingle(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

/**
 * Promise wrapper for book files upload (multer v2 compatible).
 * Usage in route: await uploadBookFiles(req, res);
 */
const uploadBookFiles = (req, res) =>
  new Promise((resolve, reject) => {
    _uploadBookFiles(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

module.exports = { uploadSingle, uploadBookFiles, UPLOAD_DIR };
