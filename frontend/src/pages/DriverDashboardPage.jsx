import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesApi, bookingsApi } from '../services/api';
import mapService from '../services/mapService';
import AvailabilityBadge from '../components/AvailabilityBadge';
import BookingCard from '../components/BookingCard';
import Toast from '../components/Toast';
import { Truck, Calendar, Clock, Star, MapPin, Plus, Radio, CheckCircle, Navigation } from 'lucide-react';

const DriverDashboardPage = () => {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [locationSharing, setLocationSharing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const vData = await vehiclesApi.getMyVehicles();
      setVehicles(vData);

      const rData = await bookingsApi.getDriverBookings('PENDING');
      setRequests(rData);

      const bData = await bookingsApi.getDriverBookings('ALL');
      setBookings(bData);

      if (vData.length > 0) {
        setLocationSharing(vData[0].location_sharing_enabled || false);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVehicleAvailability = async (vehicleId, currentStatus) => {
    try {
      const updated = await vehiclesApi.updateAvailability(vehicleId, !currentStatus);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...v, availability_status: updated.availability_status } : v))
      );
      setToast({
        message: `Vehicle status changed to ${!currentStatus ? 'Available 🟢' : 'Not Available 🔴'}`,
        type: 'info',
      });
    } catch (err) {
      setToast({ message: 'Failed to update availability status.', type: 'error' });
    }
  };

  const handleToggleLocationSharing = async () => {
    const nextState = !locationSharing;
    setLocationSharing(nextState);

    if (nextState) {
      try {
        const loc = await mapService.getCurrentLocation();
        for (const v of vehicles) {
          await vehiclesApi.updateLocation(v.id, {
            current_latitude: loc.lat,
            current_longitude: loc.lng,
            location_sharing_enabled: true,
          });
        }
        setToast({ message: '📍 Live location sharing turned ON!', type: 'success' });
      } catch (err) {
        setToast({ message: 'Unable to access GPS location permission.', type: 'error' });
      }
    } else {
      for (const v of vehicles) {
        await vehiclesApi.updateLocation(v.id, {
          current_latitude: v.current_latitude || 16.5062,
          current_longitude: v.current_longitude || 80.6480,
          location_sharing_enabled: false,
        });
      }
      setToast({ message: 'Location sharing turned OFF', type: 'info' });
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await bookingsApi.accept(id);
      setToast({ message: 'Booking accepted!', type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setToast({ message: 'Failed to accept request.', type: 'error' });
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await bookingsApi.reject(id);
      setToast({ message: 'Booking rejected.', type: 'info' });
      fetchDashboardData();
    } catch (err) {
      setToast({ message: 'Failed to reject request.', type: 'error' });
    }
  };

  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const avgRating = vehicles.length > 0 ? vehicles[0].average_rating : 5.0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Greeting Header */}
      <div className="bg-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-emerald-400 font-extrabold uppercase text-xs tracking-wider">
              Driver Dashboard
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">
              Good Morning, {user?.name} 👋
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Manage your vehicles and booking requests across India.
            </p>
          </div>

          {/* Location Sharing Toggle Pill */}
          <button
            onClick={handleToggleLocationSharing}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-xs shadow-lg transition-all ${
              locationSharing
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Radio className={`w-4 h-4 ${locationSharing ? 'animate-pulse' : ''}`} />
            <span>Location Sharing {locationSharing ? 'ON 🟢' : 'OFF 🔴'}</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Bookings</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-slate-900">{bookings.length}</strong>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Requests</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-amber-600">{requests.length}</strong>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-400 uppercase">Trips Completed</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-emerald-600">{completedCount}</strong>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
            <span className="text-xs font-bold text-slate-400 uppercase">Overall Rating</span>
            <div className="flex items-center justify-between mt-2">
              <strong className="text-2xl font-black text-slate-900">⭐ {avgRating}</strong>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Registered Vehicles Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">My Registered Vehicles</h3>
            <Link
              to="/driver/add-vehicle"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={v.vehicle_photo}
                    alt={v.vehicle_model}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{v.vehicle_model}</h4>
                    <span className="inline-block bg-amber-100 text-amber-900 font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg mt-1">
                      {v.vehicle_number}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500">Availability Switch:</span>
                  <button
                    onClick={() => handleToggleVehicleAvailability(v.id, v.availability_status)}
                    className="cursor-pointer"
                  >
                    <AvailabilityBadge isAvailable={v.availability_status} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming Booking Requests */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-black text-slate-900">Recent Booking Requests ({requests.length})</h3>

          {requests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 text-xs font-semibold">
              No new pending booking requests right now.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <BookingCard
                  key={req.id}
                  booking={req}
                  isDriverView={true}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboardPage;
