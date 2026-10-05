import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_ADMIN_PACKAGES } from '../api/adminApi';
import {
  Package, Plus, Search, Trash2, Edit3, CheckCircle2,
  Calendar, MapPin, IndianRupee, Percent, Eye, X
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
    destinationName: 'Goa, India',
    destinationId: 1,
    durationDays: 5,
    durationNights: 4,
    price: 24999.00,
    discountPercentage: 10,
    availableSlots: 15,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    highlights: 'Luxury transfers, Guided excursions, Sunset catamaran sail'
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
        destinationName: 'Goa, India',
        destinationId: 1,
        durationDays: 5,
        durationNights: 4,
        price: 24999.00,
        discountPercentage: 10,
        availableSlots: 15,
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        highlights: 'Luxury transfers, Guided excursions, Sunset catamaran sail'
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
          background: '#0d9488',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)',
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
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Tour Packages Inventory
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Manage curated luxury tours, pricing discounts, and real-time traveler slot capacities across India and the globe.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-admin-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Add Tour Package
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{
        padding: '14px 18px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Filter packages by title or destination (e.g. Goa, Kashmir, Kerala, Rajasthan)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-input"
          style={{ height: '38px', fontSize: '0.88rem' }}
        />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="admin-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Image Banner */}
            <div style={{ position: 'relative', height: '170px' }}>
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(255, 255, 255, 0.92)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <Calendar size={12} color="#0d9488" />
                {pkg.durationDays}D / {pkg.durationNights}N
              </div>

              {pkg.discountPercentage > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#be123c',
                  padding: '4px 8px',
                  borderRadius: '6px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px' }}>
                <MapPin size={14} color="#0d9488" />
                {pkg.destinationName}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px 0', color: '#0f172a', lineHeight: 1.4 }}>
                {pkg.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Base Price (INR)</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{Number(pkg.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Available Slots</span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: pkg.availableSlots < 5 ? '#be123c' : '#047857'
                  }}>
                    {pkg.availableSlots} remaining
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <span className="status-badge badge-confirmed">
                  ACTIVE
                </span>

                <button
                  onClick={() => handleDelete(pkg.id, pkg.title)}
                  className="btn-danger"
                  style={{
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Create New Tour Package</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Publish to live traveler catalog</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Package Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Golden Triangle: Delhi, Agra & Jaipur Heritage"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Destination
                  </label>
                  <select
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                    className="admin-input"
                  >
                    <option value="Goa, India">Goa, India</option>
                    <option value="Kashmir (Srinagar & Gulmarg), India">Kashmir (Srinagar & Gulmarg), India</option>
                    <option value="Kerala, India">Kerala, India</option>
                    <option value="Rajasthan, India">Rajasthan, India</option>
                    <option value="Ladakh, India">Ladakh, India</option>
                    <option value="Varanasi, India">Varanasi, India</option>
                    <option value="Bali, Indonesia">Bali, Indonesia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Swiss Alps, Switzerland">Swiss Alps, Switzerland</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Duration (Days / Nights)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Days"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      className="admin-input"
                      style={{ width: '50%' }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Nights"
                      value={formData.durationNights}
                      onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                      className="admin-input"
                      style={{ width: '50%' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Base Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Available Slots
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.availableSlots}
                    onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Highlights (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-admin-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-admin-primary"
                  style={{ flex: 1 }}
                >
                  {submitting ? 'Creating...' : 'Publish Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
