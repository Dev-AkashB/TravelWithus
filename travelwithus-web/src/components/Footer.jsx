import React from 'react';
import { Compass, ShieldCheck, Headphones, Award, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#070a12', marginTop: '100px', paddingTop: '60px', paddingBottom: '40px' }}>
      <div className="container">
        {/* Value Proposition Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', paddingBottom: '50px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.1)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Instant Confirmation</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Real-time inventory hold & secure booking</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>Best Price Guarantee</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Direct partner rates with no hidden fees</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>24/7 Dedicated Concierge</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Personal assistance every step of the journey</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', padding: '50px 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Compass size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Travel<span style={{ color: '#2dd4bf' }}>WithUs</span></span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
              Pioneering enterprise real-time vacation packages, bespoke itineraries, and premier global stays.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '16px' }}>Top Destinations</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <li><Link to="/destinations">Bali, Indonesia</Link></li>
              <li><Link to="/destinations">Paris, France</Link></li>
              <li><Link to="/destinations">Maldives Atolls</Link></li>
              <li><Link to="/destinations">Swiss Alps</Link></li>
              <li><Link to="/destinations">Dubai, UAE</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '16px' }}>Travel Offerings</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <li><Link to="/packages">Curated Tour Packages</Link></li>
              <li><Link to="/hotels">Luxury Resort Stays</Link></li>
              <li><Link to="/my-bookings">Manage Reservations</Link></li>
              <li><Link to="/destinations">Explore Travel Map</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '16px' }}>Travel Insider Newsletter</h5>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
              Receive hand-crafted luxury travel itineraries and secret flash deals.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="email" placeholder="Your email address" className="input-field" style={{ padding: '8px 12px', fontSize: '0.85rem' }} />
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Join</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
          <div>© {new Date().getFullYear()} TravelWithUs Platform. Built with Spring Boot 3 & React.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>PCI-DSS Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
