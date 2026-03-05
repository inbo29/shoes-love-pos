import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    getTransfers,
    updateTransferStatus,
    Transfer,
} from '../../../../services/mockTransferData';

const CURRENT_BRANCH = 'Салбар 1'; // In production this comes from auth context

const TransferReceiveScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialTransfer = useMemo(() => {
        if (location.state?.transferId) {
            return getTransfers().find(t => t.id === location.state.transferId) || null;
        }
        return null;
    }, [location.state?.transferId]);

    const [step, setStep] = useState<1 | 2>(initialTransfer ? 2 : 1);
    const [transfers, setTransfers] = useState<Transfer[]>(() => getTransfers());
    const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(initialTransfer);
    const [receiptQuantities, setReceiptQuantities] = useState<Record<string, number>>(() => {
        if (initialTransfer) {
            const init: Record<string, number> = {};
            initialTransfer.items.forEach(item => { init[item.productId] = item.sentQty; });
            return init;
        }
        return {};
    });
    const [receiptRemarks, setReceiptRemarks] = useState('');
    const [isDone, setIsDone] = useState(false);

    // Only Шилжүүлсэн → current branch
    const eligibleTransfers = useMemo(
        () => transfers.filter(t => t.status === 'Шилжүүлсэн' && t.toBranch === CURRENT_BRANCH),
        [transfers]
    );

    const handleSelect = (transfer: Transfer) => {
        setSelectedTransfer(transfer);
        const init: Record<string, number> = {};
        transfer.items.forEach(item => { init[item.productId] = item.sentQty; });
        setReceiptQuantities(init);
        setReceiptRemarks('');
        setStep(2);
    };

    const handleQtyDelta = (productId: string, delta: number, max: number) => {
        setReceiptQuantities(prev => ({
            ...prev,
            [productId]: Math.min(max, Math.max(0, (prev[productId] ?? 0) + delta)),
        }));
    };

    const handleQtyInput = (productId: string, val: string, max: number) => {
        setReceiptQuantities(prev => ({
            ...prev,
            [productId]: Math.min(max, Math.max(0, parseInt(val) || 0)),
        }));
    };

    const handleConfirm = () => {
        if (!selectedTransfer) return;
        updateTransferStatus(selectedTransfer.id, 'Хүлээн авсан', {
            receivedQuantities: receiptQuantities,
            receiptRemarks,
        });
        setTransfers(getTransfers());
        setIsDone(true);
    };

    const receiptTotal = useMemo(() => {
        if (!selectedTransfer) return 0;
        return selectedTransfer.items.reduce((sum, item) => sum + (receiptQuantities[item.productId] ?? item.sentQty), 0);
    }, [selectedTransfer, receiptQuantities]);

    // ── Shared header ───────────────────────────────────────────
    const renderHeader = () => (
        <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        if (step === 2 && !location.state?.transferId) setStep(1);
                        else navigate('/pos/transfer');
                    }}
                    className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div>
                    <h3 className="text-lg font-black text-gray-800">Бараа хүлээн авах</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {step === 1 ? 'Шилжүүлэг сонгох' : 'Хүлээн авах бүртгэх'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {[1, 2].map(s => (
                    <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === s ? 'bg-[#FFD400] text-gray-900 scale-110 shadow-lg shadow-yellow-200'
                        : step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                        {step > s ? <span className="material-icons-round text-sm">check</span> : s}
                    </div>
                ))}
            </div>
        </div>
    );

    // ── Success ─────────────────────────────────────────────────
    if (isDone) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
                <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-sm w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <span className="material-icons-round text-6xl text-green-500">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase mb-4">Хүлээн авалт бүртгэгдлээ</h3>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed mb-10">
                        Бараа амжилттай хүлээн авагдлаа.<br />Нөөцөд нэмэгдлээ.
                    </p>
                    <button
                        onClick={() => navigate('/pos/transfer')}
                        className="w-full py-5 bg-[#FFD400] text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#FFC400] active:scale-95 transition-all"
                    >
                        Жагсаалт руу буцах
                    </button>
                </div>
            </div>
        );
    }

    // ── Step 1: Select transfer ─────────────────────────────────
    if (step === 1) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                {renderHeader()}

                <div className="shrink-0 mx-6 mt-5 flex items-center gap-3 px-5 py-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                        <span className="material-icons-round text-green-500">local_shipping</span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-green-700">ХҮЛЭЭН АВАХ</p>
                        <p className="text-[11px] font-bold text-green-500">
                            {CURRENT_BRANCH} руу ирсэн шилжүүлгийг хүлээн авна уу
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 flex flex-col gap-4">
                    {eligibleTransfers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                            <span className="material-icons-round text-6xl mb-4 opacity-30">local_shipping</span>
                            <p className="font-bold text-lg">Хүлээн авах шилжүүлэг байхгүй</p>
                            <p className="text-xs font-bold mt-1 text-gray-400">Шилжүүлсэн барааны TO = {CURRENT_BRANCH} байх ёстой</p>
                        </div>
                    ) : eligibleTransfers.map(t => (
                        <div
                            key={t.id}
                            onClick={() => handleSelect(t)}
                            className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group px-6 py-5 flex items-center gap-5"
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                                <span className="material-icons-round text-green-400">swap_horiz</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[14px] font-extrabold text-[#40C1C7] group-hover:underline">{t.id}</span>
                                    <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-blue-100 text-blue-600 border border-blue-200">
                                        Шилжүүлсэн
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{t.fromBranch}</span>
                                    <span className="material-icons-round text-[12px]">east</span>
                                    <span className="text-green-500">{t.toBranch}</span>
                                    <span className="text-gray-300">•</span>
                                    <span>{t.date}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 shrink-0">
                                <div className="text-center hidden sm:block">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт тоо</p>
                                    <p className="text-[15px] font-black text-gray-800">{t.totalQty} ш</p>
                                </div>
                                <button
                                    onClick={e => { e.stopPropagation(); handleSelect(t); }}
                                    className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                >
                                    Сонгох
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Step 2: Process receiving ───────────────────────────────
    if (!selectedTransfer) return null;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            {renderHeader()}

            <div className="shrink-0 mx-6 mt-4 flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="material-icons-round text-amber-400 text-base">info</span>
                <p className="text-[11px] font-bold text-amber-600">
                    Хүлээн авах тоог засах боломжтой. Барааны мэдээллийг өөрчилж болохгүй.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col gap-5">

                {/* Meta card */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Шилжүүлэх №</p>
                        <p className="text-[13px] font-black text-[#40C1C7]">{selectedTransfer.id}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаанаас</p>
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-[13px] text-gray-400">logout</span>
                            <p className="text-[13px] font-bold text-gray-800">{selectedTransfer.fromBranch}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаашаа</p>
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-[13px] text-green-500">login</span>
                            <p className="text-[13px] font-bold text-green-600">{selectedTransfer.toBranch}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Огноо</p>
                        <p className="text-[13px] font-bold text-gray-800">{selectedTransfer.date}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex-1">Бараа</div>
                        <div className="w-[100px] text-center">Илгээсэн</div>
                        <div className="w-[160px] text-center">Хүлээн авах</div>
                    </div>
                    <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '320px' }}>
                        {selectedTransfer.items.map(item => {
                            const qty = receiptQuantities[item.productId] ?? item.sentQty;
                            return (
                                <div key={item.productId} className="px-6 py-4 border-b border-gray-50 flex items-center">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-gray-800 truncate">{item.productName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.productCode}</p>
                                    </div>
                                    <div className="w-[100px] text-center">
                                        <p className="text-[13px] font-black text-gray-900">{item.sentQty}</p>
                                    </div>
                                    <div className="w-[160px] flex items-center justify-center">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                                            <button onClick={() => handleQtyDelta(item.productId, -1, item.sentQty)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95">
                                                <span className="material-icons-round text-sm">remove</span>
                                            </button>
                                            <input
                                                type="number" min={0} max={item.sentQty} value={qty}
                                                onChange={e => handleQtyInput(item.productId, e.target.value, item.sentQty)}
                                                className="w-20 px-1 text-center font-black text-green-600 bg-transparent focus:outline-none text-sm"
                                            />
                                            <button onClick={() => handleQtyDelta(item.productId, 1, item.sentQty)} className="w-8 h-8 rounded-xl bg-green-500 text-white shadow-sm flex items-center justify-center hover:bg-green-600 active:scale-95">
                                                <span className="material-icons-round text-sm">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Нийт хүлээн авах ширхэг</p>
                        <p className="text-lg font-black text-green-600">{receiptTotal} ш</p>
                    </div>
                </div>

                {/* Remarks */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-icons-round text-sm">notes</span>Хүлээн авалтын тайлбар
                    </label>
                    <textarea
                        value={receiptRemarks} onChange={e => setReceiptRemarks(e.target.value)} rows={3}
                        placeholder="Бараа шалгасан тэмдэглэл…"
                        className="w-full resize-none rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 font-medium"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
                <div className="text-[11px] font-bold text-gray-400">
                    <span className="font-black text-gray-700">{selectedTransfer.id}</span> • {selectedTransfer.items.length} нэр төрөл
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => location.state?.transferId ? navigate('/pos/transfer') : setStep(1)}
                        className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-[11px] tracking-wider border border-gray-100"
                    >
                        Буцах
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-icons-round text-base">check_circle</span>
                        Хүлээн авах бүртгэх
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferReceiveScreen;
