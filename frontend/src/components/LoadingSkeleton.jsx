import React from 'react';

const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm animate-pulse">
            <div className="h-44 bg-slate-200 rounded-2xl mb-4"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-16 bg-slate-100 rounded-xl mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {items.map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 h-24"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
