import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Gallery() {
  const { gallery } = useContext(AppContext);
  const [photoCategory, setPhotoCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredPhotos = gallery.photos.filter(photo => 
    photoCategory === 'All' || photo.category === photoCategory
  );

  const categories = ['All', 'Outreach', 'Community', 'Crusades', 'Trips'];

  return (
    <div className="gallery-page animate-fade-in font-sans">
      
      {/* Page Header */}
      <section className="gallery-header text-center">
        <span className="section-tag">PHOTOS FROM THE FIELD</span>
        <h2>Ministry Photo Gallery</h2>
        <p className="lead-desc">Explore capture highlights from our various crusades, community water projects, and mission journeys.</p>
      </section>

      {/* Category Filter Bar */}
      <section className="category-filter-section reveal">
        <div className="photo-category-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill ${photoCategory === cat ? 'active' : ''}`}
              onClick={() => setPhotoCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Photos Grid */}
      <section className="photos-grid-section reveal">
        {filteredPhotos.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p>No photos uploaded in this category yet. Log in as admin to upload.</p>
          </div>
        ) : (
          <div className="grid-4 gallery-photos-grid">
            {filteredPhotos.map((photo, idx) => (
              <div 
                key={photo.id} 
                className={`gallery-photo-item card reveal-zoom${idx < 4 ? ` reveal-delay-${idx + 1}` : ''}`}
                onClick={() => setLightboxImage(photo)}
              >
                <img src={photo.url} alt={photo.title} className="gallery-thumbnail" />
                <div className="photo-info-overlay">
                  <h4>{photo.title}</h4>
                  <span className="photo-cat-badge">{photo.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="modal-content lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close lightbox-close-btn" onClick={() => setLightboxImage(null)}>✕</button>
            <img src={lightboxImage.url} alt={lightboxImage.title} className="lightbox-image" />
            <div className="lightbox-caption text-center">
              <h3>{lightboxImage.title}</h3>
              <span className="badge badge-gold">{lightboxImage.category}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-header {
          margin-bottom: 3rem;
        }
        .lead-desc {
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0.5rem auto 0;
        }
        
        .photo-category-bar {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .category-pill {
          padding: 0.5rem 1.25rem;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          background-color: white;
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .category-pill:hover, .category-pill.active {
          color: var(--primary-blue);
          border-color: var(--primary-blue);
        }
        .category-pill.active {
          background-color: var(--primary-blue);
          color: white;
          box-shadow: var(--blue-shadow);
        }

        .gallery-photos-grid {
          margin-bottom: 2rem;
        }
        .gallery-photo-item {
          padding: 0;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          height: 220px;
        }
        .gallery-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }
        .gallery-photo-item:hover .gallery-thumbnail {
          transform: scale(1.05);
        }
        .photo-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(15, 23, 42, 0.95) 85%);
          padding: 3rem 1rem 1rem;
          opacity: 0;
          transition: var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .gallery-photo-item:hover .photo-info-overlay {
          opacity: 1;
        }
        .photo-info-overlay h4 {
          font-size: 0.95rem;
          color: white;
          margin-bottom: 0.25rem;
        }
        .photo-cat-badge {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--primary-gold);
          letter-spacing: 0.05em;
        }

        /* Lightbox Image Styles */
        .lightbox-overlay {
          background-color: rgba(15, 23, 42, 0.95);
        }
        .lightbox-content {
          max-width: 900px;
          background: none;
          border: none;
          padding: 0;
          box-shadow: none;
        }
        .lightbox-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: var(--border-radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .lightbox-caption {
          margin-top: 1.25rem;
        }
        .lightbox-caption h3 {
          font-family: var(--font-serif);
          color: white;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }
        .lightbox-close-btn {
          top: -2.5rem;
          right: 0;
          color: white;
          font-size: 1.8rem;
        }
      `}</style>

    </div>
  );
}
