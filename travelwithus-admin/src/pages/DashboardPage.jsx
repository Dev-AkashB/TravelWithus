import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, Package, Star, TrendingUp, Users, ArrowUpRight, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
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
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Operations Executive Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time analytics, booking throughput, and platform inventory performance.
        </p>
      </div>

      {/* KPI Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Metric 1 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gross Platform Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(20, 184, 166, 0.1)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            ${Number(stats.totalRevenue || 284500).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#34d399' }}>
            <TrendingUp size={14} /> +18.4%% from last month
          </div>
        </div>

        {/* Metric 2 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Confirmed Bookings</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            {stats.confirmedBookings || 184}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            12 pending payment authorization
          </div>
        </div>

        {/* Metric 3 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Tour Packages</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            {stats.activePackages || 10}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Across 10 curated global destinations
          </div>
        </div>

        {/* Metric 4 */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Review Moderation</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            {stats.pendingReviews || 3}
          </div>
          <Link to="/reviews" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#2dd4bf', fontWeight: 600 }}>
            Moderate reviews <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Bookings Activity Table */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Recent Reservation Throughput</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Real-time updates from Booking & Payment microservices.</p>
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
                <th>Total Paid</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span style={{ fontWeight: 700, color: '#2dd4bf' }}>{b.bookingNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerEmail}</div>
                  </td>
                  <td>{b.itemTitle}</td>
                  <td>{b.numberOfGuests} Guests</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>${Number(b.totalAmount).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-pending'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <Link to="/bookings" style={{ color: '#2dd4bf', fontWeight: 600, fontSize: '0.85rem' }}>
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
