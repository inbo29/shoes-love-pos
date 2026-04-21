import React from 'react';
import type { ReceiveOrder, ItemDecision } from '../receiveTypes';

interface Props {
    orderData: ReceiveOrder;
    itemDecisions: ItemDecision[];
    onDecisionsChange: (decisions: ItemDecision[]) => void;
    onValidationChange: (isValid: boolean) => void;
    hasReorder: boolean;
    calculations: {
        receiveTotal: number;
        refundTotal: number;
        reorderTotal: number;
        newOrderTotal: number;
        currentPayment: number;
        refundToCustomer: number;
    };
}

const ReceiveStep2Resolution: React.FC<Props> = ({
    orderData,
    itemDecisions,
    onDecisionsChange,
    onValidationChange,
    hasReorder,
    calculations
}) => {
    const complaintItems = itemDecisions.filter(d => d.action === 'complaint');
    const receiveItems = itemDecisions.filter(d => d.action === 'receive');

    const updateComplaintField = (itemId: number, fields: Partial<ItemDecision>) => {
        const newDecisions = itemDecisions.map(d =>
            d.itemId === itemId ? { ...d, ...fields } : d
        );
        onDecisionsChange(newDecisions);
        revalidate(newDecisions);
    };

    const revalidate = (decisions: ItemDecision[]) => {
        const allValid = decisions
            .filter(d => d.action === 'complaint')
            .every(d => d.complaintReason && d.complaintReason.trim().length > 0);
        onValidationChange(allValid);
    };

    React.useEffect(() => {
        const needsUpdate = complaintItems.some(d => d.resolution !== 'reorder');
        if (needsUpdate) {
            const newDecisions = itemDecisions.map(d =>
                d.action === 'complaint' ? { ...d, resolution: 'reorder' as const } : d
            );
            onDecisionsChange(newDecisions);
            revalidate(newDecisions);
        } else {
            revalidate(itemDecisions);
        }
    }, []);

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

                                {/* Complaint detail form */}
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center gap-1.5 text-orange-600">
                                        <span className="material-icons-round text-sm">edit_note</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider">Гомдлын мэдээлэл</span>
                                    </div>

                                    {/* Complaint reason */}
                                    <div>
                                        <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider block mb-1.5">Гомдлын агуулга *</span>
                                        <textarea
                                            value={d.complaintReason || ''}
                                            onChange={e => updateComplaintField(d.itemId, { complaintReason: e.target.value })}
                                            placeholder="Харилцагчийн гомдлын дэлгэрэнгүй энд бичнэ үү..."
                                            className="w-full px-3 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-300 resize-none transition-all"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Photo upload */}
                                    <div>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                            <span className="material-icons-round text-[10px] align-middle mr-0.5">photo_camera</span>
                                            Зураг / нотлох баримт (сонголтоор)
                                        </span>
                                        <div className="flex gap-2">
                                            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition-colors">
                                                <span className="material-icons-round text-gray-300 text-lg">add_photo_alternate</span>
                                                <span className="text-[7px] text-gray-300 font-bold mt-0.5">Нэмэх</span>
                                            </div>
                                        </div>
                                    </div>

                                    {!d.complaintReason?.trim() && (
                                        <p className="text-[9px] text-red-400 font-bold flex items-center gap-1">
                                            <span className="material-icons-round text-xs">info</span>
                                            Гомдлын агуулга заавал оруулна уу
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
                            <span className="font-bold text-gray-500">Анхны үйлчилгээний дүн</span>
                            <span className="font-black text-gray-800">{orderData.payment.total.toLocaleString()}₮</span>
                        </div>

                        {calculations.refundTotal > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-red-500 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Буцаалт хассан
                                </span>
                                <span className="font-black text-red-500">- {calculations.refundTotal.toLocaleString()}₮</span>
                            </div>
                        )}

                        <div className="flex justify-between text-xs pt-1 border-t border-gray-50">
                            <span className="font-bold text-gray-800 uppercase tracking-wider text-[10px]">Шинэчилсэн нийт дүн</span>
                            <span className="font-black text-[#5e2bff]">{calculations.newOrderTotal.toLocaleString()}₮</span>
                        </div>

                        <div className="flex justify-between text-xs mt-3">
                            <span className="font-bold text-gray-500">Урьдчилж төлсөн</span>
                            <span className="font-black text-green-600">- {orderData.payment.paid.toLocaleString()}₮</span>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 my-3"></div>

                        {calculations.currentPayment > 0 && (
                            <div className="bg-primary/5 rounded-xl p-3 border-2 border-primary/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-gray-600 uppercase">ТӨЛӨХ ДҮН</span>
                                    <span className="text-xl font-black text-primary">{calculations.currentPayment.toLocaleString()}₮</span>
                                </div>
                            </div>
                        )}

                        {calculations.refundToCustomer > 0 && (
                            <div className="bg-red-50 rounded-xl p-3 border-2 border-red-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-red-600 uppercase">БУЦААН ОЛГОХ</span>
                                    <span className="text-xl font-black text-red-600">{calculations.refundToCustomer.toLocaleString()}₮</span>
                                </div>
                            </div>
                        )}

                        {calculations.currentPayment === 0 && calculations.refundToCustomer === 0 && (
                            <div className="bg-gray-50 rounded-xl p-3 border-2 border-gray-200 text-center">
                                <span className="text-xs font-black text-gray-500 uppercase">Тооцоо дууссан (0₮)</span>
                            </div>
                        )}

                        {hasReorder && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 mt-3">
                                <p className="text-[10px] text-orange-700 font-bold flex items-start gap-1.5">
                                    <span className="material-icons-round text-xs mt-0.5">info</span>
                                    <span>Дахин захиалга сонгогдсон тул хувцас Гомдол/Ачилт руу шилжинэ.</span>
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
