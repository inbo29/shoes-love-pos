import React, { useState } from 'react';
import type { ReceiveOrder, ItemDecision } from '../receiveTypes';

interface Props {
    orderData: ReceiveOrder;
    itemDecisions: ItemDecision[];
    hasReorder: boolean;
    onGomdolReorder: () => void;
}

const EMOJI_OPTIONS = [
    { emoji: '😡', label: 'Маш муу' },
    { emoji: '😞', label: 'Муу' },
    { emoji: '😐', label: 'Дунд' },
    { emoji: '😊', label: 'Сайн' },
    { emoji: '🥰', label: 'Маш сайн' },
];

const ReceiveStep4Complete: React.FC<Props> = ({
    orderData,
    itemDecisions,
    hasReorder,
    onGomdolReorder
}) => {
    const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
    const [feedback, setFeedback] = useState('');
    const [wantReservice, setWantReservice] = useState(false);
    const [showReceiptPrinted, setShowReceiptPrinted] = useState(false);

    const receiveItems = itemDecisions.filter(d => d.action === 'receive');
    const refundItems = itemDecisions.filter(d => d.action === 'complaint' && d.resolution === 'refund');
    const reorderItems = itemDecisions.filter(d => d.action === 'complaint' && d.resolution === 'reorder');

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] gap-0 overflow-hidden">
            {/* LEFT: Survey */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-3 md:p-5">
                {/* Survey Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg mx-auto w-full">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                            <span className="material-icons-round text-3xl">sentiment_satisfied</span>
                        </div>
                        <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Сэтгэл ханамжийн санал асуулга</h2>
                        <p className="text-xs text-gray-400 font-bold mt-1">Үйлчилгээ болон гүйцэтгэлд өгөх үнэлгээ</p>
                    </div>

                    {/* Emoji Rating */}
                    <div className="flex justify-center gap-3 mb-6">
                        {EMOJI_OPTIONS.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedEmoji(idx)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${selectedEmoji === idx
                                    ? 'bg-primary/10 scale-110 shadow-md'
                                    : 'hover:bg-gray-50 hover:scale-105'
                                    }`}
                            >
                                <span className="text-3xl">{opt.emoji}</span>
                                <span className={`text-[8px] font-black uppercase tracking-wider ${selectedEmoji === idx ? 'text-primary' : 'text-gray-400'}`}>
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Reservice */}
                    <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                        <div className="relative flex items-center">
                            <input type="checkbox" checked={wantReservice} onChange={e => setWantReservice(e.target.checked)} className="sr-only" />
                            <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${wantReservice ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}>
                                {wantReservice && <span className="material-icons-round text-white text-[14px]">done</span>}
                            </div>
                        </div>
                        <span className="text-xs font-bold text-gray-700">Дахин үйлчилгээ авах хүсэлтэй байна</span>
                    </label>

                    {/* Feedback */}
                    <textarea
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        placeholder="Санал хүсэлт (сонголтоор)..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-primary resize-none transition-all"
                        rows={3}
                        maxLength={200}
                    />
                    <div className="text-right text-[9px] text-gray-300 mt-1 font-bold">{feedback.length}/200</div>
                </div>

                {/* Processing Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-lg mx-auto w-full mt-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Боловсруулалтын хураангуй</span>

                    {receiveItems.length > 0 && (
                        <div className="mt-3 space-y-1">
                            <span className="text-[9px] font-bold text-green-600 uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Хүлээн авсан ({receiveItems.length})
                            </span>
                            {receiveItems.map(d => {
                                const item = orderData.items.find(i => i.id === d.itemId);
                                return item ? (
                                    <p key={d.itemId} className="text-[10px] font-bold text-gray-600 pl-3">{item.name}</p>
                                ) : null;
                            })}
                        </div>
                    )}

                    {refundItems.length > 0 && (
                        <div className="mt-3 space-y-1">
                            <span className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Буцаалт ({refundItems.length})
                            </span>
                            {refundItems.map(d => {
                                const item = orderData.items.find(i => i.id === d.itemId);
                                return item ? (
                                    <p key={d.itemId} className="text-[10px] font-bold text-gray-600 pl-3">{item.name}</p>
                                ) : null;
                            })}
                        </div>
                    )}

                    {reorderItems.length > 0 && (
                        <div className="mt-3 space-y-1">
                            <span className="text-[9px] font-bold text-orange-600 uppercase flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Дахин захиалга ({reorderItems.length})
                            </span>
                            {reorderItems.map(d => {
                                const item = orderData.items.find(i => i.id === d.itemId);
                                return item ? (
                                    <p key={d.itemId} className="text-[10px] font-bold text-gray-600 pl-3">{item.name}</p>
                                ) : null;
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                        <div className="h-7 w-1.5 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Захиалгын мэдээлэл</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">Захиалгын №</span>
                            <span className="font-black text-primary">{orderData.id}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">Нийт дүн</span>
                            <span className="font-black text-gray-800">{orderData.payment.total.toLocaleString()}₮</span>
                        </div>
                    </div>

                    {/* Receipt Print */}
                    <button
                        onClick={() => setShowReceiptPrinted(true)}
                        className={`w-full mt-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${showReceiptPrinted
                            ? 'bg-gray-100 text-gray-400 border border-gray-200'
                            : 'bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm'
                            }`}
                    >
                        <span className="material-icons-round text-lg">{showReceiptPrinted ? 'check_circle' : 'print'}</span>
                        {showReceiptPrinted ? 'Баримт хэвлэгдсэн' : 'Төлбөрийн баримт хэвлэх'}
                    </button>

                    {/* Reorder Button (conditional) */}
                    {hasReorder && (
                        <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                            <div className="flex items-center gap-2 text-orange-600 mb-2">
                                <span className="material-icons-round text-sm">warning</span>
                                <span className="text-[10px] font-black uppercase">Дахин захиалга</span>
                            </div>
                            <p className="text-[9px] text-orange-700 font-bold mb-3">
                                Төлбөргүй дахин илгээх буй захиалга үүсгэнэ.
                            </p>
                            <button
                                onClick={onGomdolReorder}
                                className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round text-sm">replay</span>
                                Дахин захиалга үүсгэх
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceiveStep4Complete;
