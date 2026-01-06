import React, { useState, useEffect } from 'react';
import type { SelectedOrderProduct } from '../ProductOrderListScreen';

interface Props {
    selectedProducts: SelectedOrderProduct[];
    onValidationChange: (valid: boolean) => void;
}

const OrderStep2Confirmation: React.FC<Props> = ({ selectedProducts, onValidationChange }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        onValidationChange(isConfirmed);
    }, [isConfirmed, onValidationChange]);

    const totalItems = selectedProducts.length;
    const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalAmount = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6">
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
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ерөнхий дүн</span>
                        <span className="text-2xl font-black text-primary">{totalAmount.toLocaleString()} ₮</span>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-tight">Захиалгын дэлгэрэнгүй</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {selectedProducts.map((product, idx) => (
                            <div key={idx} className="p-6 flex items-center justify-between group hover:bg-gray-50/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                        <span className="material-icons-round text-gray-300">inventory_2</span>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-900 leading-tight">{product.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{product.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12 text-right">
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Нэгж үнэ</p>
                                        <p className="text-[13px] font-bold text-gray-800">{product.price.toLocaleString()} ₮</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Тоо хэмжээ</p>
                                        <p className="text-[13px] font-bold text-gray-800">x {product.quantity}</p>
                                    </div>
                                    <div className="w-[120px]">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Нийт</p>
                                        <p className="text-sm font-black text-gray-900">{(product.price * product.quantity).toLocaleString()} ₮</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer group hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isConfirmed ? 'bg-primary border-primary' : 'bg-white border-gray-200 group-hover:border-primary/50'}`}>
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
