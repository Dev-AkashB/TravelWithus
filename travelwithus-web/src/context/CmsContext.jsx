import React, { createContext, useContext, useState, useEffect } from 'react';

export const DEFAULT_CMS_CONFIG = {
  announcementEnabled: true,
  announcementText: '🎉 Special Monsoon & Festive Offer: Flat 15% OFF on Luxury Rajasthan & Kerala Packages with code TWU2026',
  announcementBadge: 'LIMITED OFFER',
  announcementLink: '/packages',
  heroBadge: 'Premium Real-Time Travel & Luxury Holidays in India',
  heroTitle: 'Curated Indian Expeditions & Luxury Resort Escapes',
  heroSubtitle: 'Explore the tranquil backwaters of Kerala, golden beaches of Goa, snow-clad peaks of Kashmir, and royal forts of Rajasthan with verified live bookings.',
  helplinePhone: '+91 1800 200 4888',
  supportEmail: 'support@travelwithus.com',
  instantBookingEnabled: true,
  freeCancellationEnabled: true,
  showLiveSlotBadges: true,
  whatsappReceiptsEnabled: true
};

const STORAGE_KEY = 'twu_website_cms_config';
const CmsContext = createContext(null);

export const CmsProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    // 1. Check URL parameters for live cross-origin sync payload
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlPayload = searchParams.get('twu_cms') || searchParams.get('cms_config');
      if (urlPayload) {
        const parsed = JSON.parse(decodeURIComponent(urlPayload));
        const merged = { ...DEFAULT_CMS_CONFIG, ...parsed };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        
        // Clean URL without reloading
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
        return merged;
      }
    } catch (e) {
      console.warn('Failed to parse CMS config from URL:', e);
    }

    // 2. Read from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_CMS_CONFIG, ...JSON.parse(saved) } : DEFAULT_CMS_CONFIG;
    } catch {
      return DEFAULT_CMS_CONFIG;
    }
  });

  // Listen for cross-origin postMessage, BroadcastChannel, and storage events
  useEffect(() => {
    // A. Storage event listener (same-origin tabs)
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setConfig({ ...DEFAULT_CMS_CONFIG, ...JSON.parse(e.newValue) });
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // B. Cross-Origin postMessage listener (e.g. from travelwithus-admin port 3001)
    const handleMessage = (e) => {
      try {
        if (e.data && e.data.type === 'TWU_CMS_UPDATE' && e.data.config) {
          const merged = { ...DEFAULT_CMS_CONFIG, ...e.data.config };
          setConfig(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('CMS postMessage parse error', err);
      }
    };
    window.addEventListener('message', handleMessage);

    // C. BroadcastChannel for instant multi-tab sync
    let channel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('twu_cms_channel');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'CMS_UPDATE' && event.data.config) {
            const merged = { ...DEFAULT_CMS_CONFIG, ...event.data.config };
            setConfig(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        };
      } catch {}
    }

    // Expose global bridge for programmatic testing / iframe sync
    window.__TWU_CMS_SYNC = (newConfig) => {
      const merged = { ...DEFAULT_CMS_CONFIG, ...newConfig };
      setConfig(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    };

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleMessage);
      if (channel) channel.close();
    };
  }, []);

  const updateConfig = (newConfig) => {
    const merged = { ...config, ...newConfig };
    setConfig(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  return (
    <CmsContext.Provider value={{ config, updateConfig }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  return context || { config: DEFAULT_CMS_CONFIG, updateConfig: () => {} };
};

export default CmsContext;
