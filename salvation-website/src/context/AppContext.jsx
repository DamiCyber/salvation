import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api/index';

export const AppContext = createContext();

// ─── Fallback seed data ────────────────────────────────────────────────────────
const SEED_BOOKS = [
  {
    _id: 'book-seed-1', id: 'book-seed-1',
    title: 'Walking in Divine Purpose',
    description: 'An inspiring guide to understanding your spiritual calling and walking daily in the obedience of faith.',
    price: 14.99, downloadUrl: '#',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    previewChapters: ['Chapter 1: Hearing the Voice of the Father', 'Chapter 2: The Wilderness of Preparation', 'Chapter 3: Stepping Out in Radical Faith'],
  },
  {
    _id: 'book-seed-2', id: 'book-seed-2',
    title: 'The Fields are White',
    description: 'Stories of miraculous healings, breakthroughs, and salvation from the frontlines of global missions.',
    price: 0, downloadUrl: '#',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    previewChapters: ['Chapter 1: The First Steps on Kenyan Soil', 'Chapter 2: A Blind Girl Sees', 'Chapter 3: Feeding the Multitude'],
  },
];

const SEED_CONTENT = [
  {
    _id: 'content-seed-1', id: 'content-seed-1',
    type: 'Blog', title: 'Radical Simplicity in the Villages',
    excerpt: 'Deep reflections on our recent journey to the remote villages and what their joy taught us.',
    date: 'June 10, 2026',
    content: 'During our week in the sub-counties, we encountered believers who possess virtually nothing in terms of worldly goods, yet their faces radiated a joy that surpasses understanding...',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: 'content-seed-2', id: 'content-seed-2',
    type: 'Testimony', title: 'Miraculous Healing: Blind Eyes Opened',
    excerpt: "A testament to God's raw healing power: Grace's sight was restored during our Friday night crusade.",
    date: 'June 05, 2026',
    content: 'During our Friday evening open-air crusade in Kakamega, a woman named Grace came to the stage weeping. She had been blind in her left eye since a farming accident six years ago...',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
  },
];

const SEED_GALLERY = {
  photos: [
    { _id: 'p-seed-1', id: 'p-seed-1', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', title: 'Medical Outreach Camp', category: 'Outreach', mediaType: 'photo' },
    { _id: 'p-seed-2', id: 'p-seed-2', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600', title: "Children's Bible Study", category: 'Community', mediaType: 'photo' },
  ],
  videos: [
    { _id: 'v-seed-1', id: 'v-seed-1', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Crusade Highlights 2026', category: 'Crusades', mediaType: 'video' },
  ],
};

const SEED_SERMONS = [
  { _id: 's-seed-1', id: 's-seed-1', title: 'The Cost of the Call', type: 'Audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', date: 'June 07, 2026', duration: '42:15', notes: 'A sermon on Luke 14:25-33.' },
  { _id: 's-seed-2', id: 's-seed-2', title: 'Living Out the Great Commission', type: 'Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', date: 'May 31, 2026', duration: '35:40', notes: 'Exhortation on Matthew 28:18-20.' },
];

const SEED_PRAYERS = [
  { _id: 'pr-seed-1', id: 'pr-seed-1', name: 'David S.', text: 'Please pray for our upcoming village outreach.', date: 'June 11, 2026', prayCount: 24, count: 24, status: 'Approved', answer: '' },
  { _id: 'pr-seed-2', id: 'pr-seed-2', name: 'Mary J.', text: 'Praise Report! My son is healed!', date: 'June 09, 2026', prayCount: 48, count: 48, status: 'Praise Report', answer: 'Healed by His stripes!' },
];

const SEED_STREAM = { isLive: false, streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', streamTitle: 'Sunday Morning Outreach Service' };
const SEED_PROJECTS = [
  { _id: 'proj-seed-1', id: 'proj-seed-1', title: 'Clean Water Wells', description: 'Drilling 5 new wells.', status: 'Current', progress: 60 },
  { _id: 'proj-seed-2', id: 'proj-seed-2', title: 'Outreach Truck Sound System', description: 'A portable sound rig.', status: 'Completed', progress: 100 },
];
const SEED_EVENTS = [
  { _id: 'ev-seed-1', id: 'ev-seed-1', title: 'Holy Fire Crusade', date: 'July 12–15, 2026', location: 'Kakamega Main Field', description: 'Outreach crusades featuring nightly salvation and healing services.' },
];
const DONATION_GOAL = 30000000;

// ─── Normalise helpers ─────────────────────────────────────────────────────────
const norm = (item) => {
  if (!item) return item;
  const out = { ...item };
  if (out._id && !out.id) out.id = String(out._id);
  if (!out.count) out.count = out.prayCount || 0;
  if (!out.prayCount) out.prayCount = out.count || 0;
  return out;
};
const normArr = (arr) => (Array.isArray(arr) ? arr.map(norm) : arr);

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [books,       setBooks]       = useState(normArr(SEED_BOOKS));
  const [content,     setContent]     = useState(normArr(SEED_CONTENT));
  const [gallery,     setGallery]     = useState({ photos: normArr(SEED_GALLERY.photos), videos: normArr(SEED_GALLERY.videos) });
  const [sermons,     setSermons]     = useState(normArr(SEED_SERMONS));
  const [prayers,     setPrayers]     = useState(normArr(SEED_PRAYERS));
  const [projects,    setProjects]    = useState(normArr(SEED_PROJECTS));
  const [events,      setEvents]      = useState(normArr(SEED_EVENTS));
  const [streamState, setStreamState] = useState(SEED_STREAM);
  const [donations,   setDonations]   = useState({
    totalRaised: 14500000,
    goal: DONATION_GOAL,
    ledger: [
      { id: 'don-seed-1', name: 'Anonymous', amount: 150000, date: 'June 11, 2026', campaign: 'General Support' },
      { id: 'don-seed-2', name: 'Arthur & Helen G.', amount: 500000, date: 'June 10, 2026', campaign: 'Clean Water Wells' },
    ],
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => !!localStorage.getItem('ms_admin_token'));
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState(null);

  // ── Initial fetch ────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [booksRes, contentRes, photosRes, videosRes, streamRes, projectsRes, eventsRes, prayersRes] = await Promise.all([
        api.getBooks(), api.getContent(),
        api.getGallery('photo'), api.getGallery('video'),
        api.getStream(), api.getProjects(), api.getEvents(),
        api.getPublicPrayers(),
      ]);

      if (booksRes.data.length)    setBooks(normArr(booksRes.data));
      if (contentRes.data.length)  setContent(normArr(contentRes.data));
      setGallery({ photos: normArr(photosRes.data), videos: normArr(videosRes.data) });
      if (streamRes.data)          setStreamState(streamRes.data);
      if (projectsRes.data.length) setProjects(normArr(projectsRes.data));
      if (eventsRes.data.length)   setEvents(normArr(eventsRes.data));
      if (prayersRes.data.length)  setPrayers(normArr(prayersRes.data));

      // Donation summary
      try {
        const sumRes = await api.getDonationSummary();
        const { grandTotal, campaigns } = sumRes.data;
        const ledger = campaigns.map((c, i) => ({ id: `camp-${i}`, name: c._id, amount: c.total, date: '', campaign: c._id }));
        setDonations({ totalRaised: grandTotal || 0, goal: DONATION_GOAL, ledger });
      } catch { /* keep seed donations */ }

    } catch (err) {
      console.warn('API unavailable, using seed data:', err.message);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Admin: full prayer list
  const fetchAllPrayers = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    try { const res = await api.getAllPrayers(); if (res.data.length) setPrayers(normArr(res.data)); } catch { /* ignore */ }
  }, [isAdminLoggedIn]);
  useEffect(() => { fetchAllPrayers(); }, [fetchAllPrayers]);

  // Admin: full ledger
  const fetchLedger = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    try {
      const res = await api.getAllDonations();
      const ledger = normArr(res.data);
      const totalRaised = ledger.reduce((s, d) => s + (d.amount || 0), 0);
      setDonations({ totalRaised, goal: DONATION_GOAL, ledger });
    } catch { /* ignore */ }
  }, [isAdminLoggedIn]);
  useEffect(() => { fetchLedger(); }, [fetchLedger]);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const loginAdmin = async (password) => {
    try {
      const res = await api.loginAdmin(password);
      localStorage.setItem('ms_admin_token', res.data.token);
      setIsAdminLoggedIn(true);
      return true;
    } catch { return false; }
  };
  const logoutAdmin = () => {
    localStorage.removeItem('ms_admin_token');
    setIsAdminLoggedIn(false);
  };

  // ── Books ────────────────────────────────────────────────────────────────────
  const addOrUpdateBook = async (bookData) => {
    try {
      const isForm = bookData instanceof FormData;
      const getId  = isForm ? bookData.get('_id') || bookData.get('id') : (bookData._id || bookData.id);
      const isSeed = !getId || String(getId).startsWith('book-seed');

      if (!isSeed) {
        const res = await api.updateBook(getId, bookData);
        setBooks(prev => prev.map(b => (b._id === getId || b.id === getId) ? norm(res.data) : b));
      } else {
        if (isForm) { bookData.delete('_id'); bookData.delete('id'); }
        const res = await api.createBook(bookData);
        setBooks(prev => [norm(res.data), ...prev]);
      }
    } catch (err) { console.error('Book save error:', err.message); throw err; }
  };
  const deleteBook = async (id) => {
    if (!id || String(id).startsWith('book-seed')) {
      setBooks(prev => prev.filter(b => b._id !== id && b.id !== id));
      return;
    }
    try { await api.deleteBook(id); setBooks(prev => prev.filter(b => b._id !== id && b.id !== id)); }
    catch (err) { console.error('Book delete error:', err.message); throw err; }
  };

  // ── Content ──────────────────────────────────────────────────────────────────
  const addOrUpdateContent = async (item) => {
    try {
      const isForm = item instanceof FormData;
      const id = isForm
        ? (item.get('_id') || item.get('id'))
        : (item._id || item.id);
      const isSeed = !id || String(id).startsWith('content-seed');

      if (!isSeed) {
        const res = await api.updateContent(id, item);
        setContent(prev => prev.map(c => (c._id === id || c.id === id) ? norm(res.data) : c));
      } else {
        // Strip any seed id before sending so MongoDB gets a clean create
        if (isForm) { item.delete('_id'); item.delete('id'); }
        const res = await api.createContent(item);
        setContent(prev => [norm(res.data), ...prev]);
      }
    } catch (err) { console.error('Content save error:', err.message); throw err; }
  };
  const deleteContent = async (id) => {
    // If it's a seed item, just remove it from local state — no API call
    if (!id || String(id).startsWith('content-seed')) {
      setContent(prev => prev.filter(c => c._id !== id && c.id !== id));
      return;
    }
    try { await api.deleteContent(id); setContent(prev => prev.filter(c => c._id !== id && c.id !== id)); }
    catch (err) { console.error('Content delete error:', err.message); throw err; }
  };

  // ── Gallery ──────────────────────────────────────────────────────────────────
  const addMediaItem = async (itemData, mediaType) => {
    try {
      // itemData can be FormData (file) or plain object (URL-only)
      const fd = itemData instanceof FormData ? itemData : (() => {
        const f = new FormData();
        Object.entries(itemData).forEach(([k, v]) => f.append(k, v));
        return f;
      })();
      const res = await api.addGalleryItem(fd);
      const newItem = norm(res.data);
      const mt = newItem.mediaType || mediaType;
      setGallery(prev => ({
        photos: mt === 'photo' ? [newItem, ...prev.photos] : prev.photos,
        videos: mt === 'video' ? [newItem, ...prev.videos] : prev.videos,
      }));
    } catch (err) { console.error('Gallery add error:', err.message); throw err; }
  };
  const deleteMediaItem = async (id, mediaType) => {
    if (!id || String(id).startsWith('p-seed') || String(id).startsWith('v-seed')) {
      setGallery(prev => ({
        photos: mediaType === 'photo' ? prev.photos.filter(p => p._id !== id && p.id !== id) : prev.photos,
        videos: mediaType === 'video' ? prev.videos.filter(v => v._id !== id && v.id !== id) : prev.videos,
      }));
      return;
    }
    try {
      await api.deleteGalleryItem(id);
      setGallery(prev => ({
        photos: mediaType === 'photo' ? prev.photos.filter(p => p._id !== id && p.id !== id) : prev.photos,
        videos: mediaType === 'video' ? prev.videos.filter(v => v._id !== id && v.id !== id) : prev.videos,
      }));
    } catch (err) { console.error('Gallery delete error:', err.message); throw err; }
  };

  // ── Sermons (local only — no separate route) ──────────────────────────────────
  const addOrUpdateSermon = (sermon) => {
    if (sermon.id) { setSermons(prev => prev.map(s => s.id === sermon.id ? sermon : s)); }
    else { setSermons(prev => [{ ...sermon, id: 's-' + Date.now() }, ...prev]); }
  };
  const deleteSermon = (id) => { setSermons(prev => prev.filter(s => s.id !== id)); };

  // ── Prayers ──────────────────────────────────────────────────────────────────
  const submitPrayerRequest = async (name, text) => {
    try {
      const res = await api.submitPrayer({ name: name || 'Anonymous', text });
      if (isAdminLoggedIn) setPrayers(prev => [norm(res.data), ...prev]);
    } catch (err) { console.error('Prayer submit error:', err.message); throw err; }
  };
  const incrementPrayCount = async (id) => {
    try {
      const res = await api.incrementPrayCount(id);
      setPrayers(prev => prev.map(p => (p._id === id || p.id === id) ? norm(res.data) : p));
    } catch {
      setPrayers(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, prayCount: (p.prayCount || 0) + 1, count: (p.count || 0) + 1 } : p));
    }
  };
  const updatePrayerStatus = async (id, status, answer = '') => {
    try {
      const res = await api.updatePrayerStatus(id, { status, answer });
      setPrayers(prev => prev.map(p => (p._id === id || p.id === id) ? norm(res.data) : p));
    } catch (err) { console.error('Prayer status error:', err.message); throw err; }
  };
  const deletePrayerRequest = async (id) => {
    try { await api.deletePrayer(id); setPrayers(prev => prev.filter(p => p._id !== id && p.id !== id)); }
    catch (err) { console.error('Prayer delete error:', err.message); throw err; }
  };

  // ── Donations ────────────────────────────────────────────────────────────────
  const receiveDonation = async (donorName, amount, campaign) => {
    const donationVal = parseFloat(amount);
    try {
      await api.recordDonation({ name: donorName || 'Anonymous', amount: donationVal, campaign: campaign || 'General Support' });
      if (isAdminLoggedIn) { await fetchLedger(); }
      else {
        setDonations(prev => ({
          ...prev, totalRaised: prev.totalRaised + donationVal,
          ledger: [{ id: 'don-' + Date.now(), name: donorName || 'Anonymous', amount: donationVal, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), campaign: campaign || 'General Support' }, ...prev.ledger],
        }));
      }
    } catch {
      setDonations(prev => ({
        ...prev, totalRaised: prev.totalRaised + donationVal,
        ledger: [{ id: 'don-' + Date.now(), name: donorName || 'Anonymous', amount: donationVal, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), campaign: campaign || 'General Support' }, ...prev.ledger],
      }));
    }
  };

  // ── Projects ─────────────────────────────────────────────────────────────────
  const addOrUpdateProject = async (proj) => {
    try {
      const id = proj._id || proj.id;
      const isSeed = !id || String(id).startsWith('proj-seed');
      if (!isSeed) {
        const res = await api.updateProject(id, proj);
        setProjects(prev => prev.map(p => (p._id === id || p.id === id) ? norm(res.data) : p));
      } else {
        const { _id, id: _id2, ...clean } = proj;
        const res = await api.createProject(clean);
        setProjects(prev => [...prev, norm(res.data)]);
      }
    } catch (err) { console.error('Project save error:', err.message); throw err; }
  };
  const deleteProject = async (id) => {
    if (!id || String(id).startsWith('proj-seed')) {
      setProjects(prev => prev.filter(p => p._id !== id && p.id !== id));
      return;
    }
    try { await api.deleteProject(id); setProjects(prev => prev.filter(p => p._id !== id && p.id !== id)); }
    catch (err) { console.error('Project delete error:', err.message); throw err; }
  };

  // ── Events ───────────────────────────────────────────────────────────────────
  const addOrUpdateEvent = async (evt) => {
    try {
      const id = evt._id || evt.id;
      const isSeed = !id || String(id).startsWith('ev-seed');
      if (!isSeed) {
        const res = await api.updateEvent(id, evt);
        setEvents(prev => prev.map(e => (e._id === id || e.id === id) ? norm(res.data) : e));
      } else {
        const { _id, id: _id2, ...clean } = evt;
        const res = await api.createEvent(clean);
        setEvents(prev => [...prev, norm(res.data)]);
      }
    } catch (err) { console.error('Event save error:', err.message); throw err; }
  };
  const deleteEvent = async (id) => {
    if (!id || String(id).startsWith('ev-seed')) {
      setEvents(prev => prev.filter(e => e._id !== id && e.id !== id));
      return;
    }
    try { await api.deleteEvent(id); setEvents(prev => prev.filter(e => e._id !== id && e.id !== id)); }
    catch (err) { console.error('Event delete error:', err.message); throw err; }
  };

  // ── Stream ───────────────────────────────────────────────────────────────────
  const setLiveStream = async (isLive, url = '', title = '') => {
    const payload = { isLive, streamUrl: url || streamState.streamUrl, streamTitle: title || streamState.streamTitle };
    setStreamState(payload);
    try { const res = await api.updateStream(payload); setStreamState(res.data); }
    catch (err) { console.error('Stream update error:', err.message); }
  };

  // ── Normalise prayer counts ───────────────────────────────────────────────────
  const normalisedPrayers = prayers.map(p => ({ ...p, count: p.prayCount ?? p.count ?? 0, prayCount: p.prayCount ?? p.count ?? 0 }));

  return (
    <AppContext.Provider value={{
      books, addOrUpdateBook, deleteBook,
      content, addOrUpdateContent, deleteContent,
      gallery, addMediaItem, deleteMediaItem,
      sermons, addOrUpdateSermon, deleteSermon,
      prayers: normalisedPrayers, submitPrayerRequest, incrementPrayCount, updatePrayerStatus, deletePrayerRequest,
      donations, receiveDonation,
      projects, addOrUpdateProject, deleteProject,
      events, addOrUpdateEvent, deleteEvent,
      streamState, setLiveStream,
      isAdminLoggedIn, loginAdmin, logoutAdmin,
      loading, apiError,
    }}>
      {children}
    </AppContext.Provider>
  );
};
