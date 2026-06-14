import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function About() {
  const { projects, events } = useContext(AppContext);
  const [activeFaithTab, setActiveFaithTab] = useState(0);

  const statementOfFaith = [
    { title: 'The Scriptures', content: 'We believe the Bible is the inspired, infallible, and authoritative Word of God, serving as our supreme rule of faith and conduct in all matters of life and godliness.' },
    { title: 'The Godhead', content: 'We believe in one God, eternally existent in three persons: Father, Son, and Holy Spirit — co-equal in power, glory, and eternal nature.' },
    { title: 'Salvation', content: 'We believe that salvation is by grace alone, through faith alone, in Christ alone — through His sacrificial death and bodily resurrection from the dead.' },
    { title: 'Divine Healing', content: 'We believe that healing and deliverance from sickness, bondage, and oppression are provided in the atonement of Christ and are the privilege of every believer today.' },
    { title: 'The Holy Spirit', content: 'We believe in the baptism of the Holy Spirit with the evidence of speaking in tongues, and the continued operation of all spiritual gifts in the Church today.' },
    { title: 'Missions & Commission', content: 'We believe the primary mandate of the Church is to go into all the world, preach the gospel to every creature, make disciples of all nations, and establish local fellowships.' },
  ];

  const timelineMilestones = [
    { year: '2010', title: 'The Calling', desc: 'Bro Ifeanyi Ohiri received a clear divine mandate to preach the undiluted gospel of Jesus Christ and to minister healing and deliverance to the nations.' },
    { year: '2013', title: 'First Open-Air Crusade', desc: 'Launched the first open-air healing crusade in Ogun State, resulting in remarkable salvations, healings, and deliverances that confirmed the calling.' },
    { year: '2017', title: 'Ministry Expansion', desc: 'The ministry extended its reach to other states across Nigeria, establishing prayer cells, outreach teams, and Bible training for local ministers.' },
    { year: '2022', title: 'Salvation Series Founded', desc: 'Salvation Series World Outreach was formally established at its current base on the Abeokuta–Ibadan Expressway, with a mandate to the nations.' },
  ];

  const coreValues = [
    { num: '01', title: 'Scriptural Integrity', desc: 'Everything we preach, teach, and do is rooted strictly in the Word of God — rightly divided and boldly declared.' },
    { num: '02', title: 'Power & Demonstration', desc: 'We believe the gospel must be preached with signs following — healing, deliverance, and the power of the Holy Spirit.' },
    { num: '03', title: 'Compassion for Souls', desc: 'Every soul matters to God. We pursue the lost, the broken, and the bound with the love and urgency of Christ.' },
    { num: '04', title: 'Financial Transparency', desc: 'We steward every resource entrusted to us with integrity, accountability, and full transparency to our partners.' },
  ];

  return (
    <div className="about-page animate-fade-in font-sans">

      {/* ── HERO BANNER ───────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content text-center">
          <span className="about-hero-tag">OUR STORY</span>
          <h1 className="about-hero-title">About the Ministry</h1>
          <p className="about-hero-sub">
            Discover the man, the calling, and the mission that drives Salvation Series World Outreach.
          </p>
        </div>
      </section>

      <div className="about-body">

        {/* ── BIO SECTION — Joyce Meyer style ───────────────────── */}
        <section className="bio-section reveal">
          <div className="bio-image-col">
            <div className="bio-img-wrapper">
              <img
                src="/pastor.jpg"
                alt="Bro Ifeanyi Ohiri — Founder & Lead Minister"
                className="bio-portrait"
              />
            </div>
            <div className="bio-img-caption">
              <strong>Bro Ifeanyi Ohiri</strong>
              <span>Founder & Lead Minister</span>
            </div>
          </div>

          <div className="bio-text-col">
            <span className="section-tag">THE MAN BEHIND THE MINISTRY</span>
            <h2 className="bio-heading">Called to Preach, Heal & Restore</h2>
            <div className="bio-gold-rule" />

            <p className="bio-lead">
              <em>"The Spirit of the Lord is upon me, because he hath anointed me to preach the gospel to the poor; he hath sent me to heal the brokenhearted, to preach deliverance to the captives…"</em>
              <br /><cite>— Luke 4:18</cite>
            </p>

            <p>
              Bro Ifeanyi Ohiri is a man marked by God — called by divine mandate to preach the undiluted gospel of Jesus Christ and to minister healing, deliverance, and restoration to the nations. His ministry is characterised by a raw dependence on the Holy Spirit, a deep reverence for Scripture, and an uncompromising pursuit of souls.
            </p>
            <p>
              From open-air crusades in remote communities to discipleship training in local churches, Bro Ifeanyi carries the fire of revival wherever he goes. Signs, wonders, and miraculous healings regularly accompany his ministry, drawing thousands into saving faith and freedom in Christ.
            </p>
            <p>
              Operating from the ministry's base on the Abeokuta–Ibadan Expressway in Ogun State, Nigeria, Salvation Series World Outreach continues to expand its reach — training ministers, planting churches, and taking the gospel to unreached people.
            </p>

            <div className="bio-affiliation-row">
              <div className="bio-aff-item">
                <span className="bio-aff-label">Ministry Base</span>
                <span className="bio-aff-value">Orile Ilugun, Abeokuta, Ogun State, Nigeria</span>
              </div>
              <div className="bio-aff-item">
                <span className="bio-aff-label">Focus</span>
                <span className="bio-aff-value">Evangelism · Healing · Deliverance · Church Planting</span>
              </div>
            </div>

            <div className="bio-cta-row">
              <a href="#support" className="btn btn-primary">Partner With Us</a>
              <a href="#contact" className="btn btn-outline-gold">Contact the Ministry</a>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ────────────────────────────────────────── */}
        <section className="stats-strip">
          {[
            { num: '1000+', label: 'Salvations Recorded' },
            { num: '50+',   label: 'Crusades Conducted' },
            { num: '12+',   label: 'Churches Planted' },
            { num: '5+',    label: 'States Reached' },
          ].map((s, i) => (
            <div key={i} className={`stat-item reveal-left reveal-delay-${i + 1}`}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── MISSION & VISION ───────────────────────────────────── */}
        <section className="mv-section">
          <div className="mv-card reveal-zoom">
            <span className="mv-icon">🎯</span>
            <span className="section-tag">PURPOSE</span>
            <h3>Our Mission</h3>
            <p>To preach the undiluted gospel of Jesus Christ, minister healing and deliverance by the power of the Holy Spirit, and establish self-sustaining local assemblies that multiply and reach the nations.</p>
          </div>
          <div className="mv-card mv-card-gold reveal-zoom">
            <span className="mv-icon">🌍</span>
            <span className="section-tag">DIRECTION</span>
            <h3>Our Vision</h3>
            <p>To see every unreached community in West Africa and beyond saturated with the life-transforming power of the gospel — through crusades, church plants, Bible training, and Holy Spirit-led outreach.</p>
          </div>
        </section>

        {/* ── CORE VALUES ────────────────────────────────────────── */}
        <section className="values-section reveal">
          <div className="values-header text-center">
            <span className="section-tag">WHAT DRIVES US</span>
            <h2>Our Core Values</h2>
            <div className="section-rule" />
          </div>
          <div className="grid-4">
            {coreValues.map((v, i) => (
              <div key={i} className="value-card">
                <span className="value-num">{v.num}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ────────────────────────────────────────────── */}
        <section className="timeline-section reveal">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <span className="section-tag">THE JOURNEY</span>
            <h2 className="section-title">Ministry Milestones</h2>
            <div className="section-rule" />
          </div>
          <div className="timeline-track">
            {timelineMilestones.map((m, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-card">
                  <span className="tl-year">{m.year}</span>
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
                <div className="timeline-node" />
              </div>
            ))}
            <div className="timeline-spine" />
          </div>
        </section>

        {/* ── STATEMENT OF FAITH ──────────────────────────────────── */}
        <section className="faith-section reveal">
          <div className="faith-header text-center">
            <span className="section-tag">THEOLOGY</span>
            <h2>What We Believe</h2>
            <div className="section-rule" />
            <p className="faith-sub">Our theological commitments and Statement of Faith</p>
          </div>
          <div className="faith-layout">
            <div className="faith-tabs-list">
              {statementOfFaith.map((item, idx) => (
                <button
                  key={idx}
                  className={`faith-tab-btn ${activeFaithTab === idx ? 'active' : ''}`}
                  onClick={() => setActiveFaithTab(idx)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className="faith-content">
              <div className="faith-content-icon">✝️</div>
              <h3 className="faith-content-title">{statementOfFaith[activeFaithTab].title}</h3>
              <p className="faith-content-text animate-fade-in" key={activeFaithTab}>
                {statementOfFaith[activeFaithTab].content}
              </p>
              <blockquote className="faith-scripture">
                "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness."
                <cite>— 2 Timothy 3:16</cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── PROJECTS DIRECTORY ──────────────────────────────────── */}
        {projects && projects.length > 0 && (
          <section className="projects-section reveal">
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <span className="section-tag">ON THE GROUND</span>
              <h2 className="section-title">Ministry Projects</h2>
              <div className="section-rule" />
            </div>
            <div className="grid-3">
              {projects.map(proj => (
                <div key={proj.id || proj._id} className="project-card">
                  <div className="proj-top">
                    <h4>{proj.title}</h4>
                    <span className={`badge ${
                      proj.status === 'Completed' ? 'badge-success' :
                      proj.status === 'Current'   ? 'badge-gold'    : 'badge-info'
                    }`}>{proj.status}</span>
                  </div>
                  <p>{proj.description}</p>
                  {proj.progress !== undefined && (
                    <div className="proj-progress">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
                      </div>
                      <span className="progress-pct">{proj.progress}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EVENTS CALENDAR ─────────────────────────────────────── */}
        {events && events.length > 0 && (
          <section className="events-section reveal">
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <span className="section-tag">COMING UP</span>
              <h2 className="section-title">Events Calendar</h2>
              <div className="section-rule" />
            </div>
            <div className="events-list">
              {events.map(evt => (
                <div key={evt.id || evt._id} className="event-row">
                  <div className="event-date-box">
                    <span className="event-date-text">{evt.date}</span>
                  </div>
                  <div className="event-details">
                    <h4>{evt.title}</h4>
                    <p className="event-location">📍 {evt.location}</p>
                    <p className="event-desc">{evt.description}</p>
                  </div>
                  <a href="#contact" className="btn btn-sm btn-outline-gold event-rsvp">RSVP</a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ──────────────────────────────────────────── */}
        <section className="about-cta-banner reveal">
          <div className="cta-banner-inner text-center">
            <span className="section-tag" style={{ color: 'rgba(255,255,255,0.7)' }}>JOIN THE MISSION</span>
            <h2 style={{ color: '#fff' }}>How Can You Pray for You?</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '560px', margin: '0 auto 2rem' }}>
              We know you have a lot on your mind. God is always here — and so are we. Whatever you are carrying, let us pray with you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#prayer-programs" className="btn" style={{ background: '#fff', color: 'var(--primary-blue)' }}>Request Prayer</a>
              <a href="#support" className="btn btn-outline-gold">Give a Donation</a>
            </div>
          </div>
        </section>

      </div>{/* end about-body */}

      <style>{`
        .about-page { background: #fff; }

        /* ── Hero ── */
        .about-hero {
          position: relative;
          width: 100vw;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          margin-top: -2rem;
          background: linear-gradient(135deg, #0f2035 0%, #1a3a6b 60%, #0f2035 100%);
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/salvation.jpg') center/cover no-repeat;
          opacity: 0.12;
        }
        .about-hero-overlay {
          display: none;
        }
        .about-hero-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
        }
        .about-hero-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: var(--primary-gold);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .about-hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: #fff;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .about-hero-sub {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Body wrapper ── */
        .about-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Bio Section ── */
        .bio-section {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 4rem;
          align-items: start;
          padding: 5rem 0 4rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .bio-image-col {
          position: sticky;
          top: 90px;
        }
        .bio-img-wrapper {
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(26,58,107,0.18);
          border: 4px solid #fff;
          outline: 1px solid var(--glass-border);
        }
        .bio-portrait {
          width: 100%;
          height: 520px;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .bio-img-caption {
          margin-top: 1.25rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .bio-img-caption strong {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--primary-blue);
        }
        .bio-img-caption span {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary-gold);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .bio-text-col {
          padding-top: 1rem;
        }
        .bio-heading {
          font-family: var(--font-serif);
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          color: var(--primary-blue);
          line-height: 1.25;
          margin: 0.5rem 0 0;
        }
        .bio-gold-rule {
          width: 60px;
          height: 4px;
          background: var(--primary-gold);
          border-radius: 2px;
          margin: 1.25rem 0 1.75rem;
        }
        .bio-lead {
          font-family: var(--font-serif);
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
          font-style: italic;
          border-left: 4px solid var(--primary-gold);
          padding-left: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .bio-lead cite {
          display: block;
          margin-top: 0.4rem;
          font-style: normal;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--primary-gold);
        }
        .bio-text-col p {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 1.2rem;
        }
        .bio-affiliation-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid var(--glass-border);
          border-left: 4px solid var(--primary-blue);
          border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
          padding: 1.25rem 1.5rem;
          margin: 1.75rem 0;
        }
        .bio-aff-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .bio-aff-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary-gold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .bio-aff-value {
          font-size: 0.92rem;
          color: var(--primary-blue);
          font-weight: 600;
        }
        .bio-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        /* ── Stats strip ── */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: var(--primary-blue);
          width: 100vw;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative;
          margin-top: 0;
        }
        .stat-item {
          padding: 2.5rem 1.5rem;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--primary-gold);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── Mission/Vision ── */
        .mv-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 4rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .mv-card {
          padding: 2.5rem;
          background: #f8fafc;
          border: 1px solid var(--glass-border);
          border-top: 4px solid var(--primary-blue);
          border-radius: var(--border-radius-md);
          transition: var(--transition-normal);
        }
        .mv-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--blue-shadow);
        }
        .mv-card-gold {
          border-top-color: var(--primary-gold);
        }
        .mv-card-gold:hover {
          box-shadow: var(--gold-shadow);
        }
        .mv-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        .mv-card h3 {
          font-size: 1.4rem;
          color: var(--primary-blue);
          margin-bottom: 0.75rem;
        }
        .mv-card p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        /* ── Core Values ── */
        .values-section {
          padding: 4rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .values-header {
          margin-bottom: 3rem;
        }
        .section-rule {
          width: 50px;
          height: 3px;
          background: var(--primary-gold);
          border-radius: 2px;
          margin: 1rem auto 0;
        }
        .value-card {
          background: #fff;
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          padding: 2rem 1.5rem;
          transition: var(--transition-normal);
          position: relative;
          overflow: hidden;
        }
        .value-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-gold));
          transform: scaleX(0);
          transition: var(--transition-normal);
          transform-origin: left;
        }
        .value-card:hover::after { transform: scaleX(1); }
        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--blue-shadow);
        }
        .value-num {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--glass-border);
          color: #e2e8f0;
          display: block;
          margin-bottom: 1rem;
          line-height: 1;
        }
        .value-card h4 {
          font-size: 1rem;
          color: var(--primary-blue);
          margin-bottom: 0.6rem;
        }
        .value-card p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Timeline ── */
        .timeline-section {
          padding: 4rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .timeline-track {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          padding: 1rem 0;
        }
        .timeline-spine {
          position: absolute;
          top: 0; bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          background: linear-gradient(to bottom, var(--primary-blue), var(--primary-gold));
          border-radius: 2px;
        }
        .timeline-item {
          display: flex;
          justify-content: flex-end;
          width: 50%;
          padding-right: 3rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .timeline-item.right {
          justify-content: flex-start;
          margin-left: 50%;
          padding-left: 3rem;
          padding-right: 0;
        }
        .timeline-node {
          position: absolute;
          right: -8px;
          top: 1.1rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-gold);
          border: 3px solid #fff;
          box-shadow: 0 0 0 2px var(--primary-blue);
          z-index: 1;
        }
        .timeline-item.right .timeline-node {
          right: auto;
          left: -8px;
        }
        .timeline-card {
          background: #fff;
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(26,58,107,0.06);
          text-align: left;
          max-width: 340px;
        }
        .tl-year {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary-gold);
          display: block;
          margin-bottom: 0.35rem;
        }
        .timeline-card h4 {
          font-size: 1rem;
          color: var(--primary-blue);
          margin-bottom: 0.4rem;
        }
        .timeline-card p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Statement of Faith ── */
        .faith-section {
          padding: 4rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .faith-header {
          margin-bottom: 3rem;
        }
        .faith-sub {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-top: 0.75rem;
        }
        .faith-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 0;
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--glass-shadow);
        }
        .faith-tabs-list {
          background: #f8fafc;
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
        }
        .faith-tab-btn {
          text-align: left;
          padding: 0.85rem 1.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition-fast);
          border-left: 3px solid transparent;
        }
        .faith-tab-btn:hover { color: var(--primary-blue); background: rgba(26,58,107,0.03); }
        .faith-tab-btn.active {
          color: var(--primary-blue);
          background: #fff;
          border-left-color: var(--primary-gold);
          font-weight: 700;
        }
        .faith-content {
          padding: 3rem;
          background: #fff;
        }
        .faith-content-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .faith-content-title {
          font-size: 1.5rem;
          color: var(--primary-blue);
          margin-bottom: 1rem;
        }
        .faith-content-text {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.75;
          margin-bottom: 2rem;
        }
        .faith-scripture {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.95rem;
          color: var(--text-muted);
          border-left: 3px solid var(--primary-gold);
          padding-left: 1.25rem;
          margin: 0;
        }
        .faith-scripture cite {
          display: block;
          margin-top: 0.4rem;
          font-style: normal;
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--primary-gold);
        }

        /* ── Projects ── */
        .projects-section {
          padding: 4rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .project-card {
          background: #fff;
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-md);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: var(--transition-normal);
        }
        .project-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--glass-shadow);
        }
        .proj-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .proj-top h4 {
          font-size: 1.05rem;
          color: var(--primary-blue);
          margin: 0;
        }
        .project-card p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          flex-grow: 1;
        }
        .proj-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }
        .progress-bar-bg {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-blue), var(--primary-gold));
          border-radius: 3px;
          transition: width 1s ease;
        }
        .progress-pct {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary-gold);
          white-space: nowrap;
        }

        /* ── Events ── */
        .events-section {
          padding: 4rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .event-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid var(--glass-border);
        }
        .event-row:last-child { border-bottom: none; }
        .event-date-box {
          min-width: 160px;
          background: var(--primary-blue);
          color: #fff;
          padding: 1rem 1.25rem;
          border-radius: var(--border-radius-sm);
          text-align: center;
          flex-shrink: 0;
        }
        .event-date-text {
          font-family: var(--font-serif);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-gold);
        }
        .event-details { flex: 1; }
        .event-details h4 {
          font-size: 1.1rem;
          color: var(--primary-blue);
          margin-bottom: 0.25rem;
        }
        .event-location {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--primary-gold);
          margin-bottom: 0.4rem;
        }
        .event-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        .event-rsvp { flex-shrink: 0; }

        /* ── CTA Banner ── */
        .about-cta-banner {
          width: 100vw;
          left: 50%; right: 50%;
          margin-left: -50vw; margin-right: -50vw;
          position: relative;
          background: linear-gradient(135deg, var(--primary-blue) 0%, #1a3a6b 100%);
          padding: 5rem 1.5rem;
          margin-top: 4rem;
        }
        .cta-banner-inner {
          max-width: 700px;
          margin: 0 auto;
        }
        .about-cta-banner h2 {
          color: #fff;
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .bio-section { grid-template-columns: 1fr; gap: 2.5rem; }
          .bio-image-col { position: static; }
          .bio-portrait { height: 420px; }
          .timeline-spine { left: 20px; transform: none; }
          .timeline-item { width: 100%; padding-left: 4rem; padding-right: 0; justify-content: flex-start; }
          .timeline-item.right { margin-left: 0; padding-left: 4rem; }
          .timeline-node { right: auto; left: 12px; }
          .timeline-item.right .timeline-node { left: 12px; }
          .timeline-card { max-width: 100%; }
          .stats-strip { grid-template-columns: repeat(2, 1fr); }
          .faith-layout { grid-template-columns: 1fr; }
          .faith-tabs-list { flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--glass-border); padding: 0; }
          .faith-tab-btn { border-left: none; border-bottom: 3px solid transparent; white-space: nowrap; }
          .faith-tab-btn.active { border-left: none; border-bottom-color: var(--primary-gold); }
          .faith-content { padding: 2rem; }
        }
        @media (max-width: 768px) {
          .mv-section { grid-template-columns: 1fr; }
          .event-row { flex-wrap: wrap; }
          .event-date-box { min-width: 100%; }
          .bio-portrait { height: 320px; }
          .stats-strip { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 480px) {
          .stats-strip { grid-template-columns: 1fr 1fr; }
          .stat-num { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
