import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Calendar, Users, MapPin, XCircle, Star, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const MyBookingsPage = () => {
  const { user, openAuth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, CONFIRMED, CANCELLED
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel dates');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user?.id) {
      api.getUserBookings(user.id).then(data => setBookings(data));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Sign in to view your bookings</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Please log in to manage your active reservations and travel itinerary receipts.</p>
        <button onClick={() => openAuth('login')} className="btn-primary">
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      await api.cancelBooking(cancelModalBooking.id, cancelReason);

      // Update state
      setBookings(prev => prev.map(b =>
        b.id === cancelModalBooking.id ? { ...b, status: 'CANCELLED', cancellationReason: cancelReason } : b
      ));

      // Update localStorage demo bookings
      const existing = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      const updated = existing.map(b =>
        b.id === cancelModalBooking.id ? { ...b, status: 'CANCELLED', cancellationReason: cancelReason } : b
      );
      localStorage.setItem('twu_demo_bookings', JSON.stringify(updated));

      setCancelModalBooking(null);
    } finally {
      setCancelling(false);
    }
  };

  const filtered = bookings.filter(b => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>Personal Itineraries</div>
          <h1 style={{ fontSize: '2.4rem' }}>My Reservations</h1>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CONFIRMED', 'CANCELLED'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filter === tab ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: filter === tab ? '#2dd4bf' : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
            >
              {tab === 'ALL' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
          <Calendar size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No reservations found</h3>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Ready to embark on an adventure? Explore our curated global tours.</p>
          <Link to="/packages" className="btn-primary">
            Explore Tour Packages <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map(b => (
            <div key={b.id} className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2dd4bf', letterSpacing: '1px' }}>
                      {b.bookingNumber}
                    </span>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-teal' : b.status === 'CANCELLED' ? 'badge-rose' : 'badge-gold'}`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem' }}>{b.itemTitle}</h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Billed</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>${b.totalAmount}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 0', margin: '16px 0', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Departure & Return</span>
                  <span style={{ color: '#cbd5e1' }}>{b.startDate} → {b.endDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Traveler Manifest</span>
                  <span style={{ color: '#cbd5e1' }}>{b.numberOfGuests || b.travelers?.length || 2} Guest(s)</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Payment Confirmation</span>
                  <span style={{ color: '#34d399' }}>✓ Paid In Full</span>
                </div>
              </div>

              {b.cancellationReason && (
                <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '16px' }}>
                  <strong>Cancellation Reason:</strong> {b.cancellationReason}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                {b.status === 'CONFIRMED' && (
                  <button
                    onClick={() => setCancelModalBooking(b)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      color: '#f87171',
                      border: '1px solid rgba(248, 113, 113, 0.3)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
                {b.itemReferenceId && (
                  <Link
                    to={`/packages/${b.itemReferenceId}`}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <Star size={14} /> Write Verified Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setCancelModalBooking(null)}
        >
          <div
            className="glass-panel"
            style={{ width: '100%', maxWidth: '480px', padding: '32px', borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171', marginBottom: '14px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Confirm Cancellation</h3>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you sure you want to cancel reservation <strong>{cancelModalBooking.bookingNumber}</strong> for <strong>{cancelModalBooking.itemTitle}</strong>? Held hotel and tour slots will be released immediately.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Reason for cancellation</label>
              <select
                className="input-field"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Change of personal travel dates">Change of personal travel dates</option>
                <option value="Medical or family emergency">Medical or family emergency</option>
                <option value="Booked another destination">Booked another destination</option>
                <option value="Found alternative tour">Found alternative tour</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  fontWeight: 600
                }}
                disabled={cancelling}
              >
                {cancelling ? 'Releasing slots...' : 'Yes, Cancel Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
