import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Calendar, MapPin, Clock, ArrowRight, XCircle, AlertTriangle, Star, CheckCircle2 } from 'lucide-react';

export const MyBookingsPage = () => {
  const { user, openAuth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel dates');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    setLoading(true);
    const userId = user ? user.id : 1;
    const data = await api.getUserBookings(userId);

    // If empty demo, provide initial realistic bookings in ₹
    if (data.length === 0) {
      const demoSeed = [
        {
          id: 991,
          bookingNumber: 'TWU-BKG-994BC342',
          itemTitle: 'Goa Coastal Grandeur & Private Catamaran Escape',
          itemReferenceId: 1,
          bookingType: 'PACKAGE',
          numberOfGuests: 2,
          totalAmount: 49998.00,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          startDate: '2026-10-15',
          endDate: '2026-10-20',
          createdAt: new Date().toISOString()
        },
        {
          id: 992,
          bookingNumber: 'TWU-BKG-883A9F12',
          itemTitle: 'The Khyber Himalayan Resort & Spa',
          itemReferenceId: 2,
          bookingType: 'HOTEL',
          numberOfGuests: 2,
          totalAmount: 79200.00,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          startDate: '2026-11-05',
          endDate: '2026-11-09',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];
      setBookings(demoSeed);
      localStorage.setItem('twu_demo_bookings', JSON.stringify(demoSeed));
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);

    try {
      await api.cancelBooking(cancelModalBooking.id, cancelReason);
      const updated = bookings.map(b =>
        b.id === cancelModalBooking.id
          ? { ...b, status: 'CANCELLED', cancellationReason: cancelReason }
          : b
      );
      setBookings(updated);
      localStorage.setItem('twu_demo_bookings', JSON.stringify(updated));
      setCancelModalBooking(null);
    } catch {
      alert('Cancellation request failed.');
    } finally {
      setCancelling(false);
    }
  };

  const filtered = bookings.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '44px 28px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Calendar size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Sign In to View Reservations
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
            Please authenticate with your email & password or Single Sign-On (Google, GitHub, Enterprise SSO) to access your personalized travel bookings.
          </p>
          <button onClick={() => openAuth('login')} className="btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '8px' }}>Traveler Dashboard</div>
          <h1 style={{ fontSize: '2.5rem', color: '#0f172a' }}>My Reservations & Itineraries</h1>
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CONFIRMED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: filterStatus === st ? 'linear-gradient(135deg, #0d9488, #0f766e)' : '#f1f5f9',
                color: filterStatus === st ? '#ffffff' : '#475569',
                border: filterStatus === st ? '1px solid #0d9488' : '1px solid #cbd5e1',
                transition: 'var(--transition)'
              }}
            >
              {st === 'ALL' ? 'All Bookings' : st}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
          <Calendar size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '8px' }}>No reservations found</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Ready to embark on an adventure? Explore our curated holiday packages.</p>
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
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d9488', letterSpacing: '1px' }}>
                      {b.bookingNumber}
                    </span>
                    <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-teal' : b.status === 'CANCELLED' ? 'badge-rose' : 'badge-gold'}`}>
                      {b.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>{b.itemTitle}</h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Billed</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>₹{Number(b.totalAmount).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0', margin: '16px 0', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Departure & Return</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{b.startDate} → {b.endDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Traveler Manifest</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{b.numberOfGuests || b.travelers?.length || 2} Guest(s)</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Payment Confirmation</span>
                  <span style={{ color: '#047857', fontWeight: 600 }}>✓ Paid In Full</span>
                </div>
              </div>

              {b.cancellationReason && (
                <div style={{ padding: '10px 14px', background: '#fee2e2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#be123c', fontSize: '0.85rem', marginBottom: '16px' }}>
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
                      color: '#be123c',
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
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
                    <Star size={14} color="#f59e0b" /> Write Verified Review
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
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setCancelModalBooking(null)}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', padding: '32px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48', marginBottom: '14px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>Confirm Cancellation</h3>
            </div>

            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you sure you want to cancel reservation <strong>{cancelModalBooking.bookingNumber}</strong> for <strong>{cancelModalBooking.itemTitle}</strong>? Held hotel and tour slots will be released immediately.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Reason for cancellation</label>
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
