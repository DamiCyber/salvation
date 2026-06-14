/**
 * cloudinary.js
 * Centralised Cloudinary v2 config + upload helper.
 *
 * Set these three env vars (or replace the fallback strings with your
 * actual Cloudinary credentials from https://cloudinary.com/console):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
const cloudinary   = require('cloudinary').v2;
const streamifier  = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key:    process.env.CLOUDINARY_API_KEY    || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
  secure: true,
});

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer   - File buffer from multer memoryStorage
 * @param {string} folder   - Cloudinary folder (e.g. 'gallery', 'books')
 * @param {string} resourceType - 'image' | 'video' | 'auto'
 * @returns {Promise<string>} - secure_url of the uploaded file
 */
function uploadToCloudinary(buffer, folder = 'uploads', resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = { cloudinary, uploadToCloudinary };
