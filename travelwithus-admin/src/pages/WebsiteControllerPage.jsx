import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Sliders,
  Check,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Megaphone,
  ShieldCheck,
  Tag,
  Package,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';

const DEFAULT_CMS_CONFIG = {
  heroTitle: 'Discover India & The World in Unrivaled Luxury',
  heroSubtitle: 'Curated holiday tour packages, 5-star private villas & seamless 24/7 concierge support.',
  announcementEnabled: true,
  announcementBadge: 'FESTIVE SALE',
  announcementText: '🎉 Exclusive Festive Holiday Sale: Flat 20% off on all Kashmir, Goa & Bali packages! Use coupon code TWU20 at checkout.',
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@travelwithus.com',
  instantBookingEnabled: true,
  freeCancellationEnabled: true,
  showLiveSlotBadges: true,
  whatsappReceiptsEnabled: true
};

export const WebsiteControllerPage = () => {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('twu_website_cms_config');
      return saved ? { ...DEFAULT_CMS_CONFIG, ...JSON.parse(saved) } : DEFAULT_CMS_CONFIG;
    } catch {
      return DEFAULT_CMS_CONFIG;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const host = typeof window !== 'undefined' ? window.location.hostname || 'localhost' : 'localhost';
  const previewUrl = `http://${host}:3000/?twu_cms=${encodeURIComponent(JSON.stringify(config))}`;

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    localStorage.setItem('twu_website_cms_config', JSON.stringify(config));
    
    // Broadcast across same-origin tabs
    window.dispatchEvent(new Event('storage'));
    
    // Broadcast via BroadcastChannel for modern browsers
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('twu_cms_channel');
        bc.postMessage({ type: 'CMS_UPDATE', config });
        bc.close();
      }
    } catch {}

    // Cross-origin iframe postMessage bridge to port 3000
    try {
      const syncFrame = document.getElementById('twu_sync_iframe');
      if (syncFrame && syncFrame.contentWindow) {
        syncFrame.contentWindow.postMessage({ type: 'TWU_CMS_UPDATE', config }, `http://${host}:3000`);
      }
    } catch {}
    
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website CMS settings to system defaults?')) {
      setConfig(DEFAULT_CMS_CONFIG);
      localStorage.setItem('twu_website_cms_config', JSON.stringify(DEFAULT_CMS_CONFIG));
      
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('twu_cms_channel');
          bc.postMessage({ type: 'CMS_UPDATE', config: DEFAULT_CMS_CONFIG });
          bc.close();
        }
      } catch {}

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hidden Cross-Origin Sync Iframe to Port 3000 */}
      <iframe
        id="twu_sync_iframe"
        src={`http://${host}:3000`}
        style={{ display: 'none', width: 0, height: 0, border: 'none' }}
        title="sync-bridge"
      />

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0fdfa', border: '1px solid #ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d9488' }}>
              <Globe size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Live Website Control & CMS
              </h1>
              <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                Control banners, announcements, policies, and content visible on customer portal (Port 3000)
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', fontSize: '0.85rem', textDecoration: 'none' }}
            title="Open customer website with currently applied CMS configuration"
          >
            <Eye size={16} /> Preview Customer Site (3000) <ExternalLink size={14} />
          </a>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontSize: '0.88rem' }}
          >
            <Save size={16} /> Save & Broadcast Changes
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', color: '#166534', fontWeight: 600, fontSize: '0.9rem' }}>
          <CheckCircle2 size={20} />
          <span>Website configuration updated! Changes are now live on the customer portal.</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '28px' }}>
        
        {/* Left Column: Editable CMS Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Top Announcement Bar / Banner */}
          <div className="admin-card" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone size={20} color="#0d9488" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Top Announcement & Promotional Ticker
                </h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: config.announcementEnabled ? '#0d9488' : '#64748b' }}>
                <input
                  type="checkbox"
                  checked={config.announcementEnabled}
                  onChange={(e) => setConfig({ ...config, announcementEnabled: e.target.checked })}
                  style={{ accentColor: '#0d9488', width: '18px', height: '18px' }}
                />
                {config.announcementEnabled ? 'BANNER ACTIVE' : 'BANNER DISABLED'}
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Badge Tag (e.g. FLASH SALE, FESTIVE DEAL)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={config.announcementBadge}
                  onChange={(e) => setConfig({ ...config, announcementBadge: e.target.value })}
                  placeholder="FESTIVE DEAL"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Announcement Banner Message
                </label>
                <textarea
                  className="admin-input"
                  rows="2"
                  value={config.announcementText}
                  onChange={(e) => setConfig({ ...config, announcementText: e.target.value })}
                  placeholder="Promotional banner message shown at the very top of all customer pages..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Live Preview of Banner */}
              {config.announcementEnabled && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Live Customer Preview:
                  </span>
                  <div style={{ background: 'linear-gradient(90deg, #0f172a, #134e4a)', color: '#ffffff', padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                    <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                      {config.announcementBadge || 'DEAL'}
                    </span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {config.announcementText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Hero Section Taglines */}
          <div className="admin-card" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Sparkles size={20} color="#0d9488" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Hero Section Headline & Subtitle
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Main Hero Title
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  placeholder="Main hero headline on home page"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Hero Subtitle Description
                </label>
                <textarea
                  className="admin-input"
                  rows="2"
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  placeholder="Supporting tagline below hero title..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Customer Support Helpline
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.supportPhone}
                    onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    className="admin-input"
                    value={config.supportEmail}
                    onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                    placeholder="support@travelwithus.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Commercial Feature Toggles */}
          <div className="admin-card" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Sliders size={20} color="#0d9488" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Customer Experience & Feature Flags
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  key: 'instantBookingEnabled',
                  label: 'Instant Real-Time Booking Confirmation',
                  desc: 'Generate immediate booking numbers and live sync into MySQL without admin voucher delays.'
                },
                {
                  key: 'freeCancellationEnabled',
                  label: '48-Hour Free Cancellation Guarantee',
                  desc: 'Show free cancellation badges across package detail pages.'
                },
                {
                  key: 'showLiveSlotBadges',
                  label: 'Display Available Seats / Slots Counter',
                  desc: 'Show real-time inventory counter (e.g. 14 Available Slots) on package cards.'
                },
                {
                  key: 'whatsappReceiptsEnabled',
                  label: 'Automated WhatsApp & Email Notifications',
                  desc: 'Trigger automated WhatsApp itineraries and ticket receipts on payment completion.'
                }
              ].map(flag => (
                <div
                  key={flag.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                      {flag.label}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {flag.desc}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config[flag.key]}
                    onChange={(e) => setConfig({ ...config, [flag.key]: e.target.checked })}
                    style={{ accentColor: '#0d9488', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Quick Site Management Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Actions Card */}
          <div className="admin-card" style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Direct Website Controls
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/packages"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdfa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Package size={20} color="#0d9488" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block' }}>Tour Packages</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Edit pricing, slots & itinerary</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488', background: '#ccfbf1', padding: '2px 8px', borderRadius: '6px' }}>
                  14 Live
                </span>
              </Link>

              <Link
                to="/destinations"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdfa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={20} color="#0d9488" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block' }}>Destinations</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Add cities, photos & tags</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488', background: '#ccfbf1', padding: '2px 8px', borderRadius: '6px' }}>
                  9 Curated
                </span>
              </Link>

              <Link
                to="/hotels"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdfa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={20} color="#0d9488" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block' }}>Hotels & Resorts</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Manage nightly rates & status</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488', background: '#ccfbf1', padding: '2px 8px', borderRadius: '6px' }}>
                  12 Active
                </span>
              </Link>

              <Link
                to="/bookings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdfa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={20} color="#0d9488" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block' }}>Bookings & Reservations</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Approve, verify or cancel</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488', background: '#ccfbf1', padding: '2px 8px', borderRadius: '6px' }}>
                  Live Sync
                </span>
              </Link>
            </div>
          </div>

          {/* Reset & Sync Card */}
          <div className="admin-card" style={{ padding: '20px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              Maintenance & Reset
            </span>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Restore website hero text, helpline numbers, and banners back to initial seed configuration.
            </p>
            <button
              type="button"
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#e11d48',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Reset to System Defaults
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};

export default WebsiteControllerPage;
