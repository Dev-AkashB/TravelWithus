import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { api, FALLBACK_HOTELS } from '../api/client';
import { RatingStars } from '../components/RatingStars';

export const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [hotels, setHotels] = useState(FALLBACK_HOTELS);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    api.getHotels().then(data => data && setHotels(data));
  }, []);

  const filtered = hotels.filter(h =>
    !searchQuery ||
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '12px' }}>Five-Star Sanctuaries</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '14px', color: '#0f172a' }}>Luxury Resorts & Heritage Stays</h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
          World-class hospitality, heritage lake palaces, private beach villas, and snow resort sanctuaries across India.
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          padding: '16px 24px',
          borderRadius: '20px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
        }}
      >
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search Goa, Kashmir, Kerala, Udaipur..."
            className="input-field"
            style={{ paddingLeft: '44px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.88rem', color: '#64748b' }}>
          Showing <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> luxury properties
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid-3">
        {filtered.map(hotel => (
          <div key={hotel.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', height: '240px' }}>
              <img src={hotel.imageUrl} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                <span className="badge badge-gold">{hotel.starRating}-Star Luxury</span>
              </div>
              <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <RatingStars rating={hotel.rating || 4.9} />
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '6px' }}>{hotel.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#0d9488', fontWeight: 600, marginBottom: '16px' }}>
                <MapPin size={14} color="#0d9488" /> {hotel.city}, {hotel.country}
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {hotel.amenities?.map((amenity, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#334155',
                      fontWeight: 500
                    }}
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Rates from</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{Number(hotel.pricePerNight).toLocaleString('en-IN')}
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}> / night</span>
                  </div>
                </div>

                <Link
                  to={`/booking?type=HOTEL&id=${hotel.id}`}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Reserve <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
