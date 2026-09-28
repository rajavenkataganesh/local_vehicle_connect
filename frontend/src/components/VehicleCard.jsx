import React from 'react';
import { Link } from 'react-router-dom';
import DriverAvatar from './DriverAvatar';
import AvailabilityBadge from './AvailabilityBadge';
import RatingStars from './RatingStars';
import CallButton from './CallButton';
import BookButton from './BookButton';
import { MapPin, Navigation } from 'lucide-react';

const TYPE_EMOJIS = {
  car: '🚗',
  auto: '🛺',
  tata_ace: '🚚',
  van: '🚐',
  mini_truck: '🚛',
  pickup_truck: '🛻',
  goods_auto: '🚐',
};

const TYPE_NAMES = {
  car: 'Car',
  auto: 'Auto',
  tata_ace: 'Tata Ace',
  van: 'Van',
  mini_truck: 'Mini Truck',
  pickup_truck: 'Pickup Truck',
  goods_auto: 'Goods Auto',
};

const VehicleCard = ({ vehicle, onBookClick }) => {
  const {
    id,
    vehicle_type,
    vehicle_model,
    vehicle_number,
    vehicle_photo,
    availability_status,
    owner,
    average_rating,
    total_reviews,
    distance_km,
  } = vehicle;

  const emoji = TYPE_EMOJIS[vehicle_type] || '🚗';
  const typeName = TYPE_NAMES[vehicle_type] || vehicle_type;

  const defaultPhoto = 'https://images.unsplash.com/photo-1586193804147-380d3df858ff?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Vehicle Image Container */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={vehicle_photo || defaultPhoto}
          alt={vehicle_model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultPhoto;
          }}
        />
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <AvailabilityBadge isAvailable={availability_status} />
        </div>
        {/* Vehicle Category Badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
          <span>{emoji}</span>
          <span>{typeName}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Driver Info Header */}
          <div className="flex items-center gap-3 mb-3">
            <DriverAvatar
              photo={owner.profile_photo}
              name={owner.name}
              isVerified={owner.is_verified}
              size="md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-base">{owner.name}</h4>
                {owner.is_verified && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                )}
              </div>
              <RatingStars rating={average_rating} count={total_reviews} size="sm" />
            </div>
          </div>

          {/* Vehicle Model & Number */}
          <div className="bg-slate-50 rounded-2xl p-3 mb-4 border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Model</p>
                <h5 className="font-bold text-slate-800 text-sm mt-0.5">{vehicle_model}</h5>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Vehicle No.</p>
                <span className="inline-block bg-amber-100 text-amber-900 font-mono font-bold text-xs px-2 py-0.5 rounded-lg mt-0.5 border border-amber-200">
                  {vehicle_number}
                </span>
              </div>
            </div>

            {distance_km !== null && distance_km !== undefined && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mt-2 pt-2 border-t border-slate-200/60">
                <Navigation className="w-3.5 h-3.5 fill-current" />
                <span>{distance_km} km away from your location</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <CallButton phone={owner.phone} fullWidth size="md" />
          {onBookClick ? (
            <BookButton onClick={() => onBookClick(vehicle)} fullWidth size="md" label="Book" />
          ) : (
            <Link
              to={`/vehicle/${id}`}
              className="inline-flex items-center justify-center font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl px-4 py-2.5 text-sm transition-all text-center"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
