import React from 'react';
import { Send } from 'lucide-react';

const BookButton = ({ onClick, label = "Book Now", disabled = false, fullWidth = false, size = "md" }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all rounded-xl shadow-sm ${sizeClasses[size]} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      <Send className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

export default BookButton;
