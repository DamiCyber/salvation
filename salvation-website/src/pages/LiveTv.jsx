import React, { useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Hls from 'hls.js';
import { AppContext } from '../context/AppContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// ── HLS Video Player component ──────────────────────────────
function HlsPlayer({ src, title }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ liveSyncDurationCount: 3 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      video.src = src;
      video.play().catch(() => {});
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      title={title}
      style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}
    />
  );
}

export default function LiveTv() {
  const { streamState, sermons } = useContext(AppContext);

  // ── Chat state ────────────────────────────────────────────
  const [messages,    setMessages]    = useState([]);
  const [chatName,    setChatName]    = useState('');
  const [chatText,    setChatText]    = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [connected,   setConnected]   = useState(false);

  const socketRef  = useRef(null);
  const chatEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  // ── Connect Socket.io when stream is live ─────────────────
  useEffect(() => {
    if (!streamState.isLive) {
      // Disconnect if stream goes offline
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
        setMessages([]);
      }
      return;
    }

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Load chat history when joining
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    // Receive new messages in real time
    socket.on('chat_message', (msg) => {
      setMessages(prev => [...prev.slice(-49), msg]);
    });

    // Live viewer count
    socket.on('viewer_count', (count) => setViewerCount(count));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [streamState.isLive]);

  // ── Scroll chat box (NOT the page) to bottom ──────────────
  useEffect(() => {
    const box = chatBoxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages]);

  // ── Send a message ─────────────────────────────────────────
  const handleSend = (e) => {
    e.preventDefault();
    if (!chatText.trim() || !socketRef.current) return;

    socketRef.current.emit('chat_message', {
      name: chatName.trim() || 'Anonymous',
      text: chatText.trim(),
    });

    setChatText('');
  };

  const videoSermons = sermons.filter(s => s.type === 'Video');

  return (
    <div className="stream-page-container animate-fade-in">

      {/* ── LIVE STREAM ACTIVE ───────────────────────────────── */}
      {streamState.isLive ? (
        <section className="live-stream-active-section">
          <div className="stream-layout-grid">

            {/* Left: Video Player */}
            <div className="stream-player-col text-left">
              <div className="stream-player-wrapper">
                {streamState.streamUrl.includes('.m3u8') ? (
                  // OBS → RTMP → HLS player
                  <HlsPlayer src={streamState.streamUrl} title={streamState.streamTitle} />
                ) : (
                  // YouTube / external embed
                  <iframe
                    src={streamState.streamUrl + (streamState.streamUrl.includes('?') ? '&' : '?') + 'autoplay=1'}
                    title={streamState.streamTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="stream-under-details">
                <div className="stream-headline-row">
                  <span className="live-indicator">🔴 LIVE</span>
                  <h3>{streamState.streamTitle}</h3>
                </div>
                <p className="stream-desc-txt">
                  Join our global outreach community as we worship and study the Word. Submit prayer requests in chat or support our crusades below.
                </p>
                <div className="stream-actions">
                  <a href="#support" className="btn btn-primary">Support Crusades</a>
                  <a href="#prayer-programs" className="btn btn-outline-gold">Submit Prayer Need</a>
                </div>
              </div>
            </div>

            {/* Right: Real-time Chat */}
            <div className="stream-chat-col card">
              <div className="chat-header">
                <div>
                  <h4>Live Chat</h4>
                  <span className={`conn-dot ${connected ? 'conn-online' : 'conn-offline'}`}>
                    {connected ? '● Connected' : '○ Connecting…'}
                  </span>
                </div>
                <span className="active-users-count">👥 {viewerCount} watching</span>
              </div>

              {/* Messages */}
              <div className="chat-messages-container" ref={chatBoxRef}>
                {messages.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', marginTop: '1rem' }}>
                    Be the first to say something!
                  </p>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className="chat-message-bubble">
                    <span className="chat-time">{msg.time}</span>
                    <span className={`chat-author ${msg.isStaff ? 'staff-author' : ''}`}>
                      {msg.name}
                      {msg.isStaff && <span className="staff-tag">Admin</span>}:
                    </span>
                    <span className="chat-content-text"> {msg.text}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={chatName}
                  onChange={e => setChatName(e.target.value)}
                  className="form-input chat-name-input"
                  maxLength={30}
                />
                <div className="chat-msg-row">
                  <input
                    type="text"
                    placeholder="Type a message or prayer…"
                    value={chatText}
                    onChange={e => setChatText(e.target.value)}
                    className="form-input chat-text-input"
                    required
                    maxLength={300}
                  />
                  <button type="submit" className="btn btn-primary chat-send-btn" disabled={!connected}>
                    Send
                  </button>
                </div>
              </form>
            </div>

          </div>
        </section>

      ) : (
        /* ── OFFLINE LAYOUT ──────────────────────────────────── */
        <section className="live-stream-offline-section animate-fade-in text-center">

          <div className="offline-hero card">
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>sensors_off</span>
            <h2>No Live Broadcast Right Now</h2>
            <p className="offline-notice" style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              The next broadcast will be announced soon. Subscribe to our newsletter or follow us on social media to be notified when we go live.
            </p>

            {/* How-to note for the admin */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <a href="#support" className="btn btn-primary">Partner with Us</a>
              <a href="#contact" className="btn btn-outline-blue">Stay Notified</a>
            </div>
          </div>

          {/* Archived Video Sermons */}
          <div className="archived-sermons-section text-left">
            <h3 className="section-title">Archived Video Sermons</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Missed a broadcast? Browse our library of past teachings and crusade videos on demand.
            </p>
            <div className="grid-2">
              {videoSermons.length === 0 ? (
                <p>No video sermons in the archive yet.</p>
              ) : (
                videoSermons.map(serm => (
                  <div key={serm.id} className="card video-archive-card">
                    <div className="video-iframe-wrapper">
                      <iframe
                        src={serm.url}
                        title={serm.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="archive-details" style={{ marginTop: '1rem' }}>
                      <span className="sermon-meta-info">{serm.date} • {serm.duration}</span>
                      <h4 style={{ color: 'var(--primary-blue)', marginTop: '0.25rem' }}>{serm.title}</h4>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', margin: 0 }}>{serm.notes}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>
      )}

      <style>{`
        .stream-page-container { margin-bottom: 2rem; }

        /* Active stream grid */
        .stream-layout-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        .stream-player-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }
        .stream-player-wrapper iframe {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border: none;
        }
        .stream-under-details { margin-top: 1.5rem; }
        .stream-headline-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
        .stream-headline-row h3 { font-size: 1.4rem; color: var(--primary-blue); margin: 0; }
        .stream-desc-txt { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; }
        .stream-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        /* Chat panel */
        .stream-chat-col {
          display: flex;
          flex-direction: column;
          height: 560px;
          padding: 1.25rem;
          background: #0d1321;
          position: sticky;
          top: 80px;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .chat-header h4 { font-size: 1rem; color: white; margin: 0 0 0.2rem; }
        .conn-dot { font-size: 0.7rem; font-weight: 600; }
        .conn-online  { color: #4ade80; }
        .conn-offline { color: var(--text-muted); }
        .active-users-count { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }

        .chat-messages-container {
          flex-grow: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-right: 0.25rem;
          margin-bottom: 0.75rem;
          overscroll-behavior: contain;
        }
        .chat-message-bubble {
          font-size: 0.83rem;
          line-height: 1.4;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 0.45rem 0.7rem;
          border-radius: var(--border-radius-sm);
          word-break: break-word;
        }
        .chat-time   { font-size: 0.68rem; color: var(--text-muted); margin-right: 0.4rem; }
        .chat-author { font-weight: 700; color: var(--primary-gold); margin-right: 0.3rem; }
        .staff-author { color: #ef4444; }
        .staff-tag {
          background: #ef4444; color: white;
          font-size: 0.6rem; padding: 0.05rem 0.25rem;
          border-radius: 3px; margin-left: 0.25rem; font-weight: 700;
        }
        .chat-content-text { color: #e5e7eb; }

        .chat-input-form { display: flex; flex-direction: column; gap: 0.4rem; }
        .chat-name-input  { padding: 0.4rem 0.7rem; font-size: 0.8rem; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
        .chat-name-input::placeholder { color: #64748b; }
        .chat-msg-row  { display: flex; gap: 0.4rem; }
        .chat-text-input { padding: 0.45rem 0.7rem; font-size: 0.85rem; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
        .chat-text-input::placeholder { color: #64748b; }
        .chat-send-btn { padding: 0.45rem 0.9rem; font-size: 0.8rem; flex-shrink: 0; }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Offline */
        .offline-hero {
          max-width: 700px;
          margin: 0 auto 4rem;
          padding: 4rem 2rem;
        }
        .youtube-live-note {
          background: rgba(26,58,107,0.06);
          border: 1px solid var(--glass-border);
          border-radius: 6px;
          padding: 0.85rem 1.25rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          max-width: 520px;
          margin: 0 auto;
          text-align: left;
          line-height: 1.6;
        }
        .youtube-live-note code {
          background: var(--bg-800);
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
          font-size: 0.8rem;
          color: var(--primary-blue);
        }
        .youtube-live-note a { color: var(--primary-blue); font-weight: 600; }

        .video-archive-card { padding: 1rem; }
        .video-iframe-wrapper {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }
        .video-iframe-wrapper iframe {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border: none;
        }
        .sermon-meta-info {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary-gold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .stream-layout-grid { grid-template-columns: 1fr; }
          .stream-chat-col { height: 380px; position: static; }
        }
      `}</style>

    </div>
  );
}
