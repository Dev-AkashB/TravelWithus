import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Clock, Users, Check, ArrowRight, Sparkles } from 'lucide-react';
import { api, FALLBACK_PACKAGES } from '../api/client';
import { RatingStars } from '../components/RatingStars';

export const PackagesPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [packages, setPackages] = useState(FALLBACK_PACKAGES);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState(100000);

  useEffect(() => {
    api.getPackages().then(data => data && setPackages(data));
  }, []);

  const filtered = packages.filter(p => {
    const matchesQuery = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destinationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    return matchesQuery && matchesPrice;
  });

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>Curated Itineraries</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '14px', color: '#0f172a' }}>Tour & Vacation Packages</h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Fully coordinated private journeys featuring luxury stays, guided cultural access, and round-trip transfers across India and beyond.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          padding: '20px 24px',
          borderRadius: '20px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search Goa, Kashmir, Kerala, Rajasthan..."
            className="input-field"
            style={{ paddingLeft: '44px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: '#475569' }}>
            Max Budget: <strong style={{ color: '#0f172a' }}>₹{maxPrice.toLocaleString('en-IN')}</strong>
          </span>
          <input
            type="range"
            min="15000"
            max="150000"
            step="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ accentColor: '#0d9488', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Packages Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {filtered.map(pkg => (
          <div
            key={pkg.id}
            className="glass-card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              borderRadius: '24px',
              overflow: 'hidden'
            }}
          >
            {/* Image Column */}
            <div style={{ position: 'relative', minHeight: '260px' }}>
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {pkg.discountPercentage > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge badge-rose" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                    {pkg.discountPercentage}% Off Festive Special
                  </span>
                </div>
              )}
            </div>

            {/* Info Column */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span className="badge badge-teal">{pkg.destinationName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#64748b' }}>
                    <Clock size={14} color="#0d9488" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#b45309', fontWeight: 600 }}>
                    <Users size={14} /> {pkg.availableSlots} Slots Left
                  </span>
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#0f172a' }}>{pkg.title}</h2>

                <div style={{ marginBottom: '16px' }}>
                  <RatingStars rating={pkg.rating || 4.9} />
                </div>

                {/* Highlights Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {pkg.highlights?.map((h, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#334155',
                        fontWeight: 500
                      }}
                    >
                      <Check size={13} color="#0d9488" /> {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Package Rate</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{Number(pkg.price).toLocaleString('en-IN')}
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}> / traveler</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="btn-secondary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/booking?type=PACKAGE&id=${pkg.id}`}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                  >
                    Book Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
