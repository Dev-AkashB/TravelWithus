import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { adminApi, MOCK_BOOKINGS } from '../api/adminApi';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    adminApi.getBookings(statusFilter === 'ALL' ? null : statusFilter).then(data => {
      if (data) setBookings(data);
    });
  }, [statusFilter]);

  const handleStatusChange = async (bookingNumber, newStatus) => {
    await adminApi.updateBookingStatus(bookingNumber, newStatus);
    setBookings(prev => prev.map(b => b.bookingNumber === bookingNumber ? { ...b, status: newStatus } : b));
  };

  const filtered = bookings.filter(b => {
    const matchesFilter = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesQuery = !searchQuery ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Reservation Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Inspect traveler manifests, track payment reconciliation, and manage reservation statuses.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: statusFilter === tab ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: statusFilter === tab ? '#2dd4bf' : 'var(--text-muted)',
                border: `1px solid ${statusFilter === tab ? 'rgba(20, 184, 166, 0.4)' : 'var(--border-subtle)'}`
              }}
            >
              {tab === 'ALL' ? 'All Bookings' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Search size={18} color="var(--text-sub)" />
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
              <th>Billed Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td>
                  <span style={{ fontWeight: 700, color: '#2dd4bf' }}>{b.bookingNumber}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>{new Date(b.createdAt).toLocaleDateString()}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{b.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.itemTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: '#2dd4bf' }}>{b.bookingType}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{b.startDate}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>to {b.endDate}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>${Number(b.totalAmount).toFixed(2)}</span>
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

      {/* Traveler Manifest Inspection Modal */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="admin-card"
            style={{ width: '100%', maxWidth: '600px', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '6px' }}>MANIFEST DETAILS</span>
                <h3 style={{ fontSize: '1.4rem' }}>{selectedBooking.bookingNumber}</h3>
              </div>
              <span className={`status-badge ${selectedBooking.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-pending'}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Itinerary:</span>
                <strong style={{ color: '#fff' }}>{selectedBooking.itemTitle}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Travel Dates:</span>
                <span style={{ color: '#fff' }}>{selectedBooking.startDate} → {selectedBooking.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Paid Amount:</span>
                <strong style={{ color: '#2dd4bf', fontSize: '1rem' }}>${Number(selectedBooking.totalAmount).toFixed(2)}</strong>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Traveler Records ({selectedBooking.numberOfGuests} Guests)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.08)', borderRadius: '8px', borderLeft: '3px solid #2dd4bf', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff' }}>
                  <span>{selectedBooking.customerName} (Primary Contact)</span>
                  <span style={{ color: '#2dd4bf' }}>Passport: P98234120</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                  {selectedBooking.customerEmail} • Verified Traveler ID
                </div>
              </div>

              {selectedBooking.numberOfGuests > 1 && (
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff' }}>
                    <span>Elena Mercer</span>
                    <span style={{ color: 'var(--text-muted)' }}>Passport: P98234121</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                    Guest 2 • Adult (30)
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="btn-admin-primary"
              style={{ width: '100%' }}
            >
              Close Manifest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
