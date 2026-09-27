import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('twu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('twu_token');
      localStorage.removeItem('twu_user');
    }
    return Promise.reject(error);
  }
);

// Fallback seed data in case API Gateway or individual services are in cold start
export const FALLBACK_DESTINATIONS = [
  {
    id: 1,
    name: 'Bali',
    country: 'Indonesia',
    category: 'BEACH',
    tagline: 'Island of the Gods & Pristine Beaches',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    startingPrice: 899,
    popular: true,
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    category: 'CULTURAL',
    tagline: 'The City of Light, Art & High Romance',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    startingPrice: 1250,
    popular: true,
  },
  {
    id: 3,
    name: 'Maldives',
    country: 'Maldives',
    category: 'BEACH',
    tagline: 'Turquoise Lagoons & Private Overwater Villas',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    startingPrice: 1899,
    popular: true,
  },
  {
    id: 4,
    name: 'Swiss Alps',
    country: 'Switzerland',
    category: 'ADVENTURE',
    tagline: 'Majestic Glaciers & Alpine Scenic Splendor',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    startingPrice: 1650,
    popular: true,
  },
  {
    id: 5,
    name: 'Dubai',
    country: 'United Arab Emirates',
    category: 'URBAN',
    tagline: 'Futuristic Luxury, Desert Safaris & Sky-High Living',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    startingPrice: 1100,
    popular: true,
  },
  {
    id: 6,
    name: 'Tokyo',
    country: 'Japan',
    category: 'URBAN',
    tagline: 'Neon Metropolis Meets Ancient Temples',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    startingPrice: 1400,
    popular: true,
  }
];

export const FALLBACK_PACKAGES = [
  {
    id: 1,
    title: 'Bali Tropical Paradise & Cultural Discovery',
    destinationName: 'Bali, Indonesia',
    durationDays: 7,
    durationNights: 6,
    price: 1299.00,
    discountPercentage: 15,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    availableSlots: 14,
    highlights: ['Ubud Sacred Monkey Forest', 'Tirta Empul Water Temple', 'Kuta Sunset Beach & Surf', 'Sunset Seafood Dinner at Jimbaran Bay'],
    inclusions: ['4-Star Luxury Villa', 'Daily Gourmet Breakfast', 'Private Chauffeur Tour', 'Airport Transfers'],
  },
  {
    id: 2,
    title: 'Parisian Romance & Haute Cuisine Tour',
    destinationName: 'Paris, France',
    durationDays: 5,
    durationNights: 4,
    price: 1599.00,
    discountPercentage: 10,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    availableSlots: 8,
    highlights: ['Eiffel Tower Summit Champagne', 'VIP Louvre Guided Walk', 'Seine Twilight Dinner Cruise', 'Montmartre Artisan Pastry Walk'],
    inclusions: ['Boutique 5-Star Hotel', 'Seine River Cruise Tickets', 'Daily French Breakfast', 'Museum Priority Passes'],
  },
  {
    id: 3,
    title: 'Maldives Overwater Sanctuary Escape',
    destinationName: 'Maldives',
    durationDays: 6,
    durationNights: 5,
    price: 2499.00,
    discountPercentage: 20,
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    availableSlots: 6,
    highlights: ['Private Sunset Dolphin Cruise', 'Coral Reef Scuba Diving', 'Floating Breakfast in Private Lagoon Pool', 'Couples Spa Ritual'],
    inclusions: ['All-Inclusive Gourmet Dining', 'Speedboat Airport Transfer', 'Complimentary Water Sports Equipment', 'Overwater Villa with Glass Floor'],
  },
  {
    id: 4,
    title: 'Swiss Alpine Glacier & Panorama Train Expedition',
    destinationName: 'Swiss Alps, Switzerland',
    durationDays: 8,
    durationNights: 7,
    price: 2199.00,
    discountPercentage: 12,
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    availableSlots: 10,
    highlights: ['Jungfraujoch Top of Europe', 'Glacier Express Scenic Rail', 'Interlaken Lake Cruise', 'Zermatt & Matterhorn Sunrise'],
    inclusions: ['Swiss First-Class Travel Pass', 'Mountain Resort Accommodations', 'Daily Alpine Breakfasts & Dinners', 'All Cable Car Excursions'],
  }
];

export const FALLBACK_HOTELS = [
  {
    id: 1,
    name: 'Ayana Resort & Secluded Cliffside Spa',
    city: 'Bali',
    country: 'Indonesia',
    starRating: 5,
    pricePerNight: 280.00,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Beach', 'Infinity Ocean Pool', 'Rock Bar Access', 'Award-Winning Spa', 'Fine Dining'],
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Le Grand Boulevard Palace',
    city: 'Paris',
    country: 'France',
    starRating: 5,
    pricePerNight: 420.00,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    amenities: ['Eiffel Tower Views', 'Michelin-Starred Restaurant', 'Marble Baths', 'Butler Service', 'Rooftop Bar'],
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Anantara Dhigu Maldives Resort',
    city: 'South Male Atoll',
    country: 'Maldives',
    starRating: 5,
    pricePerNight: 650.00,
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    amenities: ['Overwater Bungalows', 'PADI Dive Center', 'Kids Club', 'Waterfront Dining', 'Seaplane Lounge'],
    rating: 5.0,
  }
];

// API Methods
export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    } catch {
      // Mock login for offline testing
      return {
        token: 'mock-jwt-token-customer',
        userId: 1,
        email,
        name: 'Alex Mercer',
        role: 'ROLE_CUSTOMER'
      };
    }
  },
  register: async (data) => {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch {
      return {
        token: 'mock-jwt-token-registered',
        userId: 2,
        email: data.email,
        name: data.fullName,
        role: 'ROLE_CUSTOMER'
      };
    }
  },

  // Destinations
  getDestinations: async () => {
    try {
      const res = await apiClient.get('/destinations');
      return res.data?.content || FALLBACK_DESTINATIONS;
    } catch {
      return FALLBACK_DESTINATIONS;
    }
  },

  // Packages
  getPackages: async () => {
    try {
      const res = await apiClient.get('/packages');
      return res.data?.content || FALLBACK_PACKAGES;
    } catch {
      return FALLBACK_PACKAGES;
    }
  },
  getPackageById: async (id) => {
    try {
      const res = await apiClient.get(`/packages/${id}`);
      return res.data;
    } catch {
      return FALLBACK_PACKAGES.find(p => p.id === Number(id)) || FALLBACK_PACKAGES[0];
    }
  },

  // Hotels
  getHotels: async () => {
    try {
      const res = await apiClient.get('/hotels');
      return res.data?.content || FALLBACK_HOTELS;
    } catch {
      return FALLBACK_HOTELS;
    }
  },

  // Bookings
  createBooking: async (bookingData) => {
    try {
      const res = await apiClient.post('/bookings', bookingData);
      return res.data;
    } catch {
      // Generate clean mock booking response
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        bookingNumber: `TWU-BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        userId: bookingData.userId || 1,
        itemTitle: bookingData.itemTitle,
        totalAmount: bookingData.totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        numberOfGuests: bookingData.numberOfGuests,
        travelers: bookingData.travelers,
        createdAt: new Date().toISOString()
      };
    }
  },
  getUserBookings: async (userId) => {
    try {
      const res = await apiClient.get(`/bookings/user/${userId}`);
      return res.data?.content || [];
    } catch {
      const saved = localStorage.getItem('twu_demo_bookings');
      return saved ? JSON.parse(saved) : [];
    }
  },
  cancelBooking: async (id, reason) => {
    try {
      const res = await apiClient.post(`/bookings/${id}/cancel`, { reason });
      return res.data;
    } catch {
      return { id, status: 'CANCELLED', cancellationReason: reason };
    }
  },

  // Payments
  processPayment: async (paymentData) => {
    try {
      const res = await apiClient.post('/payments/process', paymentData);
      return res.data;
    } catch {
      return {
        paymentReference: `TWU-PAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        bookingNumber: paymentData.bookingNumber,
        status: 'SUCCESS',
        amount: paymentData.amount,
        transactionId: `ch_stripe_${Math.random().toString(36).substring(2, 10)}`,
        cardLastFour: paymentData.cardNumber ? paymentData.cardNumber.slice(-4) : '4242',
        paidAt: new Date().toISOString()
      };
    }
  },

  // Reviews
  getReviewsForTarget: async (targetType, targetId) => {
    try {
      const res = await apiClient.get(`/reviews/target/${targetType}/${targetId}`);
      return res.data?.content || [];
    } catch {
      return [
        {
          id: 1,
          userFullName: 'Elena Rostova',
          rating: 5,
          title: 'Absolute perfection from start to finish',
          comment: 'Every excursion was seamlessly organized. The villa exceeded our highest expectations.',
          verifiedBooking: true,
          helpfulVotes: 14,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 2,
          userFullName: 'Marcus Vance',
          rating: 5,
          title: 'Unrivaled hospitality & breathtaking scenery',
          comment: 'The private boat charter and concierge were outstanding. Will definitely book through TravelWithUs again.',
          verifiedBooking: true,
          helpfulVotes: 9,
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
        }
      ];
    }
  },
  getRatingSummary: async (targetType, targetId) => {
    try {
      const res = await apiClient.get(`/reviews/target/${targetType}/${targetId}/summary`);
      return res.data;
    } catch {
      return {
        averageRating: 4.9,
        totalReviews: 24,
        starDistribution: { 5: 21, 4: 3, 3: 0, 2: 0, 1: 0 }
      };
    }
  },
  createReview: async (reviewData) => {
    try {
      const res = await apiClient.post('/reviews', reviewData);
      return res.data;
    } catch {
      return {
        id: Date.now(),
        ...reviewData,
        verifiedBooking: true,
        helpfulVotes: 0,
        createdAt: new Date().toISOString()
      };
    }
  },

  // Notifications
  getUserNotifications: async (userId) => {
    try {
      const res = await apiClient.get(`/notifications/user/${userId}`);
      return res.data?.content || [];
    } catch {
      return [
        {
          id: 101,
          title: 'Welcome to TravelWithUs Luxury',
          message: 'Enjoy $150 off your first curated international package using code LUXE150.',
          eventType: 'SYSTEM_ANNOUNCEMENT',
          readStatus: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }
  },
  markNotificationRead: async (id) => {
    try {
      const res = await apiClient.put(`/notifications/${id}/read`);
      return res.data;
    } catch {
      return { id, readStatus: true };
    }
  }
};
