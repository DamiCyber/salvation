import axios from 'axios';

/**
 * Central axios instance.
 * - baseURL points at the Vite proxy (/api), which forwards to
 *   http://localhost:5000 in development (see vite.config.js).
 * - The request interceptor attaches the stored admin token to every
 *   request that needs it (the server checks x-admin-token).
 *
 * NOTE: Do NOT set a default Content-Type here. For FormData requests,
 * axios must auto-set multipart/form-data with the correct boundary.
 * A hardcoded application/json default would break all file uploads.
 */
const client = axios.create({
  baseURL: '/api',
});

// Attach admin token header on every request when logged in
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ms_admin_token');
  if (token) {
    config.headers['x-admin-token'] = token;
  }
  // Only set JSON content-type if body is plain object/string, not FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default client;
