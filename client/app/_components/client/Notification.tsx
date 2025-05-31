"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Notification = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000,
  position = 'bottom-right'
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          hover: 'hover:bg-green-200'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          hover: 'hover:bg-red-200'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          hover: 'hover:bg-yellow-200'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          hover: 'hover:bg-blue-200'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`fixed ${getPositionClasses()} p-4 rounded-lg shadow-lg flex items-center gap-3 border ${styles.container} z-50`}
      role="alert"
    >
      <div className={styles.icon}>
        {getIcon()}
      </div>
      <p className={`text-sm ${styles.text}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`p-1 rounded-full hover:bg-opacity-20 ${styles.hover}`}
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export default Notification; 