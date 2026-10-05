import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Check, X, Shield, Star, ThumbsUp, ArrowRight, MessageSquarePlus } from 'lucide-react';
import { api, FALLBACK_PACKAGES } from '../api/client';
import { RatingStars } from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';

export const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary'); // itinerary, reviews, inclusions
  const [guests, setGuests] = useState(1);

  // Review submission state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    api.getPackageById(id).then(data => setPkg(data));
    api.getReviewsForTarget('PACKAGE', id).then(data => setReviews(data));
    api.getRatingSummary('PACKAGE', id).then(data => setRatingSummary(data));
  }, [id]);

  if (!pkg) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Loading itinerary...</h2>
      </div>
    );
  }

  const handleVoteHelpful = async (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuth('login');
      return;
    }

    const created = await api.createReview({
      userId: user.id,
      userFullName: user.name,
      targetType: 'PACKAGE',
      targetId: Number(id),
      rating: newRating,
      title: newTitle,
      comment: newComment
    });

    setReviews([created, ...reviews]);
    setReviewModalOpen(false);
    setNewTitle('');
    setNewComment('');
  };

  const sampleDays = [
    { day: 1, title: 'Arrival & Welcome Reception', desc: 'Private luxury transfer from airport/station to your premier resort or heritage property. Evening welcome dinner.' },
    { day: 2, title: 'Heritage Exploration & Cultural Discovery', desc: 'Curated guided tour of iconic landmarks, architectural monuments, and authentic local artisan workshops.' },
    { day: 3, title: 'Nature, Waterways & Scenic Excursion', desc: 'Full-day experience visiting secluded bays, backwaters or mountain viewpoints with private transport.' },
    { day: 4, title: 'Culinary Masterclass & Wellness Spa', desc: 'Organic regional dining followed by an authentic rejuvenation massage and sunset leisure.' },
    { day: 5, title: 'Farewell Dawn Sunrise Tour & Departure', desc: 'Sunrise photography tour, leisurely breakfast, and prompt private transfer to airport or departure terminal.' }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '440px', overflow: 'hidden' }}>
        <img
          src={pkg.imageUrl}
          alt={pkg.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)' }} />

        <div className="container" style={{ position: 'absolute', bottom: '40px', left: 0, right: 0 }}>
          <div className="badge badge-teal" style={{ marginBottom: '12px' }}>
            <MapPin size={14} /> {pkg.destinationName}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#ffffff', maxWidth: '900px', lineHeight: 1.2, marginBottom: '16px' }}>
            {pkg.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <RatingStars rating={pkg.rating || 4.9} size={18} />
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#2dd4bf" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#fef08a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} /> {pkg.availableSlots} Slots Open
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '40px' }}>
          {/* Left Column: Tabs & Details */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid #e2e8f0', marginBottom: '32px' }}>
              {[
                { id: 'itinerary', label: 'Day-by-Day Itinerary' },
                { id: 'inclusions', label: 'Inclusions & Services' },
                { id: 'reviews', label: `Traveler Reviews (${reviews.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 18px',
                    fontSize: '1rem',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? '#0d9488' : '#64748b',
                    borderBottom: activeTab === tab.id ? '3px solid #0d9488' : 'none',
                    marginBottom: '-2px',
                    transition: 'var(--transition)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Itinerary */}
            {activeTab === 'itinerary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sampleDays.map((item) => (
                  <div key={item.day} className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span className="badge badge-teal" style={{ padding: '6px 12px' }}>Day {item.day}</span>
                      <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{item.title}</h3>
                    </div>
                    <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Inclusions */}
            {activeTab === 'inclusions' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#047857', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={20} /> What's Included
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
                    {pkg.inclusions?.map((inc, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={16} color="#0d9488" /> {inc}
                      </li>
                    ))}
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} color="#0d9488" /> 24/7 Dedicated Concierge Support
                    </li>
                  </ul>
                </div>

                <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#be123c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={20} /> Not Included
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#64748b' }}>
                    <li>• Personal laundry, phone charges & mini-bar</li>
                    <li>• Optional adventure sports insurance</li>
                    <li>• Gratuities & personal souvenirs</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>Verified Guest Feedback</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Reviewed by authenticated travelers</p>
                  </div>
                  <button onClick={() => setReviewModalOpen(true)} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    <MessageSquarePlus size={16} /> Write Review
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map((rev) => (
                    <div key={rev.id} className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{rev.userFullName}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#0d9488' }}>
                            <Shield size={12} /> Verified Traveler
                          </div>
                        </div>
                        <RatingStars rating={rev.rating} size={14} />
                      </div>
                      <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '6px' }}>{rev.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '12px' }}>{rev.comment}</p>
                      <button
                        onClick={() => handleVoteHelpful(rev.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}
                      >
                        <ThumbsUp size={14} /> Helpful ({rev.helpfulVotes || 0})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div>
            <div
              className="glass-panel"
              style={{
                position: 'sticky',
                top: '100px',
                padding: '30px',
                borderRadius: '24px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)'
              }}
            >
              <div style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Starting from</span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{Number(pkg.price).toLocaleString('en-IN')}
                  <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 400 }}> / traveler</span>
                </div>
                {pkg.discountPercentage > 0 && (
                  <span className="badge badge-rose" style={{ marginTop: '8px' }}>
                    Save {pkg.discountPercentage}% Special Festive Offer
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Number of Travelers</label>
                  <select
                    className="input-field"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    style={{ cursor: 'pointer' }}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>₹{Number(pkg.price).toLocaleString('en-IN')} × {guests} guests</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>₹{(pkg.price * guests).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>GST & Govt. Permits</span>
                    <span style={{ color: '#047857', fontWeight: 600 }}>Included</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontWeight: 700 }}>
                    <span style={{ color: '#0f172a' }}>Estimated Total</span>
                    <span style={{ color: '#0d9488', fontSize: '1.2rem' }}>₹{(pkg.price * guests).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/booking?type=PACKAGE&id=${pkg.id}&guests=${guests}`)}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              >
                Instant Reservation <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#64748b' }}>
                ✓ No payment charged until next step • Free cancellation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
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
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '16px' }}>Share Your Experience</h3>
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Star Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ color: star <= newRating ? '#f59e0b' : '#cbd5e1' }}
                    >
                      <Star size={24} fill={star <= newRating ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beyond all expectations!"
                  className="input-field"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Your Detailed Review</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your tour guides, accommodations, favorite moments..."
                  className="input-field"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
