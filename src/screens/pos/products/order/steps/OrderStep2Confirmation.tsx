import React, { useState, useEffect } from 'react';
import PosDropdown from '../../../../../shared/components/PosDropdown';
import type { SelectedOrderProduct } from '../ProductOrderListScreen';

interface Props {
    selectedProducts: SelectedOrderProduct[];
    onValidationChange: (valid: boolean) => void;
    onRemarksChange: (remarks: string) => void;
    onToBranchChange?: (branch: string) => void;
    fromBranch?: string;
    toBranch?: string;
}

const TO_OPTIONS = ['Төв салбар'];

const OrderStep2Confirmation: React.FC<Props> = ({
    selectedProducts,
    onValidationChange,
    onRemarksChange,
    onToBranchChange,
    fromBranch = '현재 판매점',
    toBranch: initialToBranch = 'Төв салбар',
}) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [localTo, setLocalTo] = useState(initialToBranch);

    useEffect(() => {
        onValidationChange(isConfirmed && selectedProducts.length > 0 && !!localTo);
    }, [isConfirmed, selectedProducts.length, localTo, onValidationChange]);

    const handleRemarksChange = (val: string) => {
        setRemarks(val);
        onRemarksChange(val);
    };

    const handleToChange = (val: string) => {
        setLocalTo(val);
        onToBranchChange?.(val);
    };

    const totalItems = selectedProducts.length;
    const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar">
            <div className="w-full flex flex-col p-4 md:p-6 gap-5">

                {/* FROM → TO selectors */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* FROM — read-only */}
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Хаанаас (FROM)</p>
                        <div className="flex items-center gap-2 h-11 px-4 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="material-icons-round text-[16px] text-gray-400">storefront</span>
                            <span className="text-[13px] font-black text-gray-600">{fromBranch}</span>
                            <span className="ml-auto text-[9px] font-black text-gray-300 uppercase tracking-widest">고정</span>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-end pb-1 shrink-0">
                        <span className="material-icons-round text-[28px] text-[#40C1C7]">east</span>
                    </div>

                    {/* TO — selectable */}
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Хаашаа (TO)</p>
                        <PosDropdown
                            icon="move_to_inbox"
                            value={localTo}
                            onChange={handleToChange}
                            options={TO_OPTIONS.map(o => ({ label: o, value: o }))}
                        />
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Барааны нэр төрөл</span>
                        <span className="text-2xl font-black text-gray-800">{totalItems} төрөл</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Нийт ширхэг</span>
                        <span className="text-2xl font-black text-gray-800">{totalQuantity} ширхэг</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Нийт дүн</span>
                        <span className="text-2xl font-black text-primary">{totalAmount.toLocaleString()} ₮</span>
                    </div>
                </div>

                {/* Product list */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Захиалгын дэлгэрэнгүй</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {selectedProducts.map((product, idx) => (
                            <div key={idx} className="p-5 flex items-center justify-between group hover:bg-gray-50/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                        <span className="material-icons-round text-gray-300">inventory_2</span>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-900 leading-tight">{product.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 text-right">
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Нэгж үнэ</p>
                                        <p className="text-[13px] font-bold text-gray-800">{product.price.toLocaleString()} ₮</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Тоо хэмжээ</p>
                                        <p className="text-[13px] font-bold text-gray-800">× {product.quantity}</p>
                                    </div>
                                    <div className="w-[110px]">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Нийт</p>
                                        <p className="text-sm font-black text-gray-900">{(product.price * product.quantity).toLocaleString()} ₮</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Remarks textarea */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-base">notes</span>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Тайлбар (비고)</h3>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">• заавал биш</span>
                    </div>
                    <textarea
                        value={remarks}
                        onChange={e => handleRemarksChange(e.target.value)}
                        rows={3}
                        placeholder="Тайлбар оруулна уу…"
                        className="w-full resize-none rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 font-medium"
                    />
                </div>

                {/* Confirmation checkbox */}
                <div className="flex justify-center">
                    <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer group hover:bg-gray-50 transition-colors w-full max-w-lg">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${isConfirmed ? 'bg-primary border-primary' : 'bg-white border-gray-200 group-hover:border-primary/50'}`}>
                            {isConfirmed && <span className="material-icons-round text-white text-lg">check</span>}
                        </div>
                        <span className="text-sm font-bold text-gray-600">Захиалгын мэдээлэл зөв болохыг баталгаажуулна</span>
                    </label>
                </div>

            </div>
        </div>
    );
};

export default OrderStep2Confirmation;
