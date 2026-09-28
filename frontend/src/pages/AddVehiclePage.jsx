import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehiclesApi, authApi } from '../services/api';
import Toast from '../components/Toast';
import { Truck, Camera, Image, ArrowLeft } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'car', label: '🚗 Car' },
  { value: 'auto', label: '🛺 Auto' },
  { value: 'tata_ace', label: '🚚 Tata Ace' },
  { value: 'van', label: '🚐 Van' },
  { value: 'mini_truck', label: '🚛 Mini Truck' },
  { value: 'pickup_truck', label: '🛻 Pickup Truck' },
  { value: 'goods_auto', label: '🚐 Goods Auto' },
];

const AddVehiclePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicle_type: 'tata_ace',
    vehicle_model: '',
    vehicle_number: '',
    vehicle_photo: '',
    description: '',
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await authApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, vehicle_photo: res.url }));
      setToast({ message: 'Vehicle photo uploaded!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to upload photo.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicle_photo) {
      setToast({ message: 'Please upload a vehicle photo.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      await vehiclesApi.create({
        vehicle_type: formData.vehicle_type,
        vehicle_model: formData.vehicle_model,
        vehicle_number: formData.vehicle_number,
        vehicle_photo: formData.vehicle_photo,
        description: formData.description,
        availability_status: true,
      });

      setToast({ message: 'Vehicle added successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/driver/vehicles');
      }, 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to add vehicle.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">Add New Vehicle</h1>
            <p className="text-xs text-slate-500 font-medium">Register an additional vehicle under your profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Vehicle Type *</label>
            <select
              value={formData.vehicle_type}
              onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
            >
              {VEHICLE_TYPES.map((vt) => (
                <option key={vt.value} value={vt.value}>{vt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Vehicle Model *</label>
            <input
              type="text"
              required
              value={formData.vehicle_model}
              onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
              placeholder="e.g. Mahindra Bolero Pickup or Bajaj Auto"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Vehicle Registration Number *</label>
            <input
              type="text"
              required
              value={formData.vehicle_number}
              onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
              placeholder="e.g. AP 16 TE 4521"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Vehicle Photo *</label>
            <div className="relative h-44 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
              {formData.vehicle_photo ? (
                <img src={formData.vehicle_photo} alt="Vehicle Preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-12 h-12 text-slate-300" />
              )}
              <label className="absolute inset-0 bg-black/40 hover:bg-black/50 text-white flex flex-col items-center justify-center cursor-pointer transition-opacity">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">Select Vehicle Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Goods vehicle suitable for furniture and shop moving."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 mt-2"
          >
            {submitting ? 'Registering Vehicle...' : 'Register Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehiclePage;
