import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_ADMIN_DESTINATIONS } from '../api/adminApi';
import {
  MapPin, Plus, Search, Trash2, CheckCircle2,
  Globe, Compass, Tag, Star, X, IndianRupee
} from 'lucide-react';

export const DestinationsManagerPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    country: 'India',
    category: 'BEACH',
    tagline: '',
    startingPrice: 14999,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    popular: true,
    attractionCount: 16
  });

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDestinations();
      setDestinations(data);
    } catch {
      setDestinations(MOCK_ADMIN_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove destination "${name}"?`)) return;
    try {
      await adminApi.deleteDestination(id);
      setDestinations(prev => prev.filter(d => d.id !== id));
      triggerNotification(`Destination "${name}" removed.`);
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
        startingPrice: parseFloat(formData.startingPrice),
        attractionCount: parseInt(formData.attractionCount)
      };
      const created = await adminApi.createDestination(payload);
      setDestinations(prev => [created, ...prev]);
      setShowAddModal(false);
      triggerNotification(`Destination "${payload.name}" added successfully!`);
      setFormData({
        name: '',
        country: 'India',
        category: 'BEACH',
        tagline: '',
        startingPrice: 14999,
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        popular: true,
        attractionCount: 16
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

  const categories = ['ALL', 'BEACH', 'CULTURAL', 'ADVENTURE', 'NATURE', 'URBAN'];

  const filtered = destinations.filter(d => {
    const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Toast Alert */}
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
            Destination Management
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Catalog Indian & worldwide holiday hotspots, categories, starting rates in ₹, and attraction landmarks.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-admin-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Add Destination
        </button>
      </div>

      {/* Filter and Category Bar */}
      <div className="admin-card" style={{
        padding: '14px 18px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '380px' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search Goa, Kashmir, Kerala, Rajasthan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ height: '38px', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#f0fdfa' : '#f1f5f9',
                color: selectedCategory === cat ? '#0d9488' : '#475569',
                border: `1px solid ${selectedCategory === cat ? '#99f6e4' : '#cbd5e1'}`,
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="admin-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ position: 'relative', height: '180px' }}>
              <img
                src={dest.imageUrl}
                alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#0d9488',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.5px'
              }}>
                {dest.category}
              </div>
            </div>

            <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    {dest.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>{dest.country}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>From</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{Number(dest.startingPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p style={{
                fontSize: '0.82rem',
                color: '#64748b',
                lineHeight: 1.4,
                marginBottom: '16px',
                flex: 1
              }}>
                {dest.tagline || 'Experience picturesque beauty and exceptional regional attractions.'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                marginTop: 'auto'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {dest.attractionCount || 16} Key Sights
                </span>
                <button
                  onClick={() => handleDelete(dest.id, dest.name)}
                  className="btn-danger"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
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
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Add Destination</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Configure new global travel hub</span>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manali & Solang"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="admin-input"
                  >
                    <option value="BEACH">BEACH</option>
                    <option value="CULTURAL">CULTURAL</option>
                    <option value="ADVENTURE">ADVENTURE</option>
                    <option value="NATURE">NATURE</option>
                    <option value="URBAN">URBAN</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Starting Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                  Tagline / Overview
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snow peaks, pine valleys and river rafting"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="admin-input"
                />
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
                  {submitting ? 'Adding...' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
