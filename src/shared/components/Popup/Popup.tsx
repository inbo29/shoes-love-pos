import React, { useEffect } from 'react';

type PopupType = 'info' | 'success' | 'error';

interface PopupProps {
    isOpen: boolean;
    type: PopupType;
    title: string;
    message: string;
    onClose: () => void;
}

const TYPE_CONFIG = {
    info: {
        icon: 'info',
        iconColor: 'text-blue-500',
        buttonColor: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300',
        borderColor: 'border-blue-500',
    },
    success: {
        icon: 'check_circle',
        iconColor: 'text-green-500',
        buttonColor: 'bg-green-500 hover:bg-green-600 focus:ring-green-300',
        borderColor: 'border-green-500',
    },
    error: {
        icon: 'priority_high',
        iconColor: 'text-red-500',
        buttonColor: 'bg-red-500 hover:bg-red-600 focus:ring-red-300',
        borderColor: 'border-red-500',
    },
};

const Popup: React.FC<PopupProps> = ({
    isOpen,
    type,
    title,
    message,
    onClose
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const config = TYPE_CONFIG[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center animate-in fade-in zoom-in duration-200">
                <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-5 ${config.borderColor} border-2 bg-opacity-50`}>
                    <span className={`material-icons-round text-4xl ${config.iconColor}`}>{config.icon}</span>
                </div>

                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 text-center uppercase tracking-wide">
                    {title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className={`w-full py-3.5 px-6 rounded-xl text-white font-bold uppercase tracking-wider shadow-lg transform active:scale-95 transition-all outline-none focus:ring-4 ${config.buttonColor}`}
                >
                    Ойлголоо
                </button>
            </div>
        </div>
    );
};

export default Popup;
