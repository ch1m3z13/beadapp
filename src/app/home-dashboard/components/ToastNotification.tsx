'use client';

import React, { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const ToastNotification = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000
}: ToastNotificationProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: 'CheckCircleIcon',
          bgColor: 'bg-success',
          textColor: 'text-success-foreground',
          borderColor: 'border-success'
        };
      case 'error':
        return {
          icon: 'ExclamationTriangleIcon',
          bgColor: 'bg-error',
          textColor: 'text-error-foreground',
          borderColor: 'border-error'
        };
      case 'warning':
        return {
          icon: 'ExclamationTriangleIcon',
          bgColor: 'bg-warning',
          textColor: 'text-warning-foreground',
          borderColor: 'border-warning'
        };
      case 'info':
      default:
        return {
          icon: 'InformationCircleIcon',
          bgColor: 'bg-primary',
          textColor: 'text-primary-foreground',
          borderColor: 'border-primary'
        };
    }
  };

  if (!isVisible) return null;

  const config = getToastConfig(type);

  return (
    <div className="fixed top-4 right-4 z-[200] animate-in slide-in-from-top-2 duration-300">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-floating border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        max-w-sm min-w-80
      `}>
        <Icon name={config.icon as any} size={20} className="flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-smooth"
          aria-label="Close notification"
        >
          <Icon name="XMarkIcon" size={16} />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;