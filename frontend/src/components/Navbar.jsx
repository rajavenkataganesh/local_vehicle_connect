import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, LogOut, User, Car, Calendar, LayoutDashboard, PlusCircle, Search } from 'lucide-react';
import DriverAvatar from './DriverAvatar';

const Navbar = () => {
  const { user, isCustomer, isDriver, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">
                LOCAL VEHICLE
              </span>
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase block mt-0.5">
                CONNECT INDIA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {isCustomer && (
              <>
                <Link
                  to="/search"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/search') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Find Vehicle
                </Link>
                <Link
                  to="/customer/bookings"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/customer/bookings') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Bookings
                </Link>
              </>
            )}

            {isDriver && (
              <>
                <Link
                  to="/driver/dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/driver/dashboard') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/driver/vehicles"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/driver/vehicles') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Vehicles
                </Link>
                <Link
                  to="/driver/requests"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/driver/requests') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Requests
                </Link>
                <Link
                  to="/driver/bookings"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive('/driver/bookings') ? 'bg-slate-100 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Bookings
                </Link>
              </>
            )}
          </nav>

          {/* Right Action / Profile Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isDriver ? '/driver/profile' : '/customer/profile'}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <DriverAvatar photo={user.profile_photo} name={user.name} size="sm" />
                  <span className="hidden sm:block text-sm font-bold text-slate-800">
                    {user.name}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-slate-200 text-slate-700">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/customer/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Customer Login
                </Link>
                <Link
                  to="/driver/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
                >
                  Register Vehicle
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
