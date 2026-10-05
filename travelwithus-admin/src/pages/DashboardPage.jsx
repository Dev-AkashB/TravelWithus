import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Calendar, Package, Star, TrendingUp, Users, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { adminApi, MOCK_ADMIN_STATS, MOCK_BOOKINGS } from '../api/adminApi';

export const DashboardPage = () => {
  const [stats, setStats] = useState(MOCK_ADMIN_STATS);
  const [recentBookings, setRecentBookings] = useState(MOCK_BOOKINGS);

  useEffect(() => {
    adminApi.getStats().then(data => data && setStats(data));
    adminApi.getBookings().then(data => data && setRecentBookings(data.slice(0, 5)));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '6px' }}>Operations Executive Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Real-time platform analytics, live reservations throughput, and revenue tracking in Indian Rupees (₹).
        </p>
      </div>

      {/* KPI Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Metric 1 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Gross Platform Volume</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            ₹{Number(stats.totalRevenue || 28450000).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#047857', fontWeight: 600 }}>
            <TrendingUp size={15} /> +22.4% MoM Growth
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Confirmed Bookings</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {stats.confirmedBookings || 324}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
            {stats.pendingBookings || 18} pending verification
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Tour Packages</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {stats.activePackages || 14}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
            Goa, Kashmir, Kerala, Rajasthan & more
          </div>
        </div>

        {/* Metric 4 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Review Moderation</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff1f2', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {stats.pendingReviews || 4}
          </div>
          <Link to="/reviews" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#0d9488', fontWeight: 700 }}>
            Moderate reviews <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Bookings Activity Table */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '4px' }}>Recent Reservation Throughput</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Real-time transactions from Spring Boot Booking & Payment microservices.</p>
          </div>
          <Link to="/bookings" className="btn-admin-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            View All Reservations <ArrowRight size={14} />
          </Link>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Customer</th>
                <th>Itinerary</th>
                <th>Party Size</th>
                <th>Total Paid (INR)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0d9488' }}>{b.bookingNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.customerEmail}</div>
                  </td>
                  <td style={{ color: '#334155' }}>{b.itemTitle}</td>
                  <td>{b.numberOfGuests} Guests</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{Number(b.totalAmount).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`status-badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-pending'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/bookings" style={{ color: '#0d9488', fontWeight: 700, fontSize: '0.85rem' }}>
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
