import React from 'react';
import { Compass, Plane, ShieldCheck, Headphones, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc', marginTop: '100px', paddingTop: '60px', paddingBottom: '40px' }}>
      <div className="container">
        {/* Value Proposition Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', paddingBottom: '50px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>Instant Confirmation</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Real-time inventory hold & secure booking</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>Best Value Guarantee</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Direct partner rates with no hidden fees</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>24/7 Dedicated Concierge</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Personal assistance every step of the journey</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', padding: '50px 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Compass size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Travel<span style={{ color: '#0d9488' }}>WithUs</span></span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.6' }}>
              Pioneering real-time vacation packages across incredible Indian destinations and bespoke global stays.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700, marginBottom: '16px' }}>Top Destinations</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#475569' }}>
              <li><Link to="/destinations" style={{ transition: 'color 0.2s' }}>Goa, India</Link></li>
              <li><Link to="/destinations" style={{ transition: 'color 0.2s' }}>Kashmir & Gulmarg, India</Link></li>
              <li><Link to="/destinations" style={{ transition: 'color 0.2s' }}>Kerala Backwaters, India</Link></li>
              <li><Link to="/destinations" style={{ transition: 'color 0.2s' }}>Jaipur & Udaipur, Rajasthan</Link></li>
              <li><Link to="/destinations" style={{ transition: 'color 0.2s' }}>Ladakh & Pangong Tso, India</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700, marginBottom: '16px' }}>Travel Offerings</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#475569' }}>
              <li><Link to="/packages">Curated Tour Packages</Link></li>
              <li><Link to="/hotels">Luxury Resort Stays</Link></li>
              <li><Link to="/my-bookings">Manage Reservations</Link></li>
              <li><Link to="/destinations">Explore Travel Map</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700, marginBottom: '16px' }}>Travel Insider Newsletter</h5>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
              Receive hand-crafted luxury travel itineraries and secret flash deals in ₹.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="email" placeholder="Your email address" className="input-field" style={{ padding: '9px 12px', fontSize: '0.85rem' }} />
              <button className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.85rem', flexShrink: 0 }}>Join</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap', gap: '12px' }}>
          <div>© {new Date().getFullYear()} TravelWithUs India. Real-Time Distributed Travel Platform.</div>
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
