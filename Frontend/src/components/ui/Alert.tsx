import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { AlertProps } from '../../types';

const Alert: React.FC<AlertProps> = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500 text-emerald-300';
      case 'error':
        return 'bg-rose-950/90 border-rose-500 text-rose-300';
      case 'warning':
        return 'bg-amber-950/90 border-amber-500 text-amber-300';
      case 'info':
        return 'bg-indigo-950/90 border-indigo-500 text-indigo-300';
      default:
        return 'bg-fuchsia-950/90 border-fuchsia-500 text-fuchsia-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-300" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-300" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-300" />;
      case 'info':
        return <Info className="w-5 h-5 text-indigo-300" />;
      default:
        return <Info className="w-5 h-5 text-fuchsia-300" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 border-l-4 p-4 rounded-lg shadow-lg backdrop-blur-md transition-all duration-300 transform translate-x-0 ${getAlertStyles()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
