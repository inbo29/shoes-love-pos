import React, { useEffect } from 'react';

type SystemVariant = 'POS' | 'ERP' | 'RMS' | 'DEFAULT';

interface ErrorModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    system?: SystemVariant;
    onClose: () => void;
}

const SYSTEM_COLORS = {
    POS: {
        icon: 'text-green-500',
        button: 'bg-green-500 hover:bg-green-600 focus:ring-green-300',
        border: 'border-green-500',
    },
    ERP: {
        icon: 'text-[#FFD400]', // Yellow
        button: 'bg-[#FFD400] hover:bg-yellow-500 focus:ring-yellow-300 text-gray-900',
        border: 'border-[#FFD400]',
    },
    RMS: {
        icon: 'text-blue-500', // Blue
        button: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300',
        border: 'border-blue-500',
    },
    DEFAULT: {
        icon: 'text-red-500',
        button: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-300',
        border: 'border-gray-200',
    }
};

const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    title = "Алдаа гарлаа", // "Error occurred"
    message,
    system = 'DEFAULT',
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

    const colors = SYSTEM_COLORS[system] || SYSTEM_COLORS.DEFAULT;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center animate-in fade-in zoom-in duration-200">
                <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-5 ${colors.border} border-2 bg-opacity-50`}>
                    <span className={`material-icons-round text-4xl ${colors.icon}`}>priority_high</span>
                </div>

                <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2 text-center uppercase tracking-wide">
                    {title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className={`w-full py-3.5 px-6 rounded-xl text-white font-bold uppercase tracking-wider shadow-lg transform active:scale-95 transition-all outline-none focus:ring-4 ${colors.button}`}
                >
                    Ойлголоо
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
