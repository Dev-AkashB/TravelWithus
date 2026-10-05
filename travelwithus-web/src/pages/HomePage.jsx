import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles, Shield, Clock, Award } from 'lucide-react';
import { api, FALLBACK_DESTINATIONS, FALLBACK_PACKAGES, FALLBACK_HOTELS } from '../api/client';
import { RatingStars } from '../components/RatingStars';

export const HomePage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState(FALLBACK_DESTINATIONS);
  const [packages, setPackages] = useState(FALLBACK_PACKAGES);
  const [hotels, setHotels] = useState(FALLBACK_HOTELS);

  // Search Widget State
  const [searchDestination, setSearchDestination] = useState('');
  const [tripType, setTripType] = useState('ALL'); // ALL, PACKAGES, HOTELS
  const [guests, setGuests] = useState('1');

  useEffect(() => {
    api.getDestinations().then(data => data && setDestinations(data.slice(0, 6)));
    api.getPackages().then(data => data && setPackages(data.slice(0, 4)));
    api.getHotels().then(data => data && setHotels(data.slice(0, 3)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (tripType === 'HOTELS') {
      navigate(`/hotels?query=${encodeURIComponent(searchDestination)}`);
    } else {
      navigate(`/packages?query=${encodeURIComponent(searchDestination)}&guests=${guests}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '48px', paddingBottom: '60px' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div
            className="badge badge-teal"
            style={{ marginBottom: '20px', padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} /> Premium Real-Time Travel & Luxury Holidays in India
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              lineHeight: 1.15,
              marginBottom: '20px',
              maxWidth: '960px',
              margin: '0 auto 20px',
              color: '#0f172a',
              letterSpacing: '-0.03em'
            }}
          >
            Curated Indian Expeditions & Luxury Resort Escapes
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#475569',
              maxWidth: '720px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}
          >
            Explore the tranquil backwaters of Kerala, golden beaches of Goa, snow-clad peaks of Kashmir, and royal forts of Rajasthan with verified live bookings.
          </p>

          {/* Interactive Search Bar Panel */}
          <form
            onSubmit={handleSearch}
            style={{
              maxWidth: '940px',
              margin: '0 auto',
              padding: '24px',
              borderRadius: '24px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 0 25px rgba(13, 148, 136, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              {['ALL', 'PACKAGES', 'HOTELS'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: tripType === type ? '#f0fdfa' : 'transparent',
                    color: tripType === type ? '#0d9488' : '#64748b',
                    border: tripType === type ? '1px solid #99f6e4' : '1px solid transparent',
                    transition: 'var(--transition)'
                  }}
                >
                  {type === 'ALL' ? 'All Expeditions' : type === 'PACKAGES' ? 'Tour Packages' : 'Hotels & Resorts'}
                </button>
              ))}
            </div>

            {/* Input grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                  <MapPin size={15} color="#0d9488" /> Where to?
                </label>
                <input
                  type="text"
                  placeholder="Goa, Kashmir, Kerala, Rajasthan..."
                  className="input-field"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                  <Calendar size={15} color="#0d9488" /> Approximate Dates
                </label>
                <input
                  type="date"
                  className="input-field"
                  defaultValue={new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', color: '#475569', marginBottom: '6px' }}>
                  <Users size={15} color="#0d9488" /> Travelers
                </label>
                <select
                  className="input-field"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="1">1 Solo Traveler</option>
                  <option value="2">2 Travelers (Couples)</option>
                  <option value="4">4 Travelers (Family / Group)</option>
                  <option value="6">6+ Travelers (Private Tour)</option>
                </select>
              </div>

              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', height: '46px', fontSize: '0.95rem' }}
                >
                  <Search size={18} /> Search Holidays
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge badge-teal" style={{ marginBottom: '8px' }}>Top Indian & Global Hotspots</div>
              <h2 style={{ fontSize: '2.2rem', color: '#0f172a' }}>Featured Destinations</h2>
            </div>
            <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontWeight: 700 }}>
              View all destinations <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/packages?query=${encodeURIComponent(dest.name)}`}
                className="glass-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-teal">{dest.category}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    <RatingStars rating={dest.rating || 4.9} />
                  </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>{dest.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>{dest.country}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px', flex: 1 }}>
                    {dest.tagline}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Packages from</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0d9488' }}>₹{Number(dest.startingPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <span style={{ color: '#0d9488', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Explore <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Tour Packages */}
      <section style={{ padding: '80px 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '8px' }}>Hand-Crafted Itineraries</div>
              <h2 style={{ fontSize: '2.2rem', color: '#0f172a' }}>Trending Holiday Packages</h2>
            </div>
            <Link to="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontWeight: 700 }}>
              Browse all itineraries <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="glass-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {pkg.discountPercentage > 0 && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span className="badge badge-rose">-{pkg.discountPercentage}% OFF</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.9)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 700, marginBottom: '4px' }}>
                    {pkg.destinationName}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', lineHeight: '1.35', marginBottom: '10px', flex: 1, color: '#0f172a' }}>
                    {pkg.title}
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <RatingStars rating={pkg.rating || 4.9} size={14} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Per Person</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>₹{Number(pkg.price).toLocaleString('en-IN')}</span>
                    </div>
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      Book Tour
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Resorts & Stays */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge badge-teal" style={{ marginBottom: '8px' }}>5-Star Accommodations</div>
              <h2 style={{ fontSize: '2.2rem', color: '#0f172a' }}>Sanctuaries & Luxury Resorts</h2>
            </div>
            <Link to="/hotels" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontWeight: 700 }}>
              View all hotels <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={hotel.imageUrl} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-gold">5-Star Luxury</span>
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '6px' }}>{hotel.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
                    {hotel.city}, {hotel.country}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {hotel.amenities?.slice(0, 3).map((amenity, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155', fontWeight: 500 }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: 'auto' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>From</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0d9488', marginLeft: '6px' }}>₹{Number(hotel.pricePerNight).toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}> / night</span>
                    </div>
                    <Link to={`/booking?type=HOTEL&id=${hotel.id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      Reserve Stay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
