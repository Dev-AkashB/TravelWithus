import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api, FALLBACK_PACKAGES, FALLBACK_HOTELS } from '../api/client';
import {
  Check,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
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
  Trash2
} from 'lucide-react';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const { triggerDemoNotification } = useNotifications();

  const type = searchParams.get('type') || 'PACKAGE';
  const id = searchParams.get('id') || '1';
  const initialGuests = Math.max(1, Number(searchParams.get('guests')) || 1);

  // Selected item
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(initialGuests);

  // Steps: 1 = Details & Travelers, 2 = Payment, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Traveler manifest
  const [primaryName, setPrimaryName] = useState(user?.name || '');
  const [primaryEmail, setPrimaryEmail] = useState(user?.email || '');
  const [primaryPhone, setPrimaryPhone] = useState('+91 98765 43210');
  const [guestList, setGuestList] = useState(() =>
    Array.from({ length: initialGuests }, (_, i) => ({
      fullName: i === 0 ? (user?.name || '') : '',
      age: i === 0 ? '30' : '26',
      passport: i === 0 ? 'P8762514' : '',
      primary: i === 0
    }))
  );
  const [specialRequests, setSpecialRequests] = useState('');

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

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CREDIT_CARD' | 'WALLET' | 'NET_BANKING'
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI State
  const [upiMode, setUpiMode] = useState('app'); // 'app' | 'id' | 'qr'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'bhim'
  const [upiId, setUpiId] = useState('');

  // Wallet State
  const [selectedWallet, setSelectedWallet] = useState('paytm'); // 'paytm' | 'amazonpay' | 'phonepe' | 'mobikwik'
  const [walletPhone, setWalletPhone] = useState(primaryPhone || '+91 98765 43210');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');

  // Gateway Authentication Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStatus, setAuthStatus] = useState('INPUT'); // 'INPUT' | 'VERIFYING' | 'SUCCESS' | 'FAILED'
  const [authOtp, setAuthOtp] = useState('');
  const [authUpiPin, setAuthUpiPin] = useState('');
  const [authTimer, setAuthTimer] = useState(180);
  const [authError, setAuthError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmedPayment, setConfirmedPayment] = useState(null);

  useEffect(() => {
    if (user?.name && !primaryName) setPrimaryName(user.name);
    if (user?.email && !primaryEmail) setPrimaryEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (type === 'HOTEL') {
      const h = FALLBACK_HOTELS.find(x => x.id === Number(id)) || FALLBACK_HOTELS[0];
      setItem({ ...h, title: h.name, price: h.pricePerNight * 4 });
    } else {
      const p = FALLBACK_PACKAGES.find(x => x.id === Number(id)) || FALLBACK_PACKAGES[0];
      setItem(p);
    }
  }, [type, id]);

  // Auth Timer countdown
  useEffect(() => {
    let interval = null;
    if (showAuthModal && authTimer > 0 && authStatus === 'INPUT') {
      interval = setInterval(() => setAuthTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showAuthModal, authTimer, authStatus]);

  const totalAmount = item ? (item.price * guests).toFixed(2) : '0.00';

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (!user) {
      openAuth('login');
      return;
    }
    setCurrentStep(2);
  };

  const handleQuickFillCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder(primaryName || user?.name || 'Alex Mercer');
    setExpiryDate('12/28');
    setCvv('789');
  };

  // Open Payment Gateway Authentication Modal
  const handleInitiatePaymentAuth = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (paymentMethod === 'CREDIT_CARD') {
      if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 15) {
        alert('Please enter a valid 16-digit card number.');
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
    setAuthOtp('');
    setAuthUpiPin('');
    setAuthError('');
    setAuthTimer(180);
    setShowAuthModal(true);
  };

  // Process and finalize payment after gateway authentication
  const handleAuthorizeAndConfirm = async () => {
    setAuthStatus('VERIFYING');
    setAuthError('');

    // Simulate 1.2s bank/NPCI gateway handshake
    await new Promise(r => setTimeout(r, 1200));

    setAuthStatus('SUCCESS');

    // Brief delay to showcase the green success verification badge
    await new Promise(r => setTimeout(r, 800));

    setShowAuthModal(false);
    await executeBackendBooking();
  };

  // Execute Booking and Payment in Backend Services
  const executeBackendBooking = async () => {
    setProcessing(true);

    try {
      // 1. Prepare valid travelers
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

      // 2. Create Booking in booking-service (saves into MySQL travelwithus_bookings)
      const bookingData = {
        userId: user?.id || 1,
        customerEmail: primaryEmail?.trim() || user?.email || 'traveler@travelwithus.com',
        customerName: primaryName?.trim() || user?.name || 'Traveler',
        customerPhone: primaryPhone?.trim() || '+91 98765 43210',
        bookingType: type === 'HOTEL' ? 'HOTEL' : 'PACKAGE',
        itemReferenceId: Number(id) || 1,
        itemTitle: item.title,
        startDate: startDate,
        endDate: endDate,
        numberOfGuests: Number(guests) || 1,
        numberOfRooms: 1,
        totalAmount: Number(totalAmount),
        specialRequests: specialRequests?.trim() || 'None',
        travelers: validTravelers
      };

      const bookingRes = await api.createBooking(bookingData);

      // 3. Process Payment in payment-service (saves into MySQL travelwithus_payments)
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

      // 4. Update local demo booking registry for cross-tab & admin dashboard sync
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
      setCurrentStep(3);

      // 5. Trigger live STOMP real-time notification alert
      triggerDemoNotification(
        'Booking & Payment Confirmed!',
        `Your reservation for ${item.title} has been confirmed. Receipt #${newRecord.paymentReference}.`,
        'BOOKING_CONFIRMED'
      );
    } catch (err) {
      console.error('Payment processing error', err);
      alert('Payment processing error. Please retry.');
    } finally {
      setProcessing(false);
    }
  };

  if (!item) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Loading reservation details...</h2>
      </div>
    );
  }

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1100px' }}>
      {/* Stepper Header */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {[
            { num: 1, label: 'Guest Details' },
            { num: 2, label: 'Payment Gateway' },
            { num: 3, label: 'Confirmation' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: currentStep >= s.num ? '#0d9488' : '#e2e8f0',
                    color: currentStep >= s.num ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {currentStep > s.num ? <Check size={16} /> : s.num}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: currentStep === s.num ? 700 : 500, color: currentStep === s.num ? '#0f172a' : '#64748b' }}>
                  {s.label}
                </span>
              </div>
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
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '18px' }}>Primary Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Full Name</label>
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
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Email Address</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Mobile Number (for live SMS & WhatsApp updates)</label>
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
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
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
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ccfbf1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f0fdfa'; }}
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
                            <Trash2 size={13} /> Remove Guest
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

                  {/* Manual Add Button at bottom */}
                  <button
                    type="button"
                    onClick={handleAddGuest}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px dashed #cbd5e1',
                      background: '#f8fafc',
                      color: '#0d9488',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0d9488'; e.currentTarget.style.background = '#f0fdfa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <Plus size={16} /> + Add Another Guest
                  </button>
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
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px' }}>Reservation Summary</h3>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', lineHeight: '1.3' }}>{item.title}</h4>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Instant Verification:</span>
                  <span style={{ color: '#047857', fontWeight: 600 }}>Available (Live)</span>
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

      {/* STEP 2: Payment Gateway Selection */}
      {currentStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '40px' }}>
          <div>
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>Select Payment Method</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#047857', fontWeight: 600 }}>
                  <ShieldCheck size={18} /> 256-Bit SSL Encrypted
                </div>
              </div>

              {/* Payment Method Selector Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '28px' }}>
                {[
                  { id: 'UPI', label: 'UPI & QR Code', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
                  { id: 'CREDIT_CARD', label: 'Cards (3D Secure)', icon: CreditCard, desc: 'Visa, Master, RuPay' },
                  { id: 'WALLET', label: 'Digital Wallets', icon: Wallet, desc: 'Paytm, Amazon, PhonePe' },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: Building2, desc: 'SBI, HDFC, ICICI' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: `2px solid ${paymentMethod === m.id ? '#0d9488' : '#e2e8f0'}`,
                      background: paymentMethod === m.id ? '#f0fdfa' : '#ffffff',
                      color: paymentMethod === m.id ? '#0d9488' : '#475569',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    <m.icon size={22} color={paymentMethod === m.id ? '#0d9488' : '#64748b'} />
                    <span>{m.label}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>{m.desc}</span>
                  </button>
                ))}
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
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: upiMode === tab.id ? '#ffffff' : 'transparent',
                          color: upiMode === tab.id ? '#0d9488' : '#64748b',
                          fontWeight: upiMode === tab.id ? 700 : 500,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: upiMode === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {upiMode === 'app' && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '14px' }}>Choose your UPI app to receive an instant payment request:</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[
                          { id: 'gpay', name: 'Google Pay', color: '#4285F4' },
                          { id: 'phonepe', name: 'PhonePe', color: '#5f259f' },
                          { id: 'paytm', name: 'Paytm UPI', color: '#00b9f5' },
                          { id: 'bhim', name: 'BHIM UPI', color: '#00796b' }
                        ].map(app => (
                          <div
                            key={app.id}
                            onClick={() => setSelectedUpiApp(app.id)}
                            style={{
                              padding: '14px',
                              borderRadius: '12px',
                              border: `2px solid ${selectedUpiApp === app.id ? app.color : '#e2e8f0'}`,
                              background: selectedUpiApp === app.id ? `${app.color}10` : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              color: '#1e293b'
                            }}
                          >
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: app.color, margin: '0 auto 8px' }} />
                            {app.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {upiMode === 'id' && (
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        placeholder="e.g. mobile@upi or username@okaxis"
                        className="input-field"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {['@okhdfcbank', '@okaxis', '@paytm', '@ybl'].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setUpiId(prev => (prev.split('@')[0] || 'mobile') + s)}
                            style={{ fontSize: '0.75rem', background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '6px', color: '#475569', cursor: 'pointer' }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {upiMode === 'qr' && (
                    <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                      <div style={{ width: '150px', height: '150px', margin: '0 auto 12px', background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <QrCode size={130} color="#0f172a" />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Scan with any UPI App</span>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Google Pay, PhonePe, Paytm, CRED or BHIM</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}>
                      Proceed to UPI Authentication <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Credit/Debit Card Payment Option */}
              {paymentMethod === 'CREDIT_CARD' && (
                <form onSubmit={handleInitiatePaymentAuth} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Card Details</span>
                    <button type="button" onClick={handleQuickFillCard} style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                      + Auto-fill Test Card
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Cardholder Name</label>
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
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• 4242"
                      className="input-field"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        className="input-field"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>CVV</label>
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
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}>
                      Proceed to 3D-Secure Bank OTP <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}

              {/* 3. Digital Wallet Payment Option */}
              {paymentMethod === 'WALLET' && (
                <div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '16px' }}>Choose your digital wallet to authenticate and pay:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { id: 'paytm', name: 'Paytm Wallet', color: '#00b9f5' },
                      { id: 'amazonpay', name: 'Amazon Pay', color: '#ff9900' },
                      { id: 'phonepe', name: 'PhonePe Wallet', color: '#5f259f' },
                      { id: 'mobikwik', name: 'MobiKwik', color: '#0066cc' }
                    ].map(w => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWallet(w.id)}
                        style={{
                          padding: '16px 10px',
                          borderRadius: '12px',
                          border: `2px solid ${selectedWallet === w.id ? w.color : '#e2e8f0'}`,
                          background: selectedWallet === w.id ? `${w.color}10` : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          color: '#1e293b'
                        }}
                      >
                        <Wallet size={20} color={w.color} style={{ margin: '0 auto 8px' }} />
                        {w.name}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>Linked Mobile Number</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#047857', display: 'block', marginTop: '6px' }}>
                      ✓ Wallet Balance: ₹50,000.00 (Sufficient Funds)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ flex: 1, padding: '14px' }}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="button" onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ flex: 2, padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}>
                      Authorize Wallet Payment <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Net Banking Option */}
              {paymentMethod === 'NET_BANKING' && (
                <div>
                  <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
                    <Building2 size={40} color="#0d9488" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '6px' }}>Select Your Bank</h3>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '20px' }}>Direct netbanking transfer through RBI verified payment gateway.</p>

                    <div style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
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
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button onClick={() => setCurrentStep(1)} className="btn-secondary" style={{ padding: '12px 24px' }}>
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button onClick={handleInitiatePaymentAuth} className="btn-primary" style={{ padding: '12px 32px' }}>
                        Authenticate with {selectedBank.split(' ')[0]} <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary */}
          <div>
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px' }}>Total Charge</h3>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0d9488', marginBottom: '16px' }}>
                ₹{Number(totalAmount).toLocaleString('en-IN')}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <li>✓ Immediate booking number generated</li>
                <li>✓ Registered directly into MySQL Database</li>
                <li>✓ Live Operations Admin dashboard visibility</li>
                <li>✓ Instant automated WhatsApp & email receipt</li>
                <li>✓ Free cancellation up to 48h before departure</li>
              </ul>
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

          <h2 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '8px' }}>Pack Your Bags!</h2>
          <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '28px' }}>
            Your trip <strong>{item.title}</strong> is confirmed. A receipt has been sent to <strong>{primaryEmail}</strong>.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Booking Reference:</span>
              <strong style={{ color: '#0d9488', letterSpacing: '1px' }}>{confirmedBooking.bookingNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Payment Reference:</span>
              <strong style={{ color: '#0f172a' }}>{confirmedPayment?.paymentReference}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Total Amount Paid:</span>
              <strong style={{ color: '#0d9488' }}>₹{Number(totalAmount).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#64748b' }}>Payment Method:</span>
              <span style={{ color: '#0f172a', fontWeight: 600 }}>{paymentMethod} (Authenticated)</span>
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
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} /> Print Receipt
            </button>
            <Link to="/my-bookings" className="btn-primary">
              View In My Bookings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REAL-TIME PAYMENT GATEWAY AUTHENTICATION MODAL (UPI, CARD, WALLET) */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
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
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
              border: '1px solid #e2e8f0',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0d9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>TravelWithUs Gateway</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Merchant: TravelWithUs Global Holidays Pvt Ltd</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Amount</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d9488' }}>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Verification State Overlay */}
            {authStatus === 'VERIFYING' && (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <Loader2 size={44} color="#0d9488" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '6px' }}>Securing Transaction...</h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Communicating with {paymentMethod === 'UPI' ? 'NPCI & Bank UPI switch' : paymentMethod === 'CARD' ? 'Visa / Mastercard 3DS Directory Server' : 'Wallet Security Gateway'}
                </p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Success State Overlay */}
            {authStatus === 'SUCCESS' && (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '6px' }}>Authentication Approved!</h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Issuing reservation ticket & syncing to database...</p>
              </div>
            )}

            {/* Input State Form */}
            {authStatus === 'INPUT' && (
              <div>
                {/* 1. UPI Authentication UI */}
                {paymentMethod === 'UPI' && (
                  <div>
                    <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f766e' }}>UPI 2.0 Real-time Push Verification</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>⏱ {formatTimer(authTimer)}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
                        A collect request of <strong>₹{Number(totalAmount).toLocaleString('en-IN')}</strong> was dispatched to your UPI app.
                      </p>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Enter 4 or 6-Digit UPI PIN to Approve
                      </label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                        <input
                          type="password"
                          maxLength="6"
                          placeholder="••••••"
                          className="input-field"
                          style={{ paddingLeft: '40px', letterSpacing: '6px', fontSize: '1.2rem', textAlign: 'center' }}
                          value={authUpiPin}
                          onChange={(e) => setAuthUpiPin(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                      <button
                        type="button"
                        onClick={() => setAuthUpiPin('4829')}
                        style={{ padding: '8px', fontSize: '0.8rem', color: '#0d9488', background: '#f0fdfa', border: '1px dashed #0d9488', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ⚡ Auto-fill UPI PIN (4829)
                      </button>
                      <button
                        type="button"
                        onClick={handleAuthorizeAndConfirm}
                        style={{ padding: '8px', fontSize: '0.8rem', color: '#4338ca', background: '#eef2ff', border: '1px dashed #6366f1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ⚡ Simulate Instant App Approval (GPay/PhonePe Push)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Authorize UPI Payment ₹{Number(totalAmount).toLocaleString('en-IN')}
                    </button>
                  </div>
                )}

                {/* 2. Card 3D-Secure 2.0 OTP Authentication UI */}
                {paymentMethod === 'CREDIT_CARD' && (
                  <div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>3D Secure 2.0 • Verified by Visa / Mastercard</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>⏱ {formatTimer(authTimer)}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        One-Time Password (OTP) has been sent to your mobile registered with your card ending in <strong>•••• {cardNumber.replace(/\s+/g, '').slice(-4) || '4242'}</strong>.
                      </p>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Enter 6-Digit Bank OTP
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="••••••"
                        className="input-field"
                        style={{ letterSpacing: '8px', fontSize: '1.3rem', textAlign: 'center', fontWeight: 700 }}
                        value={authOtp}
                        onChange={(e) => setAuthOtp(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setAuthOtp('842915')}
                      style={{ width: '100%', padding: '8px', fontSize: '0.8rem', color: '#0d9488', background: '#f0fdfa', border: '1px dashed #0d9488', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginBottom: '16px' }}
                    >
                      ⚡ Auto-fill Bank OTP (842915)
                    </button>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Submit OTP & Authenticate Payment
                    </button>
                  </div>
                )}

                {/* 3. Wallet Authorization UI */}
                {paymentMethod === 'WALLET' && (
                  <div>
                    <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f766e', display: 'block', marginBottom: '4px' }}>
                        {selectedWallet.toUpperCase()} Wallet Security Authorization
                      </span>
                      <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
                        Enter authorization code sent to <strong>{walletPhone}</strong> to debit ₹{Number(totalAmount).toLocaleString('en-IN')}.
                      </p>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Enter 4-Digit Wallet Authorization PIN
                      </label>
                      <input
                        type="password"
                        maxLength="4"
                        placeholder="••••"
                        className="input-field"
                        style={{ letterSpacing: '8px', fontSize: '1.3rem', textAlign: 'center', fontWeight: 700 }}
                        value={authOtp}
                        onChange={(e) => setAuthOtp(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setAuthOtp('1234')}
                      style={{ width: '100%', padding: '8px', fontSize: '0.8rem', color: '#0d9488', background: '#f0fdfa', border: '1px dashed #0d9488', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginBottom: '16px' }}
                    >
                      ⚡ Auto-fill Wallet Code (1234)
                    </button>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Confirm & Deduct from Wallet
                    </button>
                  </div>
                )}

                {/* 4. Net Banking Authorization UI */}
                {paymentMethod === 'NET_BANKING' && (
                  <div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', marginBottom: '18px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        {selectedBank} NetBanking Gateway
                      </span>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        Enter 6-digit transaction High Security Password (OTP) sent to your mobile.
                      </p>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        High Security Password (OTP)
                      </label>
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="••••••"
                        className="input-field"
                        style={{ letterSpacing: '8px', fontSize: '1.2rem', textAlign: 'center', fontWeight: 700 }}
                        value={authOtp}
                        onChange={(e) => setAuthOtp(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setAuthOtp('593810')}
                      style={{ width: '100%', padding: '8px', fontSize: '0.8rem', color: '#0d9488', background: '#f0fdfa', border: '1px dashed #0d9488', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginBottom: '16px' }}
                    >
                      ⚡ Auto-fill High Security Password (593810)
                    </button>

                    <button
                      type="button"
                      onClick={handleAuthorizeAndConfirm}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
                    >
                      Verify with Bank & Confirm
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
