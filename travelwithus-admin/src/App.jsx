import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersManagerPage } from './pages/CustomersManagerPage';
import { BookingsPage } from './pages/BookingsPage';
import { PackagesManagerPage } from './pages/PackagesManagerPage';
import { DestinationsManagerPage } from './pages/DestinationsManagerPage';
import { HotelsManagerPage } from './pages/HotelsManagerPage';
import { ReviewModeratorPage } from './pages/ReviewModeratorPage';
import { FinancialLedgerPage } from './pages/FinancialLedgerPage';
import { WebsiteControllerPage } from './pages/WebsiteControllerPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

function AppRoutes() {
  const { isAuthenticated } = useAdminAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/website-control" element={<ProtectedRoute><WebsiteControllerPage /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><CustomersManagerPage /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
      <Route path="/packages" element={<ProtectedRoute><PackagesManagerPage /></ProtectedRoute>} />
      <Route path="/destinations" element={<ProtectedRoute><DestinationsManagerPage /></ProtectedRoute>} />
      <Route path="/hotels" element={<ProtectedRoute><HotelsManagerPage /></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><ReviewModeratorPage /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><FinancialLedgerPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
