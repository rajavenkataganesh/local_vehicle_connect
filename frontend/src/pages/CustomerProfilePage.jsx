import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DriverAvatar from '../components/DriverAvatar';
import Toast from '../components/Toast';
import { User, Phone, Mail, LogOut, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <DriverAvatar photo={user.profile_photo} name={user.name} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Customer Account</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Phone Number</p>
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

export default CustomerProfilePage;
