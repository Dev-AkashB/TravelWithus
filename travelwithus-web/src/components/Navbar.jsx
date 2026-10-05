import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useCms } from '../context/CmsContext';
import { Compass, Bell, User, LogOut, Sparkles, Menu, X, Plane, Calendar, ShieldCheck, PhoneCall } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, triggerDemoNotification } = useNotifications();
  const { config: cmsConfig } = useCms();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)'
      }}
    >
      {/* Live Admin CMS Announcement Bar */}
      {cmsConfig?.announcementEnabled && cmsConfig?.announcementText && (
        <div style={{ background: 'linear-gradient(90deg, #0f172a 0%, #134e4a 100%)', color: '#ffffff', padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ background: '#f59e0b', color: '#000', fontWeight: 800, fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
            {cmsConfig.announcementBadge || 'SPECIAL OFFER'}
          </span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
            {cmsConfig.announcementText}
          </span>
          {cmsConfig.announcementLink && (
            <Link to={cmsConfig.announcementLink} style={{ color: '#5eead4', fontWeight: 700, marginLeft: '8px', textDecoration: 'underline', fontSize: '0.78rem' }}>
              Explore Now &rarr;
            </Link>
          )}
        </div>
      )}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Compass size={24} />
            <Plane size={14} style={{ position: 'absolute', top: '5px', right: '5px', opacity: 0.85 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
                Travel<span style={{ color: '#0d9488' }}>WithUs</span>
              </span>
            </div>
            <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Discover India & Beyond
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <Link
            to="/destinations"
            style={{
              fontSize: '0.95rem',
              fontWeight: isActive('/destinations') ? 700 : 500,
              color: isActive('/destinations') ? '#0d9488' : '#475569',
              transition: 'var(--transition)'
            }}
          >
            Destinations
          </Link>
          <Link
            to="/packages"
            style={{
              fontSize: '0.95rem',
              fontWeight: isActive('/packages') ? 700 : 500,
              color: isActive('/packages') ? '#0d9488' : '#475569',
              transition: 'var(--transition)'
            }}
          >
            Tours & Packages
          </Link>
          <Link
            to="/hotels"
            style={{
              fontSize: '0.95rem',
              fontWeight: isActive('/hotels') ? 700 : 500,
              color: isActive('/hotels') ? '#0d9488' : '#475569',
              transition: 'var(--transition)'
            }}
          >
            Hotels & Resorts
          </Link>
          <Link
            to="/my-bookings"
            style={{
              fontSize: '0.95rem',
              fontWeight: isActive('/my-bookings') ? 700 : 500,
              color: isActive('/my-bookings') ? '#0d9488' : '#475569',
              transition: 'var(--transition)'
            }}
          >
            My Bookings
          </Link>
        </nav>

        {/* Right Actions: Notifications & Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Admin Suite Direct Switcher */}
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ShieldCheck size={14} color="#b45309" />
            <span>Admin Suite (3001)</span>
          </a>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                position: 'relative',
                transition: 'var(--transition)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#f43f5e',
                    boxShadow: '0 0 6px #f43f5e'
                  }}
                />
              )}
            </button>

            {/* Notification Dropdown */}
            {notifDropdownOpen && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  width: '360px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                  zIndex: 100
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Real-Time Alerts</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={markAllAsRead}
                      style={{ fontSize: '0.78rem', color: '#0d9488', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  </div>
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: n.readStatus ? '#f8fafc' : '#f0fdfa',
                          borderLeft: n.readStatus ? 'none' : '3px solid #0d9488',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.3' }}>
                          {n.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '12px', paddingTop: '10px' }}>
                  <button
                    onClick={() => triggerDemoNotification('Flight Upgrade Available', 'Seat 2B in Business Class opened up for Kashmir trip.')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.78rem',
                      color: '#0d9488',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      background: '#f0fdfa'
                    }}
                  >
                    <Sparkles size={14} /> Simulate WebSocket Live Alert
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '6px 14px 6px 8px',
                  borderRadius: '9999px',
                  color: '#0f172a',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#0d9488',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </button>

              {profileDropdownOpen && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '52px',
                    right: 0,
                    width: '210px',
                    padding: '8px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#334155',
                      borderRadius: '8px'
                    }}
                  >
                    <User size={16} color="#0d9488" /> Customer Profile
                  </button>
                  <button
                    onClick={() => { navigate('/my-bookings'); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#334155',
                      borderRadius: '8px'
                    }}
                  >
                    <Calendar size={16} color="#0d9488" /> My Reservations
                  </button>
                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#e11d48',
                      fontWeight: 600,
                      borderRadius: '8px'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => openAuth('login')} className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
              <User size={16} /> Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: '#0f172a' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link to="/destinations" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', fontWeight: 600 }}>Destinations</Link>
          <Link to="/packages" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', fontWeight: 600 }}>Tours & Packages</Link>
          <Link to="/hotels" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', fontWeight: 600 }}>Hotels & Resorts</Link>
          <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0f172a', fontWeight: 600 }}>My Bookings</Link>
          {isAuthenticated && (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ color: '#0d9488', fontWeight: 700 }}>Customer Profile</Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};
