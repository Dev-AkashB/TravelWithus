import React from 'react';

// Google Pay Official 4-Color Brand Icon
export const GooglePayIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="48" height="48" rx="10" fill="#FFFFFF" />
    <path d="M43.6 20.5H42V20H24V28H35.3C33.7 32.6 29.2 36 24 36C17.4 36 12 30.6 12 24C12 17.4 17.4 12 24 12C27.1 12 29.8 13.1 32 15L37.7 9.3C34.1 6 29.3 4 24 4C13 4 4 13 4 24C4 35 13 44 24 44C35 44 43.6 35.8 43.6 24C43.6 22.8 43.4 21.6 43.6 20.5Z" fill="#FFC107"/>
    <path d="M5.5 14.7L12.1 19.5C13.9 15.1 18.6 12 24 12C27.1 12 29.8 13.1 32 15L37.7 9.3C34.1 6 29.3 4 24 4C16.3 4 9.6 8.4 5.5 14.7Z" fill="#FF3D00"/>
    <path d="M24 44C29.2 44 33.9 42.1 37.5 38.9L31.3 33.8C29.2 35.2 26.8 36 24 36C18.9 36 14.5 32.7 12.8 28.3L6.1 33.4C10.1 40 16.5 44 24 44Z" fill="#4CAF50"/>
    <path d="M43.6 20.5H42V20H24V28H35.3C34.6 30.2 33.2 32.2 31.3 33.8L37.5 38.9C41.2 35.5 43.6 30.2 43.6 24C43.6 22.8 43.4 21.6 43.6 20.5Z" fill="#1976D2"/>
  </svg>
);

// PhonePe Official Purple Devanagari 'पे' Brand Icon
export const PhonePeIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="24" fill="#5F259F"/>
    <path d="M27.2 12H21.5C20.7 12 20 12.7 20 13.5V16.8H17.5C16.7 16.8 16 17.5 16 18.3C16 19.1 16.7 19.8 17.5 19.8H20V24.5H17.5C16.7 24.5 16 25.2 16 26C16 26.8 16.7 27.5 17.5 27.5H20V34.5C20 35.3 20.7 36 21.5 36C22.3 36 23 35.3 23 34.5V27.5H26.8C31.5 27.5 35 24.2 35 19.8C35 15.3 31.5 12 27.2 12ZM26.8 24.5H23V15.2H26.8C29.6 15.2 31.8 17.2 31.8 19.8C31.8 22.5 29.6 24.5 26.8 24.5Z" fill="#FFFFFF"/>
    <circle cx="34.5" cy="13.5" r="2.5" fill="#FFFFFF"/>
  </svg>
);

// Paytm Official Blue / Cyan Wordmark Icon
export const PaytmIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 72 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="72" height="36" rx="6" fill="#002970"/>
    <text x="7" y="24" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" letterSpacing="-0.5">Pay</text>
    <text x="38" y="24" fill="#00BAF2" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="18" letterSpacing="-0.5">tm</text>
    <rect x="58" y="8" width="8" height="6" rx="2" fill="#00BAF2" fillOpacity="0.4"/>
  </svg>
);

// BHIM UPI Official Tricolor Brand Icon
export const BhimIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="48" height="48" rx="8" fill="#F8FAFC"/>
    <path d="M12 36L22 12H27L17 36H12Z" fill="#00796B"/>
    <path d="M21 36L31 12H36L26 36H21Z" fill="#F97316"/>
    <text x="24" y="44" textAnchor="middle" fill="#0F172A" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="7" letterSpacing="0.5">BHIM UPI</text>
  </svg>
);

// UPI Official Tri-color Brand Logo
export const UpiIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.4} height={size} viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="56" height="36" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
    <path d="M22 10L14 26H19.5L24.5 16L27 21H32L26 10H22Z" fill="#00833F"/>
    <path d="M27.5 10L32.5 20L37 11H42L34 26H28.5L25 19L27.5 10Z" fill="#ED6B25"/>
    <text x="28" y="32" textAnchor="middle" fill="#0B2341" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="6.5" letterSpacing="1.2">UPI</text>
  </svg>
);

// Visa Official Wordmark Brand Icon
export const VisaIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.6} height={size} viewBox="0 0 64 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="64" height="36" rx="6" fill="#1A1F71"/>
    <text x="32" y="24" textAnchor="middle" fill="#FFFFFF" fontFamily="'Arial Black', 'Helvetica Neue', sans-serif" fontStyle="italic" fontWeight="900" fontSize="18" letterSpacing="1">VISA</text>
    <path d="M12 14L15 14L17 19L14 19Z" fill="#F7B600"/>
  </svg>
);

// Mastercard Official Interlocking Circles Brand Icon
export const MastercardIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="54" height="36" rx="6" fill="#222222"/>
    <circle cx="21" cy="18" r="10" fill="#EB001B"/>
    <circle cx="33" cy="18" r="10" fill="#F79E1B"/>
    <path d="M27 10.4C29.2 12.3 30.6 15 30.6 18C30.6 21 29.2 23.7 27 25.6C24.8 23.7 23.4 21 23.4 18C23.4 15 24.8 12.3 27 10.4Z" fill="#FF5F00"/>
  </svg>
);

// RuPay Official Brand Icon
export const RuPayIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="60" height="36" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
    <text x="24" y="23" fill="#0C4A60" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" letterSpacing="-0.5">Ru</text>
    <text x="40" y="23" fill="#E65100" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" letterSpacing="-0.5">Pay</text>
    <path d="M7 24L12 12H15L10 24H7Z" fill="#0088CC"/>
    <path d="M12 24L17 12H20L15 24H12Z" fill="#F26722"/>
  </svg>
);

// American Express Brand Icon
export const AmexIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="60" height="36" rx="6" fill="#006FCF"/>
    <text x="30" y="22" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="10" letterSpacing="1">AMEX</text>
  </svg>
);

// Amazon Pay Brand Icon
export const AmazonPayIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="60" height="36" rx="6" fill="#131921"/>
    <text x="18" y="19" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="10">amazon</text>
    <text x="44" y="19" fill="#FF9900" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="10">pay</text>
    <path d="M14 24C22 28 36 28 44 24" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M43 21L46 24L42 26" fill="#FF9900"/>
  </svg>
);

// MobiKwik Brand Icon
export const MobikwikIcon = ({ size = 28, className = '' }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="60" height="36" rx="6" fill="#0066CC"/>
    <text x="30" y="23" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="11" letterSpacing="-0.3">MobiKwik</text>
  </svg>
);

// State Bank of India (SBI) Official Keyhole Logo
export const SbiIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="23" fill="#286FA4"/>
    <circle cx="24" cy="21" r="9" fill="#FFFFFF"/>
    <circle cx="24" cy="21" r="5" fill="#286FA4"/>
    <rect x="22" y="21" width="4" height="15" fill="#FFFFFF"/>
  </svg>
);

// HDFC Bank Official Logo (Blue square with red center cross)
export const HdfcIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="48" height="48" rx="8" fill="#004C8F"/>
    <rect x="15" y="15" width="18" height="18" fill="#ED232A"/>
    <rect x="22" y="7" width="4" height="34" fill="#FFFFFF"/>
    <rect x="7" y="22" width="34" height="4" fill="#FFFFFF"/>
  </svg>
);

// ICICI Bank Official Logo (Orange stylized i/flame)
export const IciciIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="48" height="48" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>
    <circle cx="24" cy="14" r="4.5" fill="#F58220"/>
    <path d="M21 21C21 21 26 21 27 24C28 27 28 35 24 35C20 35 20 28 20 28" stroke="#A81D24" strokeWidth="4.5" strokeLinecap="round"/>
  </svg>
);

// Axis Bank Official Logo (Maroon pyramid triangle)
export const AxisIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="48" height="48" rx="8" fill="#97144D"/>
    <path d="M24 10L12 36H20L24 27L28 36H36L24 10Z" fill="#FFFFFF"/>
    <path d="M24 20L26.5 25.5H21.5L24 20Z" fill="#97144D"/>
  </svg>
);

// Kotak Mahindra Bank Official Logo (Red Infinity loop)
export const KotakIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="23" fill="#ED1C24"/>
    <path d="M14 24C14 20 18 20 21 22C24 24 27 28 31 28C35 28 37 25 37 24C37 23 35 20 31 20C27 20 24 24 21 26C18 28 14 28 14 24Z" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none"/>
  </svg>
);

// Punjab National Bank (PNB) Official Logo
export const PnbIcon = ({ size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="23" fill="#A20000"/>
    <circle cx="24" cy="24" r="16" fill="#F6C343"/>
    <circle cx="24" cy="24" r="12" fill="#A20000"/>
    <rect x="22" y="16" width="4" height="16" fill="#F6C343"/>
    <circle cx="24" cy="24" r="3" fill="#A20000"/>
  </svg>
);

export const PciDssBadge = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
    <span style={{ color: '#0D9488', fontWeight: 800 }}>PCI-DSS</span> Level 1 Certified
  </div>
);
