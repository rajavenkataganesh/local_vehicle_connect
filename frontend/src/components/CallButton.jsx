import React from 'react';
import { Phone } from 'lucide-react';

const CallButton = ({ phone, label = "Call", fullWidth = false, size = "md" }) => {
  if (!phone) return null;
  const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <a
      href={`tel:${formattedPhone}`}
      className={`inline-flex items-center justify-center font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all rounded-xl shadow-sm ${sizeClasses[size]} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      <Phone className="w-4 h-4 fill-current" />
      <span>{label}</span>
    </a>
  );
};

export default CallButton;
