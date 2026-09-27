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
  const [maxPrice, setMaxPrice] = useState(3000);

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
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
        <div className="badge badge-gold" style={{ marginBottom: '12px' }}>Curated Itineraries</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '14px' }}>Tour & Vacation Packages</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
          Fully coordinated private journeys featuring luxury stays, guided cultural access, and round-trip transfers.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '20px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search Bali, Paris, Swiss Alps..."
            className="input-field"
            style={{ paddingLeft: '44px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Max Budget: <strong>${maxPrice}</strong></span>
          <input
            type="range"
            min="500"
            max="4000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ accentColor: '#14b8a6', cursor: 'pointer' }}
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                    {pkg.discountPercentage}%% Off Early Bird
                  </span>
                </div>
              )}
            </div>

            {/* Info Column */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className="badge badge-teal">{pkg.destinationName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <Clock size={14} /> {pkg.durationDays} Days / {pkg.durationNights} Nights
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#fbbf24' }}>
                    <Users size={14} /> {pkg.availableSlots} Slots Left
                  </span>
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{pkg.title}</h2>

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
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#cbd5e1'
                      }}
                    >
                      <Check size={12} color="#2dd4bf" /> {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Package Rate</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                    ${pkg.price}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}> / traveler</span>
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
