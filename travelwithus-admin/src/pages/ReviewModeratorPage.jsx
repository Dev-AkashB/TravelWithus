import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_REVIEWS_MODERATION } from '../api/adminApi';
import {
  Star, CheckCircle2, XCircle, ShieldCheck,
  AlertCircle, MessageSquare, Filter, ThumbsUp
} from 'lucide-react';

export const ReviewModeratorPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [notification, setNotification] = useState('');

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getReviewsForModeration(filterStatus === 'ALL' ? 'PENDING' : filterStatus);
      setReviews(data);
    } catch {
      setReviews(MOCK_REVIEWS_MODERATION);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const handleModerate = async (id, status) => {
    try {
      await adminApi.moderateReview(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      triggerNotification(`Review #${id} marked as ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const filteredReviews = reviews.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div>
      {/* Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0d9488',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)',
          zIndex: 100,
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Review Moderation Queue
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Review submitted traveler feedback, verify booking credentials, and approve public display.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: `1px solid ${filterStatus === st ? '#99f6e4' : '#cbd5e1'}`,
                background: filterStatus === st ? '#f0fdfa' : '#f1f5f9',
                color: filterStatus === st ? '#0d9488' : '#475569',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredReviews.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            No reviews matching selected status filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="admin-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#ccfbf1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#0d9488',
                    fontSize: '1rem',
                    border: '2px solid #99f6e4'
                  }}>
                    {rev.userFullName ? rev.userFullName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                        {rev.userFullName || 'Anonymous Traveler'}
                      </span>
                      {rev.verifiedBooking && (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#ecfdf5',
                          color: '#047857',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #a7f3d0'
                        }}>
                          <ShieldCheck size={12} />
                          Verified Booking
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {rev.targetType} #{rev.targetId} • {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rev.rating ? '#f59e0b' : 'none'}
                        color={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                  </div>
                  <span className={`status-badge ${rev.status === 'APPROVED' ? 'badge-confirmed' : rev.status === 'REJECTED' ? 'badge-cancelled' : 'badge-pending'}`}>
                    {rev.status}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                  {rev.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                  "{rev.comment}"
                </p>
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0'
              }}>
                {rev.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleModerate(rev.id, 'APPROVED')}
                    className="btn-success"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    Approve & Publish
                  </button>
                )}

                {rev.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleModerate(rev.id, 'REJECTED')}
                    className="btn-danger"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <XCircle size={15} />
                    Reject Review
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
