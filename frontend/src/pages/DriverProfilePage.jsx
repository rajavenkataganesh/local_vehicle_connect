import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DriverAvatar from '../components/DriverAvatar';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';
import { User, Phone, Mail, ShieldCheck, Truck, Calendar, LogOut, Radio, Star } from 'lucide-react';

const DriverProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <DriverAvatar photo={user.profile_photo} name={user.name} isVerified={user.is_verified} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              {user.is_verified && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Driver
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Vehicle Owner / Driver</p>
            <div className="mt-2">
              <RatingStars rating={5.0} count={12} size="sm" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Phone Number (Call Dialer Target)</p>
                <p className="text-sm font-bold text-slate-800">{user.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                <p className="text-sm font-bold text-slate-800">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Option Links */}
        <div className="space-y-2 pt-2">
          <Link
            to="/driver/vehicles"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-slate-800">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>My Vehicles</span>
            </div>
            <span className="text-xs text-slate-400">View & Add</span>
          </Link>

          <Link
            to="/driver/bookings"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-slate-800">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Trip Bookings</span>
            </div>
            <span className="text-xs text-slate-400">View History</span>
          </Link>

          <Link
            to="/driver/dashboard"
            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3 font-bold text-sm text-slate-800">
              <Radio className="w-5 h-5 text-emerald-600" />
              <span>Live Location Settings</span>
            </div>
            <span className="text-xs text-slate-400">Toggle GPS</span>
          </Link>
        </div>

        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm rounded-2xl border border-rose-200 flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverProfilePage;
