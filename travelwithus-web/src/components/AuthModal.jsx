import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowLeft } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, authModalMode, closeAuth, login, register, oauthLogin, mobileLogin, openAuth } = useAuth();
  
  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Method selection & Mobile OTP state
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'mobile'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleScriptReady, setGoogleScriptReady] = useState(false);

  useEffect(() => {
    if (!authModalOpen) {
      setError('');
      setOtpSent(false);
      setOtp('');
      setAuthMethod('email');
      setGoogleScriptReady(false);
    }
  }, [authModalOpen]);

  // Standard Email/Password Submission
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
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setGoogleLoading(true);
      setError('');
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const profile = JSON.parse(jsonPayload);
      
      await oauthLogin({
        token: response.credential,
        userId: Math.floor(Math.random() * 9000) + 1000,
        email: profile.email || 'traveler@gmail.com',
        name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'Google Traveler',
        avatarUrl: profile.picture,
        provider: 'GOOGLE'
      });
    } catch (err) {
      console.error('Failed to parse Google credential', err);
      setError('Google Sign-In could not be completed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!authModalOpen) return;

    const setupGoogle = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnDiv = document.getElementById('googleSignInBtnDiv');
          if (btnDiv) {
            btnDiv.innerHTML = '';
            window.google.accounts.id.renderButton(btnDiv, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: btnDiv.offsetWidth || 376
            });
            setGoogleScriptReady(true);
          }
        } catch (e) {
          console.warn('Google GSI init notice:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      setupGoogle();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          setupGoogle();
        }
      }, 250);
      return () => clearInterval(timer);
    }
  }, [authModalOpen]);

  // Google OAuth Sign In handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    // 1. Try Google Identity Services OAuth2 Token client for custom button
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              try {
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                }).then(r => r.json());

                await oauthLogin({
                  token: tokenResponse.access_token,
                  userId: Math.floor(Math.random() * 9000) + 1000,
                  email: userInfo.email || 'traveler@gmail.com',
                  name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || 'Google Traveler',
                  avatarUrl: userInfo.picture,
                  provider: 'GOOGLE'
                });
              } catch (err) {
                console.error('Failed to get Google user info', err);
                redirectToBackendOAuth();
              } finally {
                setGoogleLoading(false);
              }
            } else {
              setGoogleLoading(false);
            }
          },
          error_callback: (nonFatalError) => {
            console.error('Google OAuth popup/origin error:', nonFatalError);
            setGoogleLoading(false);
            setError('Google OAuth Notice: Please ensure http://localhost:3000 is added to "Authorized JavaScript origins" in Google Cloud Console.');
          }
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
        return;
      } catch (err) {
        console.warn('Google OAuth2 token client notice:', err);
      }
    }

    redirectToBackendOAuth();
  };

  const redirectToBackendOAuth = async () => {
    const gatewayUrl = 'http://localhost:8080';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      await fetch(`${gatewayUrl}/actuator/health`, { signal: controller.signal, mode: 'no-cors' });
      clearTimeout(timeoutId);

      // Backend is online: redirect through Spring Cloud Gateway OAuth2
      window.location.href = `${gatewayUrl}/oauth2/authorization/google`;
    } catch {
      // Backend is offline: direct redirect
      const redirectUri = `${window.location.origin}/oauth2/redirect`;
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20profile%20email`;
    }
  };

  // Send Mobile OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setOtpLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setOtpLoading(false);
    }, 600);
  };

  // Verify Mobile OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 4 to 6-digit verification OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await mobileLogin(mobileNumber, otp);
    } catch {
      setError('Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={closeAuth}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '32px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
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
            color: '#64748b',
            padding: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {authModalMode === 'login' ? 'Welcome Back' : 'Join TravelWithUs'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {authModalMode === 'login'
              ? 'Access your itineraries, bookings, and member rates'
              : 'Unlock curated vacation packages and personalized concierge'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#be123c', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Social & Alternative Sign-In Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {/* Single Google Sign In Button */}
          <div
            id="googleSignInBtnDiv"
            style={{
              width: '100%',
              minHeight: googleScriptReady ? '44px' : '0px',
              display: googleScriptReady ? 'flex' : 'none',
              justifyContent: 'center'
            }}
          />

          {!googleScriptReady && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              {googleLoading ? 'Connecting with Google...' : 'Continue with Google'}
            </button>
          )}

          {/* Mobile Sign In Button */}
          {authMethod === 'email' ? (
            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile');
                setError('');
              }}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              <Phone size={19} color="#0d9488" />
              Continue with Mobile Number
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setError('');
                setOtpSent(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#0d9488',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <Mail size={17} />
              Use Email & Password Instead
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
            {authMethod === 'email' ? 'OR CONTINUE WITH EMAIL' : 'OR ENTER MOBILE DETAILS'}
          </span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Mobile Number OTP Login Form */}
        {authMethod === 'mobile' ? (
          !otpSent ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Mobile Phone Number</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '0 12px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#334155', border: '1px solid #cbd5e1' }}>
                    +91
                  </div>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                    <input
                      type="tel"
                      required
                      maxLength="10"
                      placeholder="98765 43210"
                      className="input-field"
                      style={{ paddingLeft: '42px' }}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', display: 'block' }}>
                  We'll send an OTP via SMS for instant verification.
                </span>
              </div>

              <button
                type="submit"
                disabled={otpLoading || !mobileNumber}
                className="btn-primary"
                style={{ width: '100%', marginTop: '6px', padding: '14px', fontSize: '1rem' }}
              >
                {otpLoading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '12px 16px', background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#0f766e', display: 'block' }}>OTP sent to</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>+91 {mobileNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(''); }}
                  style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Change
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Enter 6-Digit OTP</label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#0d9488' }} />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="e.g. 123456"
                    className="input-field"
                    style={{ paddingLeft: '42px', letterSpacing: '4px', fontSize: '1.1rem', fontWeight: 700 }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', display: 'block' }}>
                  Enter any 4-6 digit code to verify instantly.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="btn-primary"
                style={{ width: '100%', marginTop: '6px', padding: '14px', fontSize: '1rem' }}
              >
                {loading ? 'Verifying & Signing In...' : 'Verify OTP & Log In'}
              </button>
            </form>
          )
        ) : (
          /* Standard Email / Password Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authModalMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {authModalMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Phone Number (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="input-field"
                    style={{ paddingLeft: '42px' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? 'Authenticating...' : authModalMode === 'login' ? 'Sign In to Account' : 'Create Customer Account'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem', color: '#64748b' }}>
          {authModalMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => openAuth('register')}
                style={{ color: '#0d9488', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => openAuth('login')}
                style={{ color: '#0d9488', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
