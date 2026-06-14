import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function Updates() {
  const { content } = useContext(AppContext);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Filter content based on active tab and search query
  const filteredContent = content.filter(item => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const featuredArticle = content[0]; // Take the latest item as featured

  return (
    <div className="updates-page animate-fade-in">
      
      {/* Page Header */}
      <section className="updates-header text-center">
        <span className="section-tag">REPORTS & INSIGHTS</span>
        <h2>Mission Field Updates</h2>
        <p className="lead-desc">Read fresh news, salvation testimonies, and devotionals straight from the frontlines.</p>
      </section>

      {/* Search & Category Filter Section */}
      <section className="filter-bar card reveal">
        <div className="filter-controls">
          <div className="category-tabs">
            {['All', 'Blog', 'Devotional', 'Testimony'].map(type => (
              <button
                key={type}
                className={`tab-btn ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type === 'All' ? 'All Updates' : type + 's'}
              </button>
            ))}
          </div>
          <div className="search-box-container">
            <input
              type="text"
              placeholder="Search reports or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input search-input"
            />
          </div>
        </div>
      </section>

      {/* Featured Article (only show if no search query & on 'All' or matching category) */}
      {!searchQuery && (filterType === 'All' || featuredArticle?.type === filterType) && featuredArticle && (
        <section className="featured-article-section card animate-fade-in reveal" onClick={() => setSelectedArticle(featuredArticle)}>
          <div className="grid-2 featured-grid">
            <div className="featured-img-wrapper">
              <img src={featuredArticle.image} alt={featuredArticle.title} className="featured-img" />
              <span className="badge badge-gold featured-badge">{featuredArticle.type}</span>
            </div>
            <div className="featured-text-col text-left">
              <span className="article-date">{featuredArticle.date}</span>
              <h3>{featuredArticle.title}</h3>
              <p className="featured-excerpt">{featuredArticle.excerpt}</p>
              <p className="featured-preview-text">
                {featuredArticle.content.substring(0, 200)}...
              </p>
              <button className="btn btn-outline-gold btn-sm">Read Full Report</button>
            </div>
          </div>
        </section>
      )}

      {/* Feed Grid */}
      <section className="articles-feed">
        {filteredContent.length === 0 ? (
          <div className="no-results card text-center">
            <span className="no-results-icon">🔍</span>
            <h3>No Updates Found</h3>
            <p>We couldn't find any articles matching your search query or filter criteria. Try adjusting your parameters.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filteredContent
              .filter(item => searchQuery || filterType !== 'All' || item.id !== featuredArticle?.id) // Exclude featured if in default list
              .map(item => (
                <article key={item.id} className={`card article-card text-left reveal${filteredContent.indexOf(item) < 3 ? ` reveal-delay-${filteredContent.indexOf(item) + 1}` : ''}`} onClick={() => setSelectedArticle(item)}>
                  <div className="article-img-box">
                    <img src={item.image} alt={item.title} className="article-img" />
                    <span className="badge badge-info article-badge">{item.type}</span>
                  </div>
                  <div className="article-body">
                    <span className="article-date">{item.date}</span>
                    <h4>{item.title}</h4>
                    <p className="article-excerpt">{item.excerpt}</p>
                    <span className="read-more-text">Read More →</span>
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>

      {/* Detailed Article Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="modal-content article-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedArticle(null)}>✕</button>
            
            <div className="modal-scroll-area">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="modal-hero-img" />
              
              <div className="modal-article-header text-left">
                <div className="modal-header-meta">
                  <span className="badge badge-gold">{selectedArticle.type}</span>
                  <span className="article-date">{selectedArticle.date}</span>
                </div>
                <h3>{selectedArticle.title}</h3>
              </div>
              
              <div className="modal-article-body text-left">
                {selectedArticle.content.split('\n\n').map((para, idx) => (
                  <p key={idx} className="modal-paragraph">{para}</p>
                ))}
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setSelectedArticle(null)}>Close</button>
                <a href="#support" className="btn btn-primary" onClick={() => setSelectedArticle(null)}>Support this Work</a>
              </div>
            </div>
            
          </div>
        </div>
      )}

      <style>{`
        .updates-header {
          margin-bottom: 3rem;
        }
        .filter-bar {
          padding: 1.25rem 2rem;
          margin-bottom: 3rem;
        }
        .filter-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .search-box-container {
          flex-grow: 1;
          max-width: 400px;
        }
        .search-input {
          padding: 0.6rem 1rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%239ca3af' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: calc(100% - 15px) center;
          padding-right: 2.5rem;
        }
        
        .featured-article-section {
          cursor: pointer;
          margin-bottom: 4rem;
          padding: 1.5rem;
        }
        .featured-grid {
          align-items: center;
        }
        .featured-img-wrapper {
          position: relative;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          height: 350px;
          border: 1px solid var(--glass-border);
        }
        .featured-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }
        .featured-article-section:hover .featured-img {
          transform: scale(1.03);
        }
        .featured-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .featured-text-col {
          padding: 1rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.75rem;
        }
        .article-date {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-gold);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .featured-excerpt {
          font-size: 1.15rem;
          color: white;
          font-weight: 500;
          line-height: 1.5;
        }
        .featured-preview-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .article-card {
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .article-img-box {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-bottom: 1px solid var(--glass-border);
        }
        .article-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }
        .article-card:hover .article-img {
          transform: scale(1.05);
        }
        .article-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
        }
        .article-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 0.5rem;
        }
        .article-body h4 {
          font-size: 1.15rem;
          color: white;
          line-height: 1.35;
        }
        .article-excerpt {
          font-size: 0.85rem;
          color: var(--text-secondary);
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .read-more-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-gold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.5rem;
        }

        .no-results {
          padding: 4rem 2rem;
        }
        .no-results-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        /* Article Modal Custom */
        .article-modal-content {
          max-width: 800px;
          padding: 0;
          overflow: hidden;
        }
        .modal-scroll-area {
          max-height: 85vh;
          overflow-y: auto;
          padding-bottom: 2.5rem;
        }
        .modal-hero-img {
          width: 100%;
          height: 380px;
          object-fit: cover;
        }
        .modal-article-header {
          padding: 2rem 2.5rem 1rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .modal-header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .modal-article-body {
          padding: 2rem 2.5rem;
        }
        .modal-paragraph {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 0 2.5rem;
        }

        @media (max-width: 768px) {
          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }
          .category-tabs {
            display: flex;
            overflow-x: auto;
            gap: 0.5rem;
            padding-bottom: 0.5rem;
          }
          .tab-btn {
            white-space: nowrap;
          }
          .search-box-container {
            max-width: 100%;
          }
          .featured-img-wrapper {
            height: 200px;
          }
          .featured-text-col {
            padding: 1rem 0.5rem;
          }
          .modal-hero-img {
            height: 220px;
          }
          .modal-article-header, .modal-article-body, .modal-actions {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }
      `}</style>

    </div>
  );
}
