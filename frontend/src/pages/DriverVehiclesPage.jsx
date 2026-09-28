import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehiclesApi } from '../services/api';
import AvailabilityBadge from '../components/AvailabilityBadge';
import Toast from '../components/Toast';
import { Truck, Plus, Trash2, Edit } from 'lucide-react';

const DriverVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.getMyVehicles();
      setVehicles(data);
    } catch (err) {
      setToast({ message: 'Failed to load vehicles list.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id, status) => {
    try {
      const updated = await vehiclesApi.updateAvailability(id, !status);
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, availability_status: updated.availability_status } : v))
      );
      setToast({ message: 'Vehicle availability updated.', type: 'info' });
    } catch (err) {
      setToast({ message: 'Failed to update availability.', type: 'error' });
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await vehiclesApi.delete(id);
      setToast({ message: 'Vehicle removed.', type: 'success' });
      fetchVehicles();
    } catch (err) {
      setToast({ message: 'Failed to delete vehicle.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 py-8 px-4 sm:px-6 lg:px-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Vehicles</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage multiple registered vehicles under your driver account.
            </p>
          </div>

          <Link
            to="/driver/add-vehicle"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Vehicle</span>
          </Link>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={v.vehicle_photo}
                    alt={v.vehicle_model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button onClick={() => handleToggleAvailability(v.id, v.availability_status)}>
                      <AvailabilityBadge isAvailable={v.availability_status} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    {v.vehicle_type.replace('_', ' ')}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{v.vehicle_model}</h3>
                  <span className="inline-block bg-amber-100 text-amber-900 font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                    {v.vehicle_number}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">
                  Status: {v.availability_status ? '🟢 Active Search' : '🔴 Hidden'}
                </span>
                <button
                  onClick={() => handleDeleteVehicle(v.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverVehiclesPage;
