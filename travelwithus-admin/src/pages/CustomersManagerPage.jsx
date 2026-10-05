import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  Users, UserPlus, Search, Filter, Download, Mail, Phone, MapPin,
  Calendar, Shield, Award, Edit2, Trash2, CheckCircle2, XCircle,
  Eye, FileText, ChevronRight, X, IndianRupee
} from 'lucide-react';

export const CustomersManagerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    country: 'India',
    loyaltyTier: 'SILVER',
    status: 'ACTIVE',
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await adminApi.getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleOpenAddModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      city: '',
      state: '',
      country: 'India',
      loyaltyTier: 'SILVER',
      status: 'ACTIVE',
      notes: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      city: customer.city,
      state: customer.state,
      country: customer.country || 'India',
      loyaltyTier: customer.loyaltyTier || 'SILVER',
      status: customer.status || 'ACTIVE',
      notes: customer.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (isEditModalOpen && selectedCustomer) {
      await adminApi.updateCustomer(selectedCustomer.id, formData);
      triggerNotification(`Customer profile for ${formData.fullName} updated successfully.`);
      setIsEditModalOpen(false);
    } else {
      await adminApi.createCustomer(formData);
      triggerNotification(`New customer ${formData.fullName} added successfully.`);
      setIsAddModalOpen(false);
    }
    loadCustomers();
  };

  const handleDeleteCustomer = async (customer) => {
    if (window.confirm(`Are you sure you want to deactivate customer profile for "${customer.fullName}"?`)) {
      await adminApi.deleteCustomer(customer.id);
      triggerNotification(`Customer ${customer.fullName} removed.`);
      loadCustomers();
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Full Name,Email,Phone,City,State,Loyalty Tier,Total Bookings,Total Spent (INR),Status'];
    const rows = filteredCustomers.map(c =>
      `"${c.id}","${c.fullName}","${c.email}","${c.phoneNumber}","${c.city}","${c.state}","${c.loyaltyTier}","${c.totalBookings}","${c.totalSpent}","${c.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TravelWithUs_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('Customer manifest exported to CSV.');
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !searchQuery ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.phoneNumber && c.phoneNumber.includes(searchQuery));
    const matchesTier = tierFilter === 'ALL' || c.loyaltyTier === tierFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalSpentAll = customers.reduce((acc, curr) => acc + (Number(curr.totalSpent) || 0), 0);
  const platinumCount = customers.filter(c => c.loyaltyTier === 'PLATINUM').length;
  const activeCount = customers.filter(c => c.status === 'ACTIVE').length;

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: '#0d9488', color: '#fff', padding: '12px 24px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> {notification}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: '9999px', background: '#ccfbf1', color: '#0f766e', fontWeight: 700 }}>
              CRM & Traveler Manifests
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>Manage Customer Data</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Centralized traveler database with live loyalty tiers, spending history in ₹, and communication profiles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleExportCSV}
            className="btn-admin-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={handleOpenAddModal}
            className="btn-admin-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <UserPlus size={16} /> Add New Customer
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Registered</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{customers.length}</div>
          </div>
        </div>

        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Active Travelers</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{activeCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Platinum Elite VIP</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{platinumCount}</div>
          </div>
        </div>

        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Cumulative Spend</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d9488' }}>
              ₹{totalSpentAll.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="admin-card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search customer by name, email, city..."
            className="admin-input"
            style={{ paddingLeft: '38px', height: '38px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Tier:</span>
            <select
              className="admin-input"
              style={{ width: '130px', height: '38px', padding: '6px 10px', fontSize: '0.85rem' }}
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option value="ALL">All Tiers</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
            <select
              className="admin-input"
              style={{ width: '130px', height: '38px', padding: '6px 10px', fontSize: '0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th>Loyalty Tier</th>
              <th>Trips Booked</th>
              <th>Total Spend (INR)</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No customer records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(cust => (
                <tr key={cust.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: cust.loyaltyTier === 'PLATINUM' ? '#ede9fe' : cust.loyaltyTier === 'GOLD' ? '#fef3c7' : '#f1f5f9',
                          color: cust.loyaltyTier === 'PLATINUM' ? '#6d28d9' : cust.loyaltyTier === 'GOLD' ? '#b45309' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          border: `2px solid ${cust.loyaltyTier === 'PLATINUM' ? '#c4b5fd' : cust.loyaltyTier === 'GOLD' ? '#fde68a' : '#cbd5e1'}`
                        }}
                      >
                        {cust.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{cust.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>ID: TWU-CUST-{cust.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>{cust.email}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{cust.phoneNumber}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#334155' }}>
                      <MapPin size={14} color="#0d9488" /> {cust.city}, {cust.state}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: cust.loyaltyTier === 'PLATINUM' ? '#ede9fe' : cust.loyaltyTier === 'GOLD' ? '#fef3c7' : '#f1f5f9',
                        color: cust.loyaltyTier === 'PLATINUM' ? '#6d28d9' : cust.loyaltyTier === 'GOLD' ? '#b45309' : '#475569',
                        border: `1px solid ${cust.loyaltyTier === 'PLATINUM' ? '#ddd6fe' : cust.loyaltyTier === 'GOLD' ? '#fde68a' : '#cbd5e1'}`
                      }}
                    >
                      ★ {cust.loyaltyTier}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{cust.totalBookings}</span> reservations
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0d9488', fontSize: '0.95rem' }}>
                      ₹{Number(cust.totalSpent).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${cust.status === 'ACTIVE' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                      {cust.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        title="View Full Profile"
                        style={{ padding: '6px', color: '#0d9488', borderRadius: '6px', background: '#f0fdfa' }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(cust)}
                        title="Edit Customer"
                        style={{ padding: '6px', color: '#0284c7', borderRadius: '6px', background: '#f0f9ff' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(cust)}
                        title="Delete/Deactivate"
                        style={{ padding: '6px', color: '#e11d48', borderRadius: '6px', background: '#fff1f2' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Profile & Details Modal */}
      {selectedCustomer && (
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
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '32px',
              borderRadius: '20px',
              background: '#ffffff',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCustomer(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#f0fdfa',
                  color: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  border: '2px solid #99f6e4'
                }}
              >
                {selectedCustomer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{selectedCustomer.fullName}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className="status-badge badge-confirmed">{selectedCustomer.status}</span>
                  <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>
                    ★ {selectedCustomer.loyaltyTier} TIER
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email Address</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{selectedCustomer.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone Number</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{selectedCustomer.phoneNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{selectedCustomer.city}, {selectedCustomer.state}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Revenue Contribution</div>
                <div style={{ fontWeight: 800, color: '#0d9488', fontSize: '1rem' }}>
                  ₹{Number(selectedCustomer.totalSpent).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Internal Admin Notes & Preferences</div>
              <p style={{ fontSize: '0.88rem', color: '#475569', background: '#fff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', lineHeight: '1.5' }}>
                {selectedCustomer.notes || 'No notes added for this traveler yet.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  const cust = selectedCustomer;
                  setSelectedCustomer(null);
                  handleOpenEditModal(cust);
                }}
                className="btn-admin-primary"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
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
          onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '32px',
              borderRadius: '20px',
              background: '#ffffff',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              style={{ position: 'absolute', top: '20px', right: '20px', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '20px' }}>
              {isEditModalOpen ? 'Edit Customer Profile' : 'Onboard New Customer'}
            </h3>

            <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  className="admin-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="admin-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="admin-input"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    className="admin-input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    className="admin-input"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Loyalty Tier</label>
                  <select
                    className="admin-input"
                    value={formData.loyaltyTier}
                    onChange={(e) => setFormData({ ...formData, loyaltyTier: e.target.value })}
                  >
                    <option value="PLATINUM">Platinum Elite</option>
                    <option value="GOLD">Gold Member</option>
                    <option value="SILVER">Silver Regular</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Account Status</label>
                  <select
                    className="admin-input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Internal Notes & Preferences</label>
                <textarea
                  rows="3"
                  placeholder="Special requests, favorite travel themes, dietary requirements..."
                  className="admin-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="btn-admin-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {isEditModalOpen ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
