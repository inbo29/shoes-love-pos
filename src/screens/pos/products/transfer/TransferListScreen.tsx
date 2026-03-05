import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import {
    getTransfers,
    addTransfer,
    updateTransferStatus,
    Transfer,
    TransferStatus,
} from '../../../../services/mockTransferData';
import { mockProducts, Product } from '../../../../services/mockProductData';

// ─── Types ────────────────────────────────────────────────────────
type ViewMode = 'LIST' | 'CREATE' | 'DETAIL' | 'DETAIL_RECEIVE';

interface SelectedTransferProduct {
    productId: string;
    productCode: string;
    productName: string;
    sentQty: number;
}

const CURRENT_BRANCH = 'Салбар 1'; // from auth context in production

const BRANCH_CHOICES = ['Төв салбар', 'Салбар 1', 'Салбар 2'];

// ─── Helpers ──────────────────────────────────────────────────────
const getStatusColor = (status: TransferStatus) => {
    switch (status) {
        case 'Бэлтгэж байна': return 'bg-gray-100 text-gray-500 border-gray-200';
        case 'Шилжүүлсэн': return 'bg-blue-50 text-blue-500 border-blue-100';
        case 'Хүлээн авсан': return 'bg-green-50 text-green-600 border-green-100';
        case 'Цуцалсан': return 'bg-red-50 text-red-500 border-red-100';
        default: return 'bg-gray-50 text-gray-400 border-gray-100';
    }
};

// ══════════════════════════════════════════════════════════════════
const TransferListScreen: React.FC = () => {
    const navigate = useNavigate();

    // ─── View state ────────────────────────────────────────
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [activeTransfer, setActiveTransfer] = useState<Transfer | null>(null);

    // ─── List filters ──────────────────────────────────────
    const [searchNo, setSearchNo] = useState('');
    const [searchFrom, setSearchFrom] = useState('all');
    const [searchTo, setSearchTo] = useState('all');
    const [searchStatus, setSearchStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // ─── Create flow state ─────────────────────────────────
    const [createStep, setCreateStep] = useState(1);
    const [createDone, setCreateDone] = useState(false);
    const [createdId, setCreatedId] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedTransferProduct[]>([]);
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [fromBranch, setFromBranch] = useState(CURRENT_BRANCH);
    const [toBranch, setToBranch] = useState('');
    const [transferRemarks, setTransferRemarks] = useState('');

    // ─── Detail receive state ──────────────────────────────
    const [receiptQuantities, setReceiptQuantities] = useState<Record<string, number>>({});
    const [receiptRemarks, setReceiptRemarks] = useState('');

    // ─── Runtime transfer list ─────────────────────────────
    const [transfers, setTransfers] = useState<Transfer[]>(() => getTransfers());

    const resetCreate = () => {
        setCreateStep(1);
        setCreateDone(false);
        setCreatedId('');
        setSelectedProducts([]);
        setProductSearchQuery('');
        setFromBranch(CURRENT_BRANCH);
        setToBranch('');
        setTransferRemarks('');
    };

    // ─── Filter options ────────────────────────────────────
    const statusOptions = [
        { label: 'Бүх төлөв', value: 'all' },
        { label: 'Бэлтгэж байна', value: 'Бэлтгэж байна' },
        { label: 'Шилжүүлсэн', value: 'Шилжүүлсэн' },
        { label: 'Хүлээн авсан', value: 'Хүлээн авсан' },
        { label: 'Цуцалсан', value: 'Цуцалсан' },
    ];

    const branchOptions = [
        { label: 'Бүх салбар', value: 'all' },
        ...BRANCH_CHOICES.map(b => ({ label: b, value: b })),
    ];

    // ─── Filtered list ─────────────────────────────────────
    const filteredTransfers = useMemo(() => {
        return transfers.filter(t => {
            const matchNo = t.id.toLowerCase().includes(searchNo.toLowerCase());
            const matchFrom = searchFrom === 'all' || t.fromBranch === searchFrom;
            const matchTo = searchTo === 'all' || t.toBranch === searchTo;
            const matchStatus = searchStatus === 'all' || t.status === searchStatus;
            return matchNo && matchFrom && matchTo && matchStatus;
        });
    }, [transfers, searchNo, searchFrom, searchTo, searchStatus]);

    // ─── Product grid for Create Step 1 ───────────────────
    const filteredProductGrid = useMemo(() => {
        if (!productSearchQuery) return mockProducts;
        const q = productSearchQuery.toLowerCase();
        return mockProducts.filter(p =>
            p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
        );
    }, [productSearchQuery]);

    const handleProductQtyChange = (product: Product, delta: number) => {
        const existing = selectedProducts.find(p => p.productId === product.id);
        const newQty = Math.max(0, (existing?.sentQty ?? 0) + delta);
        if (newQty === 0) {
            setSelectedProducts(prev => prev.filter(p => p.productId !== product.id));
        } else if (existing) {
            setSelectedProducts(prev => prev.map(p =>
                p.productId === product.id ? { ...p, sentQty: newQty } : p
            ));
        } else {
            setSelectedProducts(prev => [...prev, {
                productId: product.id, productCode: product.id,
                productName: product.name, sentQty: newQty,
            }]);
        }
    };

    // ─── Confirm create ────────────────────────────────────
    const handleCreateConfirm = () => {
        const newId = `TR-${Date.now().toString().slice(-5)}`;
        const newTransfer: Transfer = {
            id: newId,
            date: new Date().toISOString().split('T')[0],
            fromBranch,
            toBranch,
            totalQty: selectedProducts.reduce((s, p) => s + p.sentQty, 0),
            totalItems: selectedProducts.length,
            type: 'Хийх',
            status: 'Шилжүүлсэн',
            staff: 'Ажилтан',
            remarks: transferRemarks,
            items: selectedProducts.map(p => ({
                productId: p.productId,
                productCode: p.productCode,
                productName: p.productName,
                sentQty: p.sentQty,
                receivedQty: 0,
            })),
        };
        addTransfer(newTransfer);
        setTransfers(getTransfers());
        setCreatedId(newId);
        setCreateDone(true);
    };

    // ─── Detail receive helpers ────────────────────────────
    const openDetailReceive = (transfer: Transfer) => {
        setActiveTransfer(transfer);
        const init: Record<string, number> = {};
        transfer.items.forEach(item => { init[item.productId] = item.sentQty; });
        setReceiptQuantities(init);
        setReceiptRemarks('');
        setViewMode('DETAIL_RECEIVE');
    };

    const handleReceiveConfirm = () => {
        if (!activeTransfer) return;
        updateTransferStatus(activeTransfer.id, 'Хүлээн авсан', {
            receivedQuantities: receiptQuantities,
            receiptRemarks,
        });
        setTransfers(getTransfers());
        setViewMode('LIST');
    };

    const handleQtyDelta = (productId: string, delta: number, max: number) => {
        setReceiptQuantities(prev => ({
            ...prev,
            [productId]: Math.min(max, Math.max(0, (prev[productId] ?? 0) + delta)),
        }));
    };

    // ════════════════════════════════════════════════════════
    //  CREATE FLOW
    // ════════════════════════════════════════════════════════
    if (viewMode === 'CREATE') {

        // ── Success screen after create confirm ──
        if (createDone) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
                    <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-sm w-full">
                        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="material-icons-round text-6xl text-[#40C1C7]">check_circle</span>
                        </div>
                        <p className="text-[10px] font-black text-[#40C1C7] uppercase tracking-[0.3em] mb-3">{createdId}</p>
                        <h3 className="text-2xl font-black text-gray-800 uppercase mb-4">Шилжүүлэг үүсгэлээ</h3>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed mb-10">
                            Бараа амжилттай шилжүүлэгт бүртгэгдлээ.<br />Хүлээн авах салбарт мэдэгдлэ.
                        </p>
                        <button
                            onClick={() => { resetCreate(); setViewMode('LIST'); }}
                            className="w-full py-5 bg-[#40C1C7] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-[#36adb3] active:scale-95 transition-all"
                        >
                            Жагсаалт руу буцах
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                {/* Header + stepper */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { resetCreate(); setViewMode('LIST'); }}
                            className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <div>
                            <h3 className="text-lg font-black text-gray-800">Шилжүүлэг үүсгэх</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {createStep === 1 ? 'Бараа сонгох' : createStep === 2 ? 'Маршрут & Тайлбар' : 'Баталгаажуулах'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${createStep === s ? 'bg-[#40C1C7] text-white scale-110 shadow-lg shadow-teal-200'
                                : createStep > s ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                {createStep > s ? <span className="material-icons-round text-sm">check</span> : s}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Step 1: Product selection ── */}
                {createStep === 1 && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="shrink-0 px-6 pt-5 pb-3 flex items-center gap-3">
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                                    <span className="material-icons-round">search</span>
                                </span>
                                <input
                                    type="text" value={productSearchQuery} onChange={e => setProductSearchQuery(e.target.value)}
                                    placeholder="Бараа хайх (нэр, код)…"
                                    className="w-full h-12 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#40C1C7] transition-all"
                                />
                            </div>
                            <div className="h-12 px-5 bg-teal-50 rounded-2xl border-2 border-teal-100 flex items-center gap-3 shrink-0">
                                <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Сонгосон:</span>
                                <span className="text-lg font-black text-teal-600">{selectedProducts.length}</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filteredProductGrid.map(p => {
                                    const qty = selectedProducts.find(sp => sp.productId === p.id)?.sentQty || 0;
                                    return (
                                        <div key={p.id} className={`bg-white rounded-[24px] p-4 border-2 transition-all flex flex-col gap-3 ${qty > 0 ? 'border-[#40C1C7] shadow-xl shadow-teal-100' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="aspect-square bg-gray-50 rounded-[18px] flex items-center justify-center relative">
                                                <span className="material-icons-round text-5xl text-gray-200">inventory_2</span>
                                                {qty > 0 && <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#40C1C7] text-white rounded-full text-[9px] font-black">{qty}개</div>}
                                            </div>
                                            <div className="flex flex-col gap-0.5 px-1">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{p.category}</span>
                                                <span className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">{p.name}</span>
                                                <span className="text-sm font-black text-gray-800 mt-1">{p.price.toLocaleString()}₮</span>
                                            </div>
                                            <div className={`flex items-center justify-between p-1 rounded-xl ${qty > 0 ? 'bg-teal-50' : 'bg-gray-50'}`}>
                                                <button onClick={() => handleProductQtyChange(p, -1)} className="w-8 h-8 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-100 transition-all">
                                                    <span className="material-icons-round text-sm">remove</span>
                                                </button>
                                                <span className={`text-base font-black min-w-[28px] text-center ${qty > 0 ? 'text-[#40C1C7]' : 'text-gray-300'}`}>{qty}</span>
                                                <button onClick={() => handleProductQtyChange(p, 1)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${qty > 0 ? 'bg-[#40C1C7] text-white shadow-sm' : 'bg-white border border-gray-100 text-gray-400 hover:bg-teal-50 hover:text-[#40C1C7]'}`}>
                                                    <span className="material-icons-round text-sm">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-100 flex justify-between gap-3">
                            <button onClick={() => { resetCreate(); setViewMode('LIST'); }} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 uppercase text-[11px] tracking-wider border border-gray-100">
                                Буцах
                            </button>
                            <button
                                disabled={selectedProducts.length === 0}
                                onClick={() => setCreateStep(2)}
                                className="px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-[#40C1C7] text-white shadow-lg shadow-teal-200 hover:bg-[#36adb3] active:scale-95 transition-all disabled:opacity-40 flex items-center gap-2"
                            >
                                Дараах <span className="material-icons-round text-base">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: FROM / TO / Remarks ── */}
                {createStep === 2 && (
                    <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 flex flex-col gap-5">
                        {/* FROM → TO pickers */}
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <div className="flex-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Хаанаас (FROM)</p>
                                <PosDropdown
                                    icon="logout"
                                    value={fromBranch}
                                    onChange={setFromBranch}
                                    options={BRANCH_CHOICES.map(b => ({ label: b, value: b }))}
                                />
                            </div>
                            <div className="shrink-0 pt-5 hidden sm:block">
                                <span className="material-icons-round text-[30px] text-[#40C1C7]">east</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Хаашаа (TO)</p>
                                <PosDropdown
                                    icon="login"
                                    value={toBranch || ''}
                                    onChange={setToBranch}
                                    options={[
                                        { label: '-- Салбар сонгох --', value: '' },
                                        ...BRANCH_CHOICES.filter(b => b !== fromBranch).map(b => ({ label: b, value: b })),
                                    ]}
                                />
                            </div>
                        </div>

                        {/* FROM ≠ TO warning */}
                        {fromBranch && toBranch && fromBranch === toBranch && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[11px] font-bold">
                                <span className="material-icons-round text-base">warning</span>
                                Хаанаас ба Хаашаа адилхан байж болохгүй!
                            </div>
                        )}

                        {/* Remarks */}
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="material-icons-round text-sm">notes</span>Тайлбар
                                <span className="text-[9px] text-gray-300 font-bold">• заавал биш</span>
                            </label>
                            <textarea value={transferRemarks} onChange={e => setTransferRemarks(e.target.value)} rows={3}
                                placeholder="Шилжүүлгийн тайлбар…"
                                className="w-full resize-none rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-200 font-medium" />
                        </div>

                        {/* Summary mini */}
                        <div className="bg-teal-50/60 rounded-[20px] border border-teal-100 p-4 flex items-center gap-6">
                            <span className="material-icons-round text-teal-400">list_alt</span>
                            <div className="flex gap-6 text-[12px]">
                                <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт төрөл</p><p className="font-black text-gray-800">{selectedProducts.length}</p></div>
                                <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт ш</p><p className="font-black text-gray-800">{selectedProducts.reduce((s, p) => s + p.sentQty, 0)}</p></div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-3 pt-2">
                            <button onClick={() => setCreateStep(1)} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 uppercase text-[11px] tracking-wider border border-gray-100">← Буцах</button>
                            <button
                                disabled={!toBranch || !fromBranch || fromBranch === toBranch}
                                onClick={() => setCreateStep(3)}
                                className="px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-[#40C1C7] text-white shadow-lg hover:bg-[#36adb3] active:scale-95 transition-all disabled:opacity-40 flex items-center gap-2"
                            >
                                Дараах <span className="material-icons-round text-base">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Review & Confirm ── */}
                {createStep === 3 && (
                    <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 flex flex-col gap-5">
                        {/* Route card */}
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                            <div className="flex-1 text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаанаас</p>
                                <p className="text-[15px] font-black text-gray-800">{fromBranch}</p>
                            </div>
                            <span className="material-icons-round text-[28px] text-[#40C1C7]">east</span>
                            <div className="flex-1 text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаашаа</p>
                                <p className="text-[15px] font-black text-[#40C1C7]">{toBranch}</p>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <div className="flex-1">Бараа</div>
                                <div className="w-[100px] text-center">Тоо</div>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto no-scrollbar">
                                {selectedProducts.map(p => (
                                    <div key={p.productId} className="px-5 py-3 flex items-center">
                                        <div className="flex-1">
                                            <p className="text-[13px] font-bold text-gray-800">{p.productName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{p.productCode}</p>
                                        </div>
                                        <div className="w-[100px] text-center font-black text-gray-900">{p.sentQty} ш</div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Нийт</p>
                                <p className="text-base font-black text-gray-800">{selectedProducts.reduce((s, p) => s + p.sentQty, 0)} ш</p>
                            </div>
                        </div>

                        {transferRemarks && (
                            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                                <span className="material-icons-round text-gray-300 text-base mt-0.5">notes</span>
                                <p className="text-[13px] text-gray-600 font-medium">{transferRemarks}</p>
                            </div>
                        )}

                        <div className="flex justify-between gap-3 pt-2">
                            <button onClick={() => setCreateStep(2)} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 uppercase text-[11px] tracking-wider border border-gray-100">← Буцах</button>
                            <button
                                onClick={handleCreateConfirm}
                                className="px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-[#40C1C7] text-white shadow-lg hover:bg-[#36adb3] active:scale-95 transition-all flex items-center gap-2"
                            >
                                <span className="material-icons-round text-base">check_circle</span>
                                Шилжүүлэх хийх
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ════════════════════════════════════════════════════════
    //  DETAIL VIEW
    // ════════════════════════════════════════════════════════
    if (viewMode === 'DETAIL' && activeTransfer) {
        const canReceive = activeTransfer.status === 'Шилжүүлсэн' && activeTransfer.toBranch === CURRENT_BRANCH;
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('LIST')} className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <div>
                            <h3 className="text-lg font-black text-gray-800">{activeTransfer.id}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeTransfer.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${getStatusColor(activeTransfer.status)}`}>
                            {activeTransfer.status}
                        </span>
                    </div>
                    {canReceive && (
                        <button
                            onClick={() => navigate('/pos/transfer-receive', { state: { transferId: activeTransfer.id } })}
                            className="flex items-center gap-2 h-10 px-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-green-200 active:scale-95 transition-all"
                        >
                            <span className="material-icons-round text-base">move_to_inbox</span>
                            Хүлээн авах
                        </button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 flex flex-col gap-5">
                    {/* Meta */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Шилжүүлэх №</p>
                            <p className="text-[13px] font-black text-[#40C1C7]">{activeTransfer.id}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаанаас</p>
                            <div className="flex items-center gap-1">
                                <span className="material-icons-round text-[13px] text-gray-400">logout</span>
                                <p className="text-[13px] font-bold text-gray-800">{activeTransfer.fromBranch}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаашаа</p>
                            <div className="flex items-center gap-1">
                                <span className="material-icons-round text-[13px] text-[#40C1C7]">east</span>
                                <p className="text-[13px] font-bold text-[#40C1C7]">{activeTransfer.toBranch}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Огноо</p>
                            <p className="text-[13px] font-bold text-gray-800">{activeTransfer.date}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <div className="flex-1">Бараа</div>
                            <div className="w-[120px] text-center">Илгээсэн</div>
                            <div className="w-[120px] text-center">Хүлээн авсан</div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {activeTransfer.items.map(item => (
                                <div key={item.productId} className="px-6 py-4 flex items-center">
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-gray-800">{item.productName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{item.productCode}</p>
                                    </div>
                                    <div className="w-[120px] text-center font-black text-gray-700">{item.sentQty}</div>
                                    <div className="w-[120px] text-center font-black text-green-600">
                                        {activeTransfer.status === 'Хүлээн авсан' ? item.receivedQty : '—'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {activeTransfer.remarks && (
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                            <span className="material-icons-round text-gray-300 text-base mt-0.5">notes</span>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Тайлбар</p>
                                <p className="text-[13px] text-gray-600 font-medium">{activeTransfer.remarks}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════
    //  LIST VIEW (default)
    // ════════════════════════════════════════════════════════
    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">

                {/* Page header */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm" />
                        <h2 className="text-[18px] font-bold text-[#374151]">БАРАА ШИЛУҮҮЛЭХ</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { resetCreate(); setViewMode('CREATE'); }}
                            className="bg-[#40C1C7] hover:bg-[#36adb3] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all"
                        >
                            <span className="material-icons-round text-lg">add_circle</span> Шилжүүлэх хийх
                        </button>
                        <button
                            onClick={() => navigate('/pos/transfer-receive')}
                            className="bg-[#111827] hover:bg-black text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all"
                        >
                            <span className="material-icons-round text-lg">move_to_inbox</span> Хүлээн авах
                        </button>
                        <PosExcelButton />
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0">
                    <div className="flex-1 min-w-[200px]">
                        <PosDateRangePicker label="Хугацаа" value={dateRange} onChange={setDateRange} />
                    </div>
                    <PosDropdown label="Хаанаас" icon="logout" value={searchFrom} onChange={setSearchFrom} options={branchOptions} className="w-[150px]" />
                    <PosDropdown label="Хаашаа" icon="login" value={searchTo} onChange={setSearchTo} options={branchOptions} className="w-[150px]" />
                    <PosDropdown label="Төлөв" icon="flag" value={searchStatus} onChange={setSearchStatus} options={statusOptions} className="w-[160px]" />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Шилжүүлэх №</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round text-sm">confirmation_number</span>
                            </span>
                            <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)}
                                className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:border-[#40C1C7] transition-all" placeholder="Дугаараар хайх" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                        <div className="min-w-[1100px] flex flex-col">
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 px-6 py-4 flex text-[12px] font-bold text-gray-400 uppercase tracking-widest items-center text-left">
                                <div className="w-[180px] shrink-0">Шилжүүлэх №</div>
                                <div className="w-[120px] shrink-0 px-2">Огноо</div>
                                <div className="w-[200px] shrink-0 px-2 text-center">Хаанаас → Хаашаа</div>
                                <div className="w-[100px] shrink-0 px-2 text-center">Нийт тоо</div>
                                <div className="flex-1 px-2">Тайлбар</div>
                                <div className="w-[140px] px-2 flex justify-center">Төлөв</div>
                                <div className="w-8 shrink-0"></div>
                            </div>
                            <div className="divide-y divide-gray-50 bg-white">
                                {filteredTransfers.length > 0 ? filteredTransfers.map(t => (
                                    <div key={t.id} onClick={() => { setActiveTransfer(t); setViewMode('DETAIL'); }}
                                        className="flex px-6 py-5 border-b border-gray-50 hover:bg-[#40C1C7]/5 cursor-pointer transition-colors items-center text-[13px] group">
                                        <div className="w-[180px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline text-sm truncate pr-2">{t.id}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-gray-400 text-xs font-medium">{t.date}</div>
                                        <div className="w-[200px] shrink-0 px-2 flex justify-center items-center gap-1.5 font-bold text-gray-700 text-[12px] truncate">
                                            <span>{t.fromBranch}</span>
                                            <span className="material-icons-round text-[13px] text-gray-300">east</span>
                                            <span className="text-[#40C1C7]">{t.toBranch}</span>
                                        </div>
                                        <div className="w-[100px] shrink-0 px-2 text-center font-black text-gray-800">{t.totalQty} ш</div>
                                        <div className="flex-1 px-2">
                                            {t.remarks ? (
                                                <p className="text-[12px] text-gray-500 font-medium truncate" title={t.remarks}>{t.remarks}</p>
                                            ) : (
                                                <span className="text-[12px] text-gray-200">—</span>
                                            )}
                                        </div>
                                        <div className="w-[140px] px-2 flex justify-center">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-1.5 ${getStatusColor(t.status)}`}>{t.status}</span>
                                        </div>
                                        <div className="w-8 shrink-0 flex justify-end">
                                            <span className="material-icons-round text-gray-300 group-hover:text-[#40C1C7] transition-colors">chevron_right</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                        <span className="material-icons-round text-6xl mb-4 opacity-20">search_off</span>
                                        <p className="font-bold text-lg">Илгээмж олдсонгүй</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <PosPagination totalItems={filteredTransfers.length} itemsPerPage={10} currentPage={1} onPageChange={() => { }} />
                </div>
            </div>
        </div >
    );
};

export default TransferListScreen;
