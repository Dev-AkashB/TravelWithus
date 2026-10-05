import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const userId = searchParams.get('userId');
    const avatarUrl = searchParams.get('avatarUrl');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth2 login error:', error);
      navigate('/', { replace: true });
      return;
    }

    // Check query params (Backend Spring Security redirect)
    if (token) {
      oauthLogin({
        token,
        userId: userId ? Number(userId) : undefined,
        email: email ? decodeURIComponent(email) : 'google.user@travelwithus.com',
        name: name ? decodeURIComponent(name) : 'Google Traveler',
        avatarUrl: avatarUrl ? decodeURIComponent(avatarUrl) : undefined,
        provider: 'GOOGLE'
      }).then(() => {
        navigate('/', { replace: true });
      }).catch((err) => {
        console.error('Failed to complete OAuth login:', err);
        navigate('/', { replace: true });
      });
      return;
    }

    // Check hash fragment (Direct Google OAuth redirect)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        // Fetch user info from Google userinfo API
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(profile => {
            oauthLogin({
              token: accessToken,
              userId: Math.floor(Math.random() * 9000) + 1000,
              email: profile.email || 'traveler@gmail.com',
              name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'Google Traveler',
              avatarUrl: profile.picture,
              provider: 'GOOGLE'
            }).then(() => {
              navigate('/', { replace: true });
            });
          })
          .catch(() => {
            navigate('/', { replace: true });
          });
        return;
      }
    }

    navigate('/', { replace: true });
  }, [searchParams, navigate, oauthLogin]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '3px solid #e2e8f0',
        borderTopColor: '#0d9488',
        animation: 'spin 1s linear infinite'
      }} />
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
        Authenticating with Google...
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
        Securing session and establishing your TravelWithUs account.
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OAuth2RedirectHandler;
