import React from 'react';
import type { RefundItem } from '../refundTypes';
import { refundLineTotal, unitPrice } from '../refundTypes';

interface Props {
    refundItems: RefundItem[];
    totalRefundAmount: number;
    title?: string;
}

const RefundSummaryPanel: React.FC<Props> = ({ refundItems, totalRefundAmount, title = 'Буцаах бараа' }) => {
    const selected = refundItems.filter(i => i.selected && i.refundQuantity > 0);

    return (
        <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
            <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                <div className="flex items-center gap-2 mb-5">
                    <div className="h-4 w-1 bg-[#FFD400] rounded-sm"></div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
                    <span className="ml-auto text-[10px] font-black text-gray-400">{selected.length}</span>
                </div>

                {selected.length === 0 ? (
                    <div className="py-12 text-center text-gray-300">
                        <span className="material-icons-round text-4xl opacity-30">inventory_2</span>
                        <p className="text-[11px] font-bold mt-2">Бараа сонгогдоогүй байна</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {selected.map(item => (
                            <div key={item.productId} className="flex items-start justify-between gap-2 pb-3 border-b border-gray-50">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                        {unitPrice(item).toLocaleString()}₮ × {item.refundQuantity}
                                    </p>
                                </div>
                                <span className="text-xs font-black text-gray-800 shrink-0">
                                    {refundLineTotal(item).toLocaleString()}₮
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-end">
                        <span className="font-black text-gray-800 uppercase tracking-widest text-[10px]">Нийт буцаалт</span>
                        <span className="text-2xl font-black text-primary tracking-tighter leading-none">
                            {totalRefundAmount.toLocaleString()} ₮
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundSummaryPanel;
