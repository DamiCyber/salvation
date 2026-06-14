import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { submitContact } from '../api/index';

export default function Contact() {
  const { submitPrayerRequest } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    submitToPrayerWall: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Send to server contact collection
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
    } catch (err) {
      console.warn('Contact API error (non-blocking):', err.message);
    }

    // If the checkbox is checked, also post to prayer wall
    if (formData.submitToPrayerWall) {
      submitPrayerRequest(formData.name, formData.message);
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '', submitToPrayerWall: false });
  };

  return (
    <div className="contact-page-container animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="contact-header text-center">
        <span className="section-tag">CONNECT WITH US</span>
        <h2>Contact Our Ministry</h2>
        <p className="lead-desc">
          Have questions about our crusades, want to partner with our mission, or have a prayer need? 
          We would love to hear from you.
        </p>
      </section>

      {/* Main Grid: Info on left, Form on right */}
      <div className="grid-2 contact-grid">
        
        {/* Left Column: Contact Details */}
        <div className="contact-info-col text-left reveal-left">
          
          <div className="info-card card">
            <h3 className="column-title">Ministry Headquarters</h3>
            <p className="info-intro">
              Salvation Series World Outreach operates globally to share the gospel. Get in touch with our administrative offices.
            </p>
            
            <div className="contact-methods">
              <div className="contact-item">
                <span className="material-symbols-outlined contact-icon" style={{ color: 'var(--primary-blue)' }}>location_on</span>
                <div className="contact-text">
                  <h5>Office Address</h5>
                  <p>104 Faith Temple Way, Suite A, Richmond, VA 23220</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="material-symbols-outlined contact-icon" style={{ color: 'var(--primary-blue)' }}>call</span>
                <div className="contact-text">
                  <h5>General Inquiries</h5>
                  <p>+1 (800) 555-FAITH (3248)</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="material-symbols-outlined contact-icon" style={{ color: 'var(--primary-blue)' }}>mail</span>
                <div className="contact-text">
                  <h5>Email Address</h5>
                  <p>contact@salvationoutreach.org</p>
                </div>
              </div>

              <div className="contact-item">
                <span className="material-symbols-outlined contact-icon" style={{ color: 'var(--primary-blue)' }}>schedule</span>
                <div className="contact-text">
                  <h5>Office Hours</h5>
                  <p>Monday – Friday: 9:00 AM – 5:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card card emergency-prayer-card" style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--primary-crimson)' }}>
            <h3 className="column-title" style={{ color: 'var(--primary-crimson)' }}>24/7 Prayer Line</h3>
            <p>
              If you have an urgent prayer need or need someone to stand in faith with you right now, please call our round-the-clock prayer intercessors.
            </p>
            <div className="prayer-phone">
              <span className="material-symbols-outlined phone-icon" style={{ color: 'var(--primary-crimson)', marginRight: '0.4rem' }}>call</span>
              <a href="tel:18005557729" className="prayer-phone-link">+1 (800) 555-PRAY (7729)</a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-form-col reveal-right">
          <div className="card form-wrapper-card">
            {submitted ? (
              <div className="submission-success text-center animate-fade-in">
                <span className="material-symbols-outlined success-emoji" style={{ fontSize: '3.5rem', color: 'var(--primary-gold)', display: 'block', marginBottom: '1rem' }}>check_circle</span>
                <h3>Message Sent Successfully!</h3>
                <p>
                  Thank you for reaching out to Salvation Series World Outreach. Our ministry team has received your message and will respond to you shortly.
                </p>
                {formData.submitToPrayerWall && (
                  <div className="prayer-badge-note animate-pulse">
                    ✨ Your request has also been posted to the Prayer Wall.
                  </div>
                )}
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Send Us a Message</h3>
                
                {error && (
                  <div className="form-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span> {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">Email Address *</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">Subject</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership & Donations">Partnership & Donations</option>
                    <option value="Prayer & Counseling">Prayer Request</option>
                    <option value="Bible School Admission">Bible School Admission</option>
                    <option value="Media & Press">Media & Press</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">Your Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help or pray for you?"
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="submitToPrayerWall"
                      checked={formData.submitToPrayerWall}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="checkbox-custom-text">
                      Also share this message as a prayer request on the public Prayer Wall.
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .contact-header {
          margin-bottom: 3rem;
        }
        .lead-desc {
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0.5rem auto 0;
        }
        .section-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--primary-gold);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
        }
        
        .contact-grid {
          align-items: start;
        }

        .column-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: var(--primary-blue);
        }

        .info-card {
          margin-bottom: 1.5rem;
        }

        .info-intro {
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .contact-icon {
          font-size: 1.3rem;
          line-height: 1;
          margin-top: 0.2rem;
          background: rgba(30, 58, 138, 0.05);
          padding: 0.4rem;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .contact-text h5 {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--primary-blue);
          margin-bottom: 0.15rem;
        }

        .contact-text p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .prayer-phone {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          background: rgba(220, 38, 38, 0.05);
          padding: 0.75rem 1.25rem;
          border-radius: var(--border-radius-sm);
          border: 1px dashed rgba(220, 38, 38, 0.2);
          width: fit-content;
        }

        .prayer-phone-link {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-crimson);
        }

        .prayer-phone-link:hover {
          color: var(--crimson-hover);
          text-decoration: underline;
        }

        .phone-icon {
          color: var(--primary-crimson);
          font-size: 1.2rem;
        }

        /* Form styling details */
        .form-wrapper-card {
          padding: 2.5rem;
        }

        .form-error-banner {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--danger);
          padding: 0.75rem 1rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        /* Checkbox customization */
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          margin-top: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          gap: 0.75rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
          text-align: left;
        }

        .form-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--primary-blue);
          margin-top: 0.1rem;
          cursor: pointer;
        }

        .checkbox-custom-text {
          font-weight: 500;
        }

        /* Success screen styling */
        .submission-success {
          padding: 2rem 1rem;
        }

        .success-emoji {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .success-emoji {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .prayer-badge-note {
          background: rgba(212, 175, 55, 0.1);
          color: var(--gold-hover);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-block;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .form-wrapper-card {
            padding: 1.5rem;
          }
        }
      `}</style>

    </div>
  );
}
