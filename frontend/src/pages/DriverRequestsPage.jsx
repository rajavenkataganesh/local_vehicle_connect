import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import MapView from '../components/MapView';
import { Bell } from 'lucide-react';

const DriverRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getDriverBookings('PENDING');
      setRequests(data);
    } catch (err) {
      setToast({ message: 'Failed to load booking requests.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await bookingsApi.accept(id);
      setToast({ message: 'Booking request accepted!', type: 'success' });
      fetchRequests();
    } catch (err) {
      setToast({ message: 'Failed to accept booking.', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingsApi.reject(id);
      setToast({ message: 'Booking request rejected.', type: 'info' });
      fetchRequests();
    } catch (err) {
      setToast({ message: 'Failed to reject booking.', type: 'error' });
    }
  };

  const handleViewRoute = (booking) => {
    setSelectedRequest(booking);
    setRouteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 py-8 px-4 sm:px-6 lg:px-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Incoming Booking Requests</h1>
            <p className="text-xs text-slate-500 font-medium">
              Review customer trip details, route, and accept or decline.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={2} type="card" />
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
            <p className="text-2xl">🔔</p>
            <h4 className="text-lg font-bold text-slate-800">No pending booking requests</h4>
            <p className="text-xs text-slate-500">
              When a customer requests a trip with your vehicle, it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <BookingCard
                key={req.id}
                booking={req}
                isDriverView={true}
                onAccept={handleAccept}
                onReject={handleReject}
                onViewRoute={handleViewRoute}
              />
            ))}
          </div>
        )}
      </div>

      {/* Driver Map Route Modal */}
      <Modal isOpen={routeModalOpen} onClose={() => setRouteModalOpen(false)} title="Trip Route Map">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl text-xs font-medium space-y-1">
              <p><strong className="text-emerald-700">📍 Pickup:</strong> {selectedRequest.pickup_address}</p>
              <p><strong className="text-rose-700">🏁 Destination:</strong> {selectedRequest.drop_address}</p>
              <p><strong className="text-slate-900">Distance:</strong> {selectedRequest.distance_km} km</p>
            </div>
            <MapView
              pickup={{ lat: selectedRequest.pickup_latitude, lng: selectedRequest.pickup_longitude }}
              drop={{ lat: selectedRequest.drop_latitude, lng: selectedRequest.drop_longitude }}
              height="320px"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DriverRequestsPage;
