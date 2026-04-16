import React, { useState } from 'react';
import type { MockReceipt } from '../../../../../services/mockReceiptData';
import type { BankTransferInfo, RefundItem, RefundMethod } from '../refundTypes';
import RefundSummaryPanel from './RefundSummaryPanel';

interface Props {
    receipt: MockReceipt;
    refundItems: RefundItem[];
    totalRefundAmount: number;
    method: RefundMethod;
    bankInfo: BankTransferInfo;
    refundReference: string;
}

const RefundStep3Complete: React.FC<Props> = ({ receipt, refundItems, totalRefundAmount, method, bankInfo, refundReference }) => {
    const [printed, setPrinted] = useState(false);
    const netReceiptAmount = Math.max(0, receipt.totalAmount - totalRefundAmount);
    const isFullRefund = netReceiptAmount === 0;

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
                <div className="bg-green-50 rounded-3xl border border-green-100 shadow-sm p-10 max-w-xl w-full flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
                        <span className="material-icons-round text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 uppercase mb-3 tracking-tight">
                        Буцаалт амжилттай бүртгэгдлээ
                    </h2>

                    {method === 'cash' ? (
                        <p className="text-gray-600 text-sm font-bold mb-6 max-w-md leading-relaxed">
                            Кассаас <span className="text-green-700 font-black">{totalRefundAmount.toLocaleString()}₮</span> буцаан олгогдлоо.
                        </p>
                    ) : (
                        <div className="text-gray-600 text-sm font-bold mb-6 max-w-md leading-relaxed space-y-2">
                            <p>Үйлчилгээний төвд илгээгдлээ.</p>
                            <p className="text-blue-600">2-3 ажлын өдрийн дотор дансаар шилжүүлнэ.</p>
                        </div>
                    )}

                    <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 space-y-3 mb-6 text-left">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Бүртгэлийн №</span>
                            <span className="font-black text-gray-800">{refundReference}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Буцаалтын хэлбэр</span>
                            <span className="font-black text-gray-800">
                                {method === 'cash' ? 'Бэлэн' : 'Дансаар шилжүүлэх'}
                            </span>
                        </div>
                        {method === 'bank_transfer' && (
                            <>
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Данс</span>
                                    <span className="font-black text-gray-800">{bankInfo.accountNumber}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[10px]">Утас</span>
                                    <span className="font-black text-gray-800">{bankInfo.phone}</span>
                                </div>
                            </>
                        )}
                        <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                            <span className="font-black text-gray-800 uppercase tracking-widest text-[10px]">
                                Шинэ баримтын дүн
                            </span>
                            <span className="text-xl font-black text-primary tracking-tighter">{netReceiptAmount.toLocaleString()} ₮</span>
                        </div>
                    </div>

                    {isFullRefund ? (
                        <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span className="material-icons-round text-base">info</span>
                            Бүрэн буцаалт тул шинэ баримт хэвлэгдэхгүй
                        </div>
                    ) : !printed ? (
                        <button
                            onClick={() => setPrinted(true)}
                            className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-800 hover:bg-gray-50 transition-all shadow-md active:scale-95 group"
                        >
                            <span className="material-icons-round text-lg group-hover:rotate-12 transition-transform">print</span>
                            Шинэ баримт хэвлэх
                        </button>
                    ) : (
                        <p className="text-[10px] text-green-700 font-bold mt-3 uppercase tracking-widest">
                            Баримт хэвлэгдлээ
                        </p>
                    )}
                </div>
            </div>

            <RefundSummaryPanel refundItems={refundItems} totalRefundAmount={totalRefundAmount} title="Буцаалтын дэлгэрэнгүй" />
        </div>
    );
};

export default RefundStep3Complete;
