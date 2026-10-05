import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_TRANSACTIONS } from '../api/adminApi';
import {
  IndianRupee, Search, Filter, RotateCcw, CheckCircle2,
  AlertTriangle, ArrowUpRight, ArrowDownRight, CreditCard,
  Download, Calendar, ShieldCheck, X
} from 'lucide-react';

export const FinancialLedgerPage = () => {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Traveler requested cancellation per policy');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    const data = await adminApi.getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTxn) return;

    try {
      await adminApi.refundTransaction(
        selectedTxn.paymentReference,
        parseFloat(refundAmount),
        refundReason
      );

      setTransactions(prev =>
        prev.map(t =>
          t.paymentReference === selectedTxn.paymentReference
            ? { ...t, status: 'REFUNDED', refundedAmount: parseFloat(refundAmount) }
            : t
        )
      );

      triggerNotification(`Refund issued for ${selectedTxn.paymentReference}`);
      setSelectedTxn(null);
    } catch {
      triggerNotification('Failed to dispatch refund transaction.');
    }
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = !searchQuery ||
      t.paymentReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalRefunded = transactions
    .filter(t => t.status === 'REFUNDED')
    .reduce((acc, curr) => acc + (curr.refundedAmount || curr.amount), 0);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#0d9488',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          Financial Ledger & Payments
        </h1>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
          Real-time transaction logs, UPI / Razorpay token settlements, and automated refund dispatcher in Indian Rupees (₹).
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Total Settled Volume</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857' }}>
            ₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ArrowUpRight size={14} /> Successful settlements
          </span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Processed Refunds</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#be123c' }}>
            ₹{totalRefunded.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#be123c', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ArrowDownRight size={14} /> Cancelled bookings refunded
          </span>
        </div>

        <div className="admin-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Net Revenue</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0d9488' }}>
            ₹{(totalVolume - totalRefunded).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', display: 'block' }}>
            Reconciled across all payment channels
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '420px' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by Payment Ref, Booking # or customer email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ height: '38px', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'SUCCESS', 'REFUNDED'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: statusFilter === tab ? '#f0fdfa' : '#f1f5f9',
                border: `1px solid ${statusFilter === tab ? '#99f6e4' : '#cbd5e1'}`,
                color: statusFilter === tab ? '#0d9488' : '#475569',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Payment Ref</th>
              <th>Booking Number</th>
              <th>Customer</th>
              <th>Amount (INR)</th>
              <th>Channel / Last 4</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(txn => (
              <tr key={txn.id}>
                <td>
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#0d9488' }}>{txn.paymentReference}</span>
                </td>
                <td style={{ color: '#64748b' }}>
                  {txn.bookingNumber}
                </td>
                <td style={{ color: '#334155' }}>
                  {txn.customerEmail}
                </td>
                <td style={{ fontWeight: 800, color: '#0f172a' }}>
                  ₹{txn.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} color="#0d9488" />
                    <span>{txn.paymentMethod === 'UPI' ? 'UPI Instant' : `•••• ${txn.cardLastFour || '4242'}`}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${txn.status === 'SUCCESS' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                    {txn.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {txn.status === 'SUCCESS' && (
                    <button
                      onClick={() => {
                        setSelectedTxn(txn);
                        setRefundAmount(txn.amount.toString());
                      }}
                      className="btn-danger"
                      style={{
                        padding: '6px 12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={12} />
                      Issue Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {selectedTxn && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#be123c' }}>
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Issue Transaction Refund</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reference: {selectedTxn.paymentReference}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Refund Amount (INR ₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedTxn.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="admin-input"
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Maximum refundable: ₹{selectedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Refund Reason
                </label>
                <textarea
                  rows="3"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="btn-admin-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-primary"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                >
                  Confirm Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
