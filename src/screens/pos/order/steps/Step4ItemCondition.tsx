import React, { useState } from 'react';
import { conditionGroupsByCategory, ItemConditionGroup } from '../../../../services/mockConditionData';

interface ItemConditionState {
    itemIndex: number;
    category: string;
    selections: Record<number, number | number[]>;
    photos: File[];
    warnings: string[];
}

const Step4ItemCondition: React.FC = () => {
    // Mock: assume we have 2 Гутал items from Step 2
    const [items] = useState([
        { category: 'Гутал', index: 1 },
        { category: 'Гутал', index: 2 },
    ]);

    const [itemStates, setItemStates] = useState<ItemConditionState[]>(
        items.map(item => ({
            itemIndex: item.index,
            category: item.category,
            selections: {
                7: 2, // Бага зэрэг (Shoes default for demo)
                8: [3], // Цус (Shoes default for demo)
                9: [3], // Дотор урагдсан
                10: 2, // Үгүй
            },
            photos: [],
            warnings: [],
            comment: '',
        }))
    );

    const handleSelection = (itemIdx: number, groupCode: number, optionId: number, multiSelect: boolean) => {
        setItemStates(prev => prev.map((state, idx) => {
            if (idx !== itemIdx) return state;

            if (multiSelect) {
                const current = (state.selections[groupCode] as number[]) || [];
                const newSelection = current.includes(optionId)
                    ? current.filter(id => id !== optionId)
                    : [...current, optionId];
                return { ...state, selections: { ...state.selections, [groupCode]: newSelection } };
            } else {
                return { ...state, selections: { ...state.selections, [groupCode]: optionId } };
            }
        }));
    };

    const handleCommentChange = (itemIdx: number, value: string) => {
        setItemStates(prev => prev.map((state, idx) =>
            idx === itemIdx ? { ...state, comment: value } : state
        ));
    };

    const handlePhotoUpload = (itemIdx: number, files: FileList | null) => {
        if (!files) return;
        setItemStates(prev => prev.map((state, idx) =>
            idx === itemIdx
                ? { ...state, photos: [...state.photos, ...Array.from(files)].slice(0, 6) }
                : state
        ));
    };

    const PHOTO_LABELS = ['Урд', 'Зүүн', 'Баруун', 'Доод ул', 'Ар'];

    const renderField = (itemIdx: number, group: ItemConditionGroup) => {
        const state = itemStates[itemIdx];
        const selection = state.selections[group.groupCode];

        switch (group.fieldType) {
            case 'chip':
                return (
                    <div className="flex gap-2 flex-wrap">
                        {group.options.map(option => {
                            const isSelected = selection === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelection(itemIdx, group.groupCode, option.id, false)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${isSelected
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                );

            case 'color':
                return (
                    <div className="flex gap-2 flex-wrap items-center">
                        {group.options.map(option => {
                            const isSelected = selection === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelection(itemIdx, group.groupCode, option.id, false)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white shadow-sm hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: option.color }}
                                >
                                    {option.label === 'Хар' && isSelected && (
                                        <span className="material-icons-round text-white text-xs">check</span>
                                    )}
                                    {option.label === 'Цагаан' && (
                                        <div className="w-full h-full rounded-full border border-gray-100" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                );

            case 'button':
                return (
                    <div className="flex gap-2 flex-wrap">
                        {group.options.map(option => {
                            const isArray = Array.isArray(selection);
                            const isSelected = isArray ? (selection as number[]).includes(option.id) : selection === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelection(itemIdx, group.groupCode, option.id, group.multiSelect)}
                                    className={`px-4 py-1.5 rounded-full border transition-all text-[11px] font-medium ${isSelected
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                );

            case 'dropdown':
                return (
                    <input
                        type="text"
                        placeholder="Nike, Adidas г.м"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-xs bg-gray-50/30 focus:outline-none focus:border-primary"
                    />
                );

            case 'checkbox':
                return (
                    <div className="flex gap-3 flex-wrap">
                        {group.options.map(option => {
                            const selectedArray = (selection as number[]) || [];
                            const isSelected = selectedArray.includes(option.id);
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelection(itemIdx, group.groupCode, option.id, true)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${isSelected ? 'bg-primary/5 border-primary/30' : 'bg-gray-50/50 border-gray-100'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300'
                                        }`}>
                                        {isSelected && <span className="material-icons-round text-[10px]">check</span>}
                                    </div>
                                    <span className="text-xs text-gray-600">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full p-4 md:p-6 h-full overflow-y-auto no-scrollbar">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Одоогийн байдал бүртгэх</h1>

            <div className="space-y-6 pb-20">
                {items.map((item, itemIdx) => {
                    const conditionGroups = conditionGroupsByCategory[item.category] || [];
                    const state = itemStates[itemIdx];

                    return (
                        <div key={`${item.category}-${item.index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Item Header */}
                            <div className="p-4 flex items-center justify-between border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800">{item.category} {item.index}</h3>
                                        <span className="text-[10px] text-blue-400 font-medium px-2 py-0.5 bg-blue-50 rounded">Үйлчилгээ: {item.category}</span>
                                    </div>
                                </div>
                                <span className="material-icons-round text-gray-400 cursor-pointer">expand_less</span>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Grid Layout for Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                                    {conditionGroups.map(group => {
                                        if (group.groupName === 'Нэмэлт нөхцөлүүд') return null; // Rendered below
                                        return (
                                            <div key={group.groupCode} className="space-y-2.5">
                                                <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                                                    {group.groupName}
                                                    {['Загвар', 'Өнгө', 'Элэгдэл'].includes(group.groupName) && <span className="text-red-500">*</span>}
                                                </label>
                                                {renderField(itemIdx, group)}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Extra Conditions (Нэмэлт нөхцөлүүд) */}
                                {conditionGroups.find(g => g.groupName === 'Нэмэлт нөхцөлүүд') && (
                                    <div className="mt-8 pt-8 border-t border-gray-50">
                                        <label className="text-[11px] font-bold text-gray-800 mb-3 block">Нэмэлт нөхцөлүүд</label>
                                        {renderField(itemIdx, conditionGroups.find(g => g.groupName === 'Нэмэлт нөхцөлүүд')!)}
                                    </div>
                                )}

                                {/* Photo Upload Section */}
                                <div className="mt-10 pt-8 border-t border-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-[11px] font-bold text-gray-800">
                                            Зураг оруулах <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded text-[10px] text-orange-600 font-bold border border-orange-100">
                                            <span className="material-icons-round text-xs">warning</span>
                                            Ядаж 1 зураг оруулах шаардлагатай
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-5 gap-4">
                                        {PHOTO_LABELS.map((label, pIdx) => (
                                            <div key={label} className="flex flex-col gap-2">
                                                <div className="aspect-[4/3] bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors group">
                                                    <span className="material-icons-round text-gray-300 group-hover:text-primary transition-colors">photo_camera</span>
                                                    <span className="text-[10px] text-gray-400 mt-2">{label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Comment */}
                                <div className="mt-8">
                                    <label className="text-[11px] font-bold text-gray-800 mb-2 block">Нэмэлт тайлбар</label>
                                    <textarea
                                        placeholder="Нэмэлт тайлбар оруулна уу..."
                                        value={state.comment}
                                        onChange={(e) => handleCommentChange(itemIdx, e.target.value)}
                                        className="w-full h-24 p-3 border border-gray-100 rounded-lg text-xs bg-gray-50/30 focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Step4ItemCondition;
