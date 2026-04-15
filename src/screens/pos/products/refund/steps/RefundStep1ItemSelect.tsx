import React from 'react';
import type { MockReceipt } from '../../../../../services/mockReceiptData';
import type { RefundItem } from '../refundTypes';
import { refundLineTotal, unitPrice } from '../refundTypes';
import RefundSummaryPanel from './RefundSummaryPanel';

interface Props {
    receipt: MockReceipt;
    refundItems: RefundItem[];
    onChange: (items: RefundItem[]) => void;
    totalRefundAmount: number;
}

const paymentLabel: Record<MockReceipt['paymentMethod'], string> = {
    cash: 'Бэлэн',
    card: 'Карт',
    qpay: 'QPAY',
};

const RefundStep1ItemSelect: React.FC<Props> = ({ receipt, refundItems, onChange, totalRefundAmount }) => {
    const toggleSelect = (productId: string) => {
        onChange(
            refundItems.map(i =>
                i.productId === productId ? { ...i, selected: !i.selected } : i
            )
        );
    };

    const changeQuantity = (productId: string, delta: number) => {
        onChange(
            refundItems.map(i => {
                if (i.productId !== productId) return i;
                const nextQty = Math.max(1, Math.min(i.originalQuantity, i.refundQuantity + delta));
                return { ...i, refundQuantity: nextQty };
            })
        );
    };

    const selectAll = () => {
        const allSelected = refundItems.every(i => i.selected);
        onChange(refundItems.map(i => ({ ...i, selected: !allSelected })));
    };

    const soldAt = new Date(receipt.soldAt);
    const soldAtStr = `${soldAt.getFullYear()}-${String(soldAt.getMonth() + 1).padStart(2, '0')}-${String(soldAt.getDate()).padStart(2, '0')} ${String(soldAt.getHours()).padStart(2, '0')}:${String(soldAt.getMinutes()).padStart(2, '0')}`;

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-3 md:p-6 gap-4">
                {/* Receipt Info Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight">Баримтын мэдээлэл</h1>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Баримтын №</p>
                            <p className="font-black text-[#40C1C7]">{receipt.receiptNo}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Огноо</p>
                            <p className="font-bold text-gray-800">{soldAtStr}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Салбар</p>
                            <p className="font-bold text-gray-800">{receipt.branch}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Ажилтан</p>
                            <p className="font-bold text-gray-800">{receipt.cashier}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Төлсөн хэлбэр</p>
                            <p className="font-bold text-gray-800">{paymentLabel[receipt.paymentMethod]}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Нийт дүн</p>
                            <p className="font-black text-gray-800">{receipt.totalAmount.toLocaleString()} ₮</p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-[#40C1C7]">assignment_return</span>
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tight">Буцаах бараа сонгох</h2>
                        </div>
                        <button
                            onClick={selectAll}
                            className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
                        >
                            {refundItems.every(i => i.selected) ? 'Бүгдийг болиулах' : 'Бүгдийг сонгох'}
                        </button>
                    </div>

                    <div className="overflow-y-auto no-scrollbar flex-1">
                        <div className="sticky top-0 bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <div className="w-8 shrink-0"></div>
                            <div className="flex-1 min-w-0">Барааны нэр</div>
                            <div className="w-[100px] shrink-0 text-right">Нэгж үнэ</div>
                            <div className="w-[70px] shrink-0 text-center">Зарсан</div>
                            <div className="w-[140px] shrink-0 text-center">Буцаах тоо</div>
                            <div className="w-[110px] shrink-0 text-right">Дүн</div>
                        </div>

                        {refundItems.map(item => (
                            <div
                                key={item.productId}
                                className={`px-5 py-4 border-b border-gray-50 flex items-center text-xs transition-colors ${item.selected ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                            >
                                <div className="w-8 shrink-0">
                                    <label className="cursor-pointer group flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => toggleSelect(item.productId)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${item.selected ? 'border-secondary bg-secondary' : 'border-gray-200 bg-white group-hover:border-secondary/50'}`}>
                                            {item.selected && <span className="material-icons-round text-gray-900 text-[14px]">done</span>}
                                        </div>
                                    </label>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{item.productId}</p>
                                </div>
                                <div className="w-[100px] shrink-0 text-right">
                                    {item.salePrice != null && item.salePrice !== item.price ? (
                                        <div>
                                            <p className="text-[10px] text-gray-300 line-through">{item.price.toLocaleString()}₮</p>
                                            <p className="font-black text-gray-800">{item.salePrice.toLocaleString()}₮</p>
                                        </div>
                                    ) : (
                                        <p className="font-black text-gray-800">{unitPrice(item).toLocaleString()}₮</p>
                                    )}
                                </div>
                                <div className="w-[70px] shrink-0 text-center font-bold text-gray-500">{item.originalQuantity}</div>
                                <div className="w-[140px] shrink-0 flex items-center justify-center gap-2">
                                    <button
                                        disabled={!item.selected || item.refundQuantity <= 1}
                                        onClick={() => changeQuantity(item.productId, -1)}
                                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold disabled:opacity-30 hover:bg-gray-200 transition active:scale-95"
                                    >−</button>
                                    <span className="w-8 text-center font-black text-gray-800">{item.selected ? item.refundQuantity : 0}</span>
                                    <button
                                        disabled={!item.selected || item.refundQuantity >= item.originalQuantity}
                                        onClick={() => changeQuantity(item.productId, 1)}
                                        className="w-7 h-7 rounded-full bg-secondary text-gray-900 font-bold disabled:opacity-30 hover:bg-yellow-400 transition active:scale-95"
                                    >+</button>
                                </div>
                                <div className="w-[110px] shrink-0 text-right font-black text-gray-900">
                                    {item.selected ? refundLineTotal(item).toLocaleString() : 0}₮
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <RefundSummaryPanel refundItems={refundItems} totalRefundAmount={totalRefundAmount} />
        </div>
    );
};

export default RefundStep1ItemSelect;
