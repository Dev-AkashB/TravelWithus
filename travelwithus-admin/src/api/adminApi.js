import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const adminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('twu_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Seed Data for instantaneous admin dashboard visualization
export const MOCK_ADMIN_STATS = {
  totalRevenue: 284500.00,
  confirmedBookings: 184,
  pendingBookings: 12,
  cancelledBookings: 6,
  activePackages: 10,
  pendingReviews: 3,
  registeredUsers: 1420
};

export const MOCK_BOOKINGS = [
  {
    id: 101,
    bookingNumber: 'TWU-BKG-883A9F12',
    customerName: 'Alex Mercer',
    customerEmail: 'alex.mercer@travelwithus.com',
    itemTitle: 'Bali Tropical Paradise & Cultural Discovery',
    bookingType: 'PACKAGE',
    numberOfGuests: 2,
    totalAmount: 2598.00,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    startDate: '2026-10-12',
    endDate: '2026-10-19',
    createdAt: '2026-09-27T14:30:00'
  },
  {
    id: 102,
    bookingNumber: 'TWU-BKG-994BC342',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@travelwithus.com',
    itemTitle: 'Maldives Overwater Sanctuary Escape',
    bookingType: 'PACKAGE',
    numberOfGuests: 2,
    totalAmount: 4998.00,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    startDate: '2026-11-05',
    endDate: '2026-11-11',
    createdAt: '2026-09-27T16:15:00'
  },
  {
    id: 103,
    bookingNumber: 'TWU-BKG-771DA510',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@travelwithus.com',
    itemTitle: 'Parisian Romance & Haute Cuisine Tour',
    bookingType: 'PACKAGE',
    numberOfGuests: 1,
    totalAmount: 1599.00,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    startDate: '2026-10-20',
    endDate: '2026-10-25',
    createdAt: '2026-09-27T18:40:00'
  },
  {
    id: 104,
    bookingNumber: 'TWU-BKG-660EB998',
    customerName: 'Samantha Reed',
    customerEmail: 'samantha.reed@example.com',
    itemTitle: 'Ayana Resort & Secluded Cliffside Spa',
    bookingType: 'HOTEL',
    numberOfGuests: 2,
    totalAmount: 1400.00,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    startDate: '2026-10-01',
    endDate: '2026-10-06',
    createdAt: '2026-09-26T11:20:00'
  }
];

export const MOCK_REVIEWS_MODERATION = [
  {
    id: 201,
    userFullName: 'Jessica Chen',
    targetType: 'PACKAGE',
    targetId: 1,
    rating: 5,
    title: 'The private speedboat tour was out of this world',
    comment: 'Everything from our arrival cocktail to the sacred temple trek was coordinated to perfection.',
    status: 'PENDING',
    verifiedBooking: true,
    createdAt: '2026-09-27T17:10:00'
  },
  {
    id: 202,
    userFullName: 'David Miller',
    targetType: 'HOTEL',
    targetId: 2,
    rating: 2,
    title: 'Late check-in issue with front desk',
    comment: 'Room was beautiful but had to wait 20 minutes past check-in time for key cards.',
    status: 'PENDING',
    verifiedBooking: false,
    createdAt: '2026-09-27T18:00:00'
  }
];

export const MOCK_TRANSACTIONS = [
  {
    id: 301,
    paymentReference: 'TWU-PAY-883A9F12',
    bookingNumber: 'TWU-BKG-883A9F12',
    customerEmail: 'alex.mercer@travelwithus.com',
    amount: 2598.00,
    paymentMethod: 'CREDIT_CARD',
    cardLastFour: '4242',
    status: 'SUCCESS',
    transactionId: 'ch_stripe_883a9f1234',
    createdAt: '2026-09-27T14:31:00'
  },
  {
    id: 302,
    paymentReference: 'TWU-PAY-994BC342',
    bookingNumber: 'TWU-BKG-994BC342',
    customerEmail: 'elena.rostova@travelwithus.com',
    amount: 4998.00,
    paymentMethod: 'CREDIT_CARD',
    cardLastFour: '4242',
    status: 'SUCCESS',
    transactionId: 'ch_stripe_994bc34255',
    createdAt: '2026-09-27T16:16:00'
  },
  {
    id: 303,
    paymentReference: 'TWU-PAY-660EB998',
    bookingNumber: 'TWU-BKG-660EB998',
    customerEmail: 'samantha.reed@example.com',
    amount: 1400.00,
    paymentMethod: 'CREDIT_CARD',
    cardLastFour: '1111',
    status: 'REFUNDED',
    transactionId: 'ch_stripe_660eb99899',
    createdAt: '2026-09-26T11:21:00'
  }
];

// Admin API endpoints
export const MOCK_ADMIN_PACKAGES = [
  {
    id: 1,
    title: 'Bali Tropical Paradise & Cultural Discovery',
    destinationName: 'Bali, Indonesia',
    destinationId: 1,
    durationDays: 7,
    durationNights: 6,
    price: 1299.00,
    discountPercentage: 15,
    availableSlots: 14,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Ubud Sacred Forest', 'Tirta Empul', 'Jimbaran Sunset']
  },
  {
    id: 2,
    title: 'Parisian Romance & Haute Cuisine Tour',
    destinationName: 'Paris, France',
    destinationId: 2,
    durationDays: 5,
    durationNights: 4,
    price: 1599.00,
    discountPercentage: 10,
    availableSlots: 8,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Eiffel Summit VIP', 'Louvre Curator Tour', 'Seine Dinner Cruise']
  },
  {
    id: 3,
    title: 'Maldives Overwater Sanctuary Escape',
    destinationName: 'Maldives',
    destinationId: 3,
    durationDays: 6,
    durationNights: 5,
    price: 2499.00,
    discountPercentage: 20,
    availableSlots: 6,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    highlights: ['Private Seaplane', 'Sunset Coral Reef Snorkel', 'Underwater Dining']
  },
  {
    id: 4,
    title: 'Swiss Alps Skiing & Glacier Express Expedition',
    destinationName: 'Swiss Alps, Switzerland',
    destinationId: 4,
    durationDays: 8,
    durationNights: 7,
    price: 2199.00,
    discountPercentage: 0,
    availableSlots: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Matterhorn Glacier Ride', 'First Cliff Walk', 'Panoramic Train']
  }
];

export const MOCK_ADMIN_DESTINATIONS = [
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
    attractionCount: 14
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
    attractionCount: 22
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
    attractionCount: 8
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
    attractionCount: 18
  }
];

export const MOCK_ADMIN_HOTELS = [
  {
    id: 1,
    name: 'Ayana Resort & Secluded Cliffside Spa',
    destinationName: 'Jimbaran, Bali',
    starRating: 5,
    pricePerNight: 350.00,
    roomTypesCount: 4,
    totalRooms: 60,
    availableRooms: 24,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Le Grand Palais Heritage Luxury',
    destinationName: '1st Arrondissement, Paris',
    starRating: 5,
    pricePerNight: 520.00,
    roomTypesCount: 3,
    totalRooms: 45,
    availableRooms: 12,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Soneva Fushi Overwater Eco Haven',
    destinationName: 'Baa Atoll, Maldives',
    starRating: 5,
    pricePerNight: 890.00,
    roomTypesCount: 3,
    totalRooms: 30,
    availableRooms: 5,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
  }
];

// Admin API endpoints
export const adminApi = {
  getStats: async () => {
    try {
      const res = await adminClient.get('/bookings/admin/stats');
      return res.data;
    } catch {
      return MOCK_ADMIN_STATS;
    }
  },
  getBookings: async (status = null) => {
    try {
      const url = status ? `/bookings/admin/all?status=${status}` : '/bookings/admin/all';
      const res = await adminClient.get(url);
      return res.data?.content || MOCK_BOOKINGS;
    } catch {
      return MOCK_BOOKINGS;
    }
  },
  updateBookingStatus: async (bookingNumber, status) => {
    try {
      const res = await adminClient.put(`/bookings/${bookingNumber}/payment-status`, {
        paymentStatus: status === 'CONFIRMED' ? 'PAID' : 'PENDING',
        paymentTransactionId: 'TXN-MANUAL-ADMIN'
      });
      return res.data;
    } catch {
      return { bookingNumber, status };
    }
  },
  getPackages: async () => {
    try {
      const res = await adminClient.get('/packages');
      return res.data?.content || MOCK_ADMIN_PACKAGES;
    } catch {
      return MOCK_ADMIN_PACKAGES;
    }
  },
  createPackage: async (data) => {
    try {
      const res = await adminClient.post('/packages', data);
      return res.data;
    } catch {
      return { id: Date.now(), ...data, rating: 5.0, status: 'ACTIVE' };
    }
  },
  deletePackage: async (id) => {
    try {
      await adminClient.delete(`/packages/${id}`);
      return { success: true };
    } catch {
      return { success: true };
    }
  },
  getDestinations: async () => {
    try {
      const res = await adminClient.get('/destinations');
      return res.data?.content || MOCK_ADMIN_DESTINATIONS;
    } catch {
      return MOCK_ADMIN_DESTINATIONS;
    }
  },
  createDestination: async (data) => {
    try {
      const res = await adminClient.post('/destinations', data);
      return res.data;
    } catch {
      return { id: Date.now(), ...data, rating: 5.0, popular: false };
    }
  },
  deleteDestination: async (id) => {
    try {
      await adminClient.delete(`/destinations/${id}`);
      return { success: true };
    } catch {
      return { success: true };
    }
  },
  getHotels: async () => {
    try {
      const res = await adminClient.get('/hotels');
      return res.data?.content || MOCK_ADMIN_HOTELS;
    } catch {
      return MOCK_ADMIN_HOTELS;
    }
  },
  createHotel: async (data) => {
    try {
      const res = await adminClient.post('/hotels', data);
      return res.data;
    } catch {
      return { id: Date.now(), ...data, starRating: 5, status: 'ACTIVE' };
    }
  },
  deleteHotel: async (id) => {
    try {
      await adminClient.delete(`/hotels/${id}`);
      return { success: true };
    } catch {
      return { success: true };
    }
  },
  getReviewsForModeration: async (status = 'PENDING') => {
    try {
      const res = await adminClient.get(`/reviews/admin/moderation?status=${status}`);
      return res.data?.content || MOCK_REVIEWS_MODERATION;
    } catch {
      return MOCK_REVIEWS_MODERATION;
    }
  },
  moderateReview: async (id, status, reason = '') => {
    try {
      const res = await adminClient.put(`/reviews/admin/${id}/moderate`, { status, reason });
      return res.data;
    } catch {
      return { id, status };
    }
  },
  getTransactions: async () => {
    try {
      const res = await adminClient.get('/payments/admin/all');
      return res.data?.content || MOCK_TRANSACTIONS;
    } catch {
      return MOCK_TRANSACTIONS;
    }
  },
  refundTransaction: async (reference, amount, reason) => {
    try {
      const res = await adminClient.post(`/payments/${reference}/refund`, { amount, reason });
      return res.data;
    } catch {
      return { paymentReference: reference, status: 'REFUNDED', refundedAmount: amount };
    }
  }
};
