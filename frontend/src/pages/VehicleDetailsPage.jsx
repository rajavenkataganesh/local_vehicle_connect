import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiclesApi, bookingsApi, reviewsApi } from '../services/api';
import mapService from '../services/mapService';
import DriverAvatar from '../components/DriverAvatar';
import AvailabilityBadge from '../components/AvailabilityBadge';
import RatingStars from '../components/RatingStars';
import CallButton from '../components/CallButton';
import BookButton from '../components/BookButton';
import MapView from '../components/MapView';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Navigation, Clock, ShieldCheck, MapPin, Star, ArrowLeft } from 'lucide-react';

const LOAD_TYPES = [
  'Household Items',
  'Furniture',
  'Shop Materials',
  'Construction Materials',
  'Other',
];

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [pickup, setPickup] = useState({ address: 'Vijayawada Central', lat: 16.5062, lng: 80.6480 });
  const [drop, setDrop] = useState({ address: 'Hyderabad City Center', lat: 17.3850, lng: 78.4867 });
  const [routeInfo, setRouteInfo] = useState(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: '10:00 AM',
    passenger_count: 1,
    load_type: 'Household Items',
    additional_details: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.getById(id);
      setVehicle(data);

      const rData = await reviewsApi.getByVehicle(id);
      setReviews(rData);

      // Route calculation
      const rInfo = await mapService.calculateRoute(pickup, drop);
      setRouteInfo(rInfo);
    } catch (err) {
      setToast({ message: 'Failed to load vehicle details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/customer/login');
      return;
    }

    setSubmitting(true);
    try {
      await bookingsApi.create({
        vehicle_id: Number(id),
        pickup_address: pickup.address,
        pickup_latitude: pickup.lat,
        pickup_longitude: pickup.lng,
        drop_address: drop.address,
        drop_latitude: drop.lat,
        drop_longitude: drop.lng,
        distance_km: routeInfo?.distanceKm || 270,
        estimated_duration_minutes: routeInfo?.durationMinutes || 240,
        booking_date: bookingFormData.booking_date,
        booking_time: bookingFormData.booking_time,
        passenger_count: Number(bookingFormData.passenger_count),
        load_type: ['tata_ace', 'van', 'mini_truck', 'pickup_truck', 'goods_auto'].includes(vehicle.vehicle_type)
          ? bookingFormData.load_type
          : null,
        additional_details: bookingFormData.additional_details,
      });

      setBookingModalOpen(false);
      setToast({ message: 'Booking request sent successfully to driver!', type: 'success' });
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 1200);
    } catch (err) {
      setToast({ message: err.response?.data?.detail || 'Failed to send request.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  const defaultPhoto = 'https://images.unsplash.com/photo-1586193804147-380d3df858ff?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Vehicle & Driver Details</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vehicle & Driver Header */}
        <div className="lg:col-span-7 space-y-6">
          {/* Large Vehicle Photo Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="relative h-72 sm:h-96 bg-slate-900">
              <img
                src={vehicle.vehicle_photo || defaultPhoto}
                alt={vehicle.vehicle_model}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <AvailabilityBadge isAvailable={vehicle.availability_status} />
              </div>
            </div>

            {/* Driver Banner */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <DriverAvatar
                    photo={vehicle.owner.profile_photo}
                    name={vehicle.owner.name}
                    isVerified={vehicle.owner.is_verified}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">{vehicle.owner.name}</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Driver
                      </span>
                    </div>
                    <RatingStars rating={vehicle.average_rating} count={vehicle.total_reviews} size="md" />
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase">Registration</p>
                  <span className="font-mono font-bold text-sm bg-amber-100 text-amber-900 px-3 py-1 rounded-xl">
                    {vehicle.vehicle_number}
                  </span>
                </div>
              </div>

              {/* Vehicle Spec Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-bold uppercase">Category</span>
                  <p className="text-sm font-bold text-slate-800 capitalize">{vehicle.vehicle_type.replace('_', ' ')}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-bold uppercase">Model</span>
                  <p className="text-sm font-bold text-slate-800">{vehicle.vehicle_model}</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 font-bold uppercase">Vehicle No.</span>
                  <p className="text-sm font-mono font-bold text-emerald-700">{vehicle.vehicle_number}</p>
                </div>
              </div>

              {vehicle.description && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Owner Description</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CallButton phone={vehicle.owner.phone} label="📞 Call Driver" fullWidth size="lg" />
                <BookButton
                  onClick={() => setBookingModalOpen(true)}
                  disabled={!vehicle.availability_status}
                  label="📩 Request Booking"
                  fullWidth
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>Customer Reviews ({reviews.length})</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet for this vehicle.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-800">{rev.customer_name}</span>
                      <RatingStars rating={rev.rating} size="sm" />
                    </div>
                    {rev.review && <p className="text-xs text-slate-600 italic">"{rev.review}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Trip Map & Calculation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900">Trip Map & Route Preview</h3>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="font-bold text-emerald-700">📍 Pickup:</span> {pickup.address}
              </div>
              <div>
                <span className="font-bold text-rose-700">🏁 Drop:</span> {drop.address}
              </div>
            </div>

            {routeInfo && (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-emerald-800 font-bold block">Distance</span>
                  <strong className="text-lg font-black text-emerald-900">{routeInfo.distanceKm} km</strong>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-emerald-800 font-bold block">Est. Time</span>
                  <strong className="text-lg font-black text-emerald-900">{routeInfo.durationText}</strong>
                </div>
              </div>
            )}

            <MapView pickup={pickup} drop={drop} height="300px" />
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <Modal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} title="Request Booking">
        <form onSubmit={handleSendBooking} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-2xl text-xs font-semibold">
            <p className="text-slate-500">Vehicle</p>
            <p className="text-slate-900 font-bold text-sm">{vehicle.vehicle_model} ({vehicle.vehicle_number})</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Date *</label>
              <input
                type="date"
                required
                value={bookingFormData.booking_date}
                onChange={(e) => setBookingFormData({ ...bookingFormData, booking_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Time *</label>
              <input
                type="text"
                required
                value={bookingFormData.booking_time}
                onChange={(e) => setBookingFormData({ ...bookingFormData, booking_time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {['tata_ace', 'van', 'mini_truck', 'pickup_truck', 'goods_auto'].includes(vehicle.vehicle_type) ? (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Load Type *</label>
              <select
                value={bookingFormData.load_type}
                onChange={(e) => setBookingFormData({ ...bookingFormData, load_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {LOAD_TYPES.map((lt) => (
                  <option key={lt} value={lt}>{lt}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Passengers *</label>
              <input
                type="number"
                min={1}
                value={bookingFormData.passenger_count}
                onChange={(e) => setBookingFormData({ ...bookingFormData, passenger_count: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Additional Details</label>
            <textarea
              rows={2}
              value={bookingFormData.additional_details}
              onChange={(e) => setBookingFormData({ ...bookingFormData, additional_details: e.target.value })}
              placeholder="e.g. Ground floor loading"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 mt-2"
          >
            {submitting ? 'Sending Request...' : 'Send Booking Request'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default VehicleDetailsPage;
