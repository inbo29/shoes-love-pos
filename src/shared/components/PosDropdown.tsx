import React, { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: string;
}

interface PosDropdownProps {
    label?: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    icon?: string;
    className?: string;
    disabled?: boolean;
}

const PosDropdown: React.FC<PosDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    icon,
    className = "",
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className={`flex flex-col gap-1.5 ${className}`} ref={dropdownRef}>
            {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
            <div className="relative">
                <button
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full h-[44px] pl-11 pr-10 border ${isOpen ? 'border-primary shadow-[0_0_0_4px_rgba(64,193,199,0.1)]' : 'border-gray-200'} rounded-xl text-[13px] font-bold flex items-center transition-all text-left 
                        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70' : 'bg-white text-gray-700 hover:border-primary/50'}`}
                >
                    {icon && (
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-lg">{icon}</span>
                        </span>
                    )}
                    <span className="truncate">{selectedOption.label}</span>
                    <span className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <span className="material-icons-round text-lg">expand_more</span>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="py-1 max-h-[240px] overflow-y-auto no-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-[13px] font-bold transition-all relative group flex items-center
                                        ${value === option.value
                                            ? 'text-primary bg-primary/5'
                                            : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
                                        }
                                    `}
                                >
                                    {/* Left accent bar on hover/active */}
                                    <div className={`absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full transition-opacity 
                                        ${value === option.value ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                    `} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PosDropdown;
