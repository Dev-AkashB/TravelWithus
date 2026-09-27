import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_ADMIN_PACKAGES } from '../api/adminApi';
import {
  Package, Plus, Search, Trash2, Edit3, CheckCircle2,
  Calendar, MapPin, DollarSign, Percent, Eye, X
} from 'lucide-react';

export const PackagesManagerPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    destinationName: 'Bali, Indonesia',
    destinationId: 1,
    durationDays: 5,
    durationNights: 4,
    price: 999.00,
    discountPercentage: 10,
    availableSlots: 15,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlights: 'Luxury transfers, Guided excursions, Private dinners'
  });

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPackages();
      setPackages(data);
    } catch {
      setPackages(MOCK_ADMIN_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to deactivate package "${title}"?`)) return;
    try {
      await adminApi.deletePackage(id);
      setPackages(prev => prev.filter(p => p.id !== id));
      triggerNotification(`Package "${title}" archived.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPercentage: parseInt(formData.discountPercentage),
        availableSlots: parseInt(formData.availableSlots),
        durationDays: parseInt(formData.durationDays),
        durationNights: parseInt(formData.durationNights),
        highlights: typeof formData.highlights === 'string'
          ? formData.highlights.split(',').map(s => s.trim())
          : formData.highlights
      };
      const created = await adminApi.createPackage(payload);
      setPackages(prev => [created, ...prev]);
      setShowAddModal(false);
      triggerNotification(`Package "${payload.title}" created successfully!`);
      setFormData({
        title: '',
        destinationName: 'Bali, Indonesia',
        destinationId: 1,
        durationDays: 5,
        durationNights: 4,
        price: 999.00,
        discountPercentage: 10,
        availableSlots: 15,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        highlights: 'Luxury transfers, Guided excursions, Private dinners'
      });
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

  const filteredPackages = packages.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.destinationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Toast */}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Tour Packages Inventory
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage curated luxury tours, pricing discounts, and real-time traveler slot capacities.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)'
          }}
        >
          <Plus size={18} />
          Add Tour Package
        </button>
      </div>

      {/* Controls Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by package title or destination..."
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
        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredPackages.length}</strong> active packages
        </div>
      </div>

      {/* Packages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'var(--transition)'
            }}
          >
            {/* Image Banner */}
            <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2dd4bf',
                border: '1px solid rgba(45, 212, 191, 0.3)'
              }}>
                {pkg.durationDays}D / {pkg.durationNights}N
              </div>
              {pkg.discountPercentage > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}>
                  {pkg.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>
                <MapPin size={14} color="#14b8a6" />
                {pkg.destinationName}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {pkg.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Base Price</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f1f5f9' }}>
                    ${pkg.price?.toFixed(2)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Available Slots</span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: pkg.availableSlots < 5 ? '#f87171' : '#34d399'
                  }}>
                    {pkg.availableSlots} remaining
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  ACTIVE
                </span>

                <button
                  onClick={() => handleDelete(pkg.id, pkg.title)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Create New Tour Package</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Publish to global traveler catalog</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto Cherry Blossom & Zen Temples"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Destination
                  </label>
                  <select
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#1e293b',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Bali, Indonesia">Bali, Indonesia</option>
                    <option value="Paris, France">Paris, France</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Swiss Alps, Switzerland">Swiss Alps, Switzerland</option>
                    <option value="Tokyo, Japan">Tokyo, Japan</option>
                    <option value="Dubai, UAE">Dubai, UAE</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Duration (Days / Nights)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Days"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      style={{
                        width: '50%',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Nights"
                      value={formData.durationNights}
                      onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                      style={{
                        width: '50%',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Initial Slots
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.availableSlots}
                    onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Highlights (comma-separated)
                </label>
                <textarea
                  rows="2"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
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
                  onClick={() => setShowAddModal(false)}
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
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Publishing...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
