import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, authModalMode, closeAuth, login, register, openAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register({ fullName, email, password, phoneNumber: phone });
      }
    } catch {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = () => {
    setEmail('alex.mercer@travelwithus.com');
    setPassword('Customer@123');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={closeAuth}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '32px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuth}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: '#94a3b8',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            {authModalMode === 'login' ? 'Welcome Back' : 'Join TravelWithUs'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {authModalMode === 'login'
              ? 'Access your itineraries, bookings, and member rates'
              : 'Unlock curated vacation packages and personalized concierge'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="input-field"
                style={{ paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (authModalMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {authModalMode === 'login' && (
          <button
            type="button"
            onClick={fillQuickDemo}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px dashed rgba(20, 184, 166, 0.3)',
              borderRadius: '8px',
              color: '#2dd4bf',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <Sparkles size={16} /> Auto-fill Demo Account
          </button>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
          {authModalMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => openAuth('register')}
                style={{ color: '#2dd4bf', fontWeight: 600, textDecoration: 'underline' }}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already a member?{' '}
              <button
                type="button"
                onClick={() => openAuth('login')}
                style={{ color: '#2dd4bf', fontWeight: 600, textDecoration: 'underline' }}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
