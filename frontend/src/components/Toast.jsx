import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-800 text-white border-emerald-700',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-300" />,
    },
    error: {
      bg: 'bg-rose-800 text-white border-rose-700',
      icon: <AlertCircle className="w-5 h-5 text-rose-300" />,
    },
    info: {
      bg: 'bg-slate-900 text-white border-slate-700',
      icon: <Info className="w-5 h-5 text-blue-300" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full transition-all animate-bounce-short">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border shadow-xl ${config.bg}`}
      >
        {config.icon}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg text-white/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
