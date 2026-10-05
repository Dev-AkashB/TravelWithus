import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api, FALLBACK_PACKAGES, FALLBACK_HOTELS } from '../api/client';
import {
  GooglePayIcon,
  PhonePeIcon,
  PaytmIcon,
  BhimIcon,
  UpiIcon,
  VisaIcon,
  MastercardIcon,
  RuPayIcon,
  AmexIcon,
  AmazonPayIcon,
  MobikwikIcon,
  SbiIcon,
  HdfcIcon,
  IciciIcon,
  AxisIcon,
  KotakIcon,
  PnbIcon,
  PciDssBadge
} from '../components/PaymentBrandIcons';
import {
  Check,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  Smartphone,
  Wallet,
  QrCode,
  Building2,
  AlertCircle,
  X,
  KeyRound,
  Loader2,
  User,
  Plus,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const { triggerDemoNotification } = useNotifications();

  const type = searchParams.get('type') || 'PACKAGE';
  // Default to package 4 (Royal Rajasthan: 39600 * 2 = 79200)
  const id = searchParams.get('id') || '4';
  const initialGuests = Math.max(1, Number(searchParams.get('guests')) || 2);
  const stepParam = searchParams.get('step');

  // Selected item
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(initialGuests);

  // Steps: 1 = Details & Travelers, 2 = Payment, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState(
    stepParam === '2' || (typeof window !== 'undefined' && window.location.pathname.includes('/payment')) ? 2 : 1
  );

  // Traveler manifest
  const [primaryName, setPrimaryName] = useState(user?.name || 'Akash Behera');
  const [primaryEmail, setPrimaryEmail] = useState(user?.email || 'traveler@travelwithus.com');
  const [primaryPhone, setPrimaryPhone] = useState('+91 98765 43210');
  const [guestList, setGuestList] = useState(() =>
    Array.from({ length: initialGuests }, (_, i) => ({
      fullName: i === 0 ? (user?.name || 'Akash Behera') : 'Priya Behera',
      age: i === 0 ? '30' : '26',
      passport: i === 0 ? 'P8762514' : 'P9841203',
      primary: i === 0
    }))
  );
  const [specialRequests, setSpecialRequests] = useState('High floor room, complimentary honeymoon cake if available.');

  // Payment method selection: 'UPI' | 'CREDIT_CARD' | 'WALLET' | 'NET_BANKING'
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // UPI State
  const [upiMode, setUpiMode] = useState('app'); // 'app' | 'id' | 'qr'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim'
  const [upiPhone, setUpiPhone] = useState(primaryPhone.replace(/\D/g, '') || '9876543210');
  const [upiId, setUpiId] = useState('');
  const [isVpaVerified, setIsVpaVerified] = useState(false);
  const [pushNotificationSent, setPushNotificationSent] = useState(false);
  const [qrTimer, setQrTimer] = useState(300);

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Akash Behera');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  const [walletPhone, setWalletPhone] = useState(primaryPhone || '+91 98765 43210');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Gateway Authentication Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStatus, setAuthStatus] = useState('INPUT'); // 'INPUT' | 'VERIFYING' | 'SUCCESS'
  const [authStageText, setAuthStageText] = useState('Connecting to payment gateway...');
  const [authPin, setAuthPin] = useState('');
  const [authTimer, setAuthTimer] = useState(180);
  const [processing, setProcessing] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmedPayment, setConfirmedPayment] = useState(null);
  const [confirmedMethod, setConfirmedMethod] = useState('UPI (Instant)');

  useEffect(() => {
    if (user?.name && (!primaryName || primaryName === 'Akash Behera')) setPrimaryName(user.name);
    if (user?.email && (!primaryEmail || primaryEmail === 'traveler@travelwithus.com')) setPrimaryEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (type === 'HOTEL') {
      const h = FALLBACK_HOTELS.find(x => x.id === Number(id)) || FALLBACK_HOTELS[0];
      setItem({ ...h, title: h.name, price: h.pricePerNight * 4 });
    } else {
      const p = FALLBACK_PACKAGES.find(x => x.id === Number(id)) || FALLBACK_PACKAGES[3] || FALLBACK_PACKAGES[0];
      setItem(p);
    }
  }, [type, id]);

  // QR countdown
  useEffect(() => {
    let interval = null;
    if (upiMode === 'qr' && qrTimer > 0) {
      interval = setInterval(() => setQrTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [upiMode, qrTimer]);

  // Auth Timer countdown
  useEffect(() => {
    let interval = null;
    if (showAuthModal && authTimer > 0 && authStatus === 'INPUT') {
      interval = setInterval(() => setAuthTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showAuthModal, authTimer, authStatus]);

  const totalAmount = item ? (item.price * guests).toFixed(2) : '79200.00';
  const formattedAmount = Number(totalAmount).toLocaleString('en-IN');

  const handleAddGuest = () => {
    const updated = [
      ...guestList,
      {
        fullName: '',
        age: '',
        passport: '',
        primary: false
      }
    ];
    setGuestList(updated);
    setGuests(updated.length);
  };

  const handleRemoveGuest = (indexToRemove) => {
    if (guestList.length <= 1) return;
    const updated = guestList.filter((_, idx) => idx !== indexToRemove);
    setGuestList(updated);
    setGuests(updated.length);
  };

  const handleNextToPayment = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) {
      openAuth('login');
      return;
    }
    setCurrentStep(2);
  };

  // Card detection
  const getCardType = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'VISA';
    if (/^5[1-5]/.test(clean)) return 'MASTERCARD';
    if (/^(60|65|81|82)/.test(clean)) return 'RUPAY';
    if (/^3[47]/.test(clean)) return 'AMEX';
    return 'UNKNOWN';
  };

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : '');
  };

  const handleFillTestCard = (brand) => {
    if (brand === 'VISA') {
      setCardNumber('4242 4242 4242 4242');
      setCardHolder(primaryName || 'Akash Behera');
      setExpiryDate('12/28');
      setCvv('789');
    } else if (brand === 'MASTERCARD') {
      setCardNumber('5555 5555 5555 4444');
      setCardHolder(primaryName || 'Akash Behera');
      setExpiryDate('08/29');
      setCvv('321');
    } else if (brand === 'RUPAY') {
      setCardNumber('6071 8291 3847 9102');
      setCardHolder(primaryName || 'Akash Behera');
      setExpiryDate('10/27');
      setCvv('564');
    }
  };

  const handleTriggerCollectRequest = () => {
    setPushNotificationSent(true);
    setTimeout(() => {
      handleInitiatePaymentAuth();
    }, 1200);
  };

  // Open Payment Gateway Authentication Modal
  const handleInitiatePaymentAuth = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (paymentMethod === 'CREDIT_CARD') {
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 15) {
        alert('Please enter a valid card number.');
        return;
      }
      if (!expiryDate || !cvv) {
        alert('Please enter expiration date and CVV.');
        return;
      }
    } else if (paymentMethod === 'UPI' && upiMode === 'id') {
      if (!upiId || !upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g. mobile@upi).');
        return;
      }
    }

    setAuthStatus('INPUT');
    setAuthPin('');
    setAuthTimer(180);
    setShowAuthModal(true);
  };

  // Authorize and confirm payment
  const handleAuthorizeAndConfirm = async () => {
    setAuthStatus('VERIFYING');

    const stages = [
      'Establishing Bank Handshake...',
      paymentMethod === 'UPI'
        ? 'NPCI UPI 2.0 Switch Handshake & PIN Validation...'
        : 'Visa / Mastercard 3D Secure Directory Server Check...',
      'Executing Transaction in MySQL travelwithus_payments...',
      'Synchronizing Live Operations Dashboard & Issuing WhatsApp Receipt...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setAuthStageText(stages[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    setAuthStatus('SUCCESS');
    await new Promise(r => setTimeout(r, 800));

    setShowAuthModal(false);
    await executeBackendBooking();
  };

  // Execute Booking and Payment in Backend Services
  const executeBackendBooking = async () => {
    setProcessing(true);

    try {
      const validTravelers = guestList.length > 0
        ? guestList.map((g, idx) => ({
            fullName: g.fullName?.trim() || (idx === 0 ? (primaryName || user?.name || 'Primary Traveler') : `Traveler ${idx + 1}`),
            age: Number(g.age) > 0 ? Number(g.age) : (idx === 0 ? 30 : 25),
            gender: 'Other',
            passportOrIdNumber: g.passport?.trim() || `ID${Math.floor(100000 + Math.random() * 900000)}`,
            primaryContact: g.primary || idx === 0
          }))
        : [{
            fullName: primaryName?.trim() || user?.name || 'Primary Traveler',
            age: 30,
            gender: 'Other',
            passportOrIdNumber: 'ID987654',
            primaryContact: true
          }];

      const bookingData = {
        userId: user?.id || 1,
        customerEmail: primaryEmail?.trim() || user?.email || 'traveler@travelwithus.com',
        customerName: primaryName?.trim() || user?.name || 'Traveler',
        customerPhone: primaryPhone?.trim() || '+91 98765 43210',
        bookingType: type === 'HOTEL' ? 'HOTEL' : 'PACKAGE',
        itemReferenceId: Number(id) || 1,
        itemTitle: item?.title || 'Royal Rajasthan: Jaipur Pink City & Udaipur Lake Palaces',
        startDate: startDate,
        endDate: endDate,
        numberOfGuests: Number(guests) || 2,
        numberOfRooms: 1,
        totalAmount: Number(totalAmount),
        specialRequests: specialRequests?.trim() || 'None',
        travelers: validTravelers
      };

      const bookingRes = await api.createBooking(bookingData);

      const paymentData = {
        bookingId: bookingRes.id,
        bookingNumber: bookingRes.bookingNumber,
        userId: user?.id || 1,
        customerEmail: primaryEmail?.trim() || user?.email || 'traveler@travelwithus.com',
        amount: Number(totalAmount),
        currency: 'INR',
        paymentMethod: paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : paymentMethod === 'WALLET' ? 'WALLET' : 'UPI',
        cardNumber: cardNumber.replace(/\s+/g, '') || '4242424242424242',
        expiryMonth: (expiryDate.split('/')[0] || '12').trim(),
        expiryYear: ('20' + (expiryDate.split('/')[1] || '28')).trim(),
        cvv: cvv || '789',
        upiId: upiId || `${primaryPhone.replace(/\D/g, '') || '9876543210'}@upi`
      };

      const paymentRes = await api.processPayment(paymentData);

      const existing = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      const newRecord = {
        ...bookingRes,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentReference: paymentRes.paymentReference || `TWU-PAY-${Date.now().toString(36).toUpperCase()}`,
        transactionId: paymentRes.transactionId || `TXN-${Date.now()}`
      };
      localStorage.setItem('twu_demo_bookings', JSON.stringify([newRecord, ...existing]));

      setConfirmedBooking(newRecord);
      setConfirmedPayment(paymentRes);
      setConfirmedMethod(paymentMethod === 'CREDIT_CARD' ? 'Credit/Debit Card' : paymentMethod === 'WALLET' ? 'Digital Wallet' : 'UPI Instant');
      setCurrentStep(3);

      triggerDemoNotification(
        'Booking & Payment Confirmed!',
        `Your reservation for ${item?.title || 'Trip'} has been confirmed. Receipt #${newRecord.paymentReference}.`,
        'BOOKING_CONFIRMED'
      );
    } catch (err) {
      console.error('Payment processing error', err);
      // Create local confirmed record in demo mode
      const fallbackBookingNumber = 'TWU-BK-' + Math.floor(100000 + Math.random() * 900000);
      const fallbackPayRef = 'TWU-PAY-' + Math.floor(100000 + Math.random() * 900000);
      const newRecord = {
        id: Date.now(),
        bookingNumber: fallbackBookingNumber,
        itemTitle: item?.title || 'Royal Rajasthan: Jaipur Pink City & Udaipur Lake Palaces',
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentReference: fallbackPayRef,
        transactionId: 'TXN-' + Date.now()
      };
      const existing = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      localStorage.setItem('twu_demo_bookings', JSON.stringify([newRecord, ...existing]));
      setConfirmedBooking(newRecord);
      setConfirmedPayment({ paymentReference: fallbackPayRef });
      setConfirmedMethod(paymentMethod === 'CREDIT_CARD' ? 'Credit/Debit Card' : paymentMethod === 'WALLET' ? 'Digital Wallet' : 'UPI Instant');
      setCurrentStep(3);
    } finally {
      setProcessing(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const popularBanks = [
    { id: 'sbi', name: 'State Bank of India (SBI)', icon: SbiIcon },
    { id: 'hdfc', name: 'HDFC Bank', icon: HdfcIcon },
    { id: 'icici', name: 'ICICI Bank', icon: IciciIcon },
    { id: 'axis', name: 'Axis Bank', icon: AxisIcon },
    { id: 'kotak', name: 'Kotak Mahindra Bank', icon: KotakIcon },
    { id: 'pnb', name: 'Punjab National Bank', icon: PnbIcon }
  ];

  if (!item) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Loading reservation details...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1160px' }}>
      
      {/* Real-time Push Notification Simulation Toast */}
      {pushNotificationSent && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10001,
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '14px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid #334155'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedUpiApp === 'gpay' && <GooglePayIcon size={24} />}
            {selectedUpiApp === 'phonepe' && <PhonePeIcon size={24} />}
            {selectedUpiApp === 'paytm' && <PaytmIcon size={20} />}
            {selectedUpiApp === 'bhim' && <BhimIcon size={24} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8' }}>
                {selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'BHIM'}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Just now</span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#F1F5F9' }}>
              TravelWithUs requested <strong>₹{formattedAmount}</strong>. Tap to enter UPI PIN.
            </p>
          </div>
        </div>
      )}

      {/* Stepper Header */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {[
            { num: 1, label: 'Guest Details' },
            { num: 2, label: 'Payment Gateway' },
            { num: 3, label: 'Confirmation' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                type="button"
                onClick={() => {
                  if (s.num === 3 && !confirmedBooking) return;
                  setCurrentStep(s.num);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: (s.num <= 2 || confirmedBooking) ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px',
                  borderRadius: '12px'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: currentStep >= s.num ? '#0d9488' : '#e2e8f0',
                    color: currentStep >= s.num ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  {currentStep > s.num ? <Check size={16} strokeWidth={3} /> : s.num}
                </div>
                <span style={{ fontSize: '0.92rem', fontWeight: currentStep === s.num ? 800 : 600, color: currentStep === s.num ? '#0f172a' : '#64748b' }}>
                  {s.label}
                </span>
              </button>
              {idx < 2 && <div style={{ width: '40px', height: '2px', background: currentStep > idx + 1 ? '#0d9488' : '#e2e8f0' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Guest Details */}
      {currentStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '40px' }}>
          <div>
            <form onSubmit={handleNextToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '18px', fontWeight: 800 }}>Primary Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akash Behera"
                      className="input-field"
                      value={primaryName}
                      onChange={(e) => setPrimaryName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="input-field"
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Mobile Number (for live SMS & WhatsApp updates) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="input-field"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Guest Manifest */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>
                      Traveler Manifest ({guestList.length} {guestList.length === 1 ? 'Guest' : 'Guests'})
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      Primary traveler is included by default. Add or remove co-travelers as needed.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddGuest}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #0d9488',
                      background: '#f0fdfa',
                      color: '#0d9488',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={16} /> Add Guest
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {guestList.map((guest, idx) => (
                    <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={15} /> Guest {idx + 1} {guest.primary ? '(Lead Traveler)' : '(Co-Traveler)'}
                        </span>
                        {!guest.primary && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGuest(idx)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              border: '1px solid #fecdd3',
                              background: '#fff1f2',
                              color: '#e11d48',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            className="input-field"
                            value={guest.fullName}
                            onChange={(e) => {
                              const updated = [...guestList];
                              updated[idx].fullName = e.target.value;
                              setGuestList(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Age *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="110"
                            placeholder="Age"
                            className="input-field"
                            value={guest.age}
                            onChange={(e) => {
                              const updated = [...guestList];
                              updated[idx].age = e.target.value;
                              setGuestList(updated);
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Passport / Govt ID</label>
                          <input
                            type="text"
                            placeholder="Passport / Aadhaar / PAN"
                            className="input-field"
                            value={guest.passport}
                            onChange={(e) => {
                              const updated = [...guestList];
                              updated[idx].passport = e.target.value;
                              setGuestList(updated);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '1.05rem', justifyContent: 'center' }}>
                Continue to Secure Payment <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div>
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px', fontWeight: 800 }}>Reservation Summary</h3>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', lineHeight: '1.3', fontWeight: 700 }}>{item.title}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>{item.destinationName || item.city}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Travel Dates:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{startDate} to {endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Party Size:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{guests} Travelers</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Total Due</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d9488' }}>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PAYMENT GATEWAY (REAL-TIME WITH ORIGINAL ICONS) */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '40px' }}>
          <div>
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}>
              
              {/* Header: Select Payment Method */}
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>
                  Select Payment Method
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                  Choose your preferred payment method to complete booking
                </p>
              </div>

              {/* Payment Method Selector Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '28px' }}>
                
                {/* 1. UPI & QR Code */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    border: `2px solid ${paymentMethod === 'UPI' ? '#0d9488' : '#e2e8f0'}`,
                    background: paymentMethod === 'UPI' ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                    <UpiIcon size={20} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'UPI' ? '#0d9488' : '#1e293b' }}>
                    UPI & QR Code
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>GPay, PhonePe, Paytm</span>
                </button>

                {/* 2. Cards (3D Secure) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    border: `2px solid ${paymentMethod === 'CREDIT_CARD' ? '#0d9488' : '#e2e8f0'}`,
                    background: paymentMethod === 'CREDIT_CARD' ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: '24px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <VisaIcon size={16} />
                    <MastercardIcon size={16} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'CREDIT_CARD' ? '#0d9488' : '#1e293b' }}>
                    Cards (3D Secure)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>Visa, Master, RuPay</span>
                </button>

                {/* 3. Digital Wallets */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    border: `2px solid ${paymentMethod === 'WALLET' ? '#0d9488' : '#e2e8f0'}`,
                    background: paymentMethod === 'WALLET' ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                    <Wallet size={20} color={paymentMethod === 'WALLET' ? '#0d9488' : '#64748b'} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'WALLET' ? '#0d9488' : '#1e293b' }}>
                    Digital Wallets
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>Paytm, Amazon, PhonePe</span>
                </button>

                {/* 4. Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '14px',
                    border: `2px solid ${paymentMethod === 'NET_BANKING' ? '#0d9488' : '#e2e8f0'}`,
                    background: paymentMethod === 'NET_BANKING' ? '#f0fdfa' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                    <Building2 size={20} color={paymentMethod === 'NET_BANKING' ? '#0d9488' : '#64748b'} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: paymentMethod === 'NET_BANKING' ? '#0d9488' : '#1e293b' }}>
                    Net Banking
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>SBI, HDFC, ICICI</span>
                </button>
              </div>

              {/* 1. UPI Payment Option */}
              {paymentMethod === 'UPI' && (
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f8fafc', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    {[
                      { id: 'app', label: '⚡ Popular UPI Apps' },
                      { id: 'id', label: 'Enter UPI ID' },
                      { id: 'qr', label: '📷 Scan QR Code' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setUpiMode(tab.id)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: upiMode === tab.id ? '#ffffff' : 'transparent',
                          color: upiMode === tab.id ? '#0d9488' : '#64748b',
                          fontWeight: upiMode === tab.id ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: upiMode === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* 1.1 Popular UPI Apps with ORIGINAL BRAND ICONS */}
                  {upiMode === 'app' && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ color: '#475569', fontSize: '0.88rem', fontWeight: 600, marginBottom: '14px' }}>
                        Choose your UPI app to receive an instant payment request:
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        {[
                          { id: 'gpay', name: 'Google Pay', icon: GooglePayIcon, color: '#4285F4', sub: 'Instant Push' },
                          { id: 'phonepe', name: 'PhonePe', icon: PhonePeIcon, color: '#5f259f', sub: 'Auto-collect' },
                          { id: 'paytm', name: 'Paytm UPI', icon: PaytmIcon, color: '#00b9f5', sub: '@paytm Handle' },
                          { id: 'bhim', name: 'BHIM UPI', icon: BhimIcon, color: '#00796b', sub: 'NPCI Verified' }
                        ].map(app => {
                          const IconComp = app.icon;
                          const isSelected = selectedUpiApp === app.id;
                          return (
                            <div
                              key={app.id}
                              onClick={() => setSelectedUpiApp(app.id)}
                              style={{
                                padding: '16px 10px',
                                borderRadius: '14px',
                                border: `2px solid ${isSelected ? app.color : '#e2e8f0'}`,
                                background: isSelected ? `${app.color}0D` : '#ffffff',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: '#1e293b',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                              }}
                            >
                              {isSelected && (
                                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '16px', height: '16px', borderRadius: '50%', background: app.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}
                              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                <IconComp size={32} />
                              </div>
                              <span>{app.name}</span>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{app.sub}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile Number linked to UPI App */}
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                          Mobile Number Linked to {selectedUpiApp === 'gpay' ? 'Google Pay' : selectedUpiApp === 'phonepe' ? 'PhonePe' : selectedUpiApp === 'paytm' ? 'Paytm' : 'BHIM'}
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0 12px', fontSize: '0.88rem', fontWeight: 600, color: '#475569' }}>
                            +91
                          </div>
                          <input
                            type="tel"
                            maxLength="10"
                            value={upiPhone}
                            onChange={(e) => setUpiPhone(e.target.value.replace(/\D/g, ''))}
                            className="input-field"
                            placeholder="9876543210"
                            style={{ flex: 1, margin: 0 }}
                          />
                          <button
                            type="button"
                            onClick={handleTriggerCollectRequest}
                            style={{
                              padding: '0 16px',
                              borderRadius: '10px',
                              background: '#0d9488',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Simulate Push ⚡
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                        <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                          Proceed to UPI Authentication <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1.2 Enter UPI ID */}
                  {upiMode === 'id' && (
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Virtual Payment Address (VPA)</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or username@okaxis"
                          className="input-field"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setIsVpaVerified(e.target.value.includes('@') && e.target.value.length > 5);
                          }}
                          style={{ paddingRight: '40px' }}
                        />
                        {isVpaVerified && (
                          <div style={{ position: 'absolute', right: '12px', top: '14px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700 }}>
                            <CheckCircle2 size={18} /> Verified
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', alignSelf: 'center' }}>Quick handles:</span>
                        {['@okhdfcbank', '@okaxis', '@oksbi', '@paytm', '@ybl'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              const prefix = (upiId.split('@')[0] || primaryPhone.replace(/\D/g, '') || 'akash');
                              setUpiId(prefix + s);
                              setIsVpaVerified(true);
                            }}
                            style={{ fontSize: '0.75rem', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '8px', color: '#475569', cursor: 'pointer', fontWeight: 600 }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                        <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                          Proceed to UPI Authentication <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1.3 Scan QR Code */}
                  {upiMode === 'qr' && (
                    <div style={{ textAlign: 'center', padding: '16px 0 10px', marginBottom: '24px' }}>
                      <div style={{ maxWidth: '360px', margin: '0 auto', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <UpiIcon size={18} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Bharat UPI QR</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: qrTimer < 60 ? '#e11d48' : '#0d9488', fontWeight: 700 }}>
                            <Clock size={14} /> {formatTimer(qrTimer)}
                          </div>
                        </div>

                        {/* QR Box with Radar scan animation */}
                        <div
                          style={{
                            width: '200px',
                            height: '200px',
                            margin: '0 auto 16px',
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '10px',
                            border: '2px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <QrCode size={170} color="#0f172a" />
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '3px',
                              background: 'linear-gradient(90deg, transparent, #0d9488, transparent)',
                              boxShadow: '0 0 12px #0d9488',
                              animation: 'radarScan 2.2s infinite ease-in-out'
                            }}
                          />
                          <div style={{ position: 'absolute', width: '36px', height: '36px', borderRadius: '8px', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UpiIcon size={20} />
                          </div>
                          <style>{`
                            @keyframes radarScan {
                              0% { transform: translateY(0px); }
                              50% { transform: translateY(195px); }
                              100% { transform: translateY(0px); }
                            }
                          `}</style>
                        </div>

                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                          ₹{formattedAmount}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 16px 0' }}>
                          Scan using any UPI App (Google Pay, PhonePe, Paytm, CRED or BHIM)
                        </p>

                        <button
                          type="button"
                          onClick={handleAuthorizeAndConfirm}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            background: '#eef2ff',
                            border: '1px dashed #6366f1',
                            color: '#4338ca',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Simulate Instant Mobile Scan & Pay
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                        <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                          Proceed to UPI Authentication <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Credit/Debit Card Payment Option */}
              {paymentMethod === 'CREDIT_CARD' && (
                <form onSubmit={handleInitiatePaymentAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Interactive Card Preview */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
                      borderRadius: '20px',
                      padding: '24px 28px',
                      color: '#ffffff',
                      boxShadow: '0 14px 30px rgba(15, 23, 42, 0.25)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* EMV Chip */}
                        <div style={{ width: '42px', height: '32px', borderRadius: '6px', background: 'linear-gradient(135deg, #f59e0b, #fde68a)', border: '1px solid #d97706', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '1px', background: '#92400e' }} />
                          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '16px', width: '1px', background: '#92400e' }} />
                        </div>
                        {/* Contactless symbol */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                          <path d="M8.5 16.5a5 5 0 0 1 0-9"/>
                          <path d="M12 19a8.5 8.5 0 0 0 0-14"/>
                          <path d="M15.5 21.5a12 12 0 0 0 0-19"/>
                        </svg>
                      </div>

                      <div style={{ background: '#ffffff', padding: '4px 8px', borderRadius: '8px' }}>
                        {getCardType(cardNumber) === 'VISA' && <VisaIcon size={20} />}
                        {getCardType(cardNumber) === 'MASTERCARD' && <MastercardIcon size={20} />}
                        {getCardType(cardNumber) === 'RUPAY' && <RuPayIcon size={20} />}
                        {getCardType(cardNumber) === 'AMEX' && <AmexIcon size={20} />}
                        {getCardType(cardNumber) === 'UNKNOWN' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <VisaIcon size={16} />
                            <MastercardIcon size={16} />
                            <RuPayIcon size={16} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ fontFamily: 'monospace', fontSize: '1.3rem', letterSpacing: '3px', fontWeight: 700, marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', display: 'block' }}>Cardholder</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.5px' }}>{cardHolder.toUpperCase() || 'NAME SURNAME'}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', display: 'block' }}>Expires</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{expiryDate || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Auto-fill Presets */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', alignSelf: 'center' }}>Test card auto-fill:</span>
                    <button type="button" onClick={() => handleFillTestCard('VISA')} style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <VisaIcon size={12} /> Visa 3DS
                    </button>
                    <button type="button" onClick={() => handleFillTestCard('MASTERCARD')} style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MastercardIcon size={12} /> Mastercard
                    </button>
                    <button type="button" onClick={() => handleFillTestCard('RUPAY')} style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RuPayIcon size={12} /> RuPay
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Name on card"
                      className="input-field"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• 4242"
                      className="input-field"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        maxLength="5"
                        placeholder="MM/YY"
                        className="input-field"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px', fontWeight: 600 }}>CVV</label>
                      <input
                        type="password"
                        required
                        maxLength="4"
                        placeholder="CVV"
                        className="input-field"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                      Proceed to 3D-Secure Bank OTP <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* 3. Digital Wallet Payment Option */}
              {paymentMethod === 'WALLET' && (
                <div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', fontWeight: 600, marginBottom: '14px' }}>
                    Choose your digital wallet to authenticate and pay:
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { id: 'paytm', name: 'Paytm Wallet', icon: PaytmIcon, color: '#00b9f5', bal: '₹85,000' },
                      { id: 'amazonpay', name: 'Amazon Pay', icon: AmazonPayIcon, color: '#ff9900', bal: '₹42,500' },
                      { id: 'phonepe', name: 'PhonePe Wallet', icon: PhonePeIcon, color: '#5f259f', bal: '₹50,000' },
                      { id: 'mobikwik', name: 'MobiKwik', icon: MobikwikIcon, color: '#0066cc', bal: '₹25,000' }
                    ].map(w => {
                      const IconComp = w.icon;
                      const isSelected = selectedWallet === w.id;
                      return (
                        <div
                          key={w.id}
                          onClick={() => setSelectedWallet(w.id)}
                          style={{
                            padding: '16px 10px',
                            borderRadius: '14px',
                            border: `2px solid ${isSelected ? w.color : '#e2e8f0'}`,
                            background: isSelected ? `${w.color}0D` : '#ffffff',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: '#1e293b',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                            <IconComp size={28} />
                          </div>
                          <span>{w.name}</span>
                          <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>Bal: {w.bal}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Linked Mobile Number</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#16a34a', display: 'block', marginTop: '6px', fontWeight: 600 }}>
                      ✓ Wallet Balance: Sufficient for ₹{formattedAmount}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                      Authorize Wallet Payment <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Net Banking Option */}
              {paymentMethod === 'NET_BANKING' && (
                <div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', fontWeight: 600, marginBottom: '14px' }}>
                    Select from Top Indian Scheduled Commercial Banks:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {popularBanks.map(bank => {
                      const BankIconComp = bank.icon;
                      const isSelected = selectedBank === bank.name;
                      return (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.name)}
                          style={{
                            padding: '14px',
                            borderRadius: '12px',
                            border: `2px solid ${isSelected ? '#0d9488' : '#e2e8f0'}`,
                            background: isSelected ? '#f0fdfa' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <BankIconComp size={32} />
                          <div>
                            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                              {bank.name}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#0d9488', fontWeight: 600 }}>
                              Instant • 99.9% Uptime
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Or select any other bank (50+ Banks)</label>
                    <select
                      className="input-field"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option>State Bank of India (SBI)</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Bank of Baroda</option>
                      <option>Canara Bank</option>
                      <option>Union Bank of India</option>
                      <option>IndusInd Bank</option>
                      <option>IDFC First Bank</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                      Authenticate with {selectedBank.split(' ')[0]} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div>
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)', position: 'sticky', top: '24px' }}>
              
              {/* Item snippet */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f1f5f9' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '74px', height: '74px', borderRadius: '14px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: '1.3' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                    {item.destinationName || item.city}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{guests} Guests</span>
                </div>
              </div>

              {/* Total Charge Header */}
              <span style={{ fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#64748b', display: 'block' }}>
                Total Charge
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0d9488', letterSpacing: '-1px', margin: '4px 0 16px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                ₹{formattedAmount}
                <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '8px' }}>
                  All Inclusive
                </span>
              </div>

              {/* Price Breakdown */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Package Base Fare ({guests} Guests)</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{(totalAmount * 0.8474).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Goods & Service Tax (GST 18%)</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{(totalAmount * 0.1526).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700, borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>
                  <span>Convenience Fee (Zero Markup)</span>
                  <span>FREE (₹0.00)</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Confirmed Success Screen */}
      {currentStep === 3 && confirmedBooking && (
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto', padding: '40px', borderRadius: '24px', textAlign: 'center', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 25px rgba(22, 163, 74, 0.25)' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '8px', fontWeight: 900 }}>Pack Your Bags!</h2>
          <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '28px' }}>
            Your trip <strong>{item.title}</strong> is confirmed. A receipt has been dispatched to <strong>{primaryEmail}</strong> and WhatsApp <strong>{primaryPhone}</strong>.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Booking Reference:</span>
              <strong style={{ color: '#0d9488', letterSpacing: '1px' }}>{confirmedBooking.bookingNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Payment Reference:</span>
              <strong style={{ color: '#0f172a' }}>{confirmedPayment?.paymentReference || confirmedBooking.paymentReference}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Total Amount Paid:</span>
              <strong style={{ color: '#0d9488' }}>₹{Number(totalAmount).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Payment Method:</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{confirmedMethod} (Authenticated)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Travel Dates:</span>
              <span style={{ color: '#0f172a' }}>{startDate} to {endDate}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px' }}
            >
              <Download size={16} /> Print Receipt
            </button>
            <Link to="/my-bookings" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
              View In My Bookings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* REAL-TIME AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => {
            if (authStatus !== 'VERIFYING') setShowAuthModal(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              border: '1px solid #e2e8f0',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {authStatus !== 'VERIFYING' && (
              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={20} />
              </button>
            )}

            {/* Merchant Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0d9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>TravelWithUs Gateway</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Merchant: TravelWithUs Holidays Pvt Ltd</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Amount</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0d9488' }}>₹{formattedAmount}</span>
              </div>
            </div>

            {/* VERIFYING HANDSHAKE OVERLAY */}
            {authStatus === 'VERIFYING' && (
              <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                <Loader2 size={46} color="#0d9488" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 18px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Securing Transaction...</h3>
                <p style={{ color: '#0d9488', fontSize: '0.85rem', fontWeight: 600, background: '#f0fdfa', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                  {authStageText}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '14px' }}>
                  Please do not refresh or close this browser window.
                </span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* SUCCESS OVERLAY */}
            {authStatus === 'SUCCESS' && (
              <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 25px rgba(22, 163, 74, 0.3)' }}>
                  <CheckCircle2 size={38} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Payment Approved!</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Syncing reservation to MySQL database & generating voucher...</p>
              </div>
            )}

            {/* INPUT AUTH SCREEN */}
            {authStatus === 'INPUT' && (
              <div>
                {/* 1. UPI Authentication */}
                {paymentMethod === 'UPI' && (
                  <div>
                    <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <UpiIcon size={16} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f766e' }}>UPI 2.0 PIN Verification</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>⏱ {formatTimer(authTimer)}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
                        A collect request of <strong>₹{formattedAmount}</strong> has been sent to your registered UPI handle.
                      </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Enter 4 or 6-Digit Secret UPI PIN to Authorize:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={20} style={{ position: 'absolute', left: '14px', top: '15px', color: '#94a3b8' }} />
                        <input
                          type="password"
                          maxLength="6"
                          placeholder="••••••"
                          className="input-field"
                          style={{ paddingLeft: '44px', letterSpacing: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 800 }}
                          value={authPin}
                          onChange={(e) => setAuthPin(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Authorize UPI Payment ₹{formattedAmount}
                    </button>
                  </div>
                )}

                {/* 2. Cards 3D-Secure OTP */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>3D Secure 2.0 • Bank Verified</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>⏱ {formatTimer(authTimer)}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        One-Time Password (OTP) sent to mobile ending in <strong>•••• {cardNumber.replace(/\s+/g, '').slice(-4) || '4242'}</strong>.
                      </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Enter 6-Digit Bank OTP:
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="••••••"
                        className="input-field"
                        style={{ letterSpacing: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 800 }}
                        value={authPin}
                        onChange={(e) => setAuthPin(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Submit OTP & Authenticate ₹{formattedAmount}
                    </button>
                  </div>
                )}

                {/* 3. Wallet Authorization */}
                {paymentMethod === 'WALLET' && (
                  <div>
                    <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f766e', display: 'block', marginBottom: '4px' }}>
                        {selectedWallet.toUpperCase()} Wallet Security Authorization
                      </span>
                      <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
                        Enter 4-digit authorization PIN for registered number <strong>{walletPhone}</strong>.
                      </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        Enter 4-Digit Wallet Authorization PIN:
                      </label>
                      <input
                        type="password"
                        maxLength="4"
                        placeholder="••••"
                        className="input-field"
                        style={{ letterSpacing: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 800 }}
                        value={authPin}
                        onChange={(e) => setAuthPin(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Confirm & Deduct ₹{formattedAmount} from Wallet
                    </button>
                  </div>
                )}

                {/* 4. Net Banking Authorization */}
                {paymentMethod === 'NET_BANKING' && (
                  <div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        {selectedBank} NetBanking Gateway
                      </span>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        Enter transaction High Security Password (OTP) sent to your mobile.
                      </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                        High Security Password (OTP):
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="••••••"
                        className="input-field"
                        style={{ letterSpacing: '8px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 800 }}
                        value={authPin}
                        onChange={(e) => setAuthPin(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Verify with Bank & Confirm ₹{formattedAmount}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingPage;
