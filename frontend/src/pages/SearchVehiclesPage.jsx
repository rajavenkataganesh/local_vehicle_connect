import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { vehiclesApi, bookingsApi } from '../services/api';
import mapService from '../services/mapService';
import MapView from '../components/MapView';
import VehicleCard from '../components/VehicleCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Navigation, Calendar, Clock, Package, Users, Compass, ArrowRight } from 'lucide-react';

const VEHICLE_TYPES = [
  { value: 'all', label: 'All Vehicles', emoji: '🚘' },
  { value: 'car', label: 'Car', emoji: '🚗' },
  { value: 'auto', label: 'Auto', emoji: '🛺' },
  { value: 'tata_ace', label: 'Tata Ace', emoji: '🚚' },
  { value: 'van', label: 'Van', emoji: '🚐' },
  { value: 'mini_truck', label: 'Mini Truck', emoji: '🚛' },
  { value: 'pickup_truck', label: 'Pickup Truck', emoji: '🛻' },
  { value: 'goods_auto', label: 'Goods Auto', emoji: '🚐' },
];

const LOAD_TYPES = [
  'Household Items',
  'Furniture',
  'Shop Materials',
  'Construction Materials',
  'Electronic Appliances',
  'Agricultural Goods',
  'Other',
];

const SearchVehiclesPage = () => {
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';

  const [selectedType, setSelectedType] = useState(initialType);
  const [pickup, setPickup] = useState({ address: '', lat: 16.5062, lng: 80.6480 });
  const [drop, setDrop] = useState({ address: '', lat: 16.5200, lng: 80.6200 });

  const [pickupInput, setPickupInput] = useState('');
  const [dropInput, setDropInput] = useState('');

  const [routeInfo, setRouteInfo] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Booking Modal State
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: '10:00 AM',
    passenger_count: 1,
    load_type: 'Household Items',
    additional_details: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    // Attempt auto-location on load
    mapService.getCurrentLocation().then((loc) => {
      setPickup((prev) => ({ ...prev, lat: loc.lat, lng: loc.lng }));
    });
  }, []);

  // Fetch available vehicles
  useEffect(() => {
    fetchVehicles();
  }, [selectedType, pickup.lat, pickup.lng]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.search({
        type: selectedType,
        lat: pickup.lat,
        lng: pickup.lng,
        available_only: true,
      });
      setVehicles(data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Recalculate route when pickup or drop changes
  useEffect(() => {
    if (pickup.lat && drop.lat && pickup.address && drop.address) {
      mapService.calculateRoute(pickup, drop).then((res) => {
        setRouteInfo(res);
      });
    }
  }, [pickup, drop]);

  const handleUseCurrentLocation = async () => {
    try {
      const loc = await mapService.getCurrentLocation();
      setPickup({
        address: 'Current Location (GPS)',
        lat: loc.lat,
        lng: loc.lng,
      });
      setPickupInput('Current Location (GPS)');
      setToast({ message: 'Location set to your current GPS position.', type: 'info' });
    } catch (err) {
      setToast({ message: 'Unable to acquire GPS location permission.', type: 'error' });
    }
  };

  const handleSetPickupFromSearch = () => {
    if (!pickupInput.trim()) return;
    setPickup({
      address: pickupInput,
      lat: 16.5062 + (Math.random() - 0.5) * 0.05,
      lng: 80.6480 + (Math.random() - 0.5) * 0.05,
    });
  };

  const handleSetDropFromSearch = () => {
    if (!dropInput.trim()) return;
    setDrop({
      address: dropInput,
      lat: 16.5200 + (Math.random() - 0.5) * 0.05,
      lng: 80.6200 + (Math.random() - 0.5) * 0.05,
    });
  };

  const handleOpenBooking = (vehicle) => {
    if (!user) {
      navigate('/customer/login');
      return;
    }
    if (!pickup.address || !drop.address) {
      setToast({ message: 'Please select both Pickup and Drop location before booking.', type: 'error' });
      return;
    }
    setSelectedVehicleForBooking(vehicle);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedVehicleForBooking) return;

    setBookingSubmitting(true);
    try {
      const payload = {
        vehicle_id: selectedVehicleForBooking.id,
        pickup_address: pickup.address || 'Pickup Point',
        pickup_latitude: pickup.lat,
        pickup_longitude: pickup.lng,
        drop_address: drop.address || 'Destination Point',
        drop_latitude: drop.lat,
        drop_longitude: drop.lng,
        distance_km: routeInfo?.distanceKm || 10.0,
        estimated_duration_minutes: routeInfo?.durationMinutes || 25,
        booking_date: bookingFormData.booking_date,
        booking_time: bookingFormData.booking_time,
        passenger_count: Number(bookingFormData.passenger_count),
        load_type: ['tata_ace', 'van', 'mini_truck', 'pickup_truck', 'goods_auto'].includes(selectedVehicleForBooking.vehicle_type)
          ? bookingFormData.load_type
          : null,
        additional_details: bookingFormData.additional_details,
      };

      await bookingsApi.create(payload);
      setBookingModalOpen(false);
      setToast({ message: 'Booking request sent successfully to driver!', type: 'success' });
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 1200);
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || 'Failed to send booking request.',
        type: 'error',
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Top Search Controls Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm pt-6 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Find Available Vehicles</h1>
              <p className="text-xs text-slate-500 font-medium">
                Set pickup & drop locations to calculate route and view matching verified drivers.
              </p>
            </div>

            {/* Vehicle Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
              {VEHICLE_TYPES.map((vt) => (
                <button
                  key={vt.value}
                  onClick={() => setSelectedType(vt.value)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedType === vt.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{vt.emoji}</span>
                  <span>{vt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pickup and Drop Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Pickup Input Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <span>📍</span> Pickup Location
                </label>
                <button
                  onClick={handleUseCurrentLocation}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Use My Location</span>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pickupInput}
                  onChange={(e) => setPickupInput(e.target.value)}
                  placeholder="Enter pickup place (e.g. Mangalagiri, Vijayawada)"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSetPickupFromSearch}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Set
                </button>
              </div>
              {pickup.address && (
                <p className="text-xs font-bold text-slate-700 truncate">
                  Selected: <span className="text-emerald-700">{pickup.address}</span>
                </p>
              )}
            </div>

            {/* Drop Input Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <span>🏁</span> Drop Destination
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dropInput}
                  onChange={(e) => setDropInput(e.target.value)}
                  placeholder="Enter drop destination (e.g. Gachibowli, Hyderabad)"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={handleSetDropFromSearch}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Set
                </button>
              </div>
              {drop.address && (
                <p className="text-xs font-bold text-slate-700 truncate">
                  Selected: <span className="text-rose-700">{drop.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Route Summary Banner */}
          {routeInfo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-emerald-950 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span>Distance: {routeInfo.distanceKm} km</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Est. Duration: {routeInfo.durationText}</span>
                </div>
              </div>
              <span className="text-xs font-normal text-emerald-800">
                Direct owner call & price negotiation available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Map + Available Vehicles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Container */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Interactive Map View</span>
              <span className="text-xs text-emerald-600 font-semibold">{vehicles.length} Vehicles Nearby</span>
            </h3>

            <MapView
              pickup={pickup.address ? pickup : null}
              drop={drop.address ? drop : null}
              vehicles={vehicles}
              height="380px"
            />
          </div>
        </div>

        {/* Vehicles Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              Available Vehicles ({vehicles.length})
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Showing active drivers in India
            </span>
          </div>

          {loading ? (
            <LoadingSkeleton count={3} type="card" />
          ) : vehicles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                🚚
              </div>
              <h4 className="text-lg font-bold text-slate-800">No available vehicles found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting a different vehicle category or clearing your search filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  onBookClick={() => handleOpenBooking(v)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Request Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Send Booking Request"
      >
        {selectedVehicleForBooking && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-semibold space-y-1">
              <p className="text-slate-500">Driver & Vehicle</p>
              <p className="text-slate-900 font-bold text-sm">
                {selectedVehicleForBooking.owner.name} — {selectedVehicleForBooking.vehicle_model}
              </p>
              <p className="text-emerald-700">Phone: {selectedVehicleForBooking.owner.phone}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="text-slate-400 font-bold uppercase">Pickup</p>
              <p className="font-bold text-slate-800">{pickup.address}</p>
              <p className="text-slate-400 font-bold uppercase pt-1">Destination</p>
              <p className="font-bold text-slate-800">{drop.address}</p>
              {routeInfo && (
                <p className="text-emerald-700 font-bold pt-1">
                  Est. Distance: {routeInfo.distanceKm} km ({routeInfo.durationText})
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Booking Date *
                </label>
                <input
                  type="date"
                  required
                  value={bookingFormData.booking_date}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, booking_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Booking Time *
                </label>
                <input
                  type="text"
                  required
                  value={bookingFormData.booking_time}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, booking_time: e.target.value })}
                  placeholder="e.g. 10:30 AM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            {['tata_ace', 'van', 'mini_truck', 'pickup_truck', 'goods_auto'].includes(
              selectedVehicleForBooking.vehicle_type
            ) ? (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Load Type *
                </label>
                <select
                  value={bookingFormData.load_type}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, load_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  {LOAD_TYPES.map((lt) => (
                    <option key={lt} value={lt}>
                      {lt}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Number of Passengers *
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={bookingFormData.passenger_count}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, passenger_count: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Additional Notes for Driver
              </label>
              <textarea
                rows={2}
                value={bookingFormData.additional_details}
                onChange={(e) => setBookingFormData({ ...bookingFormData, additional_details: e.target.value })}
                placeholder="e.g. Need help with ground floor loading"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={bookingSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 mt-2"
            >
              {bookingSubmitting ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default SearchVehiclesPage;
