import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const aboutLinks = [
    { name: 'About the Ministry', hash: '#about' },
    { name: 'Mission & Vision', hash: '#about' },
    { name: 'Our Team', hash: '#team' },
    { name: 'Ministry Projects', hash: '#about' },
    { name: 'Events Calendar', hash: '#about' },
  ];

  const ministriesLinks = [
    { name: 'Bible School', hash: '#bible-school' },
    { name: 'Prayer Programs', hash: '#prayer-programs' },
    { name: 'Counseling Services', hash: '#counseling' },
    { name: 'Live TV & Radio', hash: '#live-tv' },
    { name: 'Frequently Asked Questions', hash: '#faq' },
  ];

  const resourceLinks = [
    { name: 'Publications & Books', hash: '#publications' },
    { name: 'Photo Gallery', hash: '#gallery' },
    { name: 'Video Sermons', hash: '#videos' },
    { name: 'Field Updates', hash: '#updates' },
    { name: 'Support the Mission', hash: '#support' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', hash: '#privacy' },
    { name: 'Terms of Use', hash: '#terms' },
    { name: 'Donation Policy', hash: '#donation-policy' },
    { name: 'Contact Us', hash: '#contact' },
  ];

  return (
    <footer className="site-footer font-sans">

      {/* Main Footer Grid */}
      <div className="footer-main">

        {/* Col 1: Brand */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img
              src="https://res.cloudinary.com/dhoqtwst9/image/upload/v1781277989/salvation-removebg-preview_z2vplu.png"
              alt="Salvation Series World Outreach"
              className="footer-logo-img"
            />
          </div>
          <p className="footer-tagline">
            "Go ye therefore, and teach all nations..." — Matthew 28:19
          </p>
          <p className="footer-desc">
            Spreading the gospel of Jesus Christ across the nations through crusades,
            church planting, clean water initiatives, and biblical education.
          </p>
          {/* Social Icons — SVG brand icons */}
          <div className="social-row" role="list">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" title="Facebook" aria-label="Facebook" role="listitem">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="social-icon" title="TikTok" aria-label="TikTok" role="listitem">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" title="Instagram" aria-label="Instagram" role="listitem">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" title="YouTube" aria-label="YouTube" role="listitem">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0f2035"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: About */}
        <div className="footer-col">
          <h4 className="footer-col-title">About</h4>
          <ul className="footer-links">
            {aboutLinks.map(link => (
              <li key={link.name}>
                <a href={link.hash}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Ministries */}
        <div className="footer-col">
          <h4 className="footer-col-title">Ministries</h4>
          <ul className="footer-links">
            {ministriesLinks.map(link => (
              <li key={link.name}>
                <a href={link.hash}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Resources */}
        <div className="footer-col">
          <h4 className="footer-col-title">Resources</h4>
          <ul className="footer-links">
            {resourceLinks.map(link => (
              <li key={link.name}>
                <a href={link.hash}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 5: Legal + Newsletter */}
        <div className="footer-col">
          <h4 className="footer-col-title">Legal</h4>
          <ul className="footer-links" style={{ marginBottom: '2rem' }}>
            {legalLinks.map(link => (
              <li key={link.name}>
                <a href={link.hash}>{link.name}</a>
              </li>
            ))}
          </ul>

          <h4 className="footer-col-title">Newsletter</h4>
          <p className="footer-newsletter-desc">Get mission updates in your inbox.</p>
          {subscribed ? (
            <div className="footer-subscribed-msg">✅ Thank you for subscribing!</div>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-email-input"
                required
                aria-label="Newsletter email address"
              />
              <button type="submit" className="footer-subscribe-btn">Subscribe</button>
            </form>
          )}
        </div>

      </div>

      {/* Contact Row */}
      <div className="footer-contact-row">
        <div className="footer-contact-inner">
          <div className="footer-contact-item">
            <span className="material-symbols-outlined footer-contact-icon">location_on</span>
            <span>Orile Ilugun, Opp. Adeaga Poultry, Abeokuta-Ibadan Expressway, Abeokuta, Ogun State</span>
          </div>
          <div className="footer-contact-item">
            <span className="material-symbols-outlined footer-contact-icon">call</span>
            <span>+234 802 367 0737 &nbsp;|&nbsp; +234 815 854 8307 &nbsp;|&nbsp; +234 815 854 8322</span>
          </div>
          <div className="footer-contact-item">
            <span className="material-symbols-outlined footer-contact-icon">mail</span>
            <span>contact@salvationoutreach.org</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Salvation Series World Outreach. All rights reserved.
          </p>
          <div className="footer-legal-row">
            <a href="#privacy">Privacy Policy</a>
            <span className="footer-divider">·</span>
            <a href="#terms">Terms of Use</a>
            <span className="footer-divider">·</span>
            <a href="#donation-policy">Donation Policy</a>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #0f2035;
          color: #94a3b8;
          margin-top: auto;
        }

        /* Main footer grid */
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr 1.4fr;
          gap: 2.5rem;
          text-align: left;
        }

        .footer-col {}
        .brand-col {}

        .footer-logo { margin-bottom: 1rem; }
        .footer-logo-img {
          height: 60px;
          width: auto;
          object-fit: contain;
          display: block;
          filter: brightness(0) invert(1);
        }
        .footer-tagline {
          font-family: var(--font-serif);
          font-size: 0.9rem;
          font-style: italic;
          color: var(--primary-gold);
          margin-bottom: 0.75rem;
        }
        .footer-desc {
          font-size: 0.84rem;
          line-height: 1.65;
          color: #7a8fa6;
          margin-bottom: 1.25rem;
        }

        /* Social icons */
        .social-row {
          display: flex;
          gap: 0.6rem;
        }
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          font-size: 0.95rem;
          transition: var(--transition-fast);
          text-decoration: none;
        }
        .social-icon:hover {
          background: rgba(201, 151, 62, 0.15);
          border-color: var(--primary-gold);
          transform: translateY(-2px);
        }

        /* Column titles */
        .footer-col-title {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1.1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        /* Link lists */
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links a {
          color: #7a8fa6;
          font-size: 0.84rem;
          transition: var(--transition-fast);
          text-decoration: none;
          display: block;
        }
        .footer-links a:hover {
          color: #fff;
          padding-left: 4px;
        }

        /* Newsletter */
        .footer-newsletter-desc {
          font-size: 0.8rem;
          color: #7a8fa6;
          margin-bottom: 0.75rem;
        }
        .footer-newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-email-input {
          width: 100%;
          padding: 0.6rem 0.9rem;
          border-radius: var(--border-radius-sm);
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-size: 0.84rem;
          font-family: var(--font-sans);
          transition: var(--transition-fast);
        }
        .footer-email-input::placeholder { color: #7a8fa6; }
        .footer-email-input:focus {
          outline: none;
          border-color: var(--primary-gold);
          background: rgba(255,255,255,0.08);
        }
        .footer-subscribe-btn {
          width: 100%;
          padding: 0.6rem;
          background: var(--primary-gold);
          color: #fff;
          border: none;
          border-radius: var(--border-radius-sm);
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .footer-subscribe-btn:hover {
          background: var(--gold-hover);
          transform: translateY(-1px);
        }
        .footer-subscribed-msg {
          font-size: 0.82rem;
          color: #4ade80;
          padding: 0.6rem 0.9rem;
          background: rgba(74, 222, 128, 0.08);
          border: 1px solid rgba(74, 222, 128, 0.2);
          border-radius: var(--border-radius-sm);
        }

        /* Contact row */
        .footer-contact-row {
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-contact-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #7a8fa6;
        }
        .footer-contact-icon { font-size: 1.1rem; color: var(--primary-gold); flex-shrink: 0; }

        /* Bottom bar */
        .footer-bottom {
          background: #060e1a;
          border-top: 1px solid rgba(255,255,255,0.04);
          padding: 1.25rem 0;
        }
        .footer-bottom-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer-copyright {
          font-size: 0.78rem;
          color: #64748b;
          margin: 0;
        }
        .footer-legal-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .footer-legal-row a {
          font-size: 0.78rem;
          color: #64748b;
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .footer-legal-row a:hover { color: #fff; }
        .footer-divider { color: #334155; font-size: 0.7rem; }

        @media (max-width: 1100px) {
          .footer-main { grid-template-columns: 1fr 1fr 1fr; }
          .brand-col { grid-column: span 3; }
        }
        @media (max-width: 640px) {
          .footer-main { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .brand-col { grid-column: span 2; }
          .footer-contact-inner { flex-direction: column; align-items: flex-start; }
          .footer-bottom-inner { flex-direction: column; text-align: center; }
          .footer-legal-row { justify-content: center; }
        }
      `}</style>
    </footer>
  );
}
