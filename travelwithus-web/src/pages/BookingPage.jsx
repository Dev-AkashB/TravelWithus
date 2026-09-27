import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api, FALLBACK_PACKAGES, FALLBACK_HOTELS } from '../api/client';
import { Check, ShieldCheck, CreditCard, Lock, ArrowRight, ArrowLeft, Sparkles, Download, CheckCircle2 } from 'lucide-react';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const { triggerDemoNotification } = useNotifications();

  const type = searchParams.get('type') || 'PACKAGE';
  const id = searchParams.get('id') || '1';
  const initialGuests = Number(searchParams.get('guests')) || 2;

  // Selected item
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 21).toISOString().split('T')[0]);
  const [guests, setGuests] = useState(initialGuests);

  // Steps: 1 = Details & Travelers, 2 = Payment, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Traveler manifest
  const [primaryName, setPrimaryName] = useState(user?.name || 'Alex Mercer');
  const [primaryEmail, setPrimaryEmail] = useState(user?.email || 'alex.mercer@travelwithus.com');
  const [primaryPhone, setPrimaryPhone] = useState('+1 (555) 382-9910');
  const [guestList, setGuestList] = useState([
    { fullName: user?.name || 'Alex Mercer', age: 32, passport: 'P98234120', primary: true },
    { fullName: 'Elena Mercer', age: 30, passport: 'P98234121', primary: false }
  ]);
  const [specialRequests, setSpecialRequests] = useState('Ocean view villa preferred, late check-in.');

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD'); // CREDIT_CARD, UPI, PAYPAL
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Mercer');
  const [expiryDate, setExpiryDate] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [processing, setProcessing] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmedPayment, setConfirmedPayment] = useState(null);

  useEffect(() => {
    if (type === 'HOTEL') {
      const h = FALLBACK_HOTELS.find(x => x.id === Number(id)) || FALLBACK_HOTELS[0];
      setItem({ ...h, title: h.name, price: h.pricePerNight * 5 }); // 5 nights estimate
    } else {
      const p = FALLBACK_PACKAGES.find(x => x.id === Number(id)) || FALLBACK_PACKAGES[0];
      setItem(p);
    }
  }, [type, id]);

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
    setCardHolder(user?.name || 'Alex Mercer');
    setExpiryDate('12/28');
    setCvv('789');
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Create Booking in booking-service
      const bookingData = {
        userId: user ? user.id : 1,
        customerEmail: primaryEmail,
        customerName: primaryName,
        customerPhone: primaryPhone,
        bookingType: type,
        itemReferenceId: Number(id),
        itemTitle: item.title,
        startDate,
        endDate,
        numberOfGuests: guests,
        numberOfRooms: 1,
        totalAmount: Number(totalAmount),
        specialRequests,
        travelers: guestList.map(g => ({
          fullName: g.fullName,
          age: Number(g.age),
          gender: 'Other',
          passportOrIdNumber: g.passport,
          primaryContact: g.primary
        }))
      };

      const bookingRes = await api.createBooking(bookingData);

      // 2. Process Payment in payment-service
      const paymentData = {
        bookingId: bookingRes.id,
        bookingNumber: bookingRes.bookingNumber,
        userId: user ? user.id : 1,
        customerEmail: primaryEmail,
        amount: Number(totalAmount),
        currency: 'USD',
        paymentMethod,
        cardNumber,
        expiryMonth: expiryDate.split('/')[0] || '12',
        expiryYear: '20' + (expiryDate.split('/')[1] || '28'),
        cvv
      };

      const paymentRes = await api.processPayment(paymentData);

      // Store in demo localStorage bookings
      const existing = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      const newRecord = {
        ...bookingRes,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentReference: paymentRes.paymentReference
      };
      localStorage.setItem('twu_demo_bookings', JSON.stringify([newRecord, ...existing]));

      setConfirmedBooking(bookingRes);
      setConfirmedPayment(paymentRes);
      setCurrentStep(3);

      // Trigger live real-time notification alert via STOMP context
      triggerDemoNotification(
        'Booking Confirmed: ' + bookingRes.bookingNumber,
        `Your reservation for ${item.title} has been confirmed. Receipt #${paymentRes.paymentReference}.`,
        'BOOKING_CONFIRMED'
      );
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setProcessing(false);
    }
  };

  if (!item) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Step Progress Bar */}
      <div style={{ maxWidth: '680px', margin: '0 auto 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {[
          { step: 1, label: 'Itinerary & Guests' },
          { step: 2, label: 'Payment Gateway' },
          { step: 3, label: 'Confirmed' }
        ].map((s, idx) => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: currentStep >= s.step ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              {currentStep > s.step ? <Check size={18} /> : s.step}
            </div>
            <span style={{ fontSize: '0.9rem', color: currentStep >= s.step ? '#ffffff' : '#64748b', fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Traveler Details */}
      {currentStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '40px' }}>
          <div>
            <form onSubmit={handleNextToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Primary Contact Card */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>1. Primary Traveler Contact</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Full Legal Name</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={primaryName}
                      onChange={(e) => setPrimaryName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Email (Receipt & Updates)</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={primaryEmail}
                      onChange={(e) => setPrimaryEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Contact Phone</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Guest Manifest Card */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>2. Guest Manifest</h3>
                {guestList.map((guest, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2dd4bf', marginBottom: '10px' }}>
                      Traveler #{idx + 1} {guest.primary && '(Primary Contact)'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="Full Name as on Passport"
                        className="input-field"
                        defaultValue={guest.fullName}
                      />
                      <input
                        type="number"
                        placeholder="Age"
                        className="input-field"
                        defaultValue={guest.age}
                      />
                      <input
                        type="text"
                        placeholder="Passport / ID Number"
                        className="input-field"
                        defaultValue={guest.passport}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Requests */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>3. Special Preferences</h3>
                <textarea
                  rows="3"
                  className="input-field"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1.05rem' }}>
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div>
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Reservation Summary</h3>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#ffffff', lineHeight: '1.3' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#2dd4bf' }}>{item.destinationName || item.city}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Travel Dates:</span>
                  <span style={{ color: '#fff' }}>{startDate} to {endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Party Size:</span>
                  <span style={{ color: '#fff' }}>{guests} Travelers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Instant Verification:</span>
                  <span style={{ color: '#34d399' }}>Available</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Total Due</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2dd4bf' }}>${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Payment Gateway UI */}
      {currentStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '40px' }}>
          <div>
            <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.6rem' }}>Select Payment Method</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#34d399' }}>
                  <ShieldCheck size={18} /> 256-Bit SSL Encrypted
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                {[
                  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                  { id: 'UPI', label: 'Instant UPI', icon: Sparkles },
                  { id: 'PAYPAL', label: 'PayPal', icon: ShieldCheck }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: `1px solid ${paymentMethod === m.id ? '#14b8a6' : 'rgba(255, 255, 255, 0.1)'}`,
                      background: paymentMethod === m.id ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      color: paymentMethod === m.id ? '#2dd4bf' : '#94a3b8',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    <m.icon size={22} />
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'CREDIT_CARD' && (
                <div>
                  {/* Luxury Card Preview */}
                  <div
                    style={{
                      maxWidth: '380px',
                      margin: '0 auto 28px',
                      padding: '24px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #0d9488 0%, #0f172a 100%)',
                      boxShadow: '0 20px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(20, 184, 166, 0.3)',
                      color: '#ffffff',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px' }}>TRAVELWITHUS PLATINUM</span>
                      <CreditCard size={28} />
                    </div>

                    <div style={{ fontSize: '1.25rem', letterSpacing: '3px', fontWeight: 600, marginBottom: '24px', fontFamily: 'monospace' }}>
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', textTransform: 'uppercase', color: '#99f6e4' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8' }}>CARDHOLDER</span>
                        <span style={{ fontWeight: 600 }}>{cardHolder || 'ALEX MERCER'}</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8' }}>EXPIRES</span>
                        <span style={{ fontWeight: 600 }}>{expiryDate || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        className="input-field"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Cardholder Name</label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Expiry</label>
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
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>CVV</label>
                        <input
                          type="password"
                          required
                          maxLength="4"
                          placeholder="•••"
                          className="input-field"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickFillCard}
                      style={{
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        color: '#2dd4bf',
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '8px'
                      }}
                    >
                      <Sparkles size={14} /> Quick-fill Test Card Details
                    </button>

                    <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ flex: 2, padding: '14px', fontSize: '1.05rem' }}
                        disabled={processing}
                      >
                        {processing ? 'Processing Secure Payment...' : `Authorize & Pay $${totalAmount}`}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <Sparkles size={40} color="#2dd4bf" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Instant UPI Checkout</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Enter your Virtual Payment Address (VPA) to approve payment on your device.</p>
                  <input type="text" placeholder="username@oksbi / username@paytm" className="input-field" style={{ maxWidth: '340px', margin: '0 auto 16px' }} defaultValue="alex.mercer@oksbi" />
                  <button onClick={handleProcessPayment} className="btn-primary" style={{ padding: '12px 30px' }}>
                    {processing ? 'Confirming with UPI...' : `Approve & Pay $${totalAmount}`}
                  </button>
                </div>
              )}

              {paymentMethod === 'PAYPAL' && (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <ShieldCheck size={40} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>PayPal Express Checkout</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>You will be securely redirected to authorize this transaction.</p>
                  <button onClick={handleProcessPayment} className="btn-accent" style={{ padding: '12px 30px' }}>
                    {processing ? 'Redirecting to PayPal...' : `Continue with PayPal`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary */}
          <div>
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Total Charge</h3>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2dd4bf', marginBottom: '16px' }}>
                ${totalAmount}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                <li>✓ Immediate booking number generated</li>
                <li>✓ Hotel room & tour capacity reserved</li>
                <li>✓ Instant automated email receipt</li>
                <li>✓ Free cancellation up to 48h before departure</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Confirmed Success Screen */}
      {currentStep === 3 && confirmedBooking && (
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Pack Your Bags!</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '28px' }}>
            Your trip <strong>{item.title}</strong> is confirmed. A receipt has been sent to <strong>{primaryEmail}</strong>.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>Booking Reference:</span>
              <strong style={{ color: '#2dd4bf', letterSpacing: '1px' }}>{confirmedBooking.bookingNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>Payment Reference:</span>
              <strong style={{ color: '#ffffff' }}>{confirmedPayment?.paymentReference}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>Total Amount Paid:</span>
              <strong style={{ color: '#ffffff' }}>${totalAmount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#94a3b8' }}>Travel Dates:</span>
              <span style={{ color: '#cbd5e1' }}>{startDate} to {endDate}</span>
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
    </div>
  );
};
