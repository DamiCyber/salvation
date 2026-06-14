import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import client from '../api/client';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

// Dynamically load the Paystack inline script once
function usePaystackScript() {
  const [ready, setReady] = useState(!!window.PaystackPop);
  useEffect(() => {
    if (window.PaystackPop) { setReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  return ready;
}

// Sample preview text shown in the reader modal
const MOCK_CHAPTER_TEXT = {
  0: "The voice of God rarely comes as a thunderbolt in a clear sky; more often, it is a whisper in the quiet chambers of a searching soul. In my thirty years of life, I had built a fortress of security. A high-paying tech career, a lovely suburban home, and a predictable future. Yet, when I sat on the red dirt of Kakamega, looking into the eyes of a child who had not eaten in two days, the whisper became a deafening roar. 'Whom shall I send?' The question was not directed at the crowd; it was directed at my comfort. This is the story of how that comfort died, and how a new purpose was born...",
  1: "Obedience is not a feeling; it is a direction. When we pack our bags and step onto the field, the romanticism of missions evaporates. In its place remains the daily grind of language learning, water-borne bugs, and spiritual resistance that feels like walking through deep mud. It is in this wilderness that the heart is refined. If you cannot obey in the small details of preparation, you will stumble in the trials of the field...",
  2: "We had prayed for three hours under a tarp as the rain poured. The village elders had warned us that the local witch doctor had cursed our crusade. But as Daniel took the microphone, the rain ceased, and a profound silence fell over the field. That night, we saw the first miracle. Not a blind eye opening, but a hardened heart breaking. A man who had terrorized the local community for a decade fell to his knees in tears, surrendering his weapons and his life to Jesus...",
};

export default function Books() {
  const { books, receiveDonation } = useContext(AppContext);
  const paystackReady = usePaystackScript();

  // Preview reader
  const [selectedBook,        setSelectedBook]        = useState(null);
  const [previewChapterIndex, setPreviewChapterIndex] = useState(0);

  // Checkout
  const [checkoutBook,     setCheckoutBook]     = useState(null);
  const [buyerName,        setBuyerName]        = useState('');
  const [buyerEmail,       setBuyerEmail]       = useState('');
  const [checkoutSuccess,  setCheckoutSuccess]  = useState(false);
  const [purchaseReceipt,  setPurchaseReceipt]  = useState(null);
  const [payError,         setPayError]         = useState('');
  const [verifying,        setVerifying]        = useState(false);

  const openCheckout = (book) => {
    setCheckoutBook(book);
    setCheckoutSuccess(false);
    setPurchaseReceipt(null);
    setPayError('');
  };

  const closeCheckout = () => {
    setCheckoutBook(null);
    setBuyerName('');
    setBuyerEmail('');
    setCheckoutSuccess(false);
    setPurchaseReceipt(null);
    setPayError('');
  };

  const handlePaystackPay = (e) => {
    e.preventDefault();
    if (!paystackReady) {
      setPayError('Payment system is loading, please wait a moment…');
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('xxxxx')) {
      setPayError('Paystack is not yet configured. Please add your VITE_PAYSTACK_PUBLIC_KEY to the .env file.');
      return;
    }
    setPayError('');

    const handler = window.PaystackPop.setup({
      key:      PAYSTACK_PUBLIC_KEY,
      email:    buyerEmail,
      amount:   checkoutBook.price * 100, // Paystack expects kobo (1 NGN = 100 kobo)
      currency: 'NGN',
      ref:      'SSWO-' + Date.now(),
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'buyer_name', value: buyerName },
          { display_name: 'Book Title',    variable_name: 'book_title', value: checkoutBook.title },
        ],
      },

      // Called when Paystack confirms the payment
      callback: async (response) => {
        setVerifying(true);
        try {
          const res = await client.post('/paystack/verify', {
            reference: response.reference,
            bookId:    checkoutBook._id || checkoutBook.id,
          });
          const { downloadUrl, amountPaid, reference, paidAt } = res.data;

          // Log purchase in donations ledger
          receiveDonation(buyerName || 'Anonymous', amountPaid, `Book: ${checkoutBook.title}`);

          setPurchaseReceipt({
            id:          reference,
            date:        paidAt
              ? new Date(paidAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleString(),
            amount:      amountPaid,
            bookTitle:   checkoutBook.title,
            buyerName:   buyerName || 'Anonymous',
            downloadUrl,
          });
          setCheckoutSuccess(true);
        } catch (err) {
          setPayError(
            'Payment received but verification failed: ' +
            (err.response?.data?.error || err.message) +
            '. Please contact support with reference: ' + response.reference
          );
        } finally {
          setVerifying(false);
        }
      },

      onClose: () => {
        // User dismissed the Paystack popup without paying — do nothing
      },
    });

    handler.openIframe();
  };

  return (
    <div className="books-page animate-fade-in">

      {/* Page Header */}
      <section className="books-header text-center">
        <span className="section-tag">PUBLICATIONS</span>
        <h2>Ministry Literature & Books</h2>
        <p className="lead-desc">Equip your faith with writings on spiritual growth, missionary testimonies, and warfare guidelines.</p>
      </section>

      {/* Books Catalog Grid */}
      <section className="books-catalog">
        <div className="grid-3">
          {books.map(book => (
            <div key={book._id || book.id} className="card book-card text-left">
              <div className="book-cover-container">
                <img src={book.coverUrl} alt={book.title} className="book-cover-img" />
                <span className="book-price-badge">
                  {book.price === 0 ? 'FREE' : `₦${book.price.toLocaleString()}`}
                </span>
              </div>
              <div className="book-card-details">
                <h4>{book.title}</h4>
                <p className="book-desc">{book.description}</p>
                <div className="book-actions-row">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => { setSelectedBook(book); setPreviewChapterIndex(0); }}
                  >
                    Read Preview
                  </button>
                  {book.price === 0 ? (
                    <a href={book.downloadUrl || '#'} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                      Download Free
                    </a>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => openCheckout(book)}>
                      Buy E-Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREVIEW READER MODAL ─────────────────────────────────────────────────── */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content preview-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBook(null)}>✕</button>
            <div className="preview-modal-grid">

              {/* Left: book info + chapter list */}
              <div className="preview-details-col text-left font-sans">
                <img src={selectedBook.coverUrl} alt={selectedBook.title} className="preview-book-cover" />
                <h3>{selectedBook.title}</h3>
                <p className="preview-desc-text">{selectedBook.description}</p>
                <div className="preview-price-box">
                  Price: <strong>{selectedBook.price === 0 ? 'FREE' : `₦${selectedBook.price.toLocaleString()}`}</strong>
                </div>
                <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Chapters Index</h4>
                <div className="chapters-list">
                  {(selectedBook.previewChapters || []).map((chapter, idx) => (
                    <button
                      key={idx}
                      className={`chapter-select-btn ${previewChapterIndex === idx ? 'active' : ''}`}
                      onClick={() => setPreviewChapterIndex(idx)}
                    >
                      {chapter.split(':')[0]}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '2rem' }}>
                  {selectedBook.price === 0 ? (
                    <a href={selectedBook.downloadUrl || '#'} target="_blank" rel="noreferrer" className="btn btn-primary btn-block btn-sm">
                      Download Free E-Book
                    </a>
                  ) : (
                    <button
                      className="btn btn-primary btn-block btn-sm"
                      onClick={() => { const b = selectedBook; setSelectedBook(null); openCheckout(b); }}
                    >
                      Buy E-Book — ₦{selectedBook.price.toLocaleString()}
                    </button>
                  )}
                </div>
              </div>

              {/* Right: chapter text reader */}
              <div className="preview-text-col text-left">
                <div className="reader-header">
                  <span className="reader-chapter-label">
                    {(selectedBook.previewChapters || [])[previewChapterIndex] || 'Preview'}
                  </span>
                </div>
                <div className="reader-body">
                  <p className="reader-text-paragraph">
                    {MOCK_CHAPTER_TEXT[previewChapterIndex] || 'Preview content for this chapter will appear here. Purchase the full e-book to read everything.'}
                  </p>
                  <div className="reader-blur-fade">
                    <p className="fade-text">Preview ends here. Buy the book to unlock all chapters.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── PAYSTACK CHECKOUT MODAL ──────────────────────────────────────────────── */}
      {checkoutBook && (
        <div className="modal-overlay">
          <div className="modal-content checkout-modal-content">
            <button className="modal-close" onClick={closeCheckout}>✕</button>

            {verifying ? (
              <div className="text-center" style={{ padding: '3rem 1rem' }}>
                <div className="spinner" />
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Verifying your payment…</p>
              </div>

            ) : !checkoutSuccess ? (
              <div className="checkout-view">
                <div className="checkout-book-banner">
                  <img src={checkoutBook.coverUrl} alt={checkoutBook.title} className="checkout-cover-thumb" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{checkoutBook.title}</h3>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.2rem' }}>
                      ₦{checkoutBook.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePaystackPay} style={{ marginTop: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(download will be sent here)</span></label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {payError && (
                    <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 6, fontSize: '0.85rem', marginBottom: '1rem' }}>
                      ⚠️ {payError}
                    </div>
                  )}

                  <div className="paystack-info-note">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '0.35rem' }}>lock</span>
                    Secured by Paystack — Card, Bank Transfer & USSD accepted
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={closeCheckout} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={!paystackReady}>
                      {paystackReady ? `Pay ₦${checkoutBook.price.toLocaleString()}` : 'Loading…'}
                    </button>
                  </div>
                </form>
              </div>

            ) : (
              <div className="checkout-success-view text-center animate-fade-in">
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>✅</span>
                <h3>Purchase Successful!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Your payment has been confirmed. Download your e-book below.
                </p>

                {purchaseReceipt && (
                  <div className="receipt-card text-left" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                      <strong style={{ color: 'var(--primary-blue)' }}>Salvation Series World Outreach</strong>
                      <p style={{ fontSize: '0.78rem', margin: '0.2rem 0 0', color: 'var(--text-muted)' }}>E-Book Purchase Confirmation</p>
                    </div>
                    {[
                      ['Transaction Ref', purchaseReceipt.id],
                      ['Date',            purchaseReceipt.date],
                      ['Book',            purchaseReceipt.bookTitle],
                      ['Customer',        purchaseReceipt.buyerName],
                    ].map(([label, val]) => (
                      <div key={label} className="receipt-row">
                        <span>{label}:</span><span>{val}</span>
                      </div>
                    ))}
                    <div className="receipt-total-row">
                      <span>Total Paid:</span>
                      <strong className="receipt-amt-big">₦{purchaseReceipt.amount.toLocaleString()}</strong>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {purchaseReceipt?.downloadUrl && purchaseReceipt.downloadUrl !== '#' ? (
                    <a
                      href={purchaseReceipt.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-block"
                      download
                    >
                      📥 Download E-Book Now
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Download link will be sent to {buyerEmail}. Contact us if you don't receive it within 24 hours.
                    </p>
                  )}
                  <button className="btn btn-secondary btn-block" onClick={closeCheckout}>Back to Catalog</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        .books-header { margin-bottom: 3rem; }
        .book-card { display: flex; flex-direction: column; padding: 0; overflow: hidden; height: 100%; }
        .book-cover-container {
          position: relative; background: var(--bg-950); height: 280px;
          display: flex; justify-content: center; align-items: center;
          overflow: hidden; border-bottom: 1px solid var(--glass-border);
        }
        .book-cover-img { height: 90%; width: auto; object-fit: contain; box-shadow: 0 10px 20px rgba(0,0,0,0.5); transition: var(--transition-normal); }
        .book-card:hover .book-cover-img { transform: scale(1.04) translateY(-5px); }
        .book-price-badge {
          position: absolute; top: 1rem; right: 1rem;
          background: var(--primary-gold); color: var(--bg-950);
          font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 4px;
          font-size: 0.85rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .book-card-details { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; gap: 0.5rem; }
        .book-card-details h4 { font-size: 1.15rem; color: white; }
        .book-desc { font-size: 0.85rem; color: var(--text-secondary); flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .book-actions-row { display: flex; justify-content: space-between; gap: 0.75rem; margin-top: 1rem; }
        .book-actions-row .btn { flex: 1; }

        /* Preview modal */
        .preview-modal-content { max-width: 950px; padding: 0; overflow: hidden; }
        .preview-modal-grid { display: grid; grid-template-columns: 1fr 1.5fr; max-height: 85vh; }
        .preview-details-col { padding: 2.5rem; border-right: 1px solid var(--glass-border); overflow-y: auto; max-height: 85vh; }
        .preview-book-cover { width: 140px; height: auto; margin-bottom: 1.5rem; border-radius: 4px; box-shadow: 0 10px 20px rgba(0,0,0,0.4); display: block; }
        .preview-details-col h3 { font-size: 1.4rem; color: white; margin-bottom: 0.5rem; }
        .preview-desc-text { font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.5; }
        .preview-price-box { font-size: 0.95rem; color: var(--text-primary); }
        .preview-price-box strong { color: var(--primary-gold); }
        .chapters-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .chapter-select-btn { text-align: left; background: var(--bg-800); border: 1px solid var(--glass-border); color: var(--text-secondary); padding: 0.5rem 0.75rem; font-size: 0.85rem; font-weight: 500; cursor: pointer; border-radius: var(--border-radius-sm); transition: var(--transition-fast); }
        .chapter-select-btn:hover { color: white; border-color: rgba(212,175,55,0.4); }
        .chapter-select-btn.active { color: var(--primary-gold); border-color: var(--primary-gold); background: rgba(212,175,55,0.05); }
        .preview-text-col { display: flex; flex-direction: column; height: 100%; max-height: 85vh; overflow: hidden; }
        .reader-header { padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--glass-border); background: rgba(0,0,0,0.1); }
        .reader-chapter-label { font-family: var(--font-serif); font-weight: 700; color: var(--primary-gold); font-size: 1.15rem; }
        .reader-body { padding: 2.5rem; overflow-y: auto; flex-grow: 1; position: relative; }
        .reader-text-paragraph { font-family: var(--font-serif); font-size: 1.05rem; line-height: 1.8; color: #e5e7eb; text-indent: 2rem; }
        .reader-blur-fade { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, var(--bg-900) 80%); padding: 4rem 2rem 2.5rem; text-align: center; }
        .fade-text { font-size: 0.85rem; color: var(--primary-gold); font-weight: 600; margin: 0; }

        /* Checkout modal */
        .checkout-modal-content { max-width: 460px; }
        .checkout-book-banner { display: flex; gap: 1rem; align-items: center; padding-bottom: 1.25rem; border-bottom: 1px solid var(--glass-border); }
        .checkout-cover-thumb { width: 64px; height: 86px; object-fit: cover; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.4); flex-shrink: 0; }
        .paystack-info-note { font-size: 0.78rem; color: var(--text-muted); background: rgba(26,58,107,0.06); border: 1px solid var(--glass-border); border-radius: 6px; padding: 0.6rem 0.9rem; margin-top: 0.5rem; }

        /* Receipt */
        .receipt-card { background: var(--bg-800); border: 1px solid var(--glass-border); border-radius: 8px; padding: 1.25rem; }
        .receipt-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.35rem 0; border-bottom: 1px solid var(--glass-border); color: var(--text-secondary); }
        .receipt-row span:first-child { font-weight: 600; color: var(--text-primary); }
        .receipt-total-row { display: flex; justify-content: space-between; padding: 0.75rem 0 0; font-size: 0.9rem; }
        .receipt-amt-big { color: var(--primary-gold); font-size: 1.2rem; }

        /* Spinner */
        .spinner { width: 40px; height: 40px; border: 4px solid var(--glass-border); border-top-color: var(--primary-blue); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .preview-modal-grid { grid-template-columns: 1fr; }
          .preview-details-col { border-right: none; border-bottom: 1px solid var(--glass-border); max-height: 40vh; padding: 1.5rem; }
          .preview-book-cover { width: 80px; }
          .preview-text-col { max-height: 45vh; }
          .reader-header { padding: 1rem 1.5rem; }
          .reader-body { padding: 1.5rem; }
        }
      `}</style>

    </div>
  );
}
