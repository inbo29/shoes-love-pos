import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import { mockTransfers, Transfer, TransferStatus, TransferType, TransferItem } from '../../../../services/mockTransferData';
import { mockProducts, Product } from '../../../../services/mockProductData';

// --- Types ---
type ViewMode = 'LIST' | 'CREATE_OUT' | 'DETAIL';

interface SelectedTransferProduct {
    productId: string;
    productCode: string;
    productName: string;
    sentQty: number;
}

const TransferListScreen: React.FC = () => {
    // UI View State
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [activeTransfer, setActiveTransfer] = useState<Transfer | null>(null);

    // List States (Filters)
    const [searchNo, setSearchNo] = useState('');
    const [searchFrom, setSearchFrom] = useState('all');
    const [searchTo, setSearchTo] = useState('all');
    const [searchType, setSearchType] = useState('all');
    const [searchStatus, setSearchStatus] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Outbound Create Flow State
    const [createStep, setCreateStep] = useState(1);
    const [targetBranch, setTargetBranch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<SelectedTransferProduct[]>([]);
    const [productSearchQuery, setProductSearchQuery] = useState('');

    // --- Helpers ---
    const statusOptions = [
        { label: 'Бүх төлөв', value: 'all' },
        { label: 'Бэлтгэж байна', value: 'Бэлтгэж байна' },
        { label: 'Шилжүүлсэн', value: 'Шилжүүлсэн' },
        { label: 'Хүлээн авсан', value: 'Хүлээн авсан' },
        { label: 'Цуцалсан', value: 'Цуцалсан' }
    ];

    const typeOptions = [
        { label: 'Бүгд', value: 'all' },
        { label: 'Хийх', value: 'Хийх' },
        { label: 'Авах', value: 'Авах' }
    ];

    const branchOptions = [
        { label: 'Бүх салбар', value: 'all' },
        { label: 'Төв салбар', value: 'Төв салбар' },
        { label: 'Салбар 1', value: 'Салбар 1' },
        { label: 'Салбар 2', value: 'Салбар 2' }
    ];

    const getStatusColor = (status: TransferStatus) => {
        switch (status) {
            case 'Бэлтгэж байна': return 'bg-gray-100 text-gray-500';
            case 'Шилжүүлсэн': return 'bg-blue-50 text-blue-500';
            case 'Хүлээн авсан': return 'bg-green-50 text-green-500';
            case 'Цуцалсан': return 'bg-red-50 text-red-500';
            default: return 'bg-gray-50 text-gray-400';
        }
    };

    // --- Filtering ---
    const filteredTransfers = useMemo(() => {
        return mockTransfers.filter(t => {
            const matchesNo = t.id.toLowerCase().includes(searchNo.toLowerCase());
            const matchesFrom = searchFrom === 'all' || t.fromBranch === searchFrom;
            const matchesTo = searchTo === 'all' || t.toBranch === searchTo;
            const matchesType = searchType === 'all' || t.type === searchType;
            const matchesStatus = searchStatus === 'all' || t.status === searchStatus;

            return matchesNo && matchesFrom && matchesTo && matchesType && matchesStatus;
        });
    }, [searchNo, searchFrom, searchTo, searchType, searchStatus]);

    // --- Creation Flow Functions ---
    const handleProductQtyChange = (product: Product, delta: number) => {
        const existing = selectedProducts.find(p => p.productId === product.id);
        const currentQty = existing ? existing.sentQty : 0;
        const newQty = Math.max(0, currentQty + delta);

        if (newQty === 0) {
            setSelectedProducts(prev => prev.filter(p => p.productId !== product.id));
        } else if (existing) {
            setSelectedProducts(prev => prev.map(p => p.productId === product.id ? { ...p, sentQty: newQty } : p));
        } else {
            setSelectedProducts(prev => [...prev, {
                productId: product.id,
                productCode: product.id,
                productName: product.name,
                sentQty: newQty
            }]);
        }
    };

    const filteredProductGrid = useMemo(() => {
        if (!productSearchQuery) return mockProducts;
        return mockProducts.filter(p => p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(productSearchQuery.toLowerCase()));
    }, [productSearchQuery]);

    // --- Detail Handling ---
    const openDetail = (transfer: Transfer) => {
        setActiveTransfer(transfer);
        setViewMode('DETAIL');
    };

    // --- Renderers ---

    if (viewMode === 'CREATE_OUT') {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                <div className="bg-white border-b border-gray-100 px-8 py-6 flex flex-col gap-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setViewMode('LIST')} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                                <span className="material-icons-round">arrow_back</span>
                            </button>
                            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Шилжүүлэг үүсгэх</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${createStep === s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' : createStep > s ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white border-gray-100 text-gray-300'}`}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-white/50">
                    {createStep === 1 && (
                        <div className="max-w-4xl mx-auto flex flex-col gap-12 pt-10">
                            <div className="text-center">
                                <h3 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Хаашаа шилжүүлэх вэ?</h3>
                                <p className="text-gray-400 font-bold">Бараа хүлээн авах салбараа сонгоно уу.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {['Салбар 1', 'Салбар 2', 'Салбар 3'].map(branch => (
                                    <button
                                        key={branch}
                                        onClick={() => { setTargetBranch(branch); }}
                                        className={`group h-32 rounded-[32px] border-[3px] transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden ${targetBranch === branch ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-gray-100 bg-white hover:border-primary/30 hover:-translate-y-1'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 transition-colors ${targetBranch === branch ? 'bg-primary text-white' : 'bg-gray-50 text-gray-300 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                            <span className="material-icons-round">storefront</span>
                                        </div>
                                        <span className={`text-lg font-black ${targetBranch === branch ? 'text-primary' : 'text-gray-700'}`}>{branch}</span>
                                        {targetBranch === branch && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                                                <span className="material-icons-round text-sm">check</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-center mt-12">
                                <button
                                    disabled={!targetBranch}
                                    onClick={() => setCreateStep(2)}
                                    className="h-16 px-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    Дараагийн алхам
                                </button>
                            </div>
                        </div>
                    )}

                    {createStep === 2 && (
                        <div className="h-full flex flex-col gap-6">
                            <div className="flex items-center gap-4 shrink-0 px-4">
                                <div className="relative flex-1">
                                    <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-icons-round">search</span>
                                    </span>
                                    <input
                                        type="text" value={productSearchQuery} onChange={e => setProductSearchQuery(e.target.value)}
                                        className="w-full h-14 pl-14 pr-4 bg-white border-2 border-gray-100 rounded-[24px] text-sm font-bold focus:outline-none focus:border-primary transition-all shadow-sm"
                                        placeholder="Бараа хайх (Нэр, ангилал, код)..."
                                    />
                                    <button className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-primary transition-colors">
                                        <span className="material-icons-round">qr_code_scanner</span>
                                    </button>
                                </div>
                                <div className="px-8 h-14 bg-primary/5 rounded-[24px] border-2 border-primary/10 flex items-center gap-4">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Сонгосон:</span>
                                    <span className="text-xl font-black text-primary">{selectedProducts.length}</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar px-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {filteredProductGrid.map(p => {
                                        const qty = selectedProducts.find(sp => sp.productId === p.id)?.sentQty || 0;
                                        return (
                                            <div key={p.id} className={`bg-white rounded-[28px] p-4 border-2 transition-all flex flex-col gap-4 ${qty > 0 ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray-50 hover:border-gray-200'}`}>
                                                <div className="aspect-square bg-gray-50 rounded-[20px] flex items-center justify-center relative overflow-hidden">
                                                    <span className="material-icons-round text-6xl text-gray-200">inventory_2</span>
                                                    {qty > 0 && <div className="absolute top-2 right-2 px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black">SELECTED</div>}
                                                </div>
                                                <div className="flex flex-col gap-1 px-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.category}</span>
                                                    <span className="text-[12px] font-bold text-gray-800 line-clamp-1 leading-tight h-4">{p.name}</span>
                                                    <span className="text-sm font-black text-gray-800 mt-1">{p.price.toLocaleString()}₮</span>
                                                </div>
                                                <div className={`flex items-center justify-between p-1.5 rounded-xl transition-colors ${qty > 0 ? 'bg-primary/5' : 'bg-gray-50'}`}>
                                                    <button onClick={() => handleProductQtyChange(p, -1)} className="w-9 h-9 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all"><span className="material-icons-round">remove</span></button>
                                                    <span className={`text-base font-black min-w-[32px] text-center ${qty > 0 ? 'text-primary' : 'text-gray-300'}`}>{qty}</span>
                                                    <button onClick={() => handleProductQtyChange(p, 1)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${qty > 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-gray-100 text-gray-400 hover:bg-primary/10 hover:text-primary hover:border-primary/20'}`}><span className="material-icons-round">add</span></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="shrink-0 pt-6 flex justify-between gap-3 border-t border-gray-100 px-4 bg-white/50">
                                <button onClick={() => setCreateStep(1)} className="flex items-center gap-2 h-14 px-10 rounded-[20px] bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all">
                                    <span className="material-icons-round">arrow_back</span> Буцах
                                </button>
                                <button
                                    disabled={selectedProducts.length === 0}
                                    onClick={() => setCreateStep(3)}
                                    className="h-14 px-14 bg-[#111827] text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    Дараагийн алхам
                                </button>
                            </div>
                        </div>
                    )}

                    {createStep === 3 && (
                        <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">
                            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-50 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 px-3 py-1 bg-primary/5 rounded-full inline-block">Review Transfer</p>
                                        <h3 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-4">
                                            Төв салбар <span className="material-icons-round text-primary text-4xl">trending_flat</span> {targetBranch}
                                        </h3>
                                    </div>
                                    <div className="flex gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төрөл</p>
                                            <p className="text-xl font-black text-gray-800">Хийх</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Огноо</p>
                                            <p className="text-xl font-black text-gray-800">{new Date().toISOString().split('T')[0]}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar pr-2 mb-12">
                                    {selectedProducts.map(p => (
                                        <div key={p.productId} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-[24px] border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center text-primary border-2 border-gray-50 group-hover:border-primary/10 transition-colors">
                                                    <span className="material-icons-round text-2xl">inventory_2</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-800 leading-tight">{p.productName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{p.productCode}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Илгээх тоо</p>
                                                    <p className="text-xl font-black text-gray-800">{p.sentQty} <span className="text-[10px] text-gray-400">ш</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-gray-900 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex gap-12 text-white">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Нийт төрөл</span>
                                            <span className="text-3xl font-black">{selectedProducts.length}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Нийт тоо ширхэг</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-black text-primary">{selectedProducts.reduce((sum, p) => sum + p.sentQty, 0)}</span>
                                                <span className="text-xs font-bold text-gray-500">ШИРХЭГ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button onClick={() => setCreateStep(2)} className="h-16 px-8 rounded-2xl bg-white/10 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white/20 transition-all w-full md:w-auto">Буцах</button>
                                        <button onClick={() => setViewMode('LIST')} className="h-16 px-12 bg-primary text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all w-full md:w-auto">Шилжүүлэх хийх</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (viewMode === 'DETAIL' && activeTransfer) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                <div className="bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewMode('LIST')} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Илгээмжийн дэлгэрэнгүй</h2>
                    </div>
                    {activeTransfer.type === 'Авах' && activeTransfer.status === 'Шилжүүлсэн' && (
                        <button onClick={() => setViewMode('LIST')} className="h-12 px-8 bg-green-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-green-500/20 hover:scale-105 transition-all">Хүлээн авах</button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Шилжүүлэх №</p>
                                <p className="text-lg font-black text-primary">{activeTransfer.id}</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Огноо</p>
                                <p className="text-lg font-black text-gray-700">{activeTransfer.date}</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Маршрут</p>
                                <p className="font-black text-gray-700 leading-tight">{activeTransfer.fromBranch} <br /> &rarr; {activeTransfer.toBranch}</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Төлөв</p>
                                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase mt-1 ${getStatusColor(activeTransfer.status)}`}>{activeTransfer.status}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                <div className="flex-1">Бараа / Код</div>
                                <div className="w-[120px] text-center">Илгээсэн</div>
                                <div className="w-[120px] text-center">Хүлээн авсан</div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {activeTransfer.items.map(item => (
                                    <div key={item.productId} className="px-8 py-4 flex items-center">
                                        <div className="flex-1 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                                                <span className="material-icons-round">inventory_2</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800">{item.productName}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.productCode}</p>
                                            </div>
                                        </div>
                                        <div className="w-[120px] text-center font-black text-gray-700">{item.sentQty}</div>
                                        <div className="w-[120px] text-center font-black text-primary">{activeTransfer.status === 'Хүлээн авсан' ? item.receivedQty : '-'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-primary rounded-sm"></div>
                        <h2 className="text-xl font-black text-[#374151] uppercase tracking-tight">Бараа шилжүүлэх</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setViewMode('CREATE_OUT'); setCreateStep(1); setTargetBranch(''); setSelectedProducts([]); }}
                            className="h-12 px-8 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="material-icons-round text-lg">add_circle</span> Шилжүүлэх хийх
                        </button>
                        <PosExcelButton />
                    </div>
                </div>

                {/* Filters Area */}
                <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                        <PosDateRangePicker label="Хугацаа" value={dateRange} onChange={setDateRange} />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Шилжүүлэх №</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><span className="material-icons-round text-sm">confirmation_number</span></span>
                                <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} className="w-full h-11 pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-xs font-bold focus:outline-none focus:border-primary transition-all" placeholder="Дугаараар хайх" />
                            </div>
                        </div>
                        <PosDropdown label="Хаанаас" icon="outbox" value={searchFrom} onChange={setSearchFrom} options={branchOptions} />
                        <PosDropdown label="Хаашаа" icon="move_to_inbox" value={searchTo} onChange={setSearchTo} options={branchOptions} />
                        <PosDropdown label="ИСОНГ ТӨРӨЛ" icon="swap_horiz" value={searchType} onChange={setSearchType} options={typeOptions} />
                        <PosDropdown label="Төлөв" icon="flag" value={searchStatus} onChange={setSearchStatus} options={statusOptions} />
                    </div>
                    <div className="flex justify-end pt-2 border-t border-gray-50">
                        <button className="h-12 px-12 bg-[#111827] text-white rounded-xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-black/10">
                            <span className="material-icons-round text-lg">search</span> Хайлт хийх
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                        <div className="min-w-[1100px] h-full flex flex-col">
                            <div className="sticky top-0 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] z-10">
                                <div className="w-[180px] shrink-0">Шилжүүлэх №</div>
                                <div className="w-[140px] shrink-0">Огноо</div>
                                <div className="w-[160px] shrink-0">Хаанаас</div>
                                <div className="w-[160px] shrink-0">Хаашаа</div>
                                <div className="w-[100px] shrink-0 text-center">Нийт тоо</div>
                                <div className="w-[120px] shrink-0 text-center">Төрөл</div>
                                <div className="flex-1 text-right pr-12">Төлөв</div>
                            </div>
                            <div className="divide-y divide-gray-50 flex-1">
                                {filteredTransfers.length > 0 ? filteredTransfers.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => openDetail(t)}
                                        className="flex px-8 py-5 items-center text-[12px] group transition-all hover:bg-primary/[0.02] cursor-pointer"
                                    >
                                        <div className="w-[180px] shrink-0 font-black text-primary group-hover:underline text-sm">{t.id}</div>
                                        <div className="w-[140px] shrink-0 font-bold text-gray-400">{t.date}</div>
                                        <div className="w-[160px] shrink-0 font-bold text-gray-700 flex items-center gap-2">
                                            <span className="material-icons-round text-sm text-gray-300">logout</span> {t.fromBranch}
                                        </div>
                                        <div className="w-[160px] shrink-0 font-bold text-gray-700 flex items-center gap-2">
                                            <span className="material-icons-round text-sm text-gray-300">login</span> {t.toBranch}
                                        </div>
                                        <div className="w-[100px] shrink-0 text-center font-black text-gray-800">{t.totalQty}</div>
                                        <div className="w-[120px] shrink-0 text-center">
                                            <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${t.type === 'Хийх' ? 'bg-orange-50 text-orange-500' : 'bg-cyan-50 text-cyan-600'}`}>{t.type}</span>
                                        </div>
                                        <div className="flex-1 flex justify-end items-center pr-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${getStatusColor(t.status)}`}>{t.status}</span>
                                            <span className="material-icons-round text-gray-200 ml-6 group-hover:text-primary transition-colors">arrow_forward</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-200 h-full">
                                        <span className="material-icons-round text-8xl mb-4 opacity-10">swap_horiz</span>
                                        <p className="font-black text-xl text-gray-300 uppercase tracking-widest">Илгээмж олдсонгүй</p>
                                        <p className="text-gray-300 font-bold mt-2">Хайлтын утгаа шалгана уу</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <PosPagination totalItems={filteredTransfers.length} itemsPerPage={10} currentPage={1} onPageChange={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default TransferListScreen;
