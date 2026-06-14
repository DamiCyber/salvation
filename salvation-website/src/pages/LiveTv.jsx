import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

export default function LiveTv() {
  const { streamState, sermons } = useContext(AppContext);
  const [chatMessages, setChatMessages] = useState([]);
  const [userChatText, setUserChatText] = useState('');
  const chatEndRef = useRef(null);

  // Predefined list of mock chatters & messages to cycle through during live stream
  const mockChatters = [
    { name: "John Adams", msg: "Amen! Praying from Chicago!" },
    { name: "Sister Clara", msg: "Thank you Lord for your healing power. Glory to God!" },
    { name: "Pastor James", msg: "Wonderful message. The harvest is indeed white." },
    { name: "Mary Martinez", msg: "Please pray for my mother's health, she is in the hospital." },
    { name: "Ezekiel K.", msg: "Lord, touch our villages. Send more workers!" },
    { name: "Elizabeth Chen", msg: "The audio is clear. Praying from Singapore." },
    { name: "Brother Thomas", msg: "Such a powerful word on radical obedience today." },
    { name: "Sarah G.", msg: "My heart is breaking. I surrender my plans to Jesus tonight." },
    { name: "Anonymous", msg: "Praise report: I was healed of knee pain last crusade!" }
  ];

  // Simulating live chat messages rolling in
  useEffect(() => {
    if (!streamState.isLive) {
      setChatMessages([]);
      return;
    }

    // Seed initial messages
    setChatMessages([
      { id: 'm1', name: "Evangelist Daniel", msg: "Welcome to the broadcast! Post your prayer requests in chat.", isStaff: true, time: "10:00 AM" },
      { id: 'm2', name: "Ruth Peterson", msg: "Looking forward to the sermon!", isStaff: false, time: "10:01 AM" }
    ]);

    const interval = setInterval(() => {
      const randomChat = mockChatters[Math.floor(Math.random() * mockChatters.length)];
      const newMsg = {
        id: 'msg-' + Date.now() + Math.random(),
        name: randomChat.name,
        msg: randomChat.msg,
        isStaff: false,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev.slice(-30), newMsg]); // Keep last 30 messages
    }, 4000); // Roll in a message every 4 seconds

    return () => clearInterval(interval);
  }, [streamState.isLive]);

  // Scroll chat container to bottom (not the whole page)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!userChatText.trim()) return;

    const userMsg = {
      id: 'user-msg-' + Date.now(),
      name: "You (Partner)",
      msg: userChatText,
      isStaff: false,
      isUser: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserChatText('');
  };

  const videoSermons = sermons.filter(s => s.type === 'Video');

  return (
    <div className="stream-page-container animate-fade-in">
      
      {/* Live Stream Active Layout */}
      {streamState.isLive ? (
        <section className="live-stream-active-section">
          
          <div className="stream-layout-grid">
            
            {/* Left Column: Stream Video Player */}
            <div className="stream-player-col text-left">
              <div className="stream-player-wrapper">
                <iframe
                  src={streamState.streamUrl}
                  title={streamState.streamTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="stream-under-details">
                <div className="stream-headline-row">
                  <span className="live-indicator">🔴 LIVE</span>
                  <h3>{streamState.streamTitle}</h3>
                </div>
                <p className="stream-desc-txt">
                  Join our global outreach community as we worship and study the Word of God. Submit your prayer requests directly in the chat, or click the support button to plant a seed into our outreach crusades.
                </p>
                <div className="stream-actions">
                  <a href="#support" className="btn btn-primary">Support Crusades</a>
                  <a href="#support" className="btn btn-outline-gold">Submit Prayer Need</a>
                </div>
              </div>
            </div>

            {/* Right Column: Live Chat Panel */}
            <div className="stream-chat-col card">
              <div className="chat-header">
                <h4>Live Broadcast Chat</h4>
                <span className="active-users-count">👥 142 watching</span>
              </div>
              
              <div className="chat-messages-container">
                {chatMessages.map(c => (
                  <div key={c.id} className={`chat-message-bubble ${c.isUser ? 'user-chat-bubble' : ''}`}>
                    <span className="chat-time">{c.time}</span>
                    <span className={`chat-author ${c.isStaff ? 'staff-author' : ''}`}>
                      {c.name}
                      {c.isStaff && <span className="staff-tag">Admin</span>}:
                    </span>
                    <span className="chat-content-text">{c.msg}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendChat} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Type a message or prayer..."
                  value={userChatText}
                  onChange={(e) => setUserChatText(e.target.value)}
                  className="form-input chat-text-input"
                  required
                />
                <button type="submit" className="btn btn-primary chat-send-btn">
                  Send
                </button>
              </form>
            </div>

          </div>

        </section>
      ) : (
        /* Stream Offline Layout */
        <section className="live-stream-offline-section animate-fade-in text-center">
          
          <div className="offline-hero card">
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>sensors_off</span>
            <h2>No Live Broadcast Right Now</h2>
            <p className="offline-notice" style={{ maxWidth: '480px', margin: '0 auto 2rem' }}>
              The next broadcast schedule will be announced soon. Subscribe to our newsletter or follow us on social media to be notified when we go live.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#support" className="btn btn-primary">Partner with Us</a>
              <a href="#contact" className="btn btn-outline-blue">Stay Notified</a>
            </div>
          </div>

          {/* Archived Video Sermons */}
          <div className="archived-sermons-section text-left">
            <h3 className="section-title">Archived Video Sermons</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Missed a broadcast? Browse our library of past teachings and crusade videos on demand.</p>
            
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
                      ></iframe>
                    </div>
                    <div className="archive-details" style={{ marginTop: '1rem' }}>
                      <span className="sermon-meta-info">{serm.date} • {serm.duration}</span>
                      <h4 style={{ color: 'white', marginTop: '0.25rem' }}>{serm.title}</h4>
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
        .stream-page-container {
          margin-bottom: 2rem;
        }
        
        /* Active Stream Styles */
        .stream-layout-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 2rem;
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
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .stream-under-details {
          margin-top: 1.5rem;
        }
        .stream-headline-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .stream-headline-row h3 {
          font-size: 1.4rem;
          color: white;
          margin: 0;
        }
        .stream-desc-txt {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .stream-actions {
          display: flex;
          gap: 1rem;
        }

        /* Chat Styles */
        .stream-chat-col {
          display: flex;
          flex-direction: column;
          height: 550px;
          padding: 1.25rem;
          background-color: #0d1321;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
          text-align: left;
        }
        .chat-header h4 {
          font-family: var(--font-sans);
          font-size: 1rem;
          color: white;
        }
        .active-users-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .chat-messages-container {
          flex-grow: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding-right: 0.25rem;
          text-align: left;
          margin-bottom: 1rem;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
        .chat-message-bubble {
          font-size: 0.85rem;
          line-height: 1.4;
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0.5rem 0.75rem;
          border-radius: var(--border-radius-sm);
        }
        .user-chat-bubble {
          background-color: rgba(212, 175, 55, 0.06);
          border-color: rgba(212, 175, 55, 0.15);
        }
        .chat-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-right: 0.5rem;
        }
        .chat-author {
          font-weight: 700;
          color: var(--primary-gold);
          margin-right: 0.4rem;
        }
        .staff-author {
          color: #ef4444;
        }
        .staff-tag {
          background-color: #ef4444;
          color: white;
          font-size: 0.65rem;
          padding: 0.05rem 0.25rem;
          border-radius: 3px;
          margin-left: 0.25rem;
          font-weight: 700;
        }
        .chat-content-text {
          color: #e5e7eb;
        }
        .chat-input-form {
          display: flex;
          gap: 0.5rem;
        }
        .chat-text-input {
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
        }
        .chat-send-btn {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
        }

        /* Offline Styles */
        .offline-hero {
          max-width: 700px;
          margin: 0 auto 4rem;
          padding: 4rem 2rem;
          background: radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent), var(--glass-bg);
        }
        .offline-emoji {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 1rem;
          color: var(--text-secondary);
        }
        .offline-notice {
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .countdown-box {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          background-color: var(--bg-800);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-sm);
          padding: 0.75rem;
        }
        .count-num {
          font-size: 1.8rem;
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--primary-gold);
          line-height: 1.2;
        }
        .count-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .video-archive-card {
          padding: 1rem;
        }

        @media (max-width: 900px) {
          .stream-layout-grid {
            grid-template-columns: 1fr;
          }
          .stream-chat-col {
            height: 400px;
          }
        }
      `}</style>

    </div>
  );
}
