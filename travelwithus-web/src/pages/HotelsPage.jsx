import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Wifi, Coffee, Utensils, Waves, ArrowRight } from 'lucide-react';
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
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
        <div className="badge badge-teal" style={{ marginBottom: '12px' }}>Five-Star Sanctuaries</div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '14px' }}>Luxury Resorts & Stays</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
          World-class hospitality, private overwater bungalows, and premier cliffside villas.
        </p>
      </div>

      {/* Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px',
          borderRadius: '20px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search Bali, Paris, Maldives..."
            className="input-field"
            style={{ paddingLeft: '44px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Showing <strong>{filtered.length}</strong> luxury properties
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
              <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px' }}>
                <RatingStars rating={hotel.rating || 4.9} />
              </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{hotel.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
                <MapPin size={14} color="#2dd4bf" /> {hotel.city}, {hotel.country}
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {hotel.amenities?.map((amenity, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1'
                    }}
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Rates from</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                    ${hotel.pricePerNight}
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}> / night</span>
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
