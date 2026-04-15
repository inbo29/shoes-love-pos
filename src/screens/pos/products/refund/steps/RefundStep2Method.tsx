import React from 'react';
import type { BankTransferInfo, RefundItem, RefundMethod } from '../refundTypes';
import RefundSummaryPanel from './RefundSummaryPanel';

interface Props {
    refundItems: RefundItem[];
    totalRefundAmount: number;
    method: RefundMethod;
    onMethodChange: (m: RefundMethod) => void;
    bankInfo: BankTransferInfo;
    onBankInfoChange: (info: BankTransferInfo) => void;
}

const METHODS: { id: RefundMethod; label: string; sub: string; icon: string; color: string }[] = [
    { id: 'cash', label: 'Бэлэн', sub: 'Кассаас шууд буцаан олгоно', icon: 'payments', color: 'bg-green-500' },
    { id: 'bank_transfer', label: 'Дансаар шилжүүлэх', sub: 'Үйлчилгээний төвөөс 2-3 хоногийн дотор', icon: 'account_balance', color: 'bg-blue-500' },
];

const RefundStep2Method: React.FC<Props> = ({
    refundItems,
    totalRefundAmount,
    method,
    onMethodChange,
    bankInfo,
    onBankInfoChange,
}) => {
    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-3 md:p-6 gap-5">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight">Буцаалтын хэлбэр сонгох</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {METHODS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => onMethodChange(m.id)}
                            className={`p-5 rounded-2xl border-2 transition-all flex items-start gap-4 text-left relative ${method === m.id
                                ? 'border-secondary bg-secondary/5 shadow-md'
                                : 'border-gray-100 bg-white hover:border-secondary/30 hover:shadow-sm'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${m.color} shrink-0`}>
                                <span className="material-icons-round text-xl">{m.icon}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{m.label}</p>
                                <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">{m.sub}</p>
                            </div>
                            {method === m.id && (
                                <span className="material-icons-round text-secondary absolute top-3 right-3">check_circle</span>
                            )}
                        </button>
                    ))}
                </div>

                {method === 'cash' ? (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                            <span className="material-icons-round text-3xl">payments</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Кассаас гаргах дүн</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{totalRefundAmount.toLocaleString()} ₮</p>
                        <p className="text-xs text-gray-500 font-medium mt-4 max-w-md">
                            Дараагийн алхамд орж баталгаажуулсны дараа кассаас дээрх дүнг бэлнээр буцаан олгоно.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                            <span className="material-icons-round text-blue-500 shrink-0">info</span>
                            <div className="text-xs text-blue-700 font-medium leading-relaxed">
                                Дансаар шилжүүлэг нь <b>үйлчилгээний төвөөс 2-3 ажлын өдрийн дотор</b> гүйцэтгэгдэнэ.
                                Хэрэв яаралтай бол бэлэн хэлбэрийг сонгоно уу.
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Дансны дугаар *</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={bankInfo.accountNumber}
                                onChange={e => onBankInfoChange({ ...bankInfo, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                                placeholder="Жишээ: 5001234567"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-800 tracking-wider"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Утасны дугаар *</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={8}
                                value={bankInfo.phone}
                                onChange={e => onBankInfoChange({ ...bankInfo, phone: e.target.value.replace(/[^0-9]/g, '') })}
                                placeholder="8 оронтой дугаар"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-800 tracking-wider"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Тэмдэглэл</label>
                            <textarea
                                rows={3}
                                value={bankInfo.memo || ''}
                                onChange={e => onBankInfoChange({ ...bankInfo, memo: e.target.value })}
                                placeholder="Буцаалтын шалтгаан, нэмэлт мэдээлэл..."
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-all text-sm text-gray-800 resize-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            <RefundSummaryPanel refundItems={refundItems} totalRefundAmount={totalRefundAmount} title="Буцаалтын тооцоо" />
        </div>
    );
};

export default RefundStep2Method;
