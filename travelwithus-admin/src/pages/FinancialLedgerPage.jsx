import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_TRANSACTIONS } from '../api/adminApi';
import {
  DollarSign, RotateCcw, Search, CheckCircle2,
  AlertCircle, CreditCard, ArrowDownRight, ArrowUpRight, X
} from 'lucide-react';

export const FinancialLedgerPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer requested itinerary cancellation');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTransactions();
      setTransactions(data);
    } catch {
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTxn) return;
    setSubmitting(true);
    try {
      const res = await adminApi.refundTransaction(
        selectedTxn.paymentReference,
        parseFloat(refundAmount || selectedTxn.amount),
        refundReason
      );
      setTransactions(prev => prev.map(t =>
        t.paymentReference === selectedTxn.paymentReference
          ? { ...t, status: 'REFUNDED' }
          : t
      ));
      triggerNotification(`Refund issued for ${selectedTxn.paymentReference}`);
      setSelectedTxn(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const filtered = transactions.filter(t =>
    t.paymentReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.bookingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVolume = transactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalRefunded = transactions
    .filter(t => t.status === 'REFUNDED')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div>
      {/* Toast Alert */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 100,
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Financial Ledger & Payments
        </h1>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time transaction logs, Stripe / Razorpay token settlements, and automated refund dispatcher.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Total Settled Volume</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ArrowUpRight size={14} /> Successful settlements
          </span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Processed Refunds</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171' }}>
            ${totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <ArrowDownRight size={14} /> Cancelled bookings refunded
          </span>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Net Revenue</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2dd4bf' }}>
            ${(totalVolume - totalRefunded).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
            Reconciled across all gateways
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '420px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by Payment Ref, Booking # or customer email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filtered.length}</strong> transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Payment Ref</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Booking #</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Customer</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Payment Method</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => (
              <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#2dd4bf', fontWeight: 600 }}>
                  {txn.paymentReference}
                </td>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                  {txn.bookingNumber}
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                  {txn.customerEmail}
                </td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#f1f5f9' }}>
                  ${txn.amount?.toFixed(2)}
                </td>
                <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} />
                    <span>•••• {txn.cardLastFour || '4242'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: txn.status === 'SUCCESS'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                    color: txn.status === 'SUCCESS' ? '#34d399' : '#f87171'
                  }}>
                    {txn.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  {txn.status === 'SUCCESS' && (
                    <button
                      onClick={() => {
                        setSelectedTxn(txn);
                        setRefundAmount(txn.amount.toString());
                      }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#f87171',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
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
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Issue Transaction Refund</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reference: {selectedTxn.paymentReference}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Refund Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedTxn.amount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Maximum refundable: ${selectedTxn.amount.toFixed(2)}
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Refund Reason
                </label>
                <textarea
                  rows="3"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  style={{
                    padding: '10px 18px',
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Processing...' : 'Confirm Refund'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
