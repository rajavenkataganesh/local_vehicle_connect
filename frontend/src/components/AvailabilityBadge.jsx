import React from 'react';

const AvailabilityBadge = ({ isAvailable, showLabel = true, size = 'md' }) => {
  if (isAvailable) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot"></span>
        {showLabel && "🟢 Available"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
      {showLabel && "🔴 Not Available"}
    </span>
  );
};

export default AvailabilityBadge;
