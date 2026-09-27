import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminLayout } from './components/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';
import { PackagesManagerPage } from './pages/PackagesManagerPage';
import { DestinationsManagerPage } from './pages/DestinationsManagerPage';
import { HotelsManagerPage } from './pages/HotelsManagerPage';
import { ReviewModeratorPage } from './pages/ReviewModeratorPage';
import { FinancialLedgerPage } from './pages/FinancialLedgerPage';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/packages" element={<PackagesManagerPage />} />
            <Route path="/destinations" element={<DestinationsManagerPage />} />
            <Route path="/hotels" element={<HotelsManagerPage />} />
            <Route path="/reviews" element={<ReviewModeratorPage />} />
            <Route path="/payments" element={<FinancialLedgerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminLayout>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
