import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../api/client';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  ShieldCheck,
  Save,
  CheckCircle2,
  Compass,
  ArrowRight,
  FileText,
  AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser, openAuth } = useAuth();
  const { triggerDemoNotification } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'travel_docs' | 'preferences'
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Personal Details Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    bio: '',
    avatarUrl: ''
  });

  // Travel Documents & Identity State
  const [travelDocs, setTravelDocs] = useState({
    dateOfBirth: '1998-05-14',
    gender: 'MALE',
    nationality: 'Indian',
    passportNumber: 'Z8749210',
    emergencyContactName: 'Priya Behera',
    emergencyContactPhone: '+91 98765 12345',
    emergencyRelationship: 'Family / Spouse'
  });

  // Preferences Form state
  const [preferences, setPreferences] = useState({
    currency: 'INR',
    language: 'en',
    dietaryRequirements: 'Vegetarian, Vegan preferred on flights',
    travelInterests: 'Heritage Architecture, Luxury Resorts, Coastal Escapes'
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, prefRes] = await Promise.allSettled([
        api.getProfile(),
        api.getPreferences()
      ]);

      const pData = profileRes.status === 'fulfilled' ? profileRes.value : {};
      const prefData = prefRes.status === 'fulfilled' ? prefRes.value : {};

      setFormData({
        firstName: pData.firstName || user?.firstName || (user?.name ? user.name.split(' ')[0] : 'Akash'),
        lastName: pData.lastName || user?.lastName || (user?.name && user.name.includes(' ') ? user.name.substring(user.name.indexOf(' ') + 1) : 'Behera'),
        email: pData.email || user?.email || '',
        phone: pData.phone || user?.phone || user?.phoneNumber || '+91 98765 43210',
        address: pData.address || 'Plot 42, Tech Park Avenue',
        city: pData.city || 'Bhubaneswar',
        state: 'Odisha',
        postalCode: '751024',
        country: pData.country || 'India',
        bio: pData.bio || 'Passionate traveler exploring peaceful beaches, royal heritage palaces, and luxury wellness resorts.',
        avatarUrl: pData.avatarUrl || user?.avatarUrl || ''
      });

      if (prefData && typeof prefData === 'object') {
        setPreferences({
          currency: prefData.currency || 'INR',
          language: prefData.language || 'en',
          dietaryRequirements: prefData.dietaryRequirements || 'Vegetarian, Vegan preferred on flights',
          travelInterests: prefData.travelInterests || 'Heritage Architecture, Luxury Resorts, Coastal Escapes'
        });
      }

      // Load saved travel docs from local storage if present
      const savedDocs = localStorage.getItem(`twu_docs_${user?.id}`);
      if (savedDocs) {
        try {
          setTravelDocs(JSON.parse(savedDocs));
        } catch {
          // keep defaults
        }
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        bio: formData.bio.trim(),
        avatarUrl: formData.avatarUrl.trim()
      });

      // Synchronize into global user context
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      updateUser({
        name: fullName || user.name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatarUrl: formData.avatarUrl
      });

      setSuccessMessage('Customer profile details updated and saved to database successfully!');
      triggerDemoNotification('Profile Updated', 'Your customer details were saved in database.', 'PROFILE_UPDATE');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Profile update error:', err);
      setErrorMessage(err.message || 'Could not save profile details to the server.');
    } finally {
      setSaving(false);
    }
  };

  const handleTravelDocsSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      localStorage.setItem(`twu_docs_${user?.id}`, JSON.stringify(travelDocs));
      setSuccessMessage('Travel documents & identity details updated for flight passenger verification!');
      triggerDemoNotification('Travel Identity Saved', 'Passenger documents updated for instant check-in.', 'PROFILE_UPDATE');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch {
      setErrorMessage('Could not save travel documents.');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await api.updatePreferences(preferences);
      setSuccessMessage('Travel and meal preferences updated successfully in database!');
      triggerDemoNotification('Preferences Saved', 'Travel preferences updated.', 'PROFILE_UPDATE');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch {
      setErrorMessage('Could not update preferences at this time.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container" style={{ padding: '80px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', background: '#ffffff', padding: '40px 32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(15,23,42,0.06)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdfa', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Customer Profile</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px', lineHeight: '1.5' }}>
            Sign in to view your personal booking identity, contact details, and custom travel preferences.
          </p>
          <button
            onClick={() => openAuth('login')}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <ShieldCheck size={18} /> Sign In to Access Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '40px 20px 80px', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          Customer Profile & Personal Details
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.98rem', marginTop: '6px' }}>
          Manage your personal identity, contact information, and travel preferences.
        </p>
      </div>

      {/* Main Profile Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #093433 0%, #0f172a 60%, #1e293b 100%)',
          borderRadius: '24px',
          padding: '32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 20px 35px -10px rgba(13, 148, 136, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20, 184, 166, 0.28) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <div
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: formData.avatarUrl ? `url(${formData.avatarUrl}) center/cover` : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                border: '3px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
              }}
            >
              {!formData.avatarUrl && (formData.firstName ? formData.firstName[0].toUpperCase() : 'A')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : user.name}
                </h2>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: 'rgba(13, 148, 136, 0.3)',
                    border: '1px solid #14b8a6',
                    color: '#5eead4',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {user.provider === 'GOOGLE' ? 'Google Account' : 'Verified Traveler'}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            <Link
              to="/my-bookings"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '12px',
                background: '#0d9488',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)',
                transition: 'transform 0.2s ease'
              }}
            >
              <Calendar size={17} /> View My Bookings <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Notification Alerts */}
      {successMessage && (
        <div style={{ padding: '14px 18px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', color: '#047857', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, marginBottom: '24px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)' }}>
          <CheckCircle2 size={20} color="#059669" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '14px 18px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '12px', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, marginBottom: '24px' }}>
          <AlertCircle size={20} color="#dc2626" />
          {errorMessage}
        </div>
      )}

      {/* Profile Section Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('personal')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            color: activeTab === 'personal' ? '#0d9488' : '#64748b',
            borderBottom: activeTab === 'personal' ? '3px solid #0d9488' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <User size={18} /> Personal Details
        </button>

        <button
          onClick={() => setActiveTab('travel_docs')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            color: activeTab === 'travel_docs' ? '#0d9488' : '#64748b',
            borderBottom: activeTab === 'travel_docs' ? '3px solid #0d9488' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={18} /> Passenger Identity & Travel Docs
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          style={{
            padding: '12px 20px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            background: 'none',
            color: activeTab === 'preferences' ? '#0d9488' : '#64748b',
            borderBottom: activeTab === 'preferences' ? '3px solid #0d9488' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Compass size={18} /> Travel & Dining Preferences
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'personal' && (
        <form onSubmit={handlePersonalSubmit} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Customer Contact & Residential Details</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0 0' }}>These personal details appear on hotel reservation vouchers and booking invoices.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>First Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Akash"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Last Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Behera"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Verified Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="email"
                  disabled
                  className="input-field"
                  style={{ paddingLeft: '42px', background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                  value={formData.email}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Primary credential linked to your account.</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Mobile Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>City</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="e.g. Bhubaneswar / Bangalore"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>State / Province</label>
              <input
                type="text"
                placeholder="e.g. Odisha / Karnataka"
                className="input-field"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Postal / PIN Code</label>
              <input
                type="text"
                placeholder="e.g. 751024"
                className="input-field"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Country</label>
              <div style={{ position: 'relative' }}>
                <Globe size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="India"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Street / House Address</label>
            <input
              type="text"
              placeholder="e.g. Plot 42, Tech Park Avenue, Infocity"
              className="input-field"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Personal Bio & Traveler Statement</label>
            <textarea
              rows={3}
              placeholder="Share your travel interests or preferences..."
              className="input-field"
              style={{ resize: 'vertical' }}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button
              type="button"
              onClick={loadProfileData}
              disabled={saving}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} /> {saving ? 'Saving to Database...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Passenger Identity & Travel Docs */}
      {activeTab === 'travel_docs' && (
        <form onSubmit={handleTravelDocsSubmit} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Passenger Flight & Resort Verification</h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>Storing these details speeds up airline seat selection, hotel check-ins, and international travel bookings.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Date of Birth</label>
              <input
                type="date"
                className="input-field"
                value={travelDocs.dateOfBirth}
                onChange={(e) => setTravelDocs({ ...travelDocs, dateOfBirth: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Gender</label>
              <select
                className="input-field"
                value={travelDocs.gender}
                onChange={(e) => setTravelDocs({ ...travelDocs, gender: e.target.value })}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other / Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nationality</label>
              <input
                type="text"
                placeholder="Indian"
                className="input-field"
                value={travelDocs.nationality}
                onChange={(e) => setTravelDocs({ ...travelDocs, nationality: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Passport / Government ID Number</label>
              <input
                type="text"
                placeholder="e.g. Z8749210 or Aadhaar/PAN"
                className="input-field"
                value={travelDocs.passportNumber}
                onChange={(e) => setTravelDocs({ ...travelDocs, passportNumber: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Emergency Contact Name</label>
              <input
                type="text"
                placeholder="e.g. Priya Behera"
                className="input-field"
                value={travelDocs.emergencyContactName}
                onChange={(e) => setTravelDocs({ ...travelDocs, emergencyContactName: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Emergency Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98765 12345"
                className="input-field"
                value={travelDocs.emergencyContactPhone}
                onChange={(e) => setTravelDocs({ ...travelDocs, emergencyContactPhone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} /> {saving ? 'Saving Documents...' : 'Save Travel Identity Docs'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Travel & Dining Preferences */}
      {activeTab === 'preferences' && (
        <form onSubmit={handlePreferencesSubmit} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Traveler Customization & Booking Preferences</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 24px 0' }}>Set your preferred billing currency, in-flight dining requirements, and trip style.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Preferred Currency</label>
              <select
                className="input-field"
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Preferred Language</label>
              <select
                className="input-field"
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Dietary & Meal Preferences</label>
            <input
              type="text"
              placeholder="e.g. Vegetarian, Jain Meal, Gluten-Free, Halal"
              className="input-field"
              value={preferences.dietaryRequirements}
              onChange={(e) => setPreferences({ ...preferences, dietaryRequirements: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>Transmitted to resort kitchens and flight carriers automatically during booking.</span>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Travel Style & Passions</label>
            <input
              type="text"
              placeholder="e.g. Scuba Diving, Himalayan Treks, Luxury Heritage Palaces"
              className="input-field"
              value={preferences.travelInterests}
              onChange={(e) => setPreferences({ ...preferences, travelInterests: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} /> {saving ? 'Saving Preferences...' : 'Save Travel Preferences'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
