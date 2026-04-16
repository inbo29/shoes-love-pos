import React from 'react';
import type { MockReceipt, ReceiptPaymentMethod, ReceiptStatus, RefundMethodKind } from '../../../../services/mockReceiptData';

interface Props {
    receipt: MockReceipt;
    onClose: () => void;
    onRefund?: () => void;
}

const paymentLabel: Record<ReceiptPaymentMethod, string> = {
    cash: 'Бэлэн',
    card: 'Карт',
    qpay: 'QPAY',
};

const statusLabel: Record<ReceiptStatus, string> = {
    completed: 'Борлуулалт хийгдсэн',
    refunded: 'Бүрэн буцаалттай',
    partial_refunded: 'Хэсэгчлэн буцаалттай',
};

const statusStyle: Record<ReceiptStatus, string> = {
    completed: 'bg-green-50 text-green-600 border-green-100',
    refunded: 'bg-red-50 text-red-600 border-red-100',
    partial_refunded: 'bg-orange-50 text-orange-600 border-orange-100',
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const refundMethodLabel: Record<RefundMethodKind, string> = {
    cash: 'Бэлэн',
    bank_transfer: 'Дансаар шилжүүлсэн',
};

const ReceiptDetailModal: React.FC<Props> = ({ receipt, onClose, onRefund }) => {
    const canRefund = receipt.status !== 'refunded' && !!onRefund;

    const refundedQtyByProduct: Record<string, number> = {};
    (receipt.refunds || []).forEach(rec => {
        rec.lines.forEach(ln => {
            refundedQtyByProduct[ln.productId] = (refundedQtyByProduct[ln.productId] || 0) + ln.quantity;
        });
    });
    const totalRefunded = (receipt.refunds || []).reduce((sum, r) => sum + r.totalAmount, 0);
    const netReceiptAmount = Math.max(0, receipt.totalAmount - totalRefunded);

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Баримтын дэлгэрэнгүй</h3>
                        <span className={`ml-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tight ${statusStyle[receipt.status]}`}>
                            {statusLabel[receipt.status]}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    {/* Receipt meta */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Баримтын №</p>
                            <p className="font-black text-[#40C1C7]">{receipt.receiptNo}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Огноо</p>
                            <p className="font-bold text-gray-800">{formatDate(receipt.soldAt)}</p>
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
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Утас</p>
                            <p className="font-bold text-gray-800">{receipt.customerPhone || '-'}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Төлсөн хэлбэр</p>
                            <p className="font-bold text-gray-800">{paymentLabel[receipt.paymentMethod]}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        <div className="px-4 py-3 bg-gray-100/60 flex text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <div className="flex-1">Барааны нэр</div>
                            <div className="w-[90px] text-right">Нэгж үнэ</div>
                            <div className="w-[60px] text-center">Тоо</div>
                            <div className="w-[110px] text-right">Дүн</div>
                        </div>
                        {receipt.items.map(it => {
                            const unit = it.salePrice ?? it.price;
                            const refundedQty = refundedQtyByProduct[it.productId] || 0;
                            const isFullyRefunded = refundedQty >= it.quantity;
                            const isPartiallyRefunded = refundedQty > 0 && !isFullyRefunded;
                            return (
                                <div key={it.productId} className={`flex px-4 py-3 border-t border-gray-100 text-xs items-center ${isFullyRefunded ? 'bg-red-50/40' : isPartiallyRefunded ? 'bg-orange-50/40' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-bold truncate ${isFullyRefunded ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{it.name}</p>
                                            {refundedQty > 0 && (
                                                <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tight ${isFullyRefunded ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                    {isFullyRefunded ? 'Буцаагдсан' : `Буцаалт ${refundedQty}`}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{it.productId}</p>
                                    </div>
                                    <div className="w-[90px] text-right">
                                        {it.salePrice != null && it.salePrice !== it.price ? (
                                            <div>
                                                <p className="text-[9px] text-gray-300 line-through">{it.price.toLocaleString()}₮</p>
                                                <p className="font-black text-gray-800">{it.salePrice.toLocaleString()}₮</p>
                                            </div>
                                        ) : (
                                            <p className="font-black text-gray-800">{unit.toLocaleString()}₮</p>
                                        )}
                                    </div>
                                    <div className="w-[60px] text-center">
                                        {refundedQty > 0 ? (
                                            <div className="font-bold text-gray-700 leading-tight">
                                                {it.quantity}
                                                <div className="text-[9px] text-red-500 font-black">−{refundedQty}</div>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-gray-700">{it.quantity}</span>
                                        )}
                                    </div>
                                    <div className="w-[110px] text-right font-black text-gray-900">{(unit * it.quantity).toLocaleString()}₮</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Анхны нийт дүн</span>
                            <span className="font-black text-gray-800">{receipt.totalAmount.toLocaleString()} ₮</span>
                        </div>
                        {totalRefunded > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Буцаагдсан дүн</span>
                                <span className="font-black text-red-500">− {totalRefunded.toLocaleString()} ₮</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                            <span className="font-black text-gray-800 uppercase tracking-widest text-[11px]">
                                {totalRefunded > 0 ? 'Үлдсэн дүн' : 'Нийт дүн'}
                            </span>
                            <span className="text-2xl font-black text-primary tracking-tighter leading-none">{netReceiptAmount.toLocaleString()} ₮</span>
                        </div>
                    </div>

                    {/* Refund history */}
                    {receipt.refunds && receipt.refunds.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-red-500 text-base">assignment_return</span>
                                <h4 className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Буцаалтын түүх</h4>
                            </div>
                            <div className="space-y-2">
                                {receipt.refunds.map(rec => (
                                    <div key={rec.reference} className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{rec.reference}</p>
                                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{formatDate(rec.refundedAt)} · {refundMethodLabel[rec.method]}</p>
                                            </div>
                                            <span className="text-sm font-black text-red-600">− {rec.totalAmount.toLocaleString()} ₮</span>
                                        </div>
                                        <div className="space-y-1 border-t border-red-100 pt-2">
                                            {rec.lines.map(ln => {
                                                const item = receipt.items.find(i => i.productId === ln.productId);
                                                return (
                                                    <div key={ln.productId} className="flex justify-between text-[11px]">
                                                        <span className="text-gray-700 font-medium truncate pr-2">{item?.name || ln.productId}</span>
                                                        <span className="shrink-0 text-gray-600 font-bold">×{ln.quantity} · {ln.amount.toLocaleString()}₮</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border-2 border-gray-100 bg-white text-gray-600 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Хаах
                    </button>
                    {canRefund && (
                        <button
                            onClick={onRefund}
                            className="px-6 py-3 rounded-xl bg-secondary text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-md shadow-secondary/30 active:scale-95 flex items-center gap-2"
                        >
                            <span className="material-icons-round text-base">assignment_return</span>
                            Буцаалт хийх
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetailModal;
