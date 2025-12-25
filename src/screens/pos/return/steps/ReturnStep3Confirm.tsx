import React, { useMemo } from 'react';

interface Step3Props {
    order: any;
    selectedItemIds: Set<string>;
    selectedServiceIds: Set<string>;
    reason: string;
    onReasonChange: (reason: string) => void;
}

const ReturnStep3Confirm: React.FC<Step3Props> = ({
    order,
    selectedItemIds,
    selectedServiceIds,
    reason,
    onReasonChange
}) => {
    if (!order) return null;

    // Calculate details and lists
    const { totalRefund, refundedItems } = useMemo(() => {
        let total = 0;
        let items: any[] = [];

        order.items.forEach((item: any) => {
            if (selectedItemIds.has(item.id)) {
                // Whole item
                const itemPrice = item.services?.reduce((sum: number, s: any) => sum + s.price, 0) || 0;
                total += itemPrice;
                items.push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    price: itemPrice,
                    isBundle: true,
                    serviceCount: item.services?.length || 0
                });
            } else {
                // Individual services
                item.services?.forEach((service: any) => {
                    if (selectedServiceIds.has(service.id)) {
                        total += service.price;
                        items.push({
                            id: service.id,
                            name: `${item.name} - ${service.name}`,
                            type: item.type,
                            price: service.price,
                            isBundle: false
                        });
                    }
                });
            }
        });

        return { totalRefund: total, refundedItems: items };
    }, [order.items, selectedItemIds, selectedServiceIds]);

    const originalTotal = parseInt(order.amount.replace(/[^0-9]/g, ''));
    const newTotal = originalTotal - totalRefund;

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto pb-20">
            {/* Summary Review Card */}
            <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#40C1C7]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                <div className="flex items-center gap-3 mb-10 relative z-10">
                    <div className="h-10 w-2 bg-[#40C1C7] rounded-full"></div>
                    <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Өөрчлөлтийн тойм</h2>
                </div>

                <div className="grid grid-cols-1 gap-8 relative z-10">
                    {/* Price Transition */}
                    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100/50 gap-6">
                        <div className="flex flex-col gap-2 items-center md:items-start">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Анхны нийт дүн</span>
                            <span className="text-2xl font-bold text-gray-800">{order.amount}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-200 shadow-sm border border-gray-50 rotate-90 md:rotate-0">
                            <span className="material-icons-round text-3xl">arrow_forward</span>
                        </div>
                        <div className="flex flex-col gap-2 items-center md:items-end">
                            <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em]">Буцаалтын дүн (–)</span>
                            <span className="text-2xl font-black text-red-500">-{totalRefund.toLocaleString()} ₮</span>
                        </div>
                    </div>

                    {/* Selection Summary List */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3 ml-2">
                            <div className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Сонгогдсон зүйлс ({refundedItems.length})</div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {refundedItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-red-100 transition-colors">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.isBundle ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-red-50 text-red-500'}`}>
                                        <span className="material-icons-round text-2xl">{item.isBundle ? 'inventory_2' : 'list_alt'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {item.isBundle && <span className="text-[8px] font-black bg-red-100 text-red-500 px-1.5 py-0.5 rounded-sm uppercase">Багц ⭕</span>}
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.type}</div>
                                        </div>
                                        <div className="text-base font-black text-gray-800 truncate tracking-tight">{item.name} {item.isBundle && `(${item.serviceCount})`}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-base font-black text-red-500">{item.price.toLocaleString()} ₮</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final New Total Card */}
                    <div className="mt-4 p-8 bg-[#40C1C7]/5 rounded-[40px] border-2 border-[#40C1C7]/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[28px] bg-[#40C1C7] flex items-center justify-center text-white shadow-xl shadow-[#40C1C7]/30">
                                <span className="material-icons-round text-3xl">account_balance_wallet</span>
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black text-[#40C1C7] uppercase tracking-[0.3em] mb-1">Шинэчилсэн нийт дүн</h4>
                                <div className="text-4xl font-black text-gray-900 tracking-tighter">{newTotal.toLocaleString()} ₮</div>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-white rounded-2xl border border-[#40C1C7]/20 shadow-sm flex items-center gap-2">
                            <span className="material-icons-round text-green-500">verified</span>
                            <span className="text-[12px] font-black text-[#40C1C7] uppercase tracking-widest">Тооцоолол бэлэн</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reason Input */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 ml-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                        <span className="material-icons-round text-xl">rate_review</span>
                    </div>
                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Буцаалтын шалтгаан <span className="text-red-500">*</span></label>
                </div>
                <textarea
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    placeholder="Буцаалт хийж буй шалтгааныг оруулна уу..."
                    className="w-full h-44 p-8 bg-white border border-gray-100 rounded-[32px] text-base font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-[#40C1C7]/5 focus:border-[#40C1C7] shadow-xl shadow-gray-100/50 transition-all resize-none"
                    required
                />
            </div>
        </div>
    );
};

export default ReturnStep3Confirm;
