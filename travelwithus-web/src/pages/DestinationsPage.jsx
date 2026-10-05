import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Filter } from 'lucide-react';
import { api, FALLBACK_DESTINATIONS } from '../api/client';
import { RatingStars } from '../components/RatingStars';

const CATEGORIES = ['ALL', 'BEACH', 'CULTURAL', 'ADVENTURE', 'NATURE'];

export const DestinationsPage = () => {
  const [destinations, setDestinations] = useState(FALLBACK_DESTINATIONS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getDestinations().then(data => data && setDestinations(data));
  }, []);

  const filtered = destinations.filter(d => {
    const matchesCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesQuery = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.tagline && d.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '12px' }}>Curated Atlas</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '14px', color: '#0f172a' }}>Explore Premier Destinations</h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
          From the sun-kissed beaches of Goa and calm backwaters of Kerala to the snow-covered valleys of Kashmir and regal forts of Rajasthan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          padding: '16px 24px',
          borderRadius: '20px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: selectedCategory === cat ? 'linear-gradient(135deg, #0d9488, #0f766e)' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                border: selectedCategory === cat ? '1px solid #0d9488' : '1px solid #cbd5e1',
                transition: 'var(--transition)'
              }}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search city, state or country..."
            className="input-field"
            style={{ paddingLeft: '40px', paddingRight: '14px', height: '42px', fontSize: '0.85rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid-3">
        {filtered.map(dest => (
          <div key={dest.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img
                src={dest.imageUrl}
                alt={dest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                <span className="badge badge-teal">{dest.category}</span>
              </div>
              <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <RatingStars rating={dest.rating || 4.9} />
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a' }}>{dest.name}</h3>
                <span style={{ fontSize: '0.9rem', color: '#0d9488', fontWeight: 600 }}>{dest.country}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', marginBottom: '20px', flex: 1 }}>
                {dest.tagline}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Packages starting at</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d9488' }}>₹{Number(dest.startingPrice).toLocaleString('en-IN')}</span>
                </div>
                <Link
                  to={`/packages?query=${encodeURIComponent(dest.name)}`}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  View Tours <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
