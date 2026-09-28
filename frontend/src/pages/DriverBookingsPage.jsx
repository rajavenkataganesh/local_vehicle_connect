import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import MapView from '../components/MapView';
import { Calendar } from 'lucide-react';

const TABS = ['ALL', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CANCELLED'];

const DriverBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRouteBooking, setSelectedRouteBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getDriverBookings(activeTab);
      setBookings(data);
    } catch (err) {
      setToast({ message: 'Failed to load bookings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async (id) => {
    try {
      await bookingsApi.complete(id);
      setToast({ message: 'Trip marked as COMPLETED!', type: 'success' });
      fetchBookings();
    } catch (err) {
      setToast({ message: 'Failed to complete trip.', type: 'error' });
    }
  };

  const handleViewRoute = (booking) => {
    setSelectedRouteBooking(booking);
    setRouteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 py-8 px-4 sm:px-6 lg:px-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Driver Trips & History</h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage your accepted bookings and complete active trips.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Trips' : tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} type="list" />
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
            <p className="text-2xl">🚛</p>
            <h4 className="text-lg font-bold text-slate-800">No trips in this tab</h4>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isDriverView={true}
                onComplete={handleCompleteTrip}
                onViewRoute={handleViewRoute}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={routeModalOpen} onClose={() => setRouteModalOpen(false)} title="Trip Route Map">
        {selectedRouteBooking && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl text-xs font-medium space-y-1">
              <p><strong className="text-emerald-700">📍 Pickup:</strong> {selectedRouteBooking.pickup_address}</p>
              <p><strong className="text-rose-700">🏁 Drop:</strong> {selectedRouteBooking.drop_address}</p>
              <p><strong className="text-slate-900">Distance:</strong> {selectedRouteBooking.distance_km} km</p>
            </div>
            <MapView
              pickup={{ lat: selectedRouteBooking.pickup_latitude, lng: selectedRouteBooking.pickup_longitude }}
              drop={{ lat: selectedRouteBooking.drop_latitude, lng: selectedRouteBooking.drop_longitude }}
              height="320px"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DriverBookingsPage;
