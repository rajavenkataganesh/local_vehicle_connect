import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Calendar, User, LayoutDashboard, Truck, Bell } from 'lucide-react';

const BottomNavigation = () => {
  const { user, isCustomer, isDriver } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl px-2 py-2">
      <div className="flex items-center justify-around">
        {isCustomer && (
          <>
            <Link
              to="/"
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive('/') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Home</span>
            </Link>

            <Link
              to="/search"
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive('/search') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Search</span>
            </Link>

            <Link
              to="/customer/bookings"
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive('/customer/bookings') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Bookings</span>
            </Link>

            <Link
              to="/customer/profile"
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive('/customer/profile') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">Profile</span>
            </Link>
          </>
        )}

        {isDriver && (
          <>
            <Link
              to="/driver/dashboard"
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive('/driver/dashboard') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Dashboard</span>
            </Link>

            <Link
              to="/driver/vehicles"
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive('/driver/vehicles') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Vehicles</span>
            </Link>

            <Link
              to="/driver/requests"
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive('/driver/requests') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Requests</span>
            </Link>

            <Link
              to="/driver/bookings"
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive('/driver/bookings') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Bookings</span>
            </Link>

            <Link
              to="/driver/profile"
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive('/driver/profile') ? 'text-emerald-600 font-bold scale-105' : 'text-slate-500'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Profile</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
