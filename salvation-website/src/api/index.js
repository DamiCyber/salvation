/**
 * All API calls in one place.
 * Every function returns the axios response so callers can use .data directly.
 *
 * IMPORTANT: Never manually set Content-Type for FormData requests.
 * Axios detects FormData and sets multipart/form-data + boundary automatically.
 * Setting it manually breaks the multipart boundary and causes 400 errors.
 */
import client from './client';

// ─── Auth ──────────────────────────────────────────────────────
export const loginAdmin  = (password) => client.post('/auth/login', { password });

// ─── Books ─────────────────────────────────────────────────────
export const getBooks   = ()          => client.get('/books');
export const createBook = (data)      => client.post('/books', data);   // FormData or JSON
export const updateBook = (id, data)  => client.put(`/books/${id}`, data);
export const deleteBook = (id)        => client.delete(`/books/${id}`);

// ─── Content (Blog / Devotional / Testimony) ────────────────────
export const getContent    = ()          => client.get('/content');
export const createContent = (data)      => client.post('/content', data);
export const updateContent = (id, data)  => client.put(`/content/${id}`, data);
export const deleteContent = (id)        => client.delete(`/content/${id}`);

// ─── Prayers ────────────────────────────────────────────────────
export const getPublicPrayers   = ()           => client.get('/prayers');
export const getAllPrayers       = ()           => client.get('/prayers/all');
export const submitPrayer       = (data)       => client.post('/prayers', data);
export const incrementPrayCount = (id)         => client.patch(`/prayers/${id}/pray`);
export const updatePrayerStatus = (id, data)   => client.patch(`/prayers/${id}`, data);
export const deletePrayer       = (id)         => client.delete(`/prayers/${id}`);

// ─── Donations ──────────────────────────────────────────────────
export const getDonationSummary = ()     => client.get('/donations/summary');
export const getAllDonations    = ()     => client.get('/donations');
export const recordDonation    = (data) => client.post('/donations', data);

// ─── Projects ──────────────────────────────────────────────────
export const getProjects   = ()          => client.get('/projects');
export const createProject = (data)      => client.post('/projects', data);
export const updateProject = (id, data)  => client.put(`/projects/${id}`, data);
export const deleteProject = (id)        => client.delete(`/projects/${id}`);

// ─── Events ────────────────────────────────────────────────────
export const getEvents   = ()          => client.get('/events');
export const createEvent = (data)      => client.post('/events', data);
export const updateEvent = (id, data)  => client.put(`/events/${id}`, data);
export const deleteEvent = (id)        => client.delete(`/events/${id}`);

// ─── Stream ─────────────────────────────────────────────────────
export const getStream    = ()     => client.get('/stream');
export const updateStream = (data) => client.put('/stream', data);

// ─── Gallery ────────────────────────────────────────────────────
// Always send FormData so the server's multer middleware can handle file uploads
export const getGallery        = (mediaType) =>
  client.get('/gallery', { params: mediaType ? { mediaType } : {} });
export const addGalleryItem    = (data) => client.post('/gallery', data); // FormData
export const deleteGalleryItem = (id)   => client.delete(`/gallery/${id}`);

// ─── Contact / Volunteer / Enrollment / Counseling ─────────────
export const submitContact    = (data) => client.post('/contact', data);
export const submitVolunteer  = (data) => client.post('/volunteers', data);
export const submitEnrollment = (data) => client.post('/enrollments', data);
export const submitCounseling = (data) => client.post('/counseling', data);
