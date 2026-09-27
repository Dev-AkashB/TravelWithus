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
  const [guests, setGuests] = useState('2');

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
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div
            className="badge badge-teal"
            style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} /> Award-Winning Real-Time Travel Platform
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              lineHeight: 1.15,
              marginBottom: '20px',
              maxWidth: '960px',
              margin: '0 auto 20px',
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Curated World Expeditions & Luxury Resort Escapes
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#94a3b8',
              maxWidth: '700px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}
          >
            Discover breathtaking hand-picked destinations, all-inclusive tour itineraries, and five-star sanctuaries with real-time reservation confirmation.
          </p>

          {/* Interactive Search Bar Panel */}
          <form
            onSubmit={handleSearch}
            className="glass-panel"
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              padding: '24px',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(20, 184, 166, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              {['ALL', 'PACKAGES', 'HOTELS'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: tripType === type ? 'rgba(20, 184, 166, 0.2)' : 'transparent',
                    color: tripType === type ? '#2dd4bf' : '#94a3b8',
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>
                  <MapPin size={14} color="#2dd4bf" /> Where to?
                </label>
                <input
                  type="text"
                  placeholder="Bali, Paris, Maldives, Dubai..."
                  className="input-field"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>
                  <Calendar size={14} color="#2dd4bf" /> Approximate Dates
                </label>
                <input
                  type="date"
                  className="input-field"
                  defaultValue={new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>
                  <Users size={14} color="#2dd4bf" /> Travelers
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
                  <option value="6">6+ Travelers (Private Charter)</option>
                </select>
              </div>

              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', height: '46px', fontSize: '1rem' }}
                >
                  <Search size={18} /> Search Expeditions
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
              <div className="badge badge-teal" style={{ marginBottom: '8px' }}>Global Hotspots</div>
              <h2 style={{ fontSize: '2.2rem' }}>Featured Global Destinations</h2>
            </div>
            <Link to="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2dd4bf', fontWeight: 600 }}>
              View all 10+ destinations <ArrowRight size={16} />
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
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px' }}>
                    <RatingStars rating={dest.rating || 4.9} />
                  </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.3rem' }}>{dest.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{dest.country}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px', flex: 1 }}>
                    {dest.tagline}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Packages from</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2dd4bf' }}>${dest.startingPrice}</span>
                    </div>
                    <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
      <section style={{ padding: '80px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '8px' }}>Hand-Crafted Itineraries</div>
              <h2 style={{ fontSize: '2.2rem' }}>Trending Tour Packages</h2>
            </div>
            <Link to="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2dd4bf', fontWeight: 600 }}>
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
                      <span className="badge badge-rose">-{pkg.discountPercentage}%% OFF</span>
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0, 0, 0, 0.7)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: '#2dd4bf', fontWeight: 600, marginBottom: '4px' }}>
                    {pkg.destinationName}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', lineHeight: '1.35', marginBottom: '10px', flex: 1 }}>
                    {pkg.title}
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <RatingStars rating={pkg.rating || 4.9} size={14} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Per Person</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>${pkg.price}</span>
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
              <h2 style={{ fontSize: '2.2rem' }}>Sanctuaries & Luxury Resorts</h2>
            </div>
            <Link to="/hotels" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2dd4bf', fontWeight: 600 }}>
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
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{hotel.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
                    {hotel.city}, {hotel.country}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {hotel.amenities?.slice(0, 3).map((amenity, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', marginTop: 'auto' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>From</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2dd4bf', marginLeft: '6px' }}>${hotel.pricePerNight}</span>
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
