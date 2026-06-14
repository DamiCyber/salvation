import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Home() {
  const { streamState, content, books, prayers, events, donations } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [donateAmount, setDonateAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [isMonthly, setIsMonthly] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Scripture of the year / rotating verses
  const scriptures = [
    { text: "Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me.", verse: "Isaiah 6:8" },
    { text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.", verse: "Matthew 28:19" },
    { text: "And he said unto them, Go ye into all the world, and preach the gospel to every creature.", verse: "Mark 16:15" },
    { text: "The harvest truly is plentiful, but the labourers are few; Pray ye therefore the Lord of the harvest.", verse: "Matthew 9:37–38" },
  ];
  const [scriptureIdx, setScriptureIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScriptureIdx(i => (i + 1) % scriptures.length), 7000);
    return () => clearInterval(t);
  }, []);

  // Auto-rotate testimonials
  const testimonials = [
    { name: "Grace M. – Kakamega", text: "I was blind in my left eye for six years. During the crusade the evangelist prayed, and I received my sight back. All glory to Jesus!" },
    { name: "David S. – Kisumu", text: "My entire village came to Christ through the open-air crusade. 340 souls saved in three nights. God is faithful!" },
    { name: "Pastor Emmanuel – Uganda", text: "The Bible School equipped me with everything I needed to plant a church in my community. We now have 80 members." },
  ];
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 6000); }
  };

  // Latest 3 content items
  const latestContent = content.slice(0, 3);
  // Approved prayers for preview
  const activePrayers = prayers.filter(p => p.status === 'Approved' || p.status === 'Praise Report').slice(0, 3);
  // Featured book
  const featuredBook = books[0];
  // Donation total
  const fundPercent = Math.min(Math.round(((donations?.totalRaised || 14500) / (donations?.goal || 30000)) * 100), 100);

  const presetAmounts = ['1000', '2000', '5000', '10000'];

  const howFundsUsed = [];

  const stats = [];

  return (
    <div className="home-page font-sans">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="jm-hero">
        <div className="jm-hero-overlay" />
        <div className="jm-hero-content animate-fade-in">
          <span className="hero-eyebrow">SALVATION SERIES WORLD OUTREACH</span>
          <h1 className="hero-headline">Sharing Christ.<br />Changing Lives.</h1>
          <p className="hero-sub">Taking the undiluted gospel to the nations — through crusades, Bible education, healing, and humanitarian relief.</p>
          <div className="hero-cta-row">
            <a href="#live-tv" className="btn btn-hero-watch">
              {streamState.isLive ? '🔴 Watch Live' : '▶ Watch Today\'s Teaching'}
            </a>
            <a href="#support" className="btn btn-hero-donate">Donate Now</a>
            <a href="#prayer-programs" className="btn btn-hero-pray">🙏 Pray With Us</a>
          </div>
        </div>
      </section>

      {/* ── TODAY'S FEATURE (2-col: content + scripture) ─────── */}
      <section className="jm-todays-feature">
        <div className="feature-inner">

          {/* Left: Featured content card */}
          {latestContent[0] && (
            <div className="feature-card" onClick={() => window.location.hash = '#updates'} style={{ cursor: 'pointer' }}>
              {latestContent[0].image && (
                <div className="feature-img-wrap">
                  <img src={latestContent[0].image} alt={latestContent[0].title} className="feature-img" />
                  <span className="feature-type-badge">{latestContent[0].type}</span>
                </div>
              )}
              <div className="feature-card-body">
                <p className="feature-date">{latestContent[0].date}</p>
                <h3 className="feature-title">{latestContent[0].title}</h3>
                <p className="feature-excerpt">{latestContent[0].excerpt}</p>
                <span className="feature-read-more">Read More →</span>
              </div>
            </div>
          )}

          {/* Right: Scripture of the Year */}
          <div className="scripture-panel">
            <span className="scripture-eyebrow">SCRIPTURE OF THE YEAR</span>
            <blockquote className="scripture-big-quote" key={scriptureIdx}>
              "{scriptures[scriptureIdx].text}"
            </blockquote>
            <cite className="scripture-big-cite">— {scriptures[scriptureIdx].verse}</cite>
            <div className="scripture-dots">
              {scriptures.map((_, i) => (
                <button key={i} onClick={() => setScriptureIdx(i)} className={`sc-dot${i === scriptureIdx ? ' active' : ''}`} aria-label={`Scripture ${i + 1}`} />
              ))}
            </div>
            <a href="#prayer-programs" className="btn btn-outline-blue scripture-pray-btn">Request Prayer</a>
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ────────────────────────────────── */}
      <section className="jm-mission-strip">
        <div className="mission-strip-inner">
          <span className="section-tag">OUR PURPOSE</span>
          <h2 className="mission-headline">Raising End-Time Generals for the Harvest</h2>
          <p className="mission-body">
            To spread the gospel of Jesus Christ, equip believers with biblical knowledge, provide spiritual counseling,
            and create platforms for worship, prayer, and fellowship — transforming lives and communities one soul at a time.
          </p>
          <a href="#about" className="btn btn-outline-blue">Learn About Our Mission</a>
        </div>
      </section>

      {/* ── JUST FOR YOU (offers / links) — like JM's "Just for you" ── */}
      <section className="jm-just-for-you">
        <div className="jfy-inner">
          <div className="jfy-card jfy-card-blue reveal reveal-delay-1" onClick={() => window.location.hash = '#bible-school'} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined jfy-icon" style={{ color: 'var(--primary-blue)' }}>menu_book</span>
            <div>
              <h4>Join Our Bible School</h4>
              <p>Free online discipleship training — new semester starting next month. Enrol today.</p>
              <span className="jfy-link">Register Now →</span>
            </div>
          </div>
          <div className="jfy-card jfy-card-gold reveal reveal-delay-2" onClick={() => window.location.hash = '#support'} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined jfy-icon" style={{ color: 'var(--primary-gold)' }}>handshake</span>
            <div>
              <h4>Become a Monthly Partner</h4>
              <p>When we work together we can reach so many more. Your partnership travels far.</p>
              <span className="jfy-link">Begin Here →</span>
            </div>
          </div>
          <div className="jfy-card jfy-card-red reveal reveal-delay-3" onClick={() => window.location.hash = '#live-tv'} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined jfy-icon" style={{ color: 'var(--primary-crimson)' }}>play_circle</span>
            <div>
              <h4>Watch & Listen</h4>
              <p>Access our full library of sermons, teachings, crusade videos and devotionals.</p>
              <span className="jfy-link">Browse Library →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW CAN WE PRAY FOR YOU ──────────────────────────── */}
      <section className="jm-prayer-section">
        <div className="prayer-section-inner">
          <div className="prayer-cta-col text-center reveal-left">
            <span className="section-tag">INTERCESSION</span>
            <h2>How Can We Pray for You?</h2>
            <p>We know you have a lot on your mind. God is always here for you — and so are we.</p>
            <div className="prayer-cta-btns">
              <a href="#prayer-programs" className="btn btn-primary">Submit a Prayer Request</a>
              <a href="#prayer-programs" className="btn btn-outline-gold">View Prayer Wall</a>
            </div>
          </div>
          {activePrayers.length > 0 && (
            <div className="prayer-preview-col reveal-right">
              {activePrayers.map((pr, i) => (
                <div key={pr._id || pr.id || i} className={`prayer-preview-card${pr.status === 'Praise Report' ? ' praise' : ''}`}>
                  <div className="pp-header">
                    <strong>{pr.name}</strong>
                    {pr.status === 'Praise Report' && <span className="pp-praise-tag">✨ Praise</span>}
                  </div>
                  <p>"{pr.text.length > 110 ? pr.text.slice(0, 110) + '…' : pr.text}"</p>
                  <span className="pp-count"><span className="material-symbols-outlined" style={{fontSize:'14px',verticalAlign:'middle'}}>favorite</span> {pr.prayCount || pr.count || 0} praying</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LATEST FROM THE FIELD ────────────────────────────── */}
      <section className="jm-content-section">
        <div className="content-section-inner">
          <div className="section-heading-row">
            <div>
              <span className="section-tag">READ · WATCH · LISTEN</span>
              <h2 className="section-h2">Latest from the Field</h2>
            </div>
            <a href="#updates" className="btn btn-outline-blue btn-sm">View All Updates</a>
          </div>
          <div className="grid-3">
            {latestContent.map((item, i) => (
              <article key={item._id || item.id || i} className={`content-card card reveal reveal-delay-${i + 1}`} onClick={() => window.location.hash = '#updates'} style={{ cursor: 'pointer', padding: 0 }}>
                {item.image && (
                  <div className="cc-img-wrap">
                    <img src={item.image} alt={item.title} className="cc-img" />
                    <span className="cc-type-badge">{item.type}</span>
                  </div>
                )}
                <div className="cc-body">
                  <p className="cc-date">{item.date}</p>
                  <h4 className="cc-title">{item.title}</h4>
                  <p className="cc-excerpt">{item.excerpt}</p>
                  <span className="cc-read">Read More →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONATE SECTION ───────────────────────────────────── */}
      <section className="jm-donate-section">
        <div className="donate-inner">
          {/* Left: Form */}
          <div className="donate-form-col">
            <span className="section-tag light">GIVE A DONATION</span>
            <h2 className="donate-headline">Help Share the Hope of Christ</h2>
            <p className="donate-desc">
              Every contribution — no matter the size — makes a lasting difference for individuals, families and entire communities.
            </p>
            <div className="donate-amount-grid">
              {presetAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`amt-btn${donateAmount === amt ? ' active' : ''}`}
                  onClick={() => setDonateAmount(amt)}
                >
                  ₦{amt}
                </button>
              ))}
              <button
                type="button"
                className={`amt-btn${donateAmount === 'custom' ? ' active' : ''}`}
                onClick={() => setDonateAmount('custom')}
              >
                Other
              </button>
            </div>
            {donateAmount === 'custom' && (
              <div className="custom-amt-wrap">
                <span className="currency-sign">₦</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="custom-amt-input"
                />
              </div>
            )}
            <label className="monthly-toggle">
              <input type="checkbox" checked={isMonthly} onChange={e => setIsMonthly(e.target.checked)} />
              <span>Become a Monthly Partner</span>
            </label>
            <a href="#support" className="btn btn-hero-donate donate-cta-btn">
              {isMonthly ? 'Become a Monthly Partner' : 'Donate Now'} →
            </a>
            {/* Progress bar */}
            <div className="donate-goal-row">
              <div className="donate-goal-bar-bg">
                <div className="donate-goal-bar-fill" style={{ width: `${fundPercent}%` }} />
              </div>
              <div className="donate-goal-meta">
                <span>₦{(donations?.totalRaised || 14500).toLocaleString()} raised</span>
                <span>{fundPercent}% of ₦{(donations?.goal || 30000).toLocaleString()} goal</span>
              </div>
            </div>
          </div>
          {/* Right: Impact statement */}
          <div className="donate-impact-col">
            <div className="impact-quote-card">
              <span className="material-symbols-outlined impact-quote-icon">volunteer_activism</span>
              <blockquote className="impact-quote-text">
                "When we all come together, we can create lasting change and inspire hope for individuals, families, and entire communities."
              </blockquote>
            </div>
            <div className="impact-features">
              <div className="impact-feat">
                <span className="material-symbols-outlined impact-feat-icon">church</span>
                <div>
                  <strong>Crusades & Church Planting</strong>
                  <p>Open-air healing meetings and local assembly establishment</p>
                </div>
              </div>
              <div className="impact-feat">
                <span className="material-symbols-outlined impact-feat-icon">water_drop</span>
                <div>
                  <strong>Clean Water Projects</strong>
                  <p>Drilling wells that bring physical and spiritual living water</p>
                </div>
              </div>
              <div className="impact-feat">
                <span className="material-symbols-outlined impact-feat-icon">auto_stories</span>
                <div>
                  <strong>Bible Distribution</strong>
                  <p>Free Bibles and literature for new believers and churches</p>
                </div>
              </div>
              <div className="impact-feat">
                <span className="material-symbols-outlined impact-feat-icon">school</span>
                <div>
                  <strong>Bible School Training</strong>
                  <p>Equipping ministers and believers with the Word of God</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="jm-testimonials-section">
        <div className="testimonials-inner">
          <span className="section-tag">GOD IS STILL WORKING</span>
          <h2 className="section-h2">What God Is Doing</h2>
          <div className="testimonial-carousel">
            <div className="testimonial-card animate-fade-in" key={activeTestimonial}>
              <p className="testimonial-quote">"{testimonials[activeTestimonial].text}"</p>
              <span className="testimonial-name">— {testimonials[activeTestimonial].name}</span>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} className={`tc-dot${i === activeTestimonial ? ' active' : ''}`} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
          <a href="#updates" className="btn btn-outline-blue">Read More Testimonies</a>
        </div>
      </section>

      {/* ── SHOP / BOOKS SECTION ─────────────────────────────── */}
      {books.length > 0 && (
        <section className="jm-books-section">
          <div className="books-inner">
            <div className="section-heading-row">
              <div>
                <span className="section-tag">PUBLICATIONS</span>
                <h2 className="section-h2">Books & Resources</h2>
              </div>
              <a href="#publications" className="btn btn-outline-blue btn-sm">Shop All Resources</a>
            </div>
            <div className="books-grid">
              {books.slice(0, 3).map((book, i) => (
                <div key={book._id || book.id || i} className={`book-tile card reveal reveal-delay-${i + 1}`} onClick={() => window.location.hash = '#publications'} style={{ cursor: 'pointer', padding: 0 }}>
                  <div className="book-tile-img-wrap">
                    <img src={book.coverUrl} alt={book.title} className="book-tile-img" />
                    <span className="book-tile-price">{book.price === 0 ? 'FREE' : `₦${book.price}`}</span>
                    {i === 0 && <span className="book-tile-new">New!</span>}
                  </div>
                  <div className="book-tile-body">
                    <h4 className="book-tile-title">{book.title}</h4>
                    <p className="book-tile-desc">{book.description?.slice(0, 80)}…</p>
                    <span className="book-tile-cta">{book.price === 0 ? 'Download Free →' : 'Get This Book →'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ──────────────────────────────────── */}
      {events.length > 0 && (
        <section className="jm-events-section">
          <div className="events-inner">
            <div className="section-heading-row">
              <div>
                <span className="section-tag">UPCOMING</span>
                <h2 className="section-h2">Events Calendar</h2>
              </div>
              <a href="#about" className="btn btn-outline-blue btn-sm">See All Events</a>
            </div>
            <div className="events-grid">
              {events.slice(0, 4).map((evt, i) => (
                <div key={evt._id || evt.id || i} className={`event-card card reveal reveal-delay-${i + 1}`}>
                  <div className="event-date-pill">{evt.date}</div>
                  <h4 className="event-title">{evt.title}</h4>
                  <p className="event-location"><span className="material-symbols-outlined" style={{fontSize:'14px',verticalAlign:'middle'}}>location_on</span> {evt.location}</p>
                  <p className="event-desc">{evt.description?.slice(0, 90)}…</p>
                  <a href="#contact" className="event-register-link">Register / Learn More →</a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER SIGNUP ────────────────────────────────── */}
      <section className="jm-newsletter-section">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h2>Stay Connected to the Mission</h2>
            <p>Subscribe to receive field reports, prayer letters, and ministry news delivered to your inbox.</p>
          </div>
          <div className="newsletter-form-wrap">
            {subscribed ? (
              <div className="newsletter-success">🎉 Thank you for subscribing! You'll hear from us soon.</div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                  aria-label="Newsletter email"
                />
                <button type="submit" className="btn btn-hero-donate">Subscribe</button>
              </form>
            )}
            <p className="newsletter-note">No spam. Unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </section>

      {/* ── STYLES ───────────────────────────────────────────── */}
      <style>{`
        .home-page { overflow-x: hidden; }

        /* LIVE BAR */
        .live-top-bar {
          background: var(--primary-crimson);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 0.6rem 1.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          flex-wrap: wrap;
        }
        .live-dot { animation: pulse-red-label 1.2s infinite; font-size: 0.7rem; }
        .btn-crimson { background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.4); }
        .btn-crimson:hover { background: rgba(255,255,255,0.3); color: #fff; }

        /* HERO */
        .jm-hero {
          position: relative;
          width: 100vw;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          margin-top: -2rem;
          min-height: 620px;
          background: url('/salvation.jpg') center center / cover no-repeat;
          display: flex; align-items: flex-end; justify-content: flex-start;
          padding: 0 4rem 5rem;
        }
        .jm-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(10,20,50,0.82) 40%, rgba(10,20,50,0.3) 100%);
        }
        .jm-hero-content { position: relative; z-index: 2; max-width: 600px; }
        .hero-eyebrow {
          font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em;
          color: var(--primary-gold); display: block; margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .hero-headline {
          font-family: var(--font-serif); font-size: clamp(2.2rem, 5vw, 3.8rem);
          color: #fff; line-height: 1.15; margin-bottom: 1.25rem;
          font-weight: 700;
        }
        .hero-sub {
          font-size: 1.05rem; color: rgba(255,255,255,0.85);
          line-height: 1.65; margin-bottom: 2rem; max-width: 500px;
        }
        .hero-cta-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .btn-hero-watch {
          background: #fff; color: var(--primary-blue) !important;
          font-weight: 700; border: none; padding: 0.7rem 1.5rem;
          border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        .btn-hero-watch:hover { background: #f0f4f8; transform: translateY(-1px); }
        .btn-hero-donate {
          background: var(--primary-gold); color: #fff !important;
          font-weight: 700; border: none; padding: 0.7rem 1.5rem;
          border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        .btn-hero-donate:hover { background: var(--gold-hover); transform: translateY(-1px); }
        .btn-hero-pray {
          background: transparent; color: #fff !important;
          font-weight: 600; border: 1.5px solid rgba(255,255,255,0.5);
          padding: 0.7rem 1.5rem; border-radius: var(--border-radius-sm);
          transition: var(--transition-fast);
        }
        .btn-hero-pray:hover { border-color: #fff; background: rgba(255,255,255,0.08); }

        /* TODAY'S FEATURE */
        .jm-todays-feature {
          padding: 4rem 0 3rem; background: #fff;
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative;
        }
        .feature-inner {
          max-width: 1180px; margin: 0 auto; padding: 0 1.5rem;
          display: grid; grid-template-columns: 1.1fr 1fr; gap: 2.5rem;
          align-items: stretch;
        }
        .feature-card {
          background: #fff; border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          overflow: hidden; box-shadow: var(--glass-shadow);
          display: flex; flex-direction: column;
          transition: var(--transition-normal);
        }
        .feature-card:hover { box-shadow: 0 12px 32px rgba(26,58,107,0.12); transform: translateY(-3px); }
        .feature-img-wrap { position: relative; height: 240px; overflow: hidden; }
        .feature-img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-normal); }
        .feature-card:hover .feature-img { transform: scale(1.04); }
        .feature-type-badge {
          position: absolute; top: 1rem; left: 1rem;
          background: var(--primary-gold); color: #fff;
          font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem;
          border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .feature-card-body { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
        .feature-date { font-size: 0.75rem; font-weight: 700; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .feature-title { font-family: var(--font-serif); font-size: 1.25rem; color: var(--primary-blue); margin-bottom: 0.75rem; }
        .feature-excerpt { font-size: 0.9rem; color: var(--text-secondary); flex-grow: 1; line-height: 1.6; }
        .feature-read-more { font-size: 0.85rem; font-weight: 700; color: var(--primary-blue); margin-top: 1rem; display: block; }

        .scripture-panel {
          background: linear-gradient(135deg, #0f2942, #1a3a6b);
          border-radius: var(--border-radius-md); padding: 2.5rem;
          display: flex; flex-direction: column; gap: 1.25rem;
          color: #fff;
        }
        .scripture-eyebrow { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.2em; color: var(--primary-gold); text-transform: uppercase; }
        .scripture-big-quote {
          font-family: var(--font-serif); font-size: 1.2rem; font-style: italic;
          line-height: 1.7; color: rgba(255,255,255,0.92); flex-grow: 1;
          animation: fadeIn 0.5s ease;
        }
        .scripture-big-cite { font-size: 0.9rem; font-weight: 700; color: var(--primary-gold); }
        .scripture-dots { display: flex; gap: 0.5rem; }
        .sc-dot {
          width: 8px; height: 8px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.3); cursor: pointer; padding: 0;
          transition: var(--transition-fast);
        }
        .sc-dot.active { background: var(--primary-gold); transform: scale(1.3); }
        .scripture-pray-btn {
          background: transparent !important; border: 1.5px solid rgba(255,255,255,0.3) !important;
          color: #fff !important; align-self: flex-start; font-size: 0.85rem;
        }
        .scripture-pray-btn:hover { border-color: var(--primary-gold) !important; color: var(--primary-gold) !important; }

        /* MISSION STRIP */
        .jm-mission-strip {
          background: #f8fafc;
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative; padding: 4.5rem 1.5rem;
          text-align: center;
        }
        .mission-strip-inner { max-width: 760px; margin: 0 auto; }
        .mission-headline { font-size: 2rem; color: var(--primary-blue); margin-bottom: 1.25rem; }
        .mission-body { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.75; margin-bottom: 2rem; }

        /* STATS STRIP */
        .jm-stats-strip {
          background: var(--primary-blue);
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative;
          display: flex; justify-content: center; flex-wrap: wrap;
          gap: 0; padding: 0;
        }
        .stat-item {
          flex: 1; min-width: 160px; padding: 2.5rem 1.5rem;
          text-align: center; border-right: 1px solid rgba(255,255,255,0.1);
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: var(--font-serif); font-size: 2.8rem; font-weight: 700;
          color: var(--primary-gold); line-height: 1;
        }
        .stat-label { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.1em; }

        /* JUST FOR YOU */
        .jm-just-for-you { padding: 4rem 0; }
        .jfy-inner { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .jfy-card {
          display: flex; align-items: flex-start; gap: 1.25rem;
          padding: 2rem; border-radius: var(--border-radius-md);
          transition: var(--transition-normal); cursor: pointer;
        }
        .jfy-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(26,58,107,0.12); }
        .jfy-card-blue { background: linear-gradient(135deg, rgba(26,58,107,0.05), rgba(26,58,107,0.08)); border: 1px solid rgba(26,58,107,0.1); }
        .jfy-card-gold { background: linear-gradient(135deg, rgba(201,151,62,0.06), rgba(201,151,62,0.1)); border: 1px solid rgba(201,151,62,0.15); }
        .jfy-card-red { background: linear-gradient(135deg, rgba(166,28,46,0.04), rgba(166,28,46,0.07)); border: 1px solid rgba(166,28,46,0.1); }
        .jfy-emoji { font-size: 2.2rem; flex-shrink: 0; line-height: 1; }
        .jfy-icon { font-size: 2.2rem; flex-shrink: 0; line-height: 1; }
        .jfy-card h4 { font-size: 1.05rem; color: var(--primary-blue); margin-bottom: 0.4rem; }
        .jfy-card p { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 0.75rem; }
        .jfy-link { font-size: 0.84rem; font-weight: 700; color: var(--primary-blue); }

        /* PRAYER SECTION */
        .jm-prayer-section {
          background: linear-gradient(135deg, #f0f4f8, #e8edf5);
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative; padding: 4.5rem 1.5rem;
        }
        .prayer-section-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.4fr; gap: 3rem; align-items: center; }
        .prayer-cta-col h2 { font-size: 1.8rem; margin-bottom: 0.75rem; }
        .prayer-cta-col p { margin-bottom: 1.75rem; }
        .prayer-cta-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .prayer-preview-col { display: flex; flex-direction: column; gap: 1rem; }
        .prayer-preview-card {
          background: #fff; border: 1px solid var(--glass-border);
          border-left: 4px solid var(--primary-blue);
          border-radius: var(--border-radius-sm); padding: 1.1rem 1.25rem;
          box-shadow: 0 2px 8px rgba(26,58,107,0.05);
        }
        .prayer-preview-card.praise { border-left-color: var(--primary-gold); }
        .pp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; font-size: 0.85rem; }
        .pp-header strong { color: var(--primary-blue); }
        .pp-praise-tag { font-size: 0.7rem; font-weight: 700; color: var(--primary-gold); background: rgba(201,151,62,0.1); padding: 0.15rem 0.5rem; border-radius: 4px; }
        .prayer-preview-card p { font-size: 0.88rem; color: var(--text-secondary); font-style: italic; margin: 0 0 0.4rem; }
        .pp-count { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

        /* LATEST CONTENT */
        .jm-content-section { padding: 4.5rem 0; }
        .content-section-inner { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; }
        .section-heading-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .section-h2 { font-size: 1.8rem; color: var(--primary-blue); margin: 0; padding: 0; }
        .section-h2::after { display: none; }
        .content-card { overflow: hidden; display: flex; flex-direction: column; height: 100%; }
        .cc-img-wrap { position: relative; height: 200px; overflow: hidden; }
        .cc-img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition-normal); }
        .content-card:hover .cc-img { transform: scale(1.05); }
        .cc-type-badge { position: absolute; top: 0.75rem; left: 0.75rem; background: var(--primary-blue); color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 3px; text-transform: uppercase; }
        .cc-body { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; }
        .cc-date { font-size: 0.72rem; font-weight: 700; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; }
        .cc-title { font-family: var(--font-serif); font-size: 1.1rem; color: var(--primary-blue); margin-bottom: 0.6rem; }
        .cc-excerpt { font-size: 0.86rem; color: var(--text-secondary); line-height: 1.55; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .cc-read { font-size: 0.8rem; font-weight: 700; color: var(--primary-gold); margin-top: 0.75rem; }

        /* DONATE SECTION */
        .jm-donate-section {
          background: #0f2942;
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative; padding: 5rem 1.5rem;
          color: #fff;
        }
        .donate-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: start; }
        .section-tag.light { color: var(--primary-gold); }
        .donate-headline { font-size: 2rem; color: #fff; margin-bottom: 0.75rem; }
        .donate-desc { color: rgba(255,255,255,0.75); font-size: 0.95rem; margin-bottom: 1.75rem; line-height: 1.65; }
        .donate-amount-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.6rem; margin-bottom: 1.25rem; }
        .amt-btn {
          padding: 0.7rem 0.5rem; background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.15); color: #fff;
          border-radius: var(--border-radius-sm); font-family: var(--font-sans);
          font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: var(--transition-fast);
        }
        .amt-btn:hover { border-color: var(--primary-gold); }
        .amt-btn.active { background: var(--primary-gold); border-color: var(--primary-gold); color: #fff; }
        .custom-amt-wrap { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.15); border-radius: var(--border-radius-sm); padding: 0.5rem 1rem; }
        .currency-sign { color: rgba(255,255,255,0.7); font-weight: 700; font-size: 1.1rem; }
        .custom-amt-input { background: transparent; border: none; color: #fff; font-size: 1rem; font-family: var(--font-sans); width: 100%; outline: none; }
        .custom-amt-input::placeholder { color: rgba(255,255,255,0.4); }
        .monthly-toggle { display: flex; align-items: center; gap: 0.65rem; cursor: pointer; font-size: 0.9rem; color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; }
        .monthly-toggle input { width: 16px; height: 16px; accent-color: var(--primary-gold); cursor: pointer; }
        .donate-cta-btn { width: 100%; justify-content: center; padding: 0.9rem; font-size: 1rem; margin-bottom: 1.5rem; }
        .donate-goal-bar-bg { height: 8px; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; margin-bottom: 0.5rem; }
        .donate-goal-bar-fill { height: 100%; background: linear-gradient(90deg, var(--primary-gold), #f0c060); border-radius: 8px; transition: width 1s ease; }
        .donate-goal-meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: rgba(255,255,255,0.6); }

        .donate-impact-col {}
        .impact-title { font-family: var(--font-serif); font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem; }
        .impact-desc { color: rgba(255,255,255,0.65); font-size: 0.88rem; margin-bottom: 1.75rem; }
        .impact-bars { display: flex; flex-direction: column; gap: 1.1rem; margin-bottom: 2rem; }
        .impact-bar-row {}
        .impact-bar-label-row { display: flex; justify-content: space-between; font-size: 0.84rem; color: rgba(255,255,255,0.8); margin-bottom: 0.35rem; }
        .impact-pct { font-weight: 700; color: #fff; }
        .impact-bar-bg { height: 8px; background: rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden; }
        .impact-bar-fill { height: 100%; border-radius: 8px; }
        .impact-trust-badges { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .trust-badge { font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 0.3rem 0.75rem; border-radius: 20px; }

        /* Impact column — new style */
        .impact-quote-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-left: 4px solid var(--primary-gold);
          border-radius: var(--border-radius-sm);
          padding: 1.75rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .impact-quote-icon {
          font-size: 2.2rem;
          color: var(--primary-gold);
        }
        .impact-quote-text {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
          margin: 0;
        }
        .impact-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .impact-feat {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .impact-feat-icon {
          font-size: 1.6rem;
          color: var(--primary-gold);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .impact-feat strong {
          display: block;
          font-size: 0.92rem;
          color: #fff;
          margin-bottom: 0.2rem;
          font-weight: 700;
        }
        .impact-feat p {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.6);
          margin: 0;
          line-height: 1.5;
        }

        /* TESTIMONIALS */
        .jm-testimonials-section { padding: 5rem 0; text-align: center; }
        .testimonials-inner { max-width: 760px; margin: 0 auto; padding: 0 1.5rem; }
        .testimonial-carousel { margin: 2.5rem 0; }
        .testimonial-card {
          background: #fff; border: 1px solid var(--glass-border);
          border-top: 4px solid var(--primary-gold);
          border-radius: var(--border-radius-md);
          padding: 2.5rem 2rem; box-shadow: var(--glass-shadow);
          animation: fadeIn 0.45s ease;
        }
        .testimonial-quote { font-family: var(--font-serif); font-size: 1.2rem; font-style: italic; color: var(--primary-blue); line-height: 1.7; margin-bottom: 1.25rem; }
        .testimonial-name { font-size: 0.88rem; font-weight: 700; color: var(--primary-gold); text-transform: uppercase; letter-spacing: 0.08em; }
        .testimonial-dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; }
        .tc-dot { width: 9px; height: 9px; border-radius: 50%; border: none; background: var(--bg-700); cursor: pointer; padding: 0; transition: var(--transition-fast); }
        .tc-dot.active { background: var(--primary-gold); transform: scale(1.3); }

        /* BOOKS */
        .jm-books-section { padding: 4.5rem 0; background: #f8fafc; width: 100vw; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; position: relative; }
        .books-inner { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; }
        .books-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 0; }
        .book-tile { overflow: hidden; display: flex; flex-direction: column; }
        .book-tile:hover { transform: translateY(-4px); }
        .book-tile-img-wrap { position: relative; height: 240px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid var(--glass-border); }
        .book-tile-img { height: 90%; width: auto; object-fit: contain; transition: var(--transition-normal); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .book-tile:hover .book-tile-img { transform: scale(1.04) translateY(-4px); }
        .book-tile-price { position: absolute; top: 0.75rem; right: 0.75rem; background: var(--primary-gold); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 4px; }
        .book-tile-new { position: absolute; top: 0.75rem; left: 0.75rem; background: var(--primary-crimson); color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 3px; text-transform: uppercase; }
        .book-tile-body { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; }
        .book-tile-title { font-family: var(--font-serif); font-size: 1rem; color: var(--primary-blue); margin-bottom: 0.5rem; }
        .book-tile-desc { font-size: 0.84rem; color: var(--text-secondary); flex-grow: 1; line-height: 1.55; }
        .book-tile-cta { font-size: 0.82rem; font-weight: 700; color: var(--primary-gold); margin-top: 0.75rem; }

        /* MISSIONS */
        .jm-missions-section {
          background: var(--primary-blue);
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative; padding: 5rem 1.5rem;
        }
        .missions-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .missions-headline { font-size: 2rem; color: #fff; margin-bottom: 1.25rem; }
        .missions-text-col p { color: rgba(255,255,255,0.78); font-size: 0.98rem; line-height: 1.7; margin-bottom: 1.5rem; }
        .missions-bullet-list { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
        .missions-bullet-list span { font-size: 0.92rem; color: rgba(255,255,255,0.85); font-weight: 500; }
        .missions-img { width: 100%; height: 420px; object-fit: cover; border-radius: var(--border-radius-md); box-shadow: 0 24px 56px rgba(0,0,0,0.3); }

        /* EVENTS */
        .jm-events-section { padding: 4.5rem 0; }
        .events-inner { max-width: 1180px; margin: 0 auto; padding: 0 1.5rem; }
        .events-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .event-card { padding: 1.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .event-date-pill { display: inline-block; font-size: 0.72rem; font-weight: 700; color: var(--primary-crimson); background: rgba(166,28,46,0.07); border: 1px solid rgba(166,28,46,0.15); padding: 0.25rem 0.65rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; width: fit-content; }
        .event-title { font-family: var(--font-serif); font-size: 1.1rem; color: var(--primary-blue); margin: 0; }
        .event-location { font-size: 0.82rem; color: var(--primary-gold); font-weight: 600; margin: 0; }
        .event-desc { font-size: 0.86rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }
        .event-register-link { font-size: 0.82rem; font-weight: 700; color: var(--primary-blue); margin-top: 0.5rem; }

        /* NEWSLETTER */
        .jm-newsletter-section {
          background: linear-gradient(135deg, #f8fafc, #eef2f7);
          width: 100vw; left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative; padding: 4.5rem 1.5rem;
          margin-bottom: -4rem;
        }
        .newsletter-inner { max-width: 900px; margin: 0 auto; display: flex; gap: 3rem; align-items: center; flex-wrap: wrap; }
        .newsletter-text { flex: 1; min-width: 260px; }
        .newsletter-text h2 { font-size: 1.7rem; color: var(--primary-blue); margin-bottom: 0.5rem; }
        .newsletter-text p { color: var(--text-secondary); margin: 0; }
        .newsletter-form-wrap { flex: 1; min-width: 260px; }
        .newsletter-form { display: flex; gap: 0.5rem; }
        .newsletter-input {
          flex-grow: 1; padding: 0.75rem 1rem;
          border: 1.5px solid rgba(26,58,107,0.15);
          border-radius: var(--border-radius-sm);
          background: #fff; color: var(--text-primary);
          font-size: 0.95rem; font-family: var(--font-sans);
          transition: var(--transition-fast);
        }
        .newsletter-input:focus { outline: none; border-color: var(--primary-blue); box-shadow: 0 0 0 2px rgba(26,58,107,0.08); }
        .newsletter-note { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem; }
        .newsletter-success { background: rgba(22,163,74,0.08); border: 1px solid var(--success); color: var(--success); padding: 0.85rem 1.25rem; border-radius: var(--border-radius-sm); font-weight: 600; font-size: 0.9rem; }

        /* shared section-tag */
        .section-tag {
          font-size: 0.72rem; font-weight: 800; letter-spacing: 0.18em;
          color: var(--primary-gold); text-transform: uppercase;
          display: block; margin-bottom: 0.5rem;
        }

        @keyframes pulse-red-label { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

        /* ── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 960px) {
          .jm-hero { padding: 0 2rem 4rem; min-height: 480px; }
          .feature-inner, .prayer-section-inner, .donate-inner, .missions-inner { grid-template-columns: 1fr; gap: 2rem; }
          .jfy-inner, .books-grid { grid-template-columns: 1fr 1fr; }
          .donate-amount-grid { grid-template-columns: repeat(3, 1fr); }
          .events-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .jm-hero { padding: 0 1.25rem 3rem; min-height: 420px; }
          .hero-headline { font-size: 2rem; }
          .hero-cta-row { flex-direction: column; }
          .jfy-inner, .books-grid { grid-template-columns: 1fr; }
          .newsletter-form { flex-direction: column; }
          .missions-img { height: 260px; }
          .jm-stats-strip { flex-direction: column; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .stat-item:last-child { border-bottom: none; }
        }
      `}</style>
    </div>
  );
}
