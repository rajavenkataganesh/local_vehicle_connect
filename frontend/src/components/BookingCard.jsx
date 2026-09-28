import React from 'react';
import BookingStatus from './BookingStatus';
import CallButton from './CallButton';
import DriverAvatar from './DriverAvatar';
import RatingStars from './RatingStars';
import { MapPin, Calendar, Clock, Navigation, Package, Users, Star, Eye } from 'lucide-react';

const BookingCard = ({
  booking,
  isDriverView = false,
  onAccept,
  onReject,
  onCancel,
  onComplete,
  onRate,
  onViewRoute,
}) => {
  const {
    id,
    pickup_address,
    drop_address,
    distance_km,
    estimated_duration_minutes,
    booking_date,
    booking_time,
    passenger_count,
    load_type,
    additional_details,
    status,
    vehicle,
    customer,
    review,
  } = booking;

  const defaultPhoto = 'https://images.unsplash.com/photo-1586193804147-380d3df858ff?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-6 transition-all hover:shadow-lg">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {isDriverView ? (
            <DriverAvatar
              photo={customer?.profile_photo}
              name={customer?.name || 'Customer'}
              isVerified={customer?.is_verified}
              size="md"
            />
          ) : (
            <DriverAvatar
              photo={vehicle?.owner?.profile_photo}
              name={vehicle?.owner?.name || 'Driver'}
              isVerified={vehicle?.owner?.is_verified}
              size="md"
            />
          )}

          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {isDriverView ? customer?.name || 'Customer' : vehicle?.owner?.name || 'Driver'}
            </h4>
            <p className="text-xs font-semibold text-slate-500">
              {isDriverView ? `Customer Phone: ${customer?.phone}` : `${vehicle?.vehicle_model} (${vehicle?.vehicle_number})`}
            </p>
          </div>
        </div>

        <div>
          <BookingStatus status={status} />
        </div>
      </div>

      {/* Vehicle Summary if Customer View */}
      {!isDriverView && (
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100">
          <img
            src={vehicle?.vehicle_photo || defaultPhoto}
            alt={vehicle?.vehicle_model}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Requested Vehicle</p>
            <h5 className="text-sm font-bold text-slate-800">{vehicle?.vehicle_model}</h5>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              {vehicle?.vehicle_number}
            </span>
          </div>
        </div>
      )}

      {/* Pickup and Destination Route */}
      <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
            📍
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pickup Location</p>
            <p className="text-sm font-bold text-slate-800 leading-snug">{pickup_address}</p>
          </div>
        </div>

        <div className="border-l-2 border-dashed border-slate-300 ml-3 h-3"></div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
            🏁
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Drop Destination</p>
            <p className="text-sm font-bold text-slate-800 leading-snug">{drop_address}</p>
          </div>
        </div>
      </div>

      {/* Trip Meta Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs font-medium text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{booking_date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>{booking_time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-emerald-700">{distance_km} km</span>
        </div>
        {load_type ? (
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-amber-600" />
            <span className="truncate">{load_type}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span>{passenger_count} Passenger(s)</span>
          </div>
        )}
      </div>

      {additional_details && (
        <p className="text-xs italic text-slate-500 mb-4 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
          "{additional_details}"
        </p>
      )}

      {/* Review display if completed and reviewed */}
      {review && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4">
          <p className="text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
            <span>Customer Rating:</span>
            <RatingStars rating={review.rating} size="sm" />
          </p>
          {review.review && <p className="text-xs text-amber-800 italic">"{review.review}"</p>}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          {/* Call button */}
          {isDriverView ? (
            <CallButton phone={customer?.phone} label="Call Customer" size="sm" />
          ) : (
            <CallButton phone={vehicle?.owner?.phone} label="Call Driver" size="sm" />
          )}

          {onViewRoute && (
            <button
              onClick={() => onViewRoute(booking)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Route</span>
            </button>
          )}
        </div>

        {/* Dynamic Status Action Buttons */}
        <div className="flex items-center gap-2">
          {isDriverView && status === 'PENDING' && (
            <>
              <button
                onClick={() => onReject(id)}
                className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => onAccept(id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
              >
                Accept
              </button>
            </>
          )}

          {isDriverView && status === 'ACCEPTED' && (
            <button
              onClick={() => onComplete(id)}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              Complete Trip
            </button>
          )}

          {!isDriverView && status === 'COMPLETED' && !review && onRate && (
            <button
              onClick={() => onRate(booking)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-all"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Rate Driver</span>
            </button>
          )}

          {status === 'PENDING' && onCancel && (
            <button
              onClick={() => onCancel(id)}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
