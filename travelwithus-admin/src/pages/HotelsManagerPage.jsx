import React, { useState, useEffect } from 'react';
import { adminApi, MOCK_ADMIN_HOTELS } from '../api/adminApi';
import {
  Building2, Plus, Search, Trash2, CheckCircle2,
  Star, Bed, MapPin, IndianRupee, X
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
    destinationName: 'Cavelossim, Goa',
    destinationId: 1,
    starRating: 5,
    pricePerNight: 12500,
    roomTypesCount: 3,
    totalRooms: 60,
    availableRooms: 24,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
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
        destinationName: 'Cavelossim, Goa',
        destinationId: 1,
        starRating: 5,
        pricePerNight: 12500,
        roomTypesCount: 3,
        totalRooms: 60,
        availableRooms: 24,
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
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
            Partner Hotels & Luxury Resorts
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Monitor luxury hospitality partners across India, live room availability, and night rates in INR (₹).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-admin-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Add Hotel Property
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-card" style={{
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder="Filter hotels by name or location (Goa, Kashmir, Kerala, Rajasthan)..."
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
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            className="admin-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ position: 'relative', height: '170px' }}>
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                {hotel.starRating}-Star
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontWeight: 600, fontSize: '0.8rem', marginBottom: '6px' }}>
                <MapPin size={14} color="#0d9488" />
                {hotel.destinationName}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 14px 0', color: '#0f172a', lineHeight: 1.35 }}>
                {hotel.name}
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Rate / Night</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{Number(hotel.pricePerNight).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Room Inventory</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#047857' }}>
                    {hotel.availableRooms} / {hotel.totalRooms} Avail
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                marginTop: 'auto'
              }}>
                <span className="status-badge badge-confirmed">
                  ACTIVE PARTNER
                </span>

                <button
                  onClick={() => handleDelete(hotel.id, hotel.name)}
                  className="btn-danger"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  Deactivate
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
            maxWidth: '560px',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Register Hotel Property</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Contract new hospitality provider</span>
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
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Taj Mahal Palace, Mumbai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cavelossim, Goa"
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Star Rating
                  </label>
                  <select
                    value={formData.starRating}
                    onChange={(e) => setFormData({ ...formData, starRating: e.target.value })}
                    className="admin-input"
                  >
                    <option value="5">5 Stars (Luxury)</option>
                    <option value="4">4 Stars (Superior)</option>
                    <option value="3">3 Stars (Heritage Boutique)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Rate (INR ₹/Night)
                  </label>
                  <input
                    type="number"
                    min="500"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Total Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>
                    Available Rooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.availableRooms}
                    onChange={(e) => setFormData({ ...formData, availableRooms: e.target.value })}
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
                  {submitting ? 'Registering...' : 'Register Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
