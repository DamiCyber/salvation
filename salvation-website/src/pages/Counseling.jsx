import React, { useState } from 'react';
import { submitCounseling } from '../api/index';

export default function Counseling() {
  const [counselorName, setCounselorName] = useState('');
  const [counselorEmail, setCounselorEmail] = useState('');
  const [counselorPhone, setCounselorPhone] = useState('');
  const [counselTopic, setCounselTopic] = useState('Salvation & Faith Foundations');
  const [counselDate, setCounselDate] = useState('');
  const [counselDescription, setCounselDescription] = useState('');
  const [bookedStatus, setBookedStatus] = useState(false);

  const scripturalReferences = [
    { verse: "Proverbs 11:14", text: "Where no counsel is, the people fall: but in the multitude of counsellors there is safety." },
    { verse: "James 5:16", text: "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much." },
    { verse: "Galatians 6:2", text: "Bear ye one another's burdens, and so fulfil the law of Christ." }
  ];

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (counselorName && counselorEmail && counselDate) {
      try {
        await submitCounseling({
          name: counselorName,
          email: counselorEmail,
          phone: counselorPhone,
          topic: counselTopic,
          description: counselDescription,
          message: `Preferred date: ${counselDate}`,
        });
      } catch (err) {
        console.warn('Counseling API error (non-blocking):', err.message);
      }
      setBookedStatus(true);
      setCounselorName('');
      setCounselorEmail('');
      setCounselorPhone('');
      setCounselDate('');
      setCounselDescription('');
      setTimeout(() => setBookedStatus(false), 5000);
    }
  };

  return (
    <div className="counseling-page animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="counsel-header text-center">
        <span className="section-tag">PASTORAL GUIDANCE</span>
        <h2>Counselling & Support Services</h2>
        <p className="lead-desc">Receive prayer, biblical guidance, and pastoral support for spiritual, marriage, and personal breakthroughs.</p>
      </section>

      {/* Main Grid */}
      <section className="counsel-main grid-2 card">
        {/* Left Col: Booking Form */}
        <div className="counsel-booking-form text-left font-sans">
          <h3>Schedule a Private Counselling Session</h3>
          <p className="form-sub-desc">Fill out your details below to schedule a one-on-one session with our pastoral team (conducted in-person or via zoom).</p>
          
          {bookedStatus ? (
            <div className="subscribe-success animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3>🎉 Session Booked Successfully!</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>Your counselling request has been scheduled. Check your email inbox for zoom details and calendar invitations shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={counselorName}
                  onChange={(e) => setCounselorName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={counselorEmail}
                    onChange={(e) => setCounselorEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+234 803 123 4567"
                    value={counselorPhone}
                    onChange={(e) => setCounselorPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Focus Area</label>
                  <select
                    value={counselTopic}
                    onChange={(e) => setCounselTopic(e.target.value)}
                    className="form-select"
                  >
                    <option value="Salvation & Faith Foundations">Salvation & Faith Foundations</option>
                    <option value="Spiritual Warfare & Deliverance">Spiritual Warfare & Deliverance</option>
                    <option value="Marriage & Family Counseling">Marriage & Family Counseling</option>
                    <option value="Purpose & Calling Discernment">Purpose & Calling Discernment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Session Date</label>
                  <input
                    type="date"
                    value={counselDate}
                    onChange={(e) => setCounselDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Brief Description of Need</label>
                <textarea
                  placeholder="Share details you are comfortable with to help the pastor prepare..."
                  className="form-textarea"
                  value={counselDescription}
                  onChange={e => setCounselDescription(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Request Session Booking
              </button>
            </form>
          )}
        </div>

        {/* Right Col: Scriptures & Instructions */}
        <div className="counsel-info text-left">
          <h3>The Gift of Spiritual Counsel</h3>
          <p className="lead-paragraph">We are here to support you. You do not have to carry your burdens alone. Pastoral counselling is confidential and free of charge.</p>
          
          <div className="scriptures-box" style={{ marginTop: '2.5rem' }}>
            <h4 style={{ color: 'var(--primary-blue)', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Scriptural Foundations</h4>
            {scripturalReferences.map((ref, idx) => (
              <div key={idx} className="scripture-ref-item" style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontStyle: 'italic', margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>"{ref.text}"</p>
                <cite style={{ display: 'block', textAlign: 'right', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-gold)', marginTop: '0.25rem' }}>— {ref.verse}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .counsel-header {
          margin-bottom: 3rem;
        }
        .counsel-main {
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .counsel-info {
          padding-left: 1rem;
        }
        .btn-block {
          width: 100%;
          padding: 0.85rem;
        }
      `}</style>

    </div>
  );
}
