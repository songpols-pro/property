import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgClass = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`flex items-center ${bgClass} text-white px-6 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-in`}>
            <Icon className="mr-3 w-6 h-6" />
            <span className="font-medium">{message}</span>
        </div>
    );
};

export default Toast;
