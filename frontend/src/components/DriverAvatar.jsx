import React from 'react';

const DriverAvatar = ({ photo, name, isVerified = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-3xl',
  };

  const getInitial = (n) => (n ? n.charAt(0).toUpperCase() : 'D');

  return (
    <div className="relative inline-block flex-shrink-0">
      {photo ? (
        <img
          src={photo}
          alt={name || 'Driver'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center border-2 border-white shadow-md`}
        >
          {getInitial(name)}
        </div>
      )}
      {isVerified && (
        <span
          className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm"
          title="Verified Driver"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default DriverAvatar;
