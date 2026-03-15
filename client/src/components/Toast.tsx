import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }[type];

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 max-w-md border rounded-lg p-4 ${bgColor} shadow-lg animate-in slide-in-from-bottom-5 z-50`}>
      <div className="flex items-start justify-between gap-4">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
