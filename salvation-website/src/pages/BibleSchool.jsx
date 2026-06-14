import React, { useState } from 'react';
import { submitEnrollment } from '../api/index';

export default function BibleSchool() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Course 101: Foundations of Salvation');
  const [submittedEnrollment, setSubmittedEnrollment] = useState(false);

  const coursesList = [
    { code: "BS-101", title: "Foundations of Salvation", duration: "6 Weeks", level: "Beginner", desc: "Understanding the scriptural mechanics of salvation, justification, repentance, and new birth." },
    { code: "BS-201", title: "Authority of the Believer", duration: "8 Weeks", level: "Intermediate", desc: "Equipping students with spiritual tools to walk in divine authority, prayer warfare, and healing." },
    { code: "BS-301", title: "Missions & Pioneer Evangelism", duration: "10 Weeks", level: "Advanced", desc: "Practical strategies for open-air crusades, church planting, cross-cultural missions, and community outreach." }
  ];

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (studentName && studentEmail) {
      try {
        await submitEnrollment({ name: studentName, email: studentEmail, course: selectedCourse });
      } catch (err) {
        console.warn('Enrollment API error (non-blocking):', err.message);
      }
      setSubmittedEnrollment(true);
      setStudentName('');
      setStudentEmail('');
      setTimeout(() => setSubmittedEnrollment(false), 5000);
    }
  };

  return (
    <div className="bible-school-page animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="school-header text-center">
        <span className="section-tag">DISCIPLESHIP TRAINING</span>
        <h2>Salvation Series Bible School</h2>
        <p className="lead-desc">Equipping pastors, evangelists, and believers with sound biblical theology and practical mission training.</p>
      </section>

      {/* Intro Grid */}
      <section className="school-intro-section grid-2 card">
        <div className="school-intro-text text-left">
          <h3>Study to Show Thyself Approved</h3>
          <p className="lead-paragraph">
            The Salvation Series Bible School is designed to provide solid, scriptural training. Our primary goal is not academic credentials, but active spiritual activation on the field.
          </p>
          <p>
            Whether you are a new believer seeking to understand the foundations of salvation, or an active minister preparing to launch pioneer church plants, our curriculum is structured to align directly with evolution of the early church.
          </p>
          <div className="school-features-list">
            <div className="school-feat-item">
              <span className="feat-emoji">🎓</span>
              <div>
                <strong>100% Free Tuition</strong>
                <p>Fully sponsored by global mission partners. No fees are required to learn.</p>
              </div>
            </div>
            <div className="school-feat-item">
              <span className="feat-emoji">💻</span>
              <div>
                <strong>Flexible Online Classes</strong>
                <p>Study from anywhere in the world at your own pace with downloadable guides.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="school-enroll-form-box text-left">
          <h3>Enroll in a Course</h3>
          <p className="form-sub-desc">Register for our upcoming virtual semester starting next month.</p>
          
          {submittedEnrollment ? (
            <div className="subscribe-success animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3>🎉 Enrollment Submitted!</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>Thank you for enrolling. Check your email for course syllabus and login credentials within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleEnrollSubmit} className="enroll-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="form-select"
                >
                  {coursesList.map(c => (
                    <option key={c.code} value={`${c.code}: ${c.title}`}>{c.code}: {c.title}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Submit Enrollment Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Courses Catalog Directory */}
      <section className="courses-catalog-section text-left">
        <h3 className="section-title text-center">Core Curriculum Catalogue</h3>
        <p className="text-center" style={{ marginBottom: '2.5rem' }}>Detailed course breakdown and syllabus overview.</p>
        
        <div className="grid-3">
          {coursesList.map(c => (
            <div key={c.code} className="card course-catalog-card">
              <div className="course-card-header">
                <span className="badge badge-blue">{c.code}</span>
                <span className="course-duration">🕒 {c.duration}</span>
              </div>
              <h4>{c.title}</h4>
              <p className="course-level-tag">Level: <strong>{c.level}</strong></p>
              <p className="course-desc-text">{c.desc}</p>
              <a
                href={`https://wa.me/2348023670737?text=${encodeURIComponent(`Hi, I'd like to enrol in ${c.code}: ${c.title} at Salvation Series Bible School.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-block"
                style={{ marginTop: 'auto', textAlign: 'center' }}
              >
                Enrol Now
              </a>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .school-header {
          margin-bottom: 3rem;
        }
        .school-intro-section {
          align-items: center;
          margin-bottom: 4.5rem;
        }
        .school-features-list {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .school-feat-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .feat-emoji {
          font-size: 1.3rem;
          background-color: rgba(30, 58, 138, 0.05);
          padding: 0.4rem;
          border-radius: var(--border-radius-sm);
          color: var(--primary-blue);
          line-height: 1;
        }
        .school-feat-item strong {
          color: var(--primary-blue);
          font-size: 0.95rem;
        }
        .school-feat-item p {
          font-size: 0.85rem;
          margin: 0;
        }

        .course-catalog-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: space-between;
        }
        .course-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .course-duration {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .course-level-tag {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .course-level-tag strong {
          color: var(--primary-gold);
        }
        .course-desc-text {
          font-size: 0.85rem;
          line-height: 1.6;
          margin: 0;
        }
        .btn-block {
          width: 100%;
          padding: 0.85rem;
        }
      `}</style>

    </div>
  );
}
