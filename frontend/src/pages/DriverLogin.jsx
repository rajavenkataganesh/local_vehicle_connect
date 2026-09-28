import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { Truck, Lock, Phone } from 'lucide-react';

const DriverLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email_or_phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(formData.email_or_phone, formData.password);
      if (user.role === 'DRIVER') {
        navigate('/driver/dashboard');
      } else {
        setToast({ message: 'This account is a customer account.', type: 'error' });
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || 'Driver login failed.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold">
            <Truck className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Driver Sign In</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage your vehicles, incoming requests & active trips
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Phone or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.email_or_phone}
                onChange={(e) => setFormData({ ...formData, email_or_phone: e.target.value })}
                placeholder="e.g. 9123456789 or raja@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Sign In to Driver Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-600">
            Don't have a driver profile yet?{' '}
            <Link to="/driver/register" className="font-bold text-emerald-600 hover:underline">
              Register Your Vehicle
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
