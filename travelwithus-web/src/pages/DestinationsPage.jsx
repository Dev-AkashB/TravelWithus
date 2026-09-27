import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Filter } from 'lucide-react';
import { api, FALLBACK_DESTINATIONS } from '../api/client';
import { RatingStars } from '../components/RatingStars';

const CATEGORIES = ['ALL', 'BEACH', 'CULTURAL', 'ADVENTURE', 'URBAN'];

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
      d.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '12px' }}>Curated Atlas</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '14px' }}>Explore Global Destinations</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
          From tropical turquoise atolls to historic cultural capitals, find the perfect backdrop for your next story.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          borderRadius: '20px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between'
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
                background: selectedCategory === cat ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'var(--transition)'
              }}
            >
              {cat === 'ALL' ? 'All Types' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by city or country..."
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
              <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px' }}>
                <RatingStars rating={dest.rating || 4.9} />
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.4rem' }}>{dest.name}</h3>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{dest.country}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '20px', flex: 1 }}>
                {dest.tagline}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Packages starting at</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2dd4bf' }}>${dest.startingPrice}</span>
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
