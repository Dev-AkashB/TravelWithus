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
  const [guests, setGuests] = useState(2);

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
    const res = await api.voteHelpful(reviewId);
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r));
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
    { day: 1, title: 'Arrival & VIP Sunset Welcome Cocktail', desc: 'Private luxury transfer from airport to your exclusive resort villa. Evening welcome banquet by the ocean.' },
    { day: 2, title: 'Sacred Temples & Hidden Forest Waterfalls', desc: 'Guided trek through historic sanctuaries, morning purification ceremony, and private waterfall lunch.' },
    { day: 3, title: 'Catamaran Sailing & Coral Reef Diving', desc: 'Full-day private yacht cruise exploring secluded bays with snorkeling gear and master diving instructor.' },
    { day: 4, title: 'Artisan Culinary Masterclass & Spa Ritual', desc: 'Visit local organic farms followed by a five-star private cooking masterclass and 2-hour rejuvenation spa.' },
    { day: 5, title: 'Farewell Dawn Sunrise Tour & Departure', desc: 'Private sunrise mountaintop breakfast, leisure time at the infinity pool, and airport chauffeur service.' }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        <img
          src={pkg.imageUrl}
          alt={pkg.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #090d16 0%, rgba(9, 13, 22, 0.4) 60%, transparent 100%)' }} />

        <div className="container" style={{ position: 'absolute', bottom: '40px', left: 0, right: 0 }}>
          <div className="badge badge-teal" style={{ marginBottom: '12px' }}>
            <MapPin size={14} /> {pkg.destinationName}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', maxWidth: '900px', lineHeight: 1.2, marginBottom: '16px' }}>
            {pkg.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <RatingStars rating={pkg.rating || 4.9} size={18} />
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#2dd4bf" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '32px' }}>
              {[
                { id: 'itinerary', label: 'Day-by-Day Itinerary' },
                { id: 'inclusions', label: 'Inclusions & Services' },
                { id: 'reviews', label: `Traveler Reviews (${reviews.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: activeTab === tab.id ? '#2dd4bf' : '#94a3b8',
                    borderBottom: activeTab === tab.id ? '2px solid #2dd4bf' : 'none',
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
                      <h3 style={{ fontSize: '1.2rem' }}>{item.title}</h3>
                    </div>
                    <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem' }}>
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
                  <h3 style={{ fontSize: '1.15rem', color: '#34d399', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={20} /> What's Included
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    <li>• 5-Star Luxury Villa / Resort accommodations</li>
                    <li>• Daily gourmet breakfasts & chef banquets</li>
                    <li>• Private chauffeured vehicle with personal guide</li>
                    <li>• VIP priority entrance to all national monuments</li>
                    <li>• Comprehensive international travel health coverage</li>
                  </ul>
                </div>

                <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#f87171', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={20} /> Not Included
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <li>• International flights (available on request)</li>
                    <li>• Personal shopping & alcoholic beverages</li>
                    <li>• Optional helicopter excursions</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div>
                {/* Rating Summary Header */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff' }}>4.9</div>
                    <RatingStars rating={4.9} size={20} showScore={false} />
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Based on 24 verified reviews</div>
                  </div>

                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    <MessageSquarePlus size={16} /> Write a Review
                  </button>
                </div>

                {/* Review Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviews.map(r => (
                    <div key={r.id} className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 600, color: '#ffffff' }}>{r.userFullName}</span>
                          {r.verifiedBooking && (
                            <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                              ✓ Verified Traveler
                            </span>
                          )}
                        </div>
                        <RatingStars rating={r.rating} size={14} />
                      </div>

                      <h4 style={{ fontSize: '1rem', marginBottom: '6px', color: '#f8fafc' }}>{r.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '14px' }}>
                        {r.comment}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#64748b' }}>
                        <button
                          onClick={() => handleVoteHelpful(r.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', cursor: 'pointer' }}
                        >
                          <ThumbsUp size={14} /> Helpful ({r.helpfulVotes})
                        </button>
                        <span>•</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
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
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Starting from</span>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
                  ${pkg.price}
                  <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 400 }}> / traveler</span>
                </div>
                {pkg.discountPercentage > 0 && (
                  <span className="badge badge-rose" style={{ marginTop: '8px' }}>
                    Save {pkg.discountPercentage}%% Special Promotion
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Number of Travelers</label>
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

                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>${pkg.price} × {guests} guests</span>
                    <span style={{ color: '#ffffff' }}>${(pkg.price * guests).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Taxes & Port Fees</span>
                    <span style={{ color: '#34d399' }}>Included</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', fontWeight: 700 }}>
                    <span style={{ color: '#ffffff' }}>Estimated Total</span>
                    <span style={{ color: '#2dd4bf', fontSize: '1.1rem' }}>${(pkg.price * guests).toFixed(2)}</span>
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
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setReviewModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Share Your Experience</h3>
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Star Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ color: star <= newRating ? '#f59e0b' : '#64748b' }}
                    >
                      <Star size={24} fill={star <= newRating ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Headline</label>
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
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>Your Detailed Review</label>
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
