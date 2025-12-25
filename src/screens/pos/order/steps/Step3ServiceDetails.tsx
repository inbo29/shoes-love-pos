import React, { useState } from 'react';
import { serviceDataByItem, mapCategoryToItemType, ItemType, ServiceType, ServiceDetail, ItemData } from '../../../../services/mockServiceData';

export type OrderHandlingType =
    | 'NORMAL'        // ЭНГИЙН
    | 'URGENT'        // ЯАРАЛТАЙ
    | 'DELIVERY_BOTH' // Дуудлага, хүргэж хол
    | 'DELIVERY_ONE'  // Хүргэлт 1 таладаа
    | 'BOXED'         // Хайрцагтай
    | 'CSL'           // CSL
    | 'OTHER_BRANCH'  // Өөр салбараас авах
    | 'VIP';          // VIP

const HANDLING_TYPE_LABELS: Record<OrderHandlingType, string> = {
    'NORMAL': 'ЭНГИЙН',
    'URGENT': 'ЯАРАЛТАЙ',
    'DELIVERY_BOTH': 'Дуудлага, хүргэж хол',
    'DELIVERY_ONE': 'Хүргэлт 1 таладаа',
    'BOXED': 'Хайрцагтай',
    'CSL': 'CSL',
    'OTHER_BRANCH': 'Өөр салбараас авах',
    'VIP': 'VIP',
};

interface TypeSelection {
    typeId: string;
    typeName: string;
    services: ServiceDetail[];
}

interface Step3Selection {
    itemType: ItemType;
    label: string;
    index: number;
    typeSelections: TypeSelection[];
    handlingTypes: Set<OrderHandlingType>;
}

interface ItemSection {
    itemType: ItemType;
    label: string;
    index: number;
}

interface Step3ServiceDetailsProps {
    onValidationChange?: (isValid: boolean) => void;
}

const Step3ServiceDetails: React.FC<Step3ServiceDetailsProps> = ({ onValidationChange }) => {
    // Mock items from Step 2 (shoe: 1, bag: 1) -> Updated to Shoes & Cloth (Chemical) as per request to fix "Bag" mismatch
    const [items] = useState<ItemSection[]>([
        { itemType: 'SHOES', label: 'Гутал', index: 1 },
        { itemType: 'CLOTH', label: 'Хими', index: 1 },
    ]);

    const [selections, setSelections] = useState<Step3Selection[]>(
        items.map(item => ({
            itemType: item.itemType,
            label: item.label,
            index: item.index,
            typeSelections: [],
            handlingTypes: new Set<OrderHandlingType>(['NORMAL']),
        }))
    );

    const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());

    // Order Handling Type state
    const [handlingTypes, setHandlingTypes] = useState<Set<OrderHandlingType>>(new Set(['NORMAL']));

    const toggleGlobalHandlingType = (type: OrderHandlingType) => {
        setHandlingTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
                if (newSet.size === 1) return prev;
                newSet.delete(type);
            } else {
                newSet.add(type);
            }
            return newSet;
        });
    };

    const getAccordionKey = (itemIdx: number, typeId: string) => `${itemIdx}-${typeId}`;

    const toggleAccordion = (itemIdx: number, typeId: string) => {
        const key = getAccordionKey(itemIdx, typeId);
        setOpenAccordions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const isServiceSelected = (itemIdx: number, typeId: string, serviceCode: string): boolean => {
        const typeSelection = selections[itemIdx].typeSelections.find(ts => ts.typeId === typeId);
        return typeSelection?.services.some(s => s.code === serviceCode) || false;
    };

    const toggleServiceSelection = (itemIdx: number, type: ServiceType, service: ServiceDetail) => {
        setSelections(prev => prev.map((sel, idx) => {
            if (idx !== itemIdx) return sel;

            const typeIdx = sel.typeSelections.findIndex(ts => ts.typeId === type.id);

            if (typeIdx === -1) {
                // Type not yet in selection, add it with this service
                return {
                    ...sel,
                    typeSelections: [
                        ...sel.typeSelections,
                        { typeId: type.id, typeName: type.name, services: [service] }
                    ]
                };
            } else {
                // Type exists, toggle service
                const typeSelection = sel.typeSelections[typeIdx];
                const serviceIdx = typeSelection.services.findIndex(s => s.code === service.code);

                if (serviceIdx === -1) {
                    // Add service
                    const updatedTypeSelections = [...sel.typeSelections];
                    updatedTypeSelections[typeIdx] = {
                        ...typeSelection,
                        services: [...typeSelection.services, service]
                    };
                    return { ...sel, typeSelections: updatedTypeSelections };
                } else {
                    // Remove service
                    const updatedTypeSelections = [...sel.typeSelections];
                    const newServices = typeSelection.services.filter(s => s.code !== service.code);

                    if (newServices.length === 0) {
                        // Remove entire type selection if no services left
                        updatedTypeSelections.splice(typeIdx, 1);
                    } else {
                        updatedTypeSelections[typeIdx] = { ...typeSelection, services: newServices };
                    }
                    return { ...sel, typeSelections: updatedTypeSelections };
                }
            }
        }));
    };

    const getTotalServiceCount = (itemIdx: number): number => {
        return selections[itemIdx].typeSelections.reduce((sum, ts) => sum + ts.services.length, 0);
    };

    const totalServiceCount = selections.reduce((sum, sel) =>
        sum + sel.typeSelections.reduce((typeSum, ts) => typeSum + ts.services.length, 0), 0
    );

    const allItemsValid = selections.every(sel =>
        sel.typeSelections.some(ts => ts.services.length > 0)
    );

    // Validation Effect
    React.useEffect(() => {
        if (onValidationChange) {
            onValidationChange(allItemsValid);
        }
    }, [allItemsValid, onValidationChange]);

    const toggleHandlingType = (itemIdx: number, type: OrderHandlingType) => {
        setSelections(prev => prev.map((sel, idx) => {
            if (idx !== itemIdx) return sel;

            const newHandlingTypes = new Set(sel.handlingTypes);
            if (newHandlingTypes.has(type)) {
                if (newHandlingTypes.size === 1) return sel;
                newHandlingTypes.delete(type);
            } else {
                newHandlingTypes.add(type);
            }
            return { ...sel, handlingTypes: newHandlingTypes };
        }));
    };

    return (
        <div className="w-full p-4 md:p-6 h-full overflow-y-auto no-scrollbar">
            <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-8">
                {/* Header */}
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                            Сонгосон үйлчилгээний дэлгэрэнгүй
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Бараа тус бүрд тохирох ажлын төрөл, үнийн дэлгэрэнгүйг сонгоно уу.
                    </p>
                </div>

                {/* Item Sections */}
                <div className="space-y-8">
                    {items.map((item, itemIdx) => {
                        const itemData = serviceDataByItem[item.itemType];
                        const serviceTypes = itemData?.types || [];
                        const selection = selections[itemIdx];
                        const serviceCount = getTotalServiceCount(itemIdx);

                        return (
                            <div key={`${item.itemType}-${item.index}`} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                {/* Item Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-bold text-primary flex items-center gap-2">
                                        <span className="material-icons-round text-xl">category</span>
                                        {item.label} {item.index}
                                    </h3>
                                    <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                        Сонгосон: {serviceCount} үйлчилгээ
                                    </span>
                                </div>

                                {/* Service Type Cards - Horizontal Scroll */}
                                <div className="overflow-x-auto pb-3 -mx-2 px-2">
                                    <div className="flex gap-3 min-w-max">
                                        {serviceTypes.map(type => {
                                            const accordionKey = getAccordionKey(itemIdx, type.id);
                                            const isOpen = openAccordions.has(accordionKey);
                                            const typeSelection = selection.typeSelections.find(ts => ts.typeId === type.id);
                                            const hasSelectedServices = typeSelection && typeSelection.services.length > 0;

                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => toggleAccordion(itemIdx, type.id)}
                                                    className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 min-w-[120px] ${hasSelectedServices
                                                        ? 'border-primary bg-primary/5'
                                                        : isOpen
                                                            ? 'border-primary/50 bg-primary/5'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${hasSelectedServices || isOpen ? 'bg-primary/10' : 'bg-gray-100'
                                                        }`}>
                                                        <span className={`material-icons-round text-2xl ${hasSelectedServices || isOpen ? 'text-primary' : 'text-gray-400'
                                                            }`}>
                                                            {type.icon}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-800">{type.name}</span>
                                                    {hasSelectedServices && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white font-bold">
                                                            {typeSelection.services.length}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Accordion Price Lists */}
                                <div className="space-y-3 mt-4">
                                    {serviceTypes.map(type => {
                                        const accordionKey = getAccordionKey(itemIdx, type.id);
                                        const isOpen = openAccordions.has(accordionKey);

                                        if (!isOpen) return null;

                                        return (
                                            <div key={type.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="material-icons-round text-primary text-lg">{type.icon}</span>
                                                    <span className="font-bold text-gray-800">{type.name}</span>
                                                </div>
                                                <div className="max-h-[240px] overflow-y-auto pr-2">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {type.details.map(detail => {
                                                            const isSelected = isServiceSelected(itemIdx, type.id, detail.code);

                                                            return (
                                                                <button
                                                                    key={detail.code}
                                                                    onClick={() => toggleServiceSelection(itemIdx, type, detail)}
                                                                    className={`flex items-start gap-3 px-4 py-3 rounded-lg border-2 transition-all active:scale-95 text-left ${isSelected
                                                                        ? 'border-primary bg-primary/10'
                                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                                        }`}
                                                                >
                                                                    {/* Checkbox */}
                                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected
                                                                        ? 'bg-primary border-primary'
                                                                        : 'border-gray-300 bg-white'
                                                                        }`}>
                                                                        {isSelected && (
                                                                            <span className="material-icons-round text-white text-sm">check</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Service Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-1 mb-1">
                                                                            <span className="text-sm font-bold text-gray-800">
                                                                                ₮ {detail.price.toLocaleString()}
                                                                            </span>
                                                                            {detail.orderType === 'V' && (
                                                                                <span className="px-1.5 py-0.5 bg-yellow-400 text-xs font-bold rounded text-gray-900">
                                                                                    VIP
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-xs text-gray-500 block">
                                                                            {detail.makeDay} өдөр
                                                                        </span>
                                                                        <span className="text-xs text-gray-600 line-clamp-2">
                                                                            {detail.descr}
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Handling Type for this item */}
                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">
                                        Захиалгын боловсруулалтын төрөл
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(HANDLING_TYPE_LABELS) as OrderHandlingType[]).map(type => {
                                            const isSelected = selection.handlingTypes.has(type);
                                            return (
                                                <button
                                                    key={type}
                                                    onClick={() => toggleHandlingType(itemIdx, type)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all active:scale-95 text-left ${isSelected
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                                                        ? 'bg-primary border-primary'
                                                        : 'border-gray-300 bg-white'
                                                        }`}>
                                                        {isSelected && (
                                                            <span className="material-icons-round text-white text-xs">check</span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-800">
                                                        {HANDLING_TYPE_LABELS[type]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Handling Type Selection */}
                {/* <div className="border-t border-gray-100 pt-6 mt-6">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide mb-1">
                            Захиалгын боловсруулалтын төрөл
                        </h3>
                        <p className="text-xs text-gray-500">
                            Нэг ба түүнээс дээш сонголт хийх боломжтой
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(HANDLING_TYPE_LABELS) as OrderHandlingType[]).map(type => {
                            const isSelected = handlingTypes.has(type);

                            return (
                                <button
                                    key={type}
                                    onClick={() => toggleGlobalHandlingType(type)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all active:scale-95 text-left ${isSelected
                                        ? 'border-primary bg-primary/10'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                                        ? 'bg-primary border-primary'
                                        : 'border-gray-300 bg-white'
                                        }`}>
                                        {isSelected && (
                                            <span className="material-icons-round text-white text-sm">check</span>
                                        )}
                                    </div>

                                    <span className="text-sm font-medium text-gray-800">
                                        {HANDLING_TYPE_LABELS[type]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            Сонгосон: {' '}
                            {Array.from(handlingTypes).map((t: OrderHandlingType, idx) => (
                                <span key={t}>
                                    <span className="font-medium text-primary">{HANDLING_TYPE_LABELS[t]}</span>
                                    {idx < handlingTypes.size - 1 && ', '}
                                </span>
                            ))}
                        </p>
                    </div>
                </div> */}

                {/* Selection Summary */}
                <div className="text-center pt-4 border-t border-gray-100 mt-6">
                    <p className="text-sm text-gray-600">
                        Нийт сонгосон үйлчилгээ: <span className="font-bold text-primary">{totalServiceCount}</span>
                        {!allItemsValid && (
                            <span className="text-red-500 ml-2">
                                (Бүх ангилалд дор хаяж нэг үйлчилгээ сонгоно уу)
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step3ServiceDetails;
