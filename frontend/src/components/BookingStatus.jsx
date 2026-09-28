import React from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, CheckCheck } from 'lucide-react';

const BookingStatus = ({ status }) => {
  const normalized = (status || 'PENDING').toUpperCase();

  const configs = {
    PENDING: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />,
      label: 'Pending Confirmation',
    },
    ACCEPTED: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'Accepted by Driver',
    },
    REJECTED: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Request Rejected',
    },
    COMPLETED: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <CheckCheck className="w-3.5 h-3.5 text-blue-600" />,
      label: 'Trip Completed',
    },
    CANCELLED: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />,
      label: 'Cancelled',
    },
  };

  const config = configs[normalized] || configs.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${config.bg}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default BookingStatus;
