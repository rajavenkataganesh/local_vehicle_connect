import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import Toast from '../components/Toast';
import { Truck, User, Phone, Mail, Lock, Camera, CheckCircle2, ChevronRight, ChevronLeft, Image } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'car', label: '🚗 Car' },
  { value: 'auto', label: '🛺 Auto' },
  { value: 'tata_ace', label: '🚚 Tata Ace' },
  { value: 'van', label: '🚐 Van' },
  { value: 'mini_truck', label: '🚛 Mini Truck' },
  { value: 'pickup_truck', label: '🛻 Pickup Truck' },
  { value: 'goods_auto', label: '🚐 Goods Auto' },
];

const DriverRegisterPage = () => {
  const { registerDriver } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    profile_photo: '',
    vehicle_type: 'tata_ace',
    vehicle_model: '',
    vehicle_number: '',
    vehicle_photo: '',
  });

  const handlePhotoUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await authApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, [field]: res.url }));
      setToast({ message: 'Image uploaded successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to upload image.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleNextStep1 = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setToast({ message: 'Please fill in all personal details.', type: 'error' });
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!formData.profile_photo) {
      setToast({ message: 'Please upload a driver profile photo.', type: 'error' });
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (!formData.vehicle_model || !formData.vehicle_number) {
      setToast({ message: 'Please enter vehicle model and number.', type: 'error' });
      return;
    }
    setStep(4);
  };

  const handleNextStep4 = () => {
    if (!formData.vehicle_photo) {
      setToast({ message: 'Please upload a vehicle photo.', type: 'error' });
      return;
    }
    setStep(5);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await registerDriver({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        profile_photo: formData.profile_photo,
        vehicle_type: formData.vehicle_type,
        vehicle_model: formData.vehicle_model,
        vehicle_number: formData.vehicle_number,
        vehicle_photo: formData.vehicle_photo,
      });

      setToast({ message: 'Vehicle profile created successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 1000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg = 'Failed to create driver profile.';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d) => d.msg || 'Invalid field').join(', ');
      }
      setToast({
        message: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase text-slate-400 mb-3">
            <span>Step {step} of 5</span>
            <span className="text-emerald-600">
              {step === 1 && 'Personal Details'}
              {step === 2 && 'Driver Photo'}
              {step === 3 && 'Vehicle Info'}
              {step === 4 && 'Vehicle Photo'}
              {step === 5 && 'Confirmation'}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1 — Personal Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500 font-medium">Enter your driver profile details</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Driver Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Raja Sekhar"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9123456789"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. raja@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleNextStep1}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Driver Photo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2 — Driver Photo */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Upload Driver Photo</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Upload a clear portrait photo. Customers identify you by this photo.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 rounded-full bg-slate-100 border-4 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
                {formData.profile_photo ? (
                  <img
                    src={formData.profile_photo}
                    alt="Driver Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-300" />
                )}
                <label className="absolute inset-0 bg-black/40 hover:bg-black/50 text-white flex flex-col items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-xs font-bold">Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'profile_photo')}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-xs text-slate-500 font-semibold mt-3">
                {uploading ? 'Uploading Photo...' : formData.profile_photo ? '✓ Photo Uploaded' : 'Camera / Gallery / File'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleNextStep2}
                disabled={!formData.profile_photo}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Continue to Vehicle Info</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Vehicle Information */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black text-slate-900">Vehicle Information</h2>
              <p className="text-xs text-slate-500 font-medium">Select your vehicle category and details</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Vehicle Type *
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
              >
                {VEHICLE_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>
                    {vt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Vehicle Model *
              </label>
              <input
                type="text"
                required
                value={formData.vehicle_model}
                onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                placeholder="e.g. Tata Ace Gold CNG or Maruti Dzire"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Vehicle Registration Number *
              </label>
              <input
                type="text"
                required
                value={formData.vehicle_number}
                onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                placeholder="e.g. AP 16 TE 1234"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold uppercase"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleNextStep3}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Vehicle Photo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Vehicle Photo */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Upload Vehicle Photo</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Upload a clear photo showing your vehicle.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full h-48 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
                {formData.vehicle_photo ? (
                  <img
                    src={formData.vehicle_photo}
                    alt="Vehicle Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-16 h-16 text-slate-300" />
                )}
                <label className="absolute inset-0 bg-black/40 hover:bg-black/50 text-white flex flex-col items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-sm font-bold">Select Vehicle Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'vehicle_photo')}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-xs text-slate-500 font-semibold mt-2">
                {uploading ? 'Uploading Image...' : formData.vehicle_photo ? '✓ Vehicle Photo Uploaded' : 'High quality photo recommended'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleNextStep4}
                disabled={!formData.vehicle_photo}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>Review & Confirm</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 — Confirmation */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Confirm Vehicle Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Verify your driver and vehicle profile details</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-3">
                <img
                  src={formData.profile_photo}
                  alt={formData.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{formData.name}</h4>
                  <p className="text-xs text-slate-500">{formData.phone}</p>
                  <p className="text-xs text-slate-500">{formData.email}</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={formData.vehicle_photo}
                  alt={formData.vehicle_model}
                  className="w-24 h-16 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Vehicle</p>
                  <h5 className="font-bold text-slate-800 text-sm">{formData.vehicle_model}</h5>
                  <span className="inline-block bg-amber-100 text-amber-900 text-xs font-mono font-bold px-2 py-0.5 rounded mt-1">
                    {formData.vehicle_number}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Create Vehicle Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRegisterPage;
