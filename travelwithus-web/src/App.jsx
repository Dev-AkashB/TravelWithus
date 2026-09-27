import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';

import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { HotelsPage } from './pages/HotelsPage';
import { BookingPage } from './pages/BookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/destinations" element={<DestinationsPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/packages/:id" element={<PackageDetailPage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Routes>
            </main>
            <Footer />
            <AuthModal />
            <NotificationToast />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
