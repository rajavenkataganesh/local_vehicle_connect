import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';

import LandingPage from './pages/LandingPage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import SearchVehiclesPage from './pages/SearchVehiclesPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import CustomerBookingsPage from './pages/CustomerBookingsPage';
import CustomerProfilePage from './pages/CustomerProfilePage';

import DriverLogin from './pages/DriverLogin';
import DriverRegisterPage from './pages/DriverRegisterPage';
import DriverDashboardPage from './pages/DriverDashboardPage';
import DriverVehiclesPage from './pages/DriverVehiclesPage';
import AddVehiclePage from './pages/AddVehiclePage';
import DriverRequestsPage from './pages/DriverRequestsPage';
import DriverBookingsPage from './pages/DriverBookingsPage';
import DriverProfilePage from './pages/DriverProfilePage';

// Protected Route Helpers
const CustomerRoute = ({ children }) => {
  const { user, isCustomer, loading } = useAuth();
  if (loading) return null;
  if (!user || !isCustomer) return <Navigate to="/customer/login" replace />;
  return children;
};

const DriverRoute = ({ children }) => {
  const { user, isDriver, loading } = useAuth();
  if (loading) return null;
  if (!user || !isDriver) return <Navigate to="/driver/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchVehiclesPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />

          {/* Customer Auth */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />

          {/* Customer Protected */}
          <Route
            path="/customer/bookings"
            element={
              <CustomerRoute>
                <CustomerBookingsPage />
              </CustomerRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <CustomerRoute>
                <CustomerProfilePage />
              </CustomerRoute>
            }
          />

          {/* Driver Auth */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegisterPage />} />

          {/* Driver Protected */}
          <Route
            path="/driver/dashboard"
            element={
              <DriverRoute>
                <DriverDashboardPage />
              </DriverRoute>
            }
          />
          <Route
            path="/driver/vehicles"
            element={
              <DriverRoute>
                <DriverVehiclesPage />
              </DriverRoute>
            }
          />
          <Route
            path="/driver/add-vehicle"
            element={
              <DriverRoute>
                <AddVehiclePage />
              </DriverRoute>
            }
          />
          <Route
            path="/driver/requests"
            element={
              <DriverRoute>
                <DriverRequestsPage />
              </DriverRoute>
            }
          />
          <Route
            path="/driver/bookings"
            element={
              <DriverRoute>
                <DriverBookingsPage />
              </DriverRoute>
            }
          />
          <Route
            path="/driver/profile"
            element={
              <DriverRoute>
                <DriverProfilePage />
              </DriverRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
