import React, { useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { AppContext } from '../context/AppContext';

const SOCKET_URL  = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const ZEGO_APP_ID = 283892766;
const ZEGO_SECRET = 'c62fd50e10ca57da3dcb2a6d2db9ed56'; // ServerSecret for generateKitTokenForTest
const ZEGO_ROOM   = 'salvation-live';

function randomID(len = 5) {
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  let r = '';
  for (let i = 0; i < len; i++) r += chars.charAt(Math.floor(Math.random() * chars.length));
  return r;
}

function normalizeStreamUrl(url) {
  if (!url) return url;
  if (url.includes('facebook.com/plugins/video.php')) return url;
  if (url.includes('facebook.com') && (url.includes('/videos/') || url.includes('share/v/'))) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560&autoplay=true`;
  }
  return url;
}

export default function LiveTv() {
  const { streamState, sermons } = useContext(AppContext);

  // ── Real-time chat ────────────────────────────────────────
  const [messages,    setMessages]    = useState([]);
  const [chatName,    setChatName]    = useState('');
  const [chatText,    setChatText]    = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [connected,   setConnected]   = useState(false);
  const socketRef  = useRef(null);
  const chatBoxRef = useRef(null);

  // ── ZegoCloud ─────────────────────────────────────────────
  const zegoRef = useRef(null);
  const isZego  = streamState.isLive && (!streamState.streamUrl || streamState.streamUrl === 'zego');

  // Callback ref — fires the instant the div is in the DOM
  const zegoContainerRef = (element) => {
    if (!element || zegoRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      ZEGO_APP_ID,
      ZEGO_SECRET,
      ZEGO_ROOM,
      randomID(6),
      'Viewer-' + randomID(3),
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zegoRef.current = zp;

    zp.joinRoom({
      container: element,
      scenario:  {
        mode:   ZegoUIKitPrebuilt.LiveStreaming,
        config: { role: ZegoUIKitPrebuilt.Audience },
      },
      showUserList:               false,
      showPreJoinView:            false,
      showTextChat:               false,
      showLeaveRoomConfirmDialog: false,
    });
  };

  useEffect(() => () => { zegoRef.current?.destroy?.(); zegoRef.current = null; }, []);

  // ── Socket.io chat ────────────────────────────────────────
  useEffect(() => {
    if (!streamState.isLive) {
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
      setConnected(false); setMessages([]);
      return;
    }
    const t = setTimeout(() => {
      const s = io(SOCKET_URL, { transports: ['websocket', 'polling'], reconnectionAttempts: 5 });
      socketRef.current = s;
      s.on('connect',       ()    => setConnected(true));
      s.on('disconnect',    ()    => setConnected(false));
      s.on('connect_error', ()    => setConnected(false));
      s.on('chat_history',  (h)   => setMessages(h));
      s.on('chat_message',  (msg) => setMessages(prev => [...prev.slice(-49), msg]));
      s.on('viewer_count',  (n)   => setViewerCount(n));
    }, 300);
    return () => {
      clearTimeout(t);
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
    };
  }, [streamState.isLive]);

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatText.trim() || !socketRef.current) return;
    socketRef.current.emit('chat_message', { name: chatName.trim() || 'Anonymous', text: chatText.trim() });
    setChatText('');
  };

  const videoSermons = sermons.filter(s => s.type === 'Video');
  const isUrlStream  = streamState.isLive && streamState.streamUrl && streamState.streamUrl !== 'zego' && streamState.streamUrl.startsWith('http');

  return (
    <div className="stream-page-container animate-fade-in">

      {/* ── LIVE ─────────────────────────────────────────────── */}
      {streamState.isLive ? (
        <section className="live-stream-active-section">
          <div className="stream-layout-grid">

            {/* Player */}
            <div className="stream-player-col text-left">
              <div className="stream-player-wrapper">
                {isZego ? (
                  <div ref={zegoContainerRef} style={{ width: '100%', height: '100%', background: '#000' }} />
                ) : isUrlStream ? (
                  <iframe
                    src={normalizeStreamUrl(streamState.streamUrl)}
                    title={streamState.streamTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0d1321', color: '#94a3b8', flexDirection: 'column', gap: '0.75rem', padding: '2rem', textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#ef4444' }}>error</span>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>No stream configured. Go to Admin → Livestream and set the Embed URL.</p>
                  </div>
                )}
              </div>

              <div className="stream-under-details">
                <div className="stream-headline-row">
                  <span className="live-indicator">🔴 LIVE</span>
                  <h3>{streamState.streamTitle}</h3>
                </div>
                <p className="stream-desc-txt">Join our global outreach community as we worship and study the Word.</p>
                <div className="stream-actions">
                  <a href="#support" className="btn btn-primary">Support Crusades</a>
                  <a href="#prayer-programs" className="btn btn-outline-gold">Submit Prayer Need</a>
                </div>
              </div>
            </div>

            {/* Chat */}
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
              <div className="chat-messages-container" ref={chatBoxRef}>
                {messages.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', marginTop: '1rem' }}>Be the first to say something!</p>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className="chat-message-bubble">
                    <span className="chat-time">{msg.time}</span>
                    <span className={`chat-author ${msg.isStaff ? 'staff-author' : ''}`}>
                      {msg.name}{msg.isStaff && <span className="staff-tag">Admin</span>}:
                    </span>
                    <span className="chat-content-text"> {msg.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="chat-input-form">
                <input type="text" placeholder="Your name (optional)" value={chatName} onChange={e => setChatName(e.target.value)} className="form-input chat-name-input" maxLength={30} />
                <div className="chat-msg-row">
                  <input type="text" placeholder="Type a message or prayer…" value={chatText} onChange={e => setChatText(e.target.value)} className="form-input chat-text-input" required maxLength={300} />
                  <button type="submit" className="btn btn-primary chat-send-btn" disabled={!connected}>Send</button>
                </div>
              </form>
            </div>

          </div>
        </section>

      ) : (
        /* ── OFFLINE ─────────────────────────────────────────── */
        <section className="live-stream-offline-section animate-fade-in text-center">
          <div className="offline-hero card">
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>sensors_off</span>
            <h2>No Live Broadcast Right Now</h2>
            <p style={{ maxWidth: '480px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
              The next broadcast will be announced soon. Subscribe or follow us on social media to be notified.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#support" className="btn btn-primary">Partner with Us</a>
              <a href="#contact" className="btn btn-outline-blue">Stay Notified</a>
            </div>
          </div>

          <div className="archived-sermons-section text-left">
            <h3 className="section-title">Archived Video Sermons</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Missed a broadcast? Browse our library of past teachings on demand.</p>
            <div className="grid-2">
              {videoSermons.length === 0 ? <p>No video sermons yet.</p> : videoSermons.map(serm => (
                <div key={serm.id} className="card video-archive-card">
                  <div className="video-iframe-wrapper">
                    <iframe src={serm.url} title={serm.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <span className="sermon-meta-info">{serm.date} • {serm.duration}</span>
                    <h4 style={{ color: 'var(--primary-blue)', marginTop: '0.25rem' }}>{serm.title}</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>{serm.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .stream-page-container { margin-bottom: 2rem; }
        .stream-layout-grid { display: grid; grid-template-columns: 2.2fr 1fr; gap: 2rem; align-items: start; }
        .stream-player-wrapper { position: relative; padding-bottom: 56.25%; height: 0; border-radius: var(--border-radius-md); overflow: hidden; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
        .stream-player-wrapper iframe, .stream-player-wrapper > div { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        .stream-under-details { margin-top: 1.5rem; }
        .stream-headline-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
        .stream-headline-row h3 { font-size: 1.4rem; color: var(--primary-blue); margin: 0; }
        .stream-desc-txt { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; }
        .stream-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .stream-chat-col { display: flex; flex-direction: column; height: 560px; padding: 1.25rem; background: #0d1321; position: sticky; top: 80px; }
        .chat-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem; margin-bottom: 0.75rem; }
        .chat-header h4 { font-size: 1rem; color: white; margin: 0 0 0.2rem; }
        .conn-dot { font-size: 0.7rem; font-weight: 600; }
        .conn-online { color: #4ade80; }
        .conn-offline { color: var(--text-muted); }
        .active-users-count { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); }
        .chat-messages-container { flex-grow: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 0.6rem; padding-right: 0.25rem; margin-bottom: 0.75rem; overscroll-behavior: contain; }
        .chat-message-bubble { font-size: 0.83rem; line-height: 1.4; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 0.45rem 0.7rem; border-radius: var(--border-radius-sm); word-break: break-word; }
        .chat-time { font-size: 0.68rem; color: var(--text-muted); margin-right: 0.4rem; }
        .chat-author { font-weight: 700; color: var(--primary-gold); margin-right: 0.3rem; }
        .staff-author { color: #ef4444; }
        .staff-tag { background: #ef4444; color: white; font-size: 0.6rem; padding: 0.05rem 0.25rem; border-radius: 3px; margin-left: 0.25rem; font-weight: 700; }
        .chat-content-text { color: #e5e7eb; }
        .chat-input-form { display: flex; flex-direction: column; gap: 0.4rem; }
        .chat-name-input { padding: 0.4rem 0.7rem; font-size: 0.8rem; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
        .chat-name-input::placeholder { color: #64748b; }
        .chat-msg-row { display: flex; gap: 0.4rem; }
        .chat-text-input { padding: 0.45rem 0.7rem; font-size: 0.85rem; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
        .chat-text-input::placeholder { color: #64748b; }
        .chat-send-btn { padding: 0.45rem 0.9rem; font-size: 0.8rem; flex-shrink: 0; }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .offline-hero { max-width: 700px; margin: 0 auto 4rem; padding: 4rem 2rem; }
        .video-archive-card { padding: 1rem; }
        .video-iframe-wrapper { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 6px; overflow: hidden; border: 1px solid var(--glass-border); }
        .video-iframe-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        .sermon-meta-info { font-size: 0.75rem; font-weight: 600; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 0.05em; }
        @media (max-width: 900px) { .stream-layout-grid { grid-template-columns: 1fr; } .stream-chat-col { height: 380px; position: static; } }
      `}</style>

    </div>
  );
}
