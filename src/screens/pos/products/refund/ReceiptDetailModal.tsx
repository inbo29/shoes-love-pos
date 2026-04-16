import React from 'react';
import type { MockReceipt, ReceiptPaymentMethod, ReceiptStatus } from '../../../../services/mockReceiptData';

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

const ReceiptDetailModal: React.FC<Props> = ({ receipt, onClose, onRefund }) => {
    const canRefund = receipt.status !== 'refunded' && !!onRefund;

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
                            return (
                                <div key={it.productId} className="flex px-4 py-3 border-t border-gray-100 text-xs items-center">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 truncate">{it.name}</p>
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
                                    <div className="w-[60px] text-center font-bold text-gray-700">{it.quantity}</div>
                                    <div className="w-[110px] text-right font-black text-gray-900">{(unit * it.quantity).toLocaleString()}₮</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-end pt-2">
                        <span className="font-black text-gray-800 uppercase tracking-widest text-[11px]">Нийт дүн</span>
                        <span className="text-2xl font-black text-primary tracking-tighter leading-none">{receipt.totalAmount.toLocaleString()} ₮</span>
                    </div>

                    {receipt.status !== 'completed' && (
                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-3 text-xs">
                            <span className="material-icons-round text-orange-500 shrink-0">info</span>
                            <div className="text-orange-700 font-medium leading-relaxed">
                                {receipt.status === 'refunded'
                                    ? 'Энэхүү баримт дээрх бүх бараа буцаагдсан байна.'
                                    : 'Энэхүү баримт дээр хэсэгчилсэн буцаалт хийгдсэн байна.'}
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
