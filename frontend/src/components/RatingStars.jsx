import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5.0, count, interactive = false, onRatingChange, size = "sm" }) => {
  const stars = [1, 2, 3, 4, 5];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`${iconSizes[size]} ${
                star <= rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm font-bold text-slate-700 ml-1">
        {Number(rating).toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-500">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
