import React, { useState } from 'react';

interface ServiceItem {
    id: string;
    name: string;
    icon: string;
    quantity: number;
}

interface Step2ServiceSelectionProps {
    onValidationChange?: (isValid: boolean) => void;
}

const Step2ServiceSelection: React.FC<Step2ServiceSelectionProps> = ({ onValidationChange }) => {
    const [services, setServices] = useState<ServiceItem[]>([
        { id: 'shoe', name: 'Гутал', icon: 'sports_handball', quantity: 0 },
        { id: 'chemical', name: 'Хими', icon: 'science', quantity: 0 },
        { id: 'carpet', name: 'Хивс', icon: 'layers', quantity: 0 },
        { id: 'sanitize', name: 'Ариутгал', icon: 'clean_hands', quantity: 0 },
        { id: 'clean', name: 'Clean Service', icon: 'cleaning_services', quantity: 0 },
    ]);

    // Validation Effect
    React.useEffect(() => {
        const totalCount = services.reduce((sum, s) => sum + s.quantity, 0);
        const isValid = totalCount > 0;
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [services, onValidationChange]);

    const handleIncrement = (id: string) => {
        setServices(services.map(service =>
            service.id === id ? { ...service, quantity: service.quantity + 1 } : service
        ));
    };

    const handleDecrement = (id: string) => {
        setServices(services.map(service =>
            service.id === id && service.quantity > 0
                ? { ...service, quantity: service.quantity - 1 }
                : service
        ));
    };

    const selectedCount = services.filter(s => s.quantity > 0).length;

    return (
        <div className="w-full p-4 md:p-6 h-full overflow-y-auto no-scrollbar">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Header */}
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                        Үйлчилгээний ангилал
                    </h2>
                </div>

                {/* Service List */}
                <div className="space-y-3 mb-6">
                    {services.map((service) => {
                        const isActive = service.quantity > 0;
                        return (
                            <div
                                key={service.id}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isActive
                                    ? 'border-[#FFD400] bg-[#FFD400]/5'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {/* Icon and Name */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-gray-100'
                                        }`}>
                                        <span className={`material-icons-round text-xl ${isActive ? 'text-primary' : 'text-gray-400'
                                            }`}>
                                            {service.icon}
                                        </span>
                                    </div>
                                    <span className="font-medium text-gray-800">{service.name}</span>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDecrement(service.id)}
                                        disabled={service.quantity === 0}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                                    >
                                        <span className="material-icons-round text-sm text-gray-600">remove</span>
                                    </button>

                                    <span className="w-8 text-center font-bold text-gray-700">
                                        {service.quantity}
                                    </span>

                                    <button
                                        onClick={() => handleIncrement(service.id)}
                                        className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all active:scale-95 shadow-md"
                                    >
                                        <span className="material-icons-round text-sm text-white">add</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Count */}
                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Сонгосон үйлчилгээний төрөл: <span className="font-bold text-primary">{selectedCount}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step2ServiceSelection;
