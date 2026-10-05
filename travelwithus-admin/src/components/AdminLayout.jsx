import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Compass, LayoutDashboard, Calendar, Package, MapPin, Building2,
  Star, IndianRupee, Users, LogOut, Bell, Search, ShieldCheck, CheckCircle2, Menu, X, Plane
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { path: '/customers', label: 'Manage Customer Data', icon: Users, badge: '6 Records' },
    { path: '/bookings', label: 'Reservations & Manifests', icon: Calendar },
    { path: '/packages', label: 'Tour Packages', icon: Package },
    { path: '/destinations', label: 'Destinations', icon: MapPin },
    { path: '/hotels', label: 'Hotels & Resorts', icon: Building2 },
    { path: '/reviews', label: 'Review Moderation', icon: Star, badge: '2 Pending' },
    { path: '/payments', label: 'Financial Ledger', icon: IndianRupee },
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
          width: sidebarOpen ? '270px' : '80px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'var(--transition)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
          boxShadow: '1px 0 10px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
                position: 'relative'
              }}
            >
              <Compass size={22} />
              <Plane size={12} style={{ position: 'absolute', top: '4px', right: '4px', opacity: 0.8 }} />
            </div>
            {sidebarOpen && (
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Travel<span style={{ color: '#0d9488' }}>Admin</span>
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                  EXECUTIVE SUITE
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
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
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#0d9488' : '#475569',
                  background: active ? '#f0fdfa' : 'transparent',
                  border: active ? '1px solid #99f6e4' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                <item.icon size={19} color={active ? '#0d9488' : '#64748b'} />
                {sidebarOpen && (
                  <span style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.label}
                    {item.badge && (
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', background: active ? '#ccfbf1' : '#fef3c7', color: active ? '#0f766e' : '#b45309', fontWeight: 700 }}>
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
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#0d9488' }}>
                SA
              </div>
              {sidebarOpen && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>SuperAdmin</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Operations Lead</div>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <button
                onClick={logout}
                title="Logout"
                style={{ color: '#be123c', padding: '6px', cursor: 'pointer', borderRadius: '6px', background: '#fff1f2' }}
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
            padding: '0 32px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#475569', padding: '6px', borderRadius: '6px' }}>
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#047857', background: '#ecfdf5', padding: '5px 12px', borderRadius: '9999px', border: '1px solid #a7f3d0', fontWeight: 600 }}>
              <CheckCircle2 size={15} /> Spring Cloud Mesh: Online (Port 8080)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Global admin lookup..."
                className="admin-input"
                style={{ paddingLeft: '36px', height: '36px', fontSize: '0.82rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#0d9488', fontWeight: 700 }}>
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
