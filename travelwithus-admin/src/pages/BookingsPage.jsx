import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_BOOKINGS } from '../api/adminApi';
import { Search, Filter, Calendar, Users, Eye, CheckCircle2, XCircle, Clock, Check, X } from 'lucide-react';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    adminApi.getBookings().then(data => data && setBookings(data));
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleStatusChange = async (bookingNumber, newStatus) => {
    await adminApi.updateBookingStatus(bookingNumber, newStatus);
    setBookings(prev => prev.map(b => b.bookingNumber === bookingNumber ? { ...b, status: newStatus } : b));
    if (selectedBooking && selectedBooking.bookingNumber === bookingNumber) {
      setSelectedBooking(prev => ({ ...prev, status: newStatus }));
    }
    triggerNotification(`Booking ${bookingNumber} marked as ${newStatus}`);
  };

  const filtered = bookings.filter(b => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesQuery = !searchQuery ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#0d9488', color: '#fff', padding: '12px 24px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Header and Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '4px' }}>Reservations & Guest Manifests</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Live booking synchronization across Tour Packages and Luxury Resort inventory.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: statusFilter === tab ? '#f0fdfa' : '#f1f5f9',
                color: statusFilter === tab ? '#0d9488' : '#475569',
                border: `1px solid ${statusFilter === tab ? '#99f6e4' : '#cbd5e1'}`
              }}
            >
              {tab === 'ALL' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Filter by booking number (e.g. TWU-BKG-...), customer name, or email..."
          className="admin-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Bookings Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking Ref</th>
              <th>Customer</th>
              <th>Tour / Hotel</th>
              <th>Travel Dates</th>
              <th>Billed Total (INR)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#0d9488' }}>{b.bookingNumber}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(b.createdAt).toLocaleDateString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{b.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.customerEmail}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{b.itemTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600 }}>{b.bookingType}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{b.startDate}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>to {b.endDate}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{Number(b.totalAmount).toLocaleString('en-IN')}</span>
                </td>
                <td>
                  <span className={`status-badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-pending'}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      title="Inspect Manifest"
                      className="btn-admin-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <Eye size={14} /> Manifest
                    </button>
                    {b.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusChange(b.bookingNumber, 'CONFIRMED')}
                        className="btn-success"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusChange(b.bookingNumber, 'CANCELLED')}
                        className="btn-danger"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manifest Inspection Modal */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="admin-card"
            style={{ width: '100%', maxWidth: '600px', padding: '32px', background: '#ffffff', borderRadius: '20px', boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '6px' }}>MANIFEST DETAILS</span>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{selectedBooking.bookingNumber}</h3>
              </div>
              <span className={`status-badge ${selectedBooking.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-pending'}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Itinerary:</span>
                <strong style={{ color: '#0f172a' }}>{selectedBooking.itemTitle}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Travel Dates:</span>
                <span style={{ color: '#0f172a' }}>{selectedBooking.startDate} → {selectedBooking.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Total Paid Amount:</span>
                <strong style={{ color: '#0d9488', fontSize: '1.1rem' }}>₹{Number(selectedBooking.totalAmount).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '12px' }}>Traveler Records ({selectedBooking.numberOfGuests} Guests)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: '#f0fdfa', borderRadius: '8px', borderLeft: '3px solid #0d9488', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#0f172a' }}>
                  <span>{selectedBooking.customerName} (Primary Contact)</span>
                  <span style={{ color: '#0d9488' }}>ID: IND-98234120</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                  {selectedBooking.customerEmail} • Verified Traveler
                </div>
              </div>

              {selectedBooking.numberOfGuests > 1 && (
                <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#0f172a' }}>
                    <span>Priya Sharma</span>
                    <span style={{ color: '#64748b' }}>ID: IND-98234121</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px' }}>
                    Guest 2 • Adult (30)
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-admin-secondary"
              >
                Close Manifest
              </button>
              {selectedBooking.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusChange(selectedBooking.bookingNumber, 'CONFIRMED')}
                  className="btn-admin-primary"
                >
                  <Check size={16} /> Approve & Confirm Reservation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
