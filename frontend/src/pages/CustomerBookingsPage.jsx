import React, { useState, useEffect } from 'react';
import { bookingsApi, reviewsApi } from '../services/api';
import BookingCard from '../components/BookingCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import MapView from '../components/MapView';
import { Calendar, Star } from 'lucide-react';

const TABS = ['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'];

const CustomerBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Rating Modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Route View Modal
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRouteBooking, setSelectedRouteBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getCustomerBookings(activeTab);
      setBookings(data);
    } catch (err) {
      setToast({ message: 'Failed to load bookings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await bookingsApi.cancel(id);
      setToast({ message: 'Booking cancelled successfully.', type: 'info' });
      fetchBookings();
    } catch (err) {
      setToast({ message: 'Failed to cancel booking.', type: 'error' });
    }
  };

  const handleOpenRateModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRatingValue(5);
    setReviewText('');
    setRatingModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;

    setReviewSubmitting(true);
    try {
      await reviewsApi.create({
        booking_id: selectedBookingForReview.id,
        vehicle_id: selectedBookingForReview.vehicle_id,
        rating: ratingValue,
        review: reviewText,
      });

      setRatingModalOpen(false);
      setToast({ message: 'Thank you for your rating!', type: 'success' });
      fetchBookings();
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || 'Failed to submit review.',
        type: 'error',
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleViewRoute = (booking) => {
    setSelectedRouteBooking(booking);
    setRouteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Bookings</h1>
              <p className="text-xs text-slate-500 font-medium">
                Track your active vehicle requests and booking history
              </p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'All Bookings' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          <LoadingSkeleton count={3} type="list" />
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-3xl">
              📅
            </div>
            <h4 className="text-lg font-bold text-slate-800">You don't have any bookings yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find available vehicles near you and request a trip.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                isDriverView={false}
                onCancel={handleCancelBooking}
                onRate={handleOpenRateModal}
                onViewRoute={handleViewRoute}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rate Driver Modal */}
      <Modal isOpen={ratingModalOpen} onClose={() => setRatingModalOpen(false)} title="Rate Your Driver">
        {selectedBookingForReview && (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-center">
            <p className="text-sm font-bold text-slate-800">How was your experience?</p>

            <div className="flex justify-center py-2">
              <RatingStars
                rating={ratingValue}
                interactive={true}
                onRatingChange={(r) => setRatingValue(r)}
                size="lg"
              />
            </div>

            <div>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write a quick review about the trip or driver..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50"
            >
              {reviewSubmitting ? 'Submitting Review...' : 'Submit Review'}
            </button>
          </form>
        )}
      </Modal>

      {/* Route View Modal */}
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

export default CustomerBookingsPage;
