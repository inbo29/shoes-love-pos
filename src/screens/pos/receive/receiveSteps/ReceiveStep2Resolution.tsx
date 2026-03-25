import React from 'react';
import type { ReceiveOrder, ItemDecision } from '../receiveTypes';

interface Props {
    orderData: ReceiveOrder;
    itemDecisions: ItemDecision[];
    onDecisionsChange: (decisions: ItemDecision[]) => void;
    onValidationChange: (isValid: boolean) => void;
    hasReorder: boolean;
}

const ReceiveStep2Resolution: React.FC<Props> = ({
    orderData,
    itemDecisions,
    onDecisionsChange,
    onValidationChange,
    hasReorder
}) => {
    const complaintItems = itemDecisions.filter(d => d.action === 'complaint');
    const receiveItems = itemDecisions.filter(d => d.action === 'receive');

    const updateResolution = (itemId: number, resolution: 'reorder' | 'refund') => {
        const newDecisions = itemDecisions.map(d =>
            d.itemId === itemId ? { ...d, resolution } : d
        );
        onDecisionsChange(newDecisions);

        // Valid when all complaint items have a resolution
        const allResolved = newDecisions
            .filter(d => d.action === 'complaint')
            .every(d => d.resolution);
        onValidationChange(allResolved);
    };

    // Check validation on mount
    React.useEffect(() => {
        const allResolved = complaintItems.every(d => d.resolution);
        onValidationChange(allResolved);
    }, []);

    // Calculate amounts
    const receiveTotal = receiveItems.reduce((sum, d) => {
        const item = orderData.items.find(i => i.id === d.itemId);
        return sum + (item?.price || 0);
    }, 0);

    const refundTotal = complaintItems
        .filter(d => d.resolution === 'refund')
        .reduce((sum, d) => {
            const item = orderData.items.find(i => i.id === d.itemId);
            return sum + (item?.price || 0);
        }, 0);

    const reorderTotal = complaintItems
        .filter(d => d.resolution === 'reorder')
        .reduce((sum, d) => {
            const item = orderData.items.find(i => i.id === d.itemId);
            return sum + (item?.price || 0);
        }, 0);

    const currentPayment = Math.max(0, receiveTotal - orderData.payment.paid);

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] gap-0 overflow-hidden">
            {/* LEFT: Complaint Items */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-3 md:p-4">
                <div className="flex items-center gap-2 mb-4 shrink-0">
                    <div className="h-7 w-1.5 bg-orange-400 rounded-sm"></div>
                    <h2 className="text-[16px] font-bold text-[#374151]">Шийдвэр сонгох</h2>
                    <span className="text-[10px] font-bold text-white bg-orange-400 rounded-full px-2 py-0.5 ml-1">
                        {complaintItems.length}
                    </span>
                </div>

                <div className="overflow-y-auto flex-1 no-scrollbar space-y-3">
                    {/* Received items summary */}
                    {receiveItems.length > 0 && (
                        <div className="bg-green-50 rounded-xl border border-green-100 p-3">
                            <div className="flex items-center gap-1.5 text-green-600 mb-2">
                                <span className="material-icons-round text-sm">check_circle</span>
                                <span className="text-[10px] font-black uppercase tracking-wider">Хүлээн авах бараа ({receiveItems.length})</span>
                            </div>
                            <div className="space-y-1">
                                {receiveItems.map(d => {
                                    const item = orderData.items.find(i => i.id === d.itemId);
                                    if (!item) return null;
                                    return (
                                        <div key={d.itemId} className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-green-700">{item.name}</span>
                                            <span className="font-black text-green-600">{item.price.toLocaleString()}₮</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Complaint items - resolution selection */}
                    {complaintItems.map(d => {
                        const item = orderData.items.find(i => i.id === d.itemId);
                        if (!item) return null;

                        return (
                            <div key={d.itemId} className="bg-white rounded-xl border-2 border-orange-200 overflow-hidden">
                                {/* Item info */}
                                <div className="p-4 flex items-start gap-3 border-b border-orange-100">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.photos[0] ? (
                                            <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-icons-round text-orange-300 text-xl">inventory_2</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-gray-800 uppercase truncate">{item.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.services.join(', ')}</p>
                                        <p className="text-sm font-black text-primary mt-1">{item.price.toLocaleString()}₮</p>
                                    </div>
                                    <span className="text-[8px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full border border-orange-200 uppercase">
                                        {d.complaintType === 'wash_defect' ? 'Угаалга муу' :
                                            d.complaintType === 'damage' ? 'Гэмтэл' :
                                                d.complaintType === 'smell' ? 'Үнэр' : 'Гомдол'}
                                    </span>
                                </div>

                                {/* Complaint reason */}
                                <div className="px-4 py-2 bg-orange-50/50 text-[10px] text-orange-700 font-bold">
                                    <span className="material-icons-round text-xs mr-1 align-middle">format_quote</span>
                                    {d.complaintReason || '—'}
                                </div>

                                {/* Resolution Options */}
                                <div className="p-4 space-y-2">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Шийдвэрлэлт сонгох</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => updateResolution(d.itemId, 'reorder')}
                                            className={`p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5 ${d.resolution === 'reorder'
                                                ? 'border-orange-400 bg-orange-50 shadow-md'
                                                : 'border-gray-100 bg-gray-50 hover:border-orange-200'
                                                }`}
                                        >
                                            <span className={`material-icons-round text-xl ${d.resolution === 'reorder' ? 'text-orange-500' : 'text-gray-400'}`}>
                                                replay
                                            </span>
                                            <span className={`text-[10px] font-black uppercase ${d.resolution === 'reorder' ? 'text-orange-600' : 'text-gray-500'}`}>
                                                Дахин захиалга
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => updateResolution(d.itemId, 'refund')}
                                            className={`p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5 ${d.resolution === 'refund'
                                                ? 'border-red-400 bg-red-50 shadow-md'
                                                : 'border-gray-100 bg-gray-50 hover:border-red-200'
                                                }`}
                                        >
                                            <span className={`material-icons-round text-xl ${d.resolution === 'refund' ? 'text-red-500' : 'text-gray-400'}`}>
                                                money_off
                                            </span>
                                            <span className={`text-[10px] font-black uppercase ${d.resolution === 'refund' ? 'text-red-600' : 'text-gray-500'}`}>
                                                Буцаалт (Refund)
                                            </span>
                                        </button>
                                    </div>
                                    {!d.resolution && (
                                        <p className="text-[9px] text-red-400 font-bold flex items-center gap-1 mt-1">
                                            <span className="material-icons-round text-xs">info</span>
                                            Шийдвэрлэлт сонгоно уу
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: Financial Summary */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                        <div className="h-7 w-1.5 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн тооцоо</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-green-600 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Хүлээн авах
                            </span>
                            <span className="font-black text-gray-800">{receiveTotal.toLocaleString()}₮</span>
                        </div>

                        {refundTotal > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-red-500 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Буцаалт
                                </span>
                                <span className="font-black text-red-500">- {refundTotal.toLocaleString()}₮</span>
                            </div>
                        )}

                        {reorderTotal > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-orange-500 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Дахин захиалга
                                </span>
                                <span className="font-black text-orange-500">- {reorderTotal.toLocaleString()}₮</span>
                            </div>
                        )}

                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">Урьдчилж төлсөн</span>
                            <span className="font-black text-green-600">- {orderData.payment.paid.toLocaleString()}₮</span>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 my-3"></div>

                        <div className="bg-primary/5 rounded-xl p-3 border-2 border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-gray-600 uppercase">Төлөх дүн</span>
                                <span className="text-xl font-black text-primary">{Math.max(0, currentPayment).toLocaleString()}₮</span>
                            </div>
                        </div>

                        {hasReorder && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 mt-3">
                                <p className="text-[10px] text-orange-700 font-bold flex items-start gap-1.5">
                                    <span className="material-icons-round text-xs mt-0.5">info</span>
                                    <span>Дахин захиалга сонгогдсон тул төлбөр алгасагдана. Захиалга Step 5 руу шилжинэ.</span>
                                </p>
                            </div>
                        )}

                        {!hasReorder && refundTotal > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mt-3">
                                <p className="text-[10px] text-red-700 font-bold flex items-start gap-1.5">
                                    <span className="material-icons-round text-xs mt-0.5">info</span>
                                    <span>Буцаалт дүн хасагдсан. Дараагийн алхамд төлбөр төлнө.</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiveStep2Resolution;
