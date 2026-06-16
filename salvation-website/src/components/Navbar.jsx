import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navbar({ currentHash }) {
  const { streamState, isAdminLoggedIn, logoutAdmin } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [ministriesDropdownOpen, setMinistriesDropdownOpen] = useState(false);

  const mediaLinks = [
    { name: 'Photo Gallery', hash: '#gallery' },
    { name: 'Video Sermons', hash: '#videos' },
  ];

  const ministriesLinks = [
    { name: 'Bible School', hash: '#bible-school' },
    { name: 'Prayer Programs', hash: '#prayer-programs' },
    { name: 'Counseling', hash: '#counseling' },
    { name: 'Books & Publications', hash: '#publications' },
    { name: 'FAQ', hash: '#faq' },
    { name: 'Team', hash: '#team' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setMediaDropdownOpen(false);
    setMinistriesDropdownOpen(false);
  };

  const isMediaActive = ['#gallery', '#videos'].includes(currentHash);
  const isMinActive = ['#bible-school', '#prayer-programs', '#counseling', '#faq', '#team'].includes(currentHash);

  return (
    <header className="navbar-header">
      <div className="navbar-container">

        {/* Brand Logo */}
        <a href="#home" className="nav-logo" onClick={handleLinkClick}>
          <img
            src="https://res.cloudinary.com/dhoqtwst9/image/upload/v1781277989/salvation-removebg-preview_z2vplu.png"
            alt="Salvation Series World Outreach"
            className="nav-logo-img"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-menu-desktop font-sans" role="navigation" aria-label="Main navigation">

          <a href="#home" className={`nav-link ${currentHash === '#home' ? 'active' : ''}`}>
            Home
          </a>

          <a href="#about" className={`nav-link ${currentHash === '#about' ? 'active' : ''}`}>
            About
          </a>

          {/* Media Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setMediaDropdownOpen(true)}
            onMouseLeave={() => setMediaDropdownOpen(false)}
          >
            <button
              className={`nav-link dropdown-toggle ${isMediaActive ? 'active' : ''}`}
              aria-haspopup="true"
              aria-expanded={mediaDropdownOpen}
            >
              Media ▾
            </button>
            {mediaDropdownOpen && (
              <div className="dropdown-menu animate-fade-in" role="menu">
                {mediaLinks.map(link => (
                  <a key={link.hash} href={link.hash} className="dropdown-item" onClick={handleLinkClick} role="menuitem">
                    {link.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Ministries Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setMinistriesDropdownOpen(true)}
            onMouseLeave={() => setMinistriesDropdownOpen(false)}
          >
            <button
              className={`nav-link dropdown-toggle ${isMinActive ? 'active' : ''}`}
              aria-haspopup="true"
              aria-expanded={ministriesDropdownOpen}
            >
              Ministries ▾
            </button>
            {ministriesDropdownOpen && (
              <div className="dropdown-menu animate-fade-in" role="menu">
                {ministriesLinks.map(link => (
                  <a key={link.hash} href={link.hash} className="dropdown-item" onClick={handleLinkClick} role="menuitem">
                    {link.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#updates" className={`nav-link ${currentHash === '#updates' ? 'active' : ''}`}>
            Updates
          </a>

          <a href="#contact" className={`nav-link ${currentHash === '#contact' ? 'active' : ''}`}>
            Contact
          </a>

          {/* Live TV pill */}
          {streamState.isLive ? (
            <a href="#live-tv" className="live-pill-btn" aria-label="Watch Live TV" onClick={handleLinkClick}>
              <span className="live-dot-blink" aria-hidden="true">●</span> LIVE TV
            </a>
          ) : (
            <a href="#live-tv" className={`nav-link stream-link-btn ${currentHash === '#live-tv' ? 'active' : ''}`} onClick={handleLinkClick}>
              Live TV
            </a>
          )}

          {/* Donate CTA button */}
          <a href="#support" className="btn btn-secondary nav-donate-btn" onClick={handleLinkClick}>
            Donate
          </a>

          {/* Admin icon */}
          {isAdminLoggedIn ? (
            <a href="#admin" className="nav-btn-action admin-btn" onClick={handleLinkClick} aria-label="Admin Dashboard">
              Dashboard
            </a>
          ) : (
            <a href="#admin" className="admin-lock-link" title="Admin Login" aria-label="Admin Login" onClick={handleLinkClick}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
            </a>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen
            ? <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>close</span>
            : <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>menu</span>
          }
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in font-sans" role="navigation" aria-label="Mobile navigation">

          {/* Main links */}
          <div className="mob-links-group">
            {[
              { label: 'Home',    hash: '#home',    icon: 'home' },
              { label: 'About',   hash: '#about',   icon: 'info' },
              { label: 'Updates', hash: '#updates', icon: 'newspaper' },
              { label: 'Contact', hash: '#contact', icon: 'mail' },
              { label: 'Live TV', hash: '#live-tv', icon: streamState.isLive ? 'sensors' : 'live_tv', live: streamState.isLive },
            ].map(link => (
              <a
                key={link.hash}
                href={link.hash}
                className={`mob-link ${currentHash === link.hash ? 'active' : ''} ${link.live ? 'mob-link-live' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="material-symbols-outlined mob-link-icon">{link.icon}</span>
                <span>{link.label}</span>
                {link.live && <span className="mob-live-dot">● LIVE</span>}
              </a>
            ))}
          </div>

          {/* Media group */}
          <div className="mob-group-label">
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>perm_media</span> Media
          </div>
          <div className="mob-links-group">
            {[
              { label: 'Photo Gallery',  hash: '#gallery', icon: 'photo_library' },
              { label: 'Video Sermons',  hash: '#videos',  icon: 'play_circle' },
            ].map(link => (
              <a key={link.hash} href={link.hash} className={`mob-link mob-link-sub ${currentHash === link.hash ? 'active' : ''}`} onClick={handleLinkClick}>
                <span className="material-symbols-outlined mob-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Ministries group */}
          <div className="mob-group-label">
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>church</span> Ministries
          </div>
          <div className="mob-links-group">
            {[
              { label: 'Bible School',     hash: '#bible-school',    icon: 'menu_book' },
              { label: 'Prayer Programs',  hash: '#prayer-programs', icon: 'volunteer_activism' },
              { label: 'Counseling',       hash: '#counseling',      icon: 'support_agent' },
              { label: 'Books',            hash: '#publications',    icon: 'auto_stories' },
              { label: 'Team',             hash: '#team',            icon: 'groups' },
              { label: 'FAQ',              hash: '#faq',             icon: 'help' },
            ].map(link => (
              <a key={link.hash} href={link.hash} className={`mob-link mob-link-sub ${currentHash === link.hash ? 'active' : ''}`} onClick={handleLinkClick}>
                <span className="material-symbols-outlined mob-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* CTA row */}
          <div className="mob-cta-row">
            <a href="#support" className="btn btn-secondary mob-cta-btn" onClick={handleLinkClick}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>favorite</span> Donate
            </a>
            {isAdminLoggedIn ? (
              <button
                className="btn btn-sm btn-danger mob-cta-btn"
                onClick={() => { logoutAdmin(); handleLinkClick(); window.location.hash = '#home'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span> Log Out
              </button>
            ) : (
              <a href="#admin" className="mob-admin-link" onClick={handleLinkClick}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span> Admin
              </a>
            )}
          </div>

        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 200;
          background: #ffffff;
          border-bottom: 2px solid var(--glass-border);
          box-shadow: 0 2px 12px rgba(26, 58, 107, 0.06);
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 100px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-img {
          height: 90px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .nav-menu-desktop {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.88rem;
          transition: var(--transition-fast);
          padding: 0.4rem 0.6rem;
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary-blue);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--primary-gold);
          border-radius: 2px;
        }
        .dropdown-toggle {
          font-family: var(--font-sans);
        }

        /* Dropdown */
        .nav-dropdown { position: relative; display: inline-block; }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1px solid var(--glass-border);
          box-shadow: 0 12px 28px rgba(26, 58, 107, 0.12);
          border-radius: var(--border-radius-sm);
          padding: 0.5rem 0;
          min-width: 170px;
          text-align: left;
          z-index: 300;
        }
        .dropdown-item {
          display: block;
          padding: 0.55rem 1.1rem;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          transition: var(--transition-fast);
          text-decoration: none;
          white-space: nowrap;
        }
        .dropdown-item:hover {
          background: var(--blue-light);
          color: var(--primary-blue);
        }

        /* Live pill */
        .live-pill-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(166, 28, 46, 0.08);
          border: 1.5px solid var(--primary-crimson);
          color: var(--primary-crimson) !important;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.05em;
          animation: pulse-red-label 1.5s infinite;
        }
        .live-dot-blink {
          font-size: 0.55rem;
        }
        .stream-link-btn {
          border: 1.5px solid var(--bg-700);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.82rem;
        }
        .stream-link-btn:hover {
          border-color: var(--primary-blue);
          color: var(--primary-blue) !important;
        }

        /* Donate CTA */
        .nav-donate-btn {
          padding: 0.45rem 1.1rem;
          font-size: 0.8rem;
          letter-spacing: 0.07em;
          margin-left: 0.25rem;
        }

        /* Admin */
        .nav-btn-action {
          font-size: 0.8rem;
          padding: 0.4rem 0.9rem;
          border-radius: var(--border-radius-sm);
          font-weight: 700;
          text-transform: uppercase;
          transition: var(--transition-fast);
          text-decoration: none;
        }
        .admin-btn {
          background: var(--primary-blue);
          color: #fff !important;
        }
        .admin-btn:hover {
          background: var(--blue-hover);
          box-shadow: var(--blue-shadow);
        }
        .admin-lock-link {
          opacity: 0.5;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          color: var(--text-secondary);
        }
        .admin-lock-link:hover { opacity: 1; color: var(--primary-blue); }

        /* Mobile toggle */
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: 1.5px solid var(--glass-border);
          color: var(--primary-blue);
          cursor: pointer;
          padding: 0.3rem;
          border-radius: var(--border-radius-sm);
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Mobile drawer */
        .mobile-drawer {
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 2px solid var(--glass-border);
          box-shadow: 0 16px 32px rgba(26, 58, 107, 0.12);
          padding: 1rem 1.1rem 1.25rem;
          z-index: 199;
          max-height: calc(100vh - 60px);
          overflow-y: auto;
        }

        /* Group label */
        .mob-group-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--primary-gold);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin: 0.85rem 0 0.3rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid var(--bg-700);
        }

        /* Link group */
        .mob-links-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.15rem 0.5rem;
        }

        /* Individual link */
        .mob-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.5rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition-fast);
          white-space: nowrap;
        }
        .mob-link:hover, .mob-link.active {
          background: var(--blue-light);
          color: var(--primary-blue);
        }
        .mob-link.active { font-weight: 700; }
        .mob-link-sub { font-size: 0.78rem; font-weight: 500; }
        .mob-link-live { color: var(--primary-crimson) !important; }
        .mob-live-dot {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--primary-crimson);
          letter-spacing: 0.05em;
          animation: pulse-red-label 1.2s infinite;
        }
        .mob-link-icon {
          font-size: 1rem;
          flex-shrink: 0;
          color: var(--primary-gold);
        }
        .mob-link.active .mob-link-icon,
        .mob-link:hover .mob-link-icon { color: var(--primary-blue); }

        /* CTA row at bottom */
        .mob-cta-row {
          display: flex;
          gap: 0.6rem;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--bg-700);
          align-items: center;
        }
        .mob-cta-btn {
          flex: 1;
          justify-content: center;
          font-size: 0.78rem;
          padding: 0.5rem 0.75rem;
          gap: 0.35rem;
        }
        .mob-admin-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          padding: 0.45rem 0.6rem;
          border: 1px solid var(--bg-700);
          border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        .mob-admin-link:hover { color: var(--primary-blue); border-color: var(--primary-blue); }

        /* Legacy classes — keep for any remaining refs */
        .mobile-section-label {
          font-size: 0.65rem; font-weight: 800; color: var(--primary-gold);
          text-transform: uppercase; letter-spacing: 0.12em;
          margin-top: 0.75rem; padding-bottom: 0.25rem;
          border-bottom: 1px solid var(--bg-700);
        }
        .mobile-nav-link {
          color: var(--text-secondary); font-weight: 600; font-size: 0.88rem;
          padding: 0.4rem 0; border-bottom: 1px solid var(--bg-800);
          display: block; text-align: left; text-decoration: none;
          transition: var(--transition-fast);
        }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: var(--primary-blue); }
        .mobile-nav-link.active { border-bottom-color: var(--primary-blue); }

        @keyframes pulse-red-label {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @media (max-width: 1024px) {
          .nav-menu-desktop { display: none; }
          .mobile-menu-toggle { display: flex; }
        }
      `}</style>
    </header>
  );
}
