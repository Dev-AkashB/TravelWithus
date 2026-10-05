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

// Mock Seed Data for instantaneous admin dashboard visualization in INR (₹)
export const MOCK_ADMIN_STATS = {
  totalRevenue: 28450000.00,
  confirmedBookings: 324,
  pendingBookings: 18,
  cancelledBookings: 8,
  activePackages: 14,
  pendingReviews: 4,
  registeredUsers: 1850
};

export const MOCK_CUSTOMERS = [
  {
    id: 1,
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@travelwithus.com',
    phoneNumber: '+91 98765 43210',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    loyaltyTier: 'PLATINUM',
    totalBookings: 8,
    totalSpent: 425000.00,
    status: 'ACTIVE',
    registeredAt: '2025-11-12T10:30:00',
    notes: 'Prefers high-floor lake-facing suites in Rajasthan & private Shikaras in Kashmir.'
  },
  {
    id: 2,
    fullName: 'Priya Iyer',
    email: 'priya.iyer@gmail.com',
    phoneNumber: '+91 98112 34567',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    loyaltyTier: 'GOLD',
    totalBookings: 5,
    totalSpent: 215000.00,
    status: 'ACTIVE',
    registeredAt: '2026-01-20T14:15:00',
    notes: 'Ayurvedic retreat & tea plantation enthusiast. Always requests organic meals.'
  },
  {
    id: 3,
    fullName: 'Vikramaditya Rathore',
    email: 'vikram.rathore@outlook.com',
    phoneNumber: '+91 99280 12345',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    loyaltyTier: 'PLATINUM',
    totalBookings: 12,
    totalSpent: 780000.00,
    status: 'ACTIVE',
    registeredAt: '2025-08-04T09:00:00',
    notes: 'Corporate leader. Books VIP heritage expeditions and luxury fleet transfers.'
  },
  {
    id: 4,
    fullName: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@yahoo.com',
    phoneNumber: '+91 97654 89012',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    loyaltyTier: 'SILVER',
    totalBookings: 3,
    totalSpent: 89000.00,
    status: 'ACTIVE',
    registeredAt: '2026-03-10T11:45:00',
    notes: 'Avid traveler for weekend Goa catamaran tours and scuba retreats.'
  },
  {
    id: 5,
    fullName: 'Rohan Mehra',
    email: 'rohan.mehra@travelwithus.com',
    phoneNumber: '+91 98450 77889',
    city: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    loyaltyTier: 'GOLD',
    totalBookings: 4,
    totalSpent: 168000.00,
    status: 'ACTIVE',
    registeredAt: '2026-02-18T16:20:00',
    notes: 'Family vacation planner. Requires child-friendly snow activities in Gulmarg.'
  },
  {
    id: 6,
    fullName: 'Siddharth Menon',
    email: 'siddharth.menon@hotmail.com',
    phoneNumber: '+91 94471 23890',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    loyaltyTier: 'SILVER',
    totalBookings: 1,
    totalSpent: 38499.00,
    status: 'INACTIVE',
    registeredAt: '2026-05-02T13:10:00',
    notes: 'Inquired about Ladakh motorcycle expedition.'
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 101,
    bookingNumber: 'TWU-BKG-883A9F12',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@travelwithus.com',
    itemTitle: 'Goa Coastal Grandeur & Private Catamaran Escape',
    bookingType: 'PACKAGE',
    numberOfGuests: 2,
    totalAmount: 49998.00,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    createdAt: '2026-09-27T14:30:00'
  },
  {
    id: 102,
    bookingNumber: 'TWU-BKG-994BC342',
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@gmail.com',
    itemTitle: 'Magical Kashmir: Dal Lake Houseboat & Gulmarg Snow Safari',
    bookingType: 'PACKAGE',
    numberOfGuests: 2,
    totalAmount: 73998.00,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    startDate: '2026-11-05',
    endDate: '2026-11-11',
    createdAt: '2026-09-27T16:15:00'
  },
  {
    id: 103,
    bookingNumber: 'TWU-BKG-771DA510',
    customerName: 'Vikramaditya Rathore',
    customerEmail: 'vikram.rathore@outlook.com',
    itemTitle: 'Kerala Serenity: Alleppey Houseboat & Munnar Tea Trails',
    bookingType: 'PACKAGE',
    numberOfGuests: 2,
    totalAmount: 59998.00,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    startDate: '2026-10-20',
    endDate: '2026-10-26',
    createdAt: '2026-09-27T18:40:00'
  },
  {
    id: 104,
    bookingNumber: 'TWU-BKG-660EB998',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.deshmukh@yahoo.com',
    itemTitle: 'The Leela Goa Beachfront Haven',
    bookingType: 'HOTEL',
    numberOfGuests: 2,
    totalAmount: 37500.00,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    startDate: '2026-10-01',
    endDate: '2026-10-04',
    createdAt: '2026-09-26T11:20:00'
  }
];

export const MOCK_REVIEWS_MODERATION = [
  {
    id: 201,
    userFullName: 'Rohan Mehra',
    targetType: 'PACKAGE',
    targetId: 2,
    rating: 5,
    title: 'The Kashmir cedarwood houseboat was unforgettable',
    comment: 'Everything from the hot kahwa welcome to the snowy Gulmarg gondola ride was arranged to perfection.',
    status: 'PENDING',
    verifiedBooking: true,
    createdAt: '2026-09-27T17:10:00'
  },
  {
    id: 202,
    userFullName: 'Deepika Nair',
    targetType: 'HOTEL',
    targetId: 1,
    rating: 2,
    title: 'Late check-in luggage delay',
    comment: 'Resort is breathtaking but golf buggy transfer took 15 minutes past arrival.',
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
    customerEmail: 'aarav.sharma@travelwithus.com',
    amount: 49998.00,
    paymentMethod: 'UPI',
    cardLastFour: null,
    status: 'SUCCESS',
    transactionId: 'upi_ref_883a9f1234',
    createdAt: '2026-09-27T14:31:00'
  },
  {
    id: 302,
    paymentReference: 'TWU-PAY-994BC342',
    bookingNumber: 'TWU-BKG-994BC342',
    customerEmail: 'priya.iyer@gmail.com',
    amount: 73998.00,
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
    customerEmail: 'ananya.deshmukh@yahoo.com',
    amount: 37500.00,
    paymentMethod: 'UPI',
    cardLastFour: null,
    status: 'REFUNDED',
    transactionId: 'upi_ref_660eb99899',
    createdAt: '2026-09-26T11:21:00'
  }
];

export const MOCK_ADMIN_PACKAGES = [
  {
    id: 1,
    title: 'Goa Coastal Grandeur & Private Catamaran Escape',
    destinationName: 'Goa, India',
    destinationId: 1,
    durationDays: 5,
    durationNights: 4,
    price: 24999.00,
    discountPercentage: 15,
    availableSlots: 16,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['Sunset Catamaran', 'Grand Island Scuba', 'Old Goa Heritage']
  },
  {
    id: 2,
    title: 'Magical Kashmir: Dal Lake Houseboat & Gulmarg Snow Safari',
    destinationName: 'Kashmir (Srinagar & Gulmarg), India',
    destinationId: 2,
    durationDays: 6,
    durationNights: 5,
    price: 36999.00,
    discountPercentage: 10,
    availableSlots: 10,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    highlights: ['Luxury Houseboat', 'Gulmarg Gondola', 'Pahalgam Valley']
  },
  {
    id: 3,
    title: 'Kerala Serenity: Alleppey Houseboat & Munnar Tea Trails',
    destinationName: 'Kerala, India',
    destinationId: 3,
    durationDays: 6,
    durationNights: 5,
    price: 29999.00,
    discountPercentage: 12,
    availableSlots: 12,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    highlights: ['AC Luxury Houseboat', 'Munnar Tea Plantation', 'Ayurvedic Spa']
  },
  {
    id: 4,
    title: 'Royal Rajasthan: Jaipur Pink City & Udaipur Lake Palaces',
    destinationName: 'Rajasthan, India',
    destinationId: 4,
    durationDays: 7,
    durationNights: 6,
    price: 38499.00,
    discountPercentage: 15,
    availableSlots: 14,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Amber Fort Elephant Walk', 'Lake Pichola Cruise', 'City Palace VIP']
  }
];

export const MOCK_ADMIN_DESTINATIONS = [
  {
    id: 1,
    name: 'Goa',
    country: 'India',
    category: 'BEACH',
    tagline: 'Sun-Kissed Beaches, Heritage Forts & Coastal Nightlife',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    startingPrice: 14999,
    popular: true,
    attractionCount: 28
  },
  {
    id: 2,
    name: 'Kashmir',
    country: 'India',
    category: 'ADVENTURE',
    tagline: 'Paradise on Earth, Dal Lake Shikaras & Snowy Peaks',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    startingPrice: 28999,
    popular: true,
    attractionCount: 22
  },
  {
    id: 3,
    name: 'Kerala Backwaters',
    country: 'India',
    category: 'NATURE',
    tagline: "God's Own Country, Houseboats & Mist-Clad Tea Hills",
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    startingPrice: 22499,
    popular: true,
    attractionCount: 19
  },
  {
    id: 4,
    name: 'Jaipur & Udaipur',
    country: 'India',
    category: 'CULTURAL',
    tagline: 'The Royal Heart of Rajasthan, Grand Forts & Lake Palaces',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    startingPrice: 19999,
    popular: true,
    attractionCount: 34
  }
];

export const MOCK_ADMIN_HOTELS = [
  {
    id: 1,
    name: 'The Leela Goa Beachfront Haven',
    destinationName: 'Cavelossim, Goa',
    starRating: 5,
    pricePerNight: 12500.00,
    roomTypesCount: 4,
    totalRooms: 120,
    availableRooms: 34,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'The Khyber Himalayan Resort & Spa',
    destinationName: 'Gulmarg, Kashmir',
    starRating: 5,
    pricePerNight: 19800.00,
    roomTypesCount: 3,
    totalRooms: 85,
    availableRooms: 12,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Taj Lake Palace Heritage Sanctuary',
    destinationName: 'Udaipur, Rajasthan',
    starRating: 5,
    pricePerNight: 32000.00,
    roomTypesCount: 4,
    totalRooms: 65,
    availableRooms: 8,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
  }
];

// Admin API endpoints
export const adminApi = {
  getStats: async () => {
    try {
      const res = await adminClient.get('/bookings/admin/stats');
      const baseStats = res.data || MOCK_ADMIN_STATS;
      const localBookings = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      if (localBookings.length > 0) {
        const localTotal = localBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        return {
          ...baseStats,
          totalRevenue: (Number(baseStats.totalRevenue) || 0) + localTotal,
          confirmedBookings: (Number(baseStats.confirmedBookings) || 0) + localBookings.length
        };
      }
      return baseStats;
    } catch {
      const localBookings = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      const localTotal = localBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      return {
        ...MOCK_ADMIN_STATS,
        totalRevenue: MOCK_ADMIN_STATS.totalRevenue + localTotal,
        confirmedBookings: MOCK_ADMIN_STATS.confirmedBookings + localBookings.length
      };
    }
  },

  // Customers Management
  getCustomers: async (search = '') => {
    try {
      const res = await adminClient.get(`/users/admin/customers${search ? `?query=${search}` : ''}`);
      return res.data?.content || MOCK_CUSTOMERS;
    } catch {
      const stored = localStorage.getItem('twu_admin_customers');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('twu_admin_customers', JSON.stringify(MOCK_CUSTOMERS));
      return MOCK_CUSTOMERS;
    }
  },
  createCustomer: async (customerData) => {
    try {
      const res = await adminClient.post('/users/admin/customers', customerData);
      return res.data;
    } catch {
      const stored = JSON.parse(localStorage.getItem('twu_admin_customers') || JSON.stringify(MOCK_CUSTOMERS));
      const newCust = {
        id: Date.now(),
        ...customerData,
        totalBookings: 0,
        totalSpent: 0,
        loyaltyTier: customerData.loyaltyTier || 'SILVER',
        status: customerData.status || 'ACTIVE',
        registeredAt: new Date().toISOString()
      };
      const updated = [newCust, ...stored];
      localStorage.setItem('twu_admin_customers', JSON.stringify(updated));
      return newCust;
    }
  },
  updateCustomer: async (id, customerData) => {
    try {
      const res = await adminClient.put(`/users/admin/customers/${id}`, customerData);
      return res.data;
    } catch {
      const stored = JSON.parse(localStorage.getItem('twu_admin_customers') || JSON.stringify(MOCK_CUSTOMERS));
      const updated = stored.map(c => c.id === id ? { ...c, ...customerData } : c);
      localStorage.setItem('twu_admin_customers', JSON.stringify(updated));
      return { id, ...customerData };
    }
  },
  deleteCustomer: async (id) => {
    try {
      await adminClient.delete(`/users/admin/customers/${id}`);
      return { success: true };
    } catch {
      const stored = JSON.parse(localStorage.getItem('twu_admin_customers') || JSON.stringify(MOCK_CUSTOMERS));
      const updated = stored.filter(c => c.id !== id);
      localStorage.setItem('twu_admin_customers', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Bookings
  getBookings: async (status = null) => {
    try {
      const url = status ? `/bookings/admin/all?status=${status}` : '/bookings/admin/all';
      const res = await adminClient.get(url);
      const apiBookings = res.data?.content || [];
      const localBookings = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');

      const map = new Map();
      localBookings.forEach(b => b.bookingNumber && map.set(b.bookingNumber, b));
      apiBookings.forEach(b => b.bookingNumber && map.set(b.bookingNumber, b));

      const combined = Array.from(map.values());
      const filtered = status ? combined.filter(b => b.status === status) : combined;
      return filtered.length > 0 ? filtered : MOCK_BOOKINGS;
    } catch {
      const localBookings = JSON.parse(localStorage.getItem('twu_demo_bookings') || '[]');
      const filtered = status ? localBookings.filter(b => b.status === status) : localBookings;
      return filtered.length > 0 ? [...filtered, ...MOCK_BOOKINGS] : MOCK_BOOKINGS;
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

  // Packages
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

  // Destinations
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

  // Hotels
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

  // Reviews
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

  // Transactions
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
