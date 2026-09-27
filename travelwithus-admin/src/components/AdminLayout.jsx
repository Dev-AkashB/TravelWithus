import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Compass, LayoutDashboard, Calendar, Package, MapPin, Building2,
  Star, DollarSign, LogOut, Bell, Search, ShieldCheck, CheckCircle2, Menu, X
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { path: '/bookings', label: 'Reservations & Manifests', icon: Calendar },
    { path: '/packages', label: 'Tour Packages', icon: Package },
    { path: '/destinations', label: 'Destinations', icon: MapPin },
    { path: '/hotels', label: 'Hotels & Resorts', icon: Building2 },
    { path: '/reviews', label: 'Review Moderation', icon: Star, badge: '2 Pending' },
    { path: '/payments', label: 'Financial Ledger', icon: DollarSign },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '80px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'var(--transition)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Compass size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Travel<span style={{ color: '#2dd4bf' }}>Admin</span></span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>EXECUTIVE CONSOLE</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))' : 'transparent',
                  border: active ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <item.icon size={18} color={active ? '#2dd4bf' : '#64748b'} />
                {sidebarOpen && (
                  <span style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.label}
                    {item.badge && (
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Status & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#2dd4bf' }}>
                SA
              </div>
              {sidebarOpen && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>SuperAdmin</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Operations</div>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <button
                onClick={logout}
                title="Logout"
                style={{ color: '#f87171', padding: '6px', cursor: 'pointer' }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: '70px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#94a3b8' }}>
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <CheckCircle2 size={14} /> Spring Microservices Mesh: Online (Port 8080)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Global admin lookup..."
                className="admin-input"
                style={{ paddingLeft: '36px', height: '36px', fontSize: '0.8rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#2dd4bf' }}>
              <ShieldCheck size={18} /> Role: SUPER_ADMIN
            </div>
          </div>
        </header>

        {/* Page Viewport */}
        <main style={{ padding: '32px', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};
