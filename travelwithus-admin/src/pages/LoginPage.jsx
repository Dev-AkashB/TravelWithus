import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Compass,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('admin@travelwithus.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate authentic gateway handshake
      await new Promise(r => setTimeout(r, 600));

      const success = await login(email.trim(), password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Use demo credentials below or check password.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'SUPER_ADMIN') {
      setEmail('admin@travelwithus.com');
      setPassword('Admin@123');
    } else {
      setEmail('support@travelwithus.com');
      setPassword('Admin@123');
    }
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d16 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative ambient glowing orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px 36px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 16px',
              boxShadow: '0 10px 25px rgba(13, 148, 136, 0.4)'
            }}
          >
            <Compass size={32} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>
            Travel<span style={{ color: '#2dd4bf' }}>Admin</span>
          </h1>
          <span style={{ display: 'inline-block', fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '6px' }}>
            Executive Operations Suite
          </span>
          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Sign in to manage and control the live TravelWithUs website
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '0.82rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@travelwithus.com"
                style={{
                  width: '100%',
                  padding: '13px 14px 13px 44px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2dd4bf')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>
                Secure Password
              </label>
              <span style={{ fontSize: '0.74rem', color: '#2dd4bf', cursor: 'pointer' }} onClick={() => handleFillDemo('SUPER_ADMIN')}>
                Auto-fill Demo
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#64748b' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 44px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2dd4bf')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '15px',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Service status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#0d9488', width: '16px', height: '16px' }}
              />
              Remember session
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
              API Gateway 8080 Active
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              color: '#ffffff',
              fontSize: '0.96rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.35)',
              transition: 'all 0.2s ease',
              marginTop: '4px'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Authenticating Administrator...
              </>
            ) : (
              <>
                Sign In to Admin Panel <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
            ⚡ 1-Click Demo Credentials:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('SUPER_ADMIN')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            >
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#2dd4bf' }}>
                Super Admin
              </span>
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                admin@travelwithus.com
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('ADMIN')}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
            >
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                Operations Lead
              </span>
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                support@travelwithus.com
              </span>
            </button>
          </div>
        </div>

        {/* Link back to Main Customer Website */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2dd4bf')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <span>Switch to Customer Website (Port 3000)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginPage;
