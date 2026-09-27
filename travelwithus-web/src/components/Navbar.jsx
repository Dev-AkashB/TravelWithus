import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Compass, Bell, User, LogOut, Check, Sparkles, Menu, X, Plane, Calendar } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, triggerDemoNotification } = useNotifications();
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
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Travel<span style={{ color: '#2dd4bf' }}>WithUs</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', md: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
          <Link
            to="/destinations"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/destinations') ? '#2dd4bf' : '#94a3b8',
              transition: 'var(--transition)'
            }}
          >
            Destinations
          </Link>
          <Link
            to="/packages"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/packages') ? '#2dd4bf' : '#94a3b8',
              transition: 'var(--transition)'
            }}
          >
            Tours & Packages
          </Link>
          <Link
            to="/hotels"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/hotels') ? '#2dd4bf' : '#94a3b8',
              transition: 'var(--transition)'
            }}
          >
            Hotels & Resorts
          </Link>
          <Link
            to="/my-bookings"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/my-bookings') ? '#2dd4bf' : '#94a3b8',
              transition: 'var(--transition)'
            }}
          >
            My Bookings
          </Link>
        </nav>

        {/* Right Actions: Notifications & Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
                position: 'relative',
                transition: 'var(--transition)'
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#f43f5e',
                    boxShadow: '0 0 8px #f43f5e'
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
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                  zIndex: 100
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Real-Time Alerts</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={markAllAsRead}
                      style={{ fontSize: '0.75rem', color: '#2dd4bf', cursor: 'pointer' }}
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
                          background: n.readStatus ? 'transparent' : 'rgba(20, 184, 166, 0.08)',
                          borderLeft: n.readStatus ? 'none' : '3px solid #2dd4bf',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.3' }}>
                          {n.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '12px', paddingTop: '10px' }}>
                  <button
                    onClick={() => triggerDemoNotification('Flight Upgrade Available', 'Seat 2B in Business Class opened up for Bali trip.')}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.75rem',
                      color: '#2dd4bf',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      borderRadius: '8px',
                      background: 'rgba(20, 184, 166, 0.1)'
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '6px 14px 6px 8px',
                  borderRadius: '9999px',
                  color: '#ffffff'
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#0d9488',
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
                    width: '200px',
                    padding: '8px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                    zIndex: 100
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => { navigate('/my-bookings'); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#cbd5e1',
                      borderRadius: '8px'
                    }}
                  >
                    <Calendar size={16} /> My Reservations
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
                      color: '#f87171',
                      borderRadius: '8px'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => openAuth('login')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <User size={16} /> Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: '#cbd5e1' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

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
