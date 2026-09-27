import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_ADMIN_HOTELS } from '../api/adminApi';
import {
  Building2, Plus, Search, Trash2, CheckCircle2,
  Star, Bed, MapPin, DollarSign, X
} from 'lucide-react';

export const HotelsManagerPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    destinationName: 'Jimbaran, Bali',
    destinationId: 1,
    starRating: 5,
    pricePerNight: 299,
    roomTypesCount: 3,
    totalRooms: 40,
    availableRooms: 20,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  });

  const loadHotels = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getHotels();
      setHotels(data);
    } catch {
      setHotels(MOCK_ADMIN_HOTELS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate hotel "${name}"?`)) return;
    try {
      await adminApi.deleteHotel(id);
      setHotels(prev => prev.filter(h => h.id !== id));
      triggerNotification(`Hotel "${name}" deactivated.`);
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
        starRating: parseInt(formData.starRating),
        pricePerNight: parseFloat(formData.pricePerNight),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms)
      };
      const created = await adminApi.createHotel(payload);
      setHotels(prev => [created, ...prev]);
      setShowAddModal(false);
      triggerNotification(`Hotel "${payload.name}" registered successfully!`);
      setFormData({
        name: '',
        destinationName: 'Jimbaran, Bali',
        destinationId: 1,
        starRating: 5,
        pricePerNight: 299,
        roomTypesCount: 3,
        totalRooms: 40,
        availableRooms: 20,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
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

  const filtered = hotels.filter(h =>
    h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.destinationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Partner Hotels & Resorts
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Monitor luxury hospitality partners, room availability, and night rates.
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
          Add Hotel Property
        </button>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by hotel or location..."
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
          Showing <strong>{filtered.length}</strong> hospitality partners
        </div>
      </div>

      {/* Hotel Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ height: '170px', position: 'relative' }}>
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'flex',
                gap: '2px',
                alignItems: 'center'
              }}>
                {[...Array(hotel.starRating || 5)].map((_, i) => (
                  <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>
                <MapPin size={14} color="#14b8a6" />
                {hotel.destinationName}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 14px 0', color: 'var(--text-primary)' }}>
                {hotel.name}
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Rate / Night</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2dd4bf' }}>
                    ${hotel.pricePerNight?.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Room Inventory</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                    {hotel.availableRooms} / {hotel.totalRooms} Avail
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: 'auto'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  ACTIVE PARTNER
                </span>

                <button
                  onClick={() => handleDelete(hotel.id, hotel.name)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Hotel Modal */}
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
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Register Hotel Property</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Add new lodging partner to inventory</span>
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
                  Hotel Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Ritz-Carlton Grand Resort"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jimbaran, Bali"
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
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
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Star Rating (1-5)
                  </label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => setFormData({ ...formData, starRating: e.target.value })}
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
                    <option value="5">5 Stars (Luxury)</option>
                    <option value="4">4 Stars (Superior)</option>
                    <option value="3">3 Stars (Standard)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Base Rate ($/Night)
                  </label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
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
                    Total Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
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
                    Available Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.availableRooms}
                    onChange={(e) => setFormData({ ...formData, availableRooms: e.target.value })}
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
                  {submitting ? 'Registering...' : 'Register Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
