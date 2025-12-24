import React from 'react';

interface PosExcelButtonProps {
    onClick?: () => void;
    label?: string;
}

const PosExcelButton: React.FC<PosExcelButtonProps> = ({ onClick, label = 'Excel татах' }) => {
    return (
        <button
            onClick={onClick}
            className="group bg-green-500 hover:bg-green-600 text-white px-5 h-[44px] rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all font-bold text-sm active:scale-95 whitespace-nowrap"
        >
            <span className="material-icons-round text-lg group-hover:scale-110 transition-transform">description</span>
            {label}
        </button>
    );
};

export default PosExcelButton;
