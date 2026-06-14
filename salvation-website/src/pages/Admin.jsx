import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import * as api from '../api/index';

export default function Admin() {
  const {
    books, addOrUpdateBook, deleteBook,
    content, addOrUpdateContent, deleteContent,
    gallery, addMediaItem, deleteMediaItem,
    prayers, updatePrayerStatus, deletePrayerRequest,
    donations,
    projects, addOrUpdateProject, deleteProject,
    events, addOrUpdateEvent, deleteEvent,
    streamState, setLiveStream,
    isAdminLoggedIn, loginAdmin, logoutAdmin,
  } = useContext(AppContext);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const [password,   setPassword]   = useState('');
  const [loginError, setLoginError] = useState(false);

  // ── Tab navigation ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('Stream');

  // ── Stream ──────────────────────────────────────────────────────────────────
  const [streamLive,       setStreamLive]       = useState(streamState.isLive);
  const [streamUrl,        setStreamUrl]        = useState(streamState.streamUrl);
  const [streamTitleInput, setStreamTitleInput] = useState(streamState.streamTitle);

  // ── Books ───────────────────────────────────────────────────────────────────
  const [editingBook,  setEditingBook]  = useState(null);
  const [bookTitle,    setBookTitle]    = useState('');
  const [bookDesc,     setBookDesc]     = useState('');
  const [bookPrice,    setBookPrice]    = useState('0');
  const [bookChapters, setBookChapters] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('');  // text URL fallback
  const [bookDlUrl,    setBookDlUrl]    = useState('');  // text download URL fallback
  const [bookUploading, setBookUploading] = useState(false);
  const [bookUploadProgress, setBookUploadProgress] = useState('');
  const coverFileRef = useRef(null);
  const downloadFileRef = useRef(null);

  // ── Gallery upload ───────────────────────────────────────────────────────────
  const [galleryTitle,      setGalleryTitle]      = useState('');
  const [galleryCategory,   setGalleryCategory]   = useState('General');
  const [galleryMediaType,  setGalleryMediaType]  = useState('photo');
  const [galleryUrl,        setGalleryUrl]        = useState(''); // URL fallback for videos
  const [galleryUploading,  setGalleryUploading]  = useState(false);
  const [galleryUploadMsg,  setGalleryUploadMsg]  = useState('');
  const [galleryFilter,     setGalleryFilter]     = useState('photo');
  const galleryFileRef = useRef(null);

  // ── Content ─────────────────────────────────────────────────────────────────
  const [editingContent, setEditingContent] = useState(null);
  const [contentTitle,   setContentTitle]   = useState('');
  const [contentType,    setContentType]    = useState('Blog');
  const [contentExcerpt, setContentExcerpt] = useState('');
  const [contentBody,    setContentBody]    = useState('');
  const [contentImage,   setContentImage]   = useState('');
  const [contentUploading, setContentUploading] = useState(false);
  const [contentImagePreview, setContentImagePreview] = useState('');
  const contentImageRef = useRef(null);

  // ── Prayers ─────────────────────────────────────────────────────────────────
  const [prayerFilter,    setPrayerFilter]    = useState('Pending');
  const [prayerAnswerText, setPrayerAnswerText] = useState({});

  // ─── Login ────────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const ok = await loginAdmin(password);
    if (ok) { setLoginError(false); setPassword(''); }
    else setLoginError(true);
  };

  if (!isAdminLoggedIn) {
    return (
      <div style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: 420, width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary-blue)', display: 'block', marginBottom: '0.75rem' }}>lock</span>
          <h2>Admin Dashboard</h2>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Enter your admin password to manage content, upload media, and moderate the site.
          </p>
          <form onSubmit={handleLogin} className="text-left">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            {loginError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                ❌ Incorrect password.
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Stream handlers ─────────────────────────────────────────────────────────
  const handleUpdateStream = (e) => {
    e.preventDefault();
    setLiveStream(streamLive, streamUrl, streamTitleInput);
    alert('✅ Stream settings saved!');
  };

  // ─── Book handlers ────────────────────────────────────────────────────────────
  const resetBookForm = () => {
    setEditingBook(null); setBookTitle(''); setBookDesc(''); setBookPrice('0');
    setBookChapters(''); setBookCoverUrl(''); setBookDlUrl('');
    if (coverFileRef.current)    coverFileRef.current.value    = '';
    if (downloadFileRef.current) downloadFileRef.current.value = '';
  };
  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookTitle(book.title);
    setBookDesc(book.description || '');
    setBookPrice(String(book.price || 0));
    setBookChapters((book.previewChapters || []).join('\n'));
    setBookCoverUrl(book.coverUrl || '');
    setBookDlUrl(book.downloadUrl || '');
  };
  const handleSaveBook = async (e) => {
    e.preventDefault();
    setBookUploading(true);
    setBookUploadProgress('Saving book…');
    try {
      const fd = new FormData();
      fd.append('title',       bookTitle);
      fd.append('description', bookDesc);
      fd.append('price',       bookPrice || '0');
      fd.append('previewChapters', JSON.stringify(
        bookChapters.split('\n').filter(c => c.trim())
      ));

      // Attach cover file if selected, otherwise send URL text
      if (coverFileRef.current?.files[0]) {
        fd.append('coverFile', coverFileRef.current.files[0]);
        setBookUploadProgress('Uploading cover image…');
      } else {
        fd.append('coverUrl', bookCoverUrl ||
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400');
      }

      // Attach download file if selected, otherwise send URL text
      if (downloadFileRef.current?.files[0]) {
        fd.append('downloadFile', downloadFileRef.current.files[0]);
        setBookUploadProgress('Uploading book file…');
      } else {
        fd.append('downloadUrl', bookDlUrl || '#');
      }

      // Pass editing ID if updating
      if (editingBook) {
        fd.append('_id', editingBook._id || editingBook.id);
      }

      await addOrUpdateBook(fd);
      alert('✅ Book saved successfully!');
      resetBookForm();
    } catch (err) {
      alert('❌ Error saving book: ' + err.message);
    } finally {
      setBookUploading(false);
      setBookUploadProgress('');
    }
  };

  // ─── Gallery handlers ─────────────────────────────────────────────────────────
  const resetGalleryForm = () => {
    setGalleryTitle(''); setGalleryCategory('General');
    setGalleryUrl(''); setGalleryUploadMsg('');
    if (galleryFileRef.current) galleryFileRef.current.value = '';
  };
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    setGalleryUploading(true);
    setGalleryUploadMsg('Uploading…');
    try {
      const fd = new FormData();
      fd.append('title',     galleryTitle);
      fd.append('category',  galleryCategory);
      fd.append('mediaType', galleryMediaType);

      if (galleryFileRef.current?.files[0]) {
        // Real file from disk — attach it with field name 'file'
        fd.append('file', galleryFileRef.current.files[0]);
      } else if (galleryUrl.trim()) {
        // URL fallback (YouTube embed, external image)
        fd.append('url', galleryUrl.trim());
      } else {
        setGalleryUploadMsg('❌ Please select a file or enter a URL.');
        setGalleryUploading(false);
        return;
      }

      await addMediaItem(fd, galleryMediaType);
      setGalleryUploadMsg('✅ Uploaded successfully!');
      resetGalleryForm();
      setTimeout(() => setGalleryUploadMsg(''), 4000);
    } catch (err) {
      setGalleryUploadMsg('❌ Failed: ' + err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  // ─── Content handlers ────────────────────────────────────────────────────────
  const resetContentForm = () => {
    setEditingContent(null); setContentTitle(''); setContentExcerpt('');
    setContentBody(''); setContentImage(''); setContentImagePreview('');
    if (contentImageRef.current) contentImageRef.current.value = '';
  };
  const handleEditContent = (item) => {
    setEditingContent(item); setContentTitle(item.title);
    setContentType(item.type); setContentExcerpt(item.excerpt);
    setContentBody(item.content); setContentImage(item.image);
    setContentImagePreview(item.image || '');
    if (contentImageRef.current) contentImageRef.current.value = '';
  };
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setContentUploading(true);
    try {
      const fd = new FormData();
      fd.append('title',   contentTitle);
      fd.append('type',    contentType);
      fd.append('excerpt', contentExcerpt);
      fd.append('content', contentBody);

      if (contentImageRef.current?.files[0]) {
        fd.append('file', contentImageRef.current.files[0]);
      } else {
        fd.append('image', contentImage ||
          'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800');
      }

      if (editingContent) fd.append('_id', editingContent._id || editingContent.id);

      await addOrUpdateContent(fd);
      alert('✅ Article saved!');
      resetContentForm();
    } catch (err) {
      alert('❌ Error saving article: ' + err.message);
    } finally {
      setContentUploading(false);
    }
  };

  // ─── Prayer handlers ─────────────────────────────────────────────────────────
  const handlePrayerAction = (id, status, answer = '') => {
    updatePrayerStatus(id, status, answer);
    setPrayerAnswerText(prev => { const u = { ...prev }; delete u[id]; return u; });
  };

  // ─── Ledger stats ────────────────────────────────────────────────────────────
  const donationByCampaign = (donations?.ledger || []).reduce((acc, d) => {
    acc[d.campaign] = (acc[d.campaign] || 0) + d.amount;
    return acc;
  }, {});

  const tabs = [
    { id: 'Stream',  label: 'Livestream',  icon: 'sensors' },
    { id: 'Books',   label: 'Books',       icon: 'auto_stories' },
    { id: 'Gallery', label: 'Gallery',     icon: 'photo_library' },
    { id: 'Content', label: 'Blog/Updates', icon: 'article' },
    { id: 'Prayers', label: 'Prayers',     icon: 'volunteer_activism' },
    { id: 'Ledger',  label: 'Ledger',      icon: 'payments' },
  ];

  const CATEGORIES = ['General', 'Outreach', 'Community', 'Crusades', 'Trips', 'Events'];

  return (
    <div className="admin-page font-sans">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Admin Control Center</h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Manage content, upload media, and moderate the ministry site.
          </p>
        </div>
        <button className="btn btn-sm btn-danger" onClick={logoutAdmin}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span> Exit
        </button>
      </div>

      {/* Tab bar */}
      <div className="admin-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`admin-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── STREAM TAB ──────────────────────────────────────────────────────────── */}
      {activeTab === 'Stream' && (
        <div className="admin-panel grid-2 animate-fade-in">
          <div className="card">
            <h3>Livestream Controller</h3>
            <p className="form-sub-desc">Toggle live status and set your YouTube/Vimeo embed URL.</p>
            <form onSubmit={handleUpdateStream}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" checked={streamLive} onChange={e => setStreamLive(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <span>Broadcast is LIVE NOW</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Broadcast Title</label>
                <input type="text" value={streamTitleInput} onChange={e => setStreamTitleInput(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Embed URL</label>
                <input type="text" value={streamUrl} onChange={e => setStreamUrl(e.target.value)} className="form-input" required placeholder="https://www.youtube.com/embed/VIDEO_ID" />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Use the /embed/ format from YouTube.</small>
              </div>
              <button type="submit" className="btn btn-primary">Save Stream Settings</button>
            </form>
          </div>
          <div className="card">
            <h3>Current Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-800)', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 700 }}>
                  {streamState.isLive
                    ? <span style={{ color: 'var(--primary-crimson)' }}>🔴 ONLINE</span>
                    : <span style={{ color: 'var(--text-muted)' }}>⚫ OFFLINE</span>}
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-800)', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Title</span>
                <p style={{ margin: '0.25rem 0 0', fontWeight: 600, color: 'var(--primary-blue)', fontSize: '0.9rem' }}>{streamState.streamTitle}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKS TAB ───────────────────────────────────────────────────────────── */}
      {activeTab === 'Books' && (
        <div className="admin-panel grid-2 animate-fade-in">
          <div className="card">
            <h3>{editingBook ? 'Edit Book' : 'Publish New Book'}</h3>
            <p className="form-sub-desc">Upload cover image, set price, and attach a downloadable PDF or ePub file.</p>
            <form onSubmit={handleSaveBook}>
              <div className="form-group">
                <label className="form-label">Book Title *</label>
                <input type="text" placeholder="e.g. Walking in Obedience" value={bookTitle} onChange={e => setBookTitle(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea placeholder="Short marketing description…" value={bookDesc} onChange={e => setBookDesc(e.target.value)} className="form-textarea" required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₦) — Set 0 for Free</label>
                <input type="number" step="1" min="0" placeholder="0" value={bookPrice} onChange={e => setBookPrice(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image — Upload from Device</label>
                <input type="file" accept="image/*" ref={coverFileRef} className="form-input" style={{ padding: '0.4rem' }} />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Select a JPG or PNG from your laptop or phone</small>
              </div>
              <div className="form-group">
                <label className="form-label">Or Paste Cover Image URL (if no file)</label>
                <input type="text" placeholder="https://…" value={bookCoverUrl} onChange={e => setBookCoverUrl(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Book File — Upload PDF/ePub from Device</label>
                <input type="file" accept=".pdf,.epub,.mobi" ref={downloadFileRef} className="form-input" style={{ padding: '0.4rem' }} />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Select a PDF or ePub from your device</small>
              </div>
              <div className="form-group">
                <label className="form-label">Or Paste Download URL (if no file)</label>
                <input type="text" placeholder="https://…" value={bookDlUrl} onChange={e => setBookDlUrl(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Preview Chapters (one per line)</label>
                <textarea placeholder={"Chapter 1: The Calling\nChapter 2: The Field\nChapter 3: The Harvest"} value={bookChapters} onChange={e => setBookChapters(e.target.value)} className="form-textarea" style={{ minHeight: 80 }} />
              </div>
              {bookUploadProgress && (
                <div style={{ padding: '0.6rem 1rem', background: 'rgba(26,58,107,0.06)', borderRadius: 6, marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--primary-blue)' }}>
                  ⏳ {bookUploadProgress}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" disabled={bookUploading}>
                  {bookUploading ? 'Saving…' : editingBook ? 'Save Changes' : 'Publish Book'}
                </button>
                {editingBook && (
                  <button type="button" className="btn btn-outline-blue" onClick={resetBookForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>
          <div className="card">
            <h3>Published Books ({books.length})</h3>
            <p className="form-sub-desc">Click ✏️ to edit or 🗑️ to remove.</p>
            <div className="admin-list-scroll">
              {books.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No books yet.</p>}
              {books.map(b => (
                <div key={b._id || b.id} className="admin-list-item">
                  {b.coverUrl
                    ? <img src={b.coverUrl} alt="" className="admin-thumb-img" />
                    : <div className="admin-thumb-img" style={{ background: 'var(--bg-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>auto_stories</span></div>
                  }
                  <div className="admin-item-details">
                    <h4>{b.title}</h4>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{b.price === 0 ? 'FREE' : `₦${b.price.toLocaleString()}`}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="btn btn-sm btn-outline-blue" onClick={() => handleEditBook(b)} title="Edit">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => window.confirm('Delete this book?') && deleteBook(b._id || b.id)} title="Delete">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GALLERY TAB ─────────────────────────────────────────────────────────── */}
      {activeTab === 'Gallery' && (
        <div className="admin-panel grid-2 animate-fade-in">
          {/* Upload form */}
          <div className="card">
            <h3>Upload Media</h3>
            <p className="form-sub-desc">Add photos by URL or YouTube/Vimeo embed links for videos. They'll appear live on the site immediately.</p>
            <form onSubmit={handleGalleryUpload}>
              <div className="form-group">
                <label className="form-label">Media Type</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['photo', 'video'].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`tab-btn btn-sm ${galleryMediaType === t ? 'active' : ''}`}
                      onClick={() => { setGalleryMediaType(t); setGalleryUrl(''); if (galleryFileRef.current) galleryFileRef.current.value = ''; }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{t === 'photo' ? 'image' : 'videocam'}</span>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" placeholder="e.g. Medical Outreach Camp" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)} className="form-select">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {galleryMediaType === 'photo' ? (
                <div className="form-group">
                  <label className="form-label">Upload Photo from Device *</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={galleryFileRef}
                    className="form-input"
                    style={{ padding: '0.4rem' }}
                  />
                  <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    JPG, PNG, WebP — select from your laptop or phone
                  </small>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Upload Video from Device</label>
                    <input
                      type="file"
                      accept="video/*"
                      ref={galleryFileRef}
                      className="form-input"
                      style={{ padding: '0.4rem' }}
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                      MP4, WebM — select from your device. Or paste a YouTube link below.
                    </small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Or Paste YouTube / Vimeo Embed URL</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      value={galleryUrl}
                      onChange={e => setGalleryUrl(e.target.value)}
                      className="form-input"
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                      Use the /embed/ format. Example: https://www.youtube.com/embed/abc123
                    </small>
                  </div>
                </>
              )}
              {galleryUploadMsg && (
                <div style={{ padding: '0.6rem 1rem', background: galleryUploadMsg.startsWith('✅') ? 'rgba(22,163,74,0.08)' : galleryUploadMsg.startsWith('❌') ? 'rgba(220,38,38,0.08)' : 'rgba(26,58,107,0.06)', borderRadius: 6, marginBottom: '1rem', fontSize: '0.85rem', color: galleryUploadMsg.startsWith('✅') ? 'var(--success)' : galleryUploadMsg.startsWith('❌') ? 'var(--danger)' : 'var(--primary-blue)' }}>
                  {galleryUploadMsg}
                </div>
              )}
              <button type="submit" className="btn btn-primary" disabled={galleryUploading}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>
                {galleryUploading ? ' Uploading…' : ' Upload'}
              </button>
            </form>
          </div>

          {/* Media list */}
          <div className="card">
            <h3>Manage Media</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['photo', 'video'].map(t => (
                <button key={t} className={`tab-btn btn-sm ${galleryFilter === t ? 'active' : ''}`} onClick={() => setGalleryFilter(t)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{t === 'photo' ? 'image' : 'videocam'}</span>
                  {t === 'photo' ? ` Photos (${gallery.photos.length})` : ` Videos (${gallery.videos.length})`}
                </button>
              ))}
            </div>
            <div className="admin-list-scroll">
              {(galleryFilter === 'photo' ? gallery.photos : gallery.videos).length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No {galleryFilter}s uploaded yet.</p>
              )}
              {(galleryFilter === 'photo' ? gallery.photos : gallery.videos).map(item => (
                <div key={item._id || item.id} className="admin-list-item">
                  {galleryFilter === 'photo'
                    ? <img src={item.url} alt={item.title} className="admin-thumb-img" />
                    : <div className="admin-thumb-img" style={{ background: '#0f1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--primary-gold)' }}>play_circle</span>
                      </div>
                  }
                  <div className="admin-item-details">
                    <h4>{item.title || '(untitled)'}</h4>
                    <span className="badge badge-info" style={{ fontSize: '0.62rem' }}>{item.category}</span>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => window.confirm('Delete this item?') && deleteMediaItem(item._id || item.id, galleryFilter)} title="Delete">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT TAB ─────────────────────────────────────────────────────────── */}
      {activeTab === 'Content' && (
        <div className="admin-panel grid-2 animate-fade-in">
          <div className="card">
            <h3>{editingContent ? 'Edit Article' : 'Publish New Article'}</h3>
            <p className="form-sub-desc">Publish blogs, reports, and testimonies to the Updates feed.</p>
            <form onSubmit={handleSaveContent}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" placeholder="e.g. Crusade Report — Kakamega" value={contentTitle} onChange={e => setContentTitle(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select value={contentType} onChange={e => setContentType(e.target.value)} className="form-select">
                  <option>Blog</option>
                  <option>Devotional</option>
                  <option>Testimony</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Feature Image — Upload from Device</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={contentImageRef}
                  className="form-input"
                  style={{ padding: '0.4rem' }}
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f) {
                      setContentImagePreview(URL.createObjectURL(f));
                      setContentImage(''); // clear URL field when file chosen
                    } else {
                      setContentImagePreview('');
                    }
                  }}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  JPG, PNG, WebP — select from your device
                </small>
                {contentImagePreview && (
                  <div style={{ marginTop: '0.6rem', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--glass-border)', maxHeight: 160 }}>
                    <img src={contentImagePreview} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Or Paste Image URL (if no file)</label>
                <input
                  type="text"
                  placeholder="https://…"
                  value={contentImage}
                  onChange={e => {
                    setContentImage(e.target.value);
                    if (e.target.value) setContentImagePreview(e.target.value);
                    else if (!contentImageRef.current?.files[0]) setContentImagePreview('');
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Excerpt / Summary *</label>
                <input type="text" placeholder="One-line summary for the feed card" value={contentExcerpt} onChange={e => setContentExcerpt(e.target.value)} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Full Content *</label>
                <textarea placeholder="Write the full article here…" value={contentBody} onChange={e => setContentBody(e.target.value)} className="form-textarea" style={{ minHeight: 180 }} required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" disabled={contentUploading}>
                  {contentUploading ? 'Saving…' : editingContent ? 'Save Changes' : 'Publish Article'}
                </button>
                {editingContent && <button type="button" className="btn btn-outline-blue" onClick={resetContentForm}>Cancel</button>}
              </div>
            </form>
          </div>
          <div className="card">
            <h3>Published Articles ({content.length})</h3>
            <div className="admin-list-scroll">
              {content.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No articles yet.</p>}
              {content.map(c => (
                <div key={c._id || c.id} className="admin-list-item">
                  {c.image
                    ? <img src={c.image} alt="" className="admin-thumb-img" />
                    : <div className="admin-thumb-img" style={{ background: 'var(--bg-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>article</span></div>
                  }
                  <div className="admin-item-details">
                    <h4>{c.title}</h4>
                    <span className="badge badge-info" style={{ fontSize: '0.62rem' }}>{c.type}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="btn btn-sm btn-outline-blue" onClick={() => handleEditContent(c)}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span></button>
                    <button className="btn btn-sm btn-danger" onClick={() => window.confirm('Delete this article?') && deleteContent(c._id || c.id)}><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PRAYERS TAB ─────────────────────────────────────────────────────────── */}
      {activeTab === 'Prayers' && (
        <div className="admin-panel animate-fade-in">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Prayer Wall Moderation</h3>
                <p className="form-sub-desc" style={{ margin: 0 }}>Approve, mark as praise reports, or remove requests.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Pending', 'Approved', 'Praise Report'].map(s => (
                  <button key={s} className={`tab-btn btn-sm ${prayerFilter === s ? 'active' : ''}`} onClick={() => setPrayerFilter(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {prayers.filter(p => p.status === prayerFilter).length === 0
                ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No "{prayerFilter}" requests.</p>
                : prayers.filter(p => p.status === prayerFilter).map(pr => (
                  <div key={pr._id || pr.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--primary-blue)' }}>{pr.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{pr.date}</span>
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1rem' }}>"{pr.text}"</p>
                    {pr.answer && (
                      <div style={{ background: 'rgba(22,163,74,0.06)', padding: '0.75rem', borderRadius: 6, border: '1px solid rgba(22,163,74,0.2)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                        <strong style={{ color: 'var(--success)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Praise Answer:</strong>
                        <p style={{ margin: '0.25rem 0 0' }}>{pr.answer}</p>
                      </div>
                    )}
                    {prayerFilter === 'Approved' && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input type="text" placeholder="Enter praise answer…" value={prayerAnswerText[pr._id || pr.id] || ''} onChange={e => setPrayerAnswerText(p => ({ ...p, [pr._id || pr.id]: e.target.value }))} className="form-input" style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }} />
                        <button className="btn btn-sm btn-primary" onClick={() => { const ans = prayerAnswerText[pr._id || pr.id] || ''; if (!ans.trim()) return alert('Enter an answer first.'); handlePrayerAction(pr._id || pr.id, 'Praise Report', ans); }}>Submit</button>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                      {prayerFilter === 'Pending' && <>
                        <button className="btn btn-sm btn-primary" onClick={() => handlePrayerAction(pr._id || pr.id, 'Approved')}>Approve</button>
                        <button className="btn btn-sm btn-outline-gold" onClick={() => { const a = window.prompt('Praise answer:'); if (a !== null) handlePrayerAction(pr._id || pr.id, 'Praise Report', a); }}>Mark Praise</button>
                      </>}
                      {prayerFilter !== 'Pending' && <button className="btn btn-sm btn-outline-blue" onClick={() => handlePrayerAction(pr._id || pr.id, 'Pending')}>Move to Pending</button>}
                      <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }} onClick={() => window.confirm('Delete this request?') && deletePrayerRequest(pr._id || pr.id)}>Delete</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ── LEDGER TAB ──────────────────────────────────────────────────────────── */}
      {activeTab === 'Ledger' && (
        <div className="admin-panel grid-2 animate-fade-in">
          <div className="card">
            <h3>Campaign Breakdown</h3>
            <p className="form-sub-desc">Funds raised per campaign.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {Object.keys(donationByCampaign).length === 0
                ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No donation data yet.</p>
                : Object.entries(donationByCampaign).map(([camp, total]) => (
                  <div key={camp}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--primary-blue)' }}>{camp}</strong>
                      <span style={{ color: 'var(--primary-gold)', fontWeight: 700 }}>₦{total.toLocaleString()}</span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: 6 }}>
                      <div className="progress-bar-fill" style={{ width: `${Math.min((total / (donations?.totalRaised || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="card">
            <h3>Recent Transactions</h3>
            <div className="admin-list-scroll" style={{ maxHeight: 360 }}>
              {(donations?.ledger || []).length === 0
                ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No transactions yet.</p>
                : (donations.ledger || []).map(d => (
                  <div key={d.id || d._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem', marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--primary-blue)' }}>{d.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.campaign} · {d.date}</p>
                    </div>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>+₦{(d.amount || 0).toLocaleString()}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-page { padding-bottom: 3rem; }
        .admin-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.75rem; padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border); flex-wrap: wrap; gap: 1rem;
        }
        .admin-tabs {
          display: flex; gap: 0.4rem; flex-wrap: wrap;
          margin-bottom: 2rem; border-bottom: 2px solid var(--glass-border); padding-bottom: 0.75rem;
        }
        .admin-tab-btn {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 600;
          background: #fff; border: 1.5px solid var(--bg-700);
          color: var(--text-secondary); border-radius: 30px; cursor: pointer;
          transition: var(--transition-fast); white-space: nowrap;
          font-family: var(--font-sans);
        }
        .admin-tab-btn:hover { color: var(--primary-blue); border-color: var(--primary-blue); }
        .admin-tab-btn.active {
          background: var(--primary-blue); color: #fff;
          border-color: var(--primary-blue); box-shadow: var(--blue-shadow);
        }
        .admin-panel { margin-top: 0.5rem; }
        .admin-list-scroll {
          max-height: 480px; overflow-y: auto;
          display: flex; flex-direction: column; gap: 0.75rem; padding-right: 0.25rem;
        }
        .admin-list-item {
          display: flex; align-items: center; gap: 1rem;
          background: var(--bg-800); border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-sm); padding: 0.75rem 1rem;
        }
        .admin-thumb-img {
          width: 52px; height: 52px; object-fit: cover;
          border-radius: 6px; border: 1px solid var(--glass-border); flex-shrink: 0;
        }
        .admin-item-details { flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.2rem; }
        .admin-item-details h4 { font-size: 0.88rem; color: var(--primary-blue); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .admin-item-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }
        .admin-item-actions .btn { padding: 0.35rem 0.5rem; }
        @media (max-width: 768px) {
          .admin-tabs { gap: 0.3rem; }
          .admin-tab-btn { font-size: 0.72rem; padding: 0.4rem 0.65rem; }
          .admin-tab-btn span:last-child { display: none; }
          .admin-tab-btn .material-symbols-outlined { font-size: '20px' !important; }
        }
      `}</style>
    </div>
  );
}
