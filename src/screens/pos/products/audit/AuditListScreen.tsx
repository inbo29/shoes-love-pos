import React, { useState, useMemo, useRef, useEffect } from 'react';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import { mockAudits, Audit, AuditStatus, AuditItem, AuditType } from '../../../../services/mockAuditData';
import { mockProducts, Product } from '../../../../services/mockProductData';

interface Props {
    userName: string;
    initialBranch: string;
}

type ViewMode = 'LIST' | 'DETAIL';

const AuditListScreen: React.FC<Props> = ({ userName, initialBranch }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeAudit, setActiveAudit] = useState<Audit | null>(null);

    // List Filters
    const [searchNo, setSearchNo] = useState('');
    const [searchStatus, setSearchStatus] = useState('all');
    const [searchBranch, setSearchBranch] = useState(userName === 'Админ' ? 'all' : (initialBranch || 'Төв салбар'));
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Creation States
    const [newAuditType, setNewAuditType] = useState<AuditType>('Үлдэгдэлтэй бараа');
    const [newAuditBranch, setNewAuditBranch] = useState(initialBranch || 'Төв салбар');
    const [newAuditNotes, setNewAuditNotes] = useState('');

    // Detail States
    const [scanningBarcode, setScanningBarcode] = useState('');
    const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    // --- Helpers ---
    const getStatusColor = (status: AuditStatus) => {
        switch (status) {
            case 'Процесс': return 'bg-blue-50 text-blue-500';
            case 'Түр хадгалсан': return 'bg-orange-50 text-orange-500';
            case 'Дууссан': return 'bg-green-50 text-green-500';
            default: return 'bg-gray-50 text-gray-400';
        }
    };

    const statusOptions = [
        { label: 'Бүх төлөв', value: 'all' },
        { label: 'Процесс', value: 'Процесс' },
        { label: 'Түр хадгалсан', value: 'Түр хадгалсан' },
        { label: 'Дууссан', value: 'Дууссан' }
    ];

    const branchOptions = [
        { label: 'Бүх салбар', value: 'all' },
        { label: 'Төв салбар', value: 'Төв салбар' },
        { label: 'Салбар 1', value: 'Салбар 1' },
        { label: 'Салбар 2', value: 'Салбар 2' }
    ];

    // --- Actions ---
    const handleStartAudit = () => {
        const newAudit: Audit = {
            id: `AD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().slice(0, 10),
            branchName: newAuditBranch,
            type: newAuditType,
            totalProducts: 0,
            totalDiffQty: 0,
            totalDiffAmount: 0,
            status: 'Процесс',
            manager: userName,
            items: [],
            notes: newAuditNotes
        };
        setActiveAudit(newAudit);
        setAuditItems([]);
        setViewMode('DETAIL');
        setIsCreateModalOpen(false);
    };

    const handleBarcodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanningBarcode) return;

        // Find product in mockProducts
        const product = mockProducts.find(p => p.id === scanningBarcode || p.name.includes(scanningBarcode));
        if (product) {
            const existingItem = auditItems.find(item => item.productId === product.id);
            if (existingItem) {
                updateItemQty(product.id, existingItem.actualQty + 1);
            } else {
                const newItem: AuditItem = {
                    productId: product.id,
                    productCode: product.id,
                    productName: product.name,
                    unit: 'ш',
                    systemQty: 10, // Mock system qty
                    actualQty: 1,
                    diffQty: 1 - 10,
                    price: product.price,
                    diffAmount: (1 - 10) * product.price
                };
                setAuditItems(prev => [newItem, ...prev]);
            }
        }
        setScanningBarcode('');
        barcodeInputRef.current?.focus();
    };

    const updateItemQty = (productId: string, newQty: number) => {
        const safeQty = Math.max(0, newQty);
        setAuditItems(prev => prev.map(item => {
            if (item.productId === productId) {
                const diff = safeQty - item.systemQty;
                return {
                    ...item,
                    actualQty: safeQty,
                    diffQty: diff,
                    diffAmount: diff * item.price
                };
            }
            return item;
        }));
    };

    const removeItem = (productId: string) => {
        setAuditItems(prev => prev.filter(item => item.productId !== productId));
    };

    // --- Filtering ---
    const filteredAudits = useMemo(() => {
        return mockAudits.filter(a => {
            const matchesNo = a.id.toLowerCase().includes(searchNo.toLowerCase());
            const matchesStatus = searchStatus === 'all' || a.status === searchStatus;
            const matchesBranch = searchBranch === 'all' || a.branchName === searchBranch;
            return matchesNo && matchesStatus && matchesBranch;
        });
    }, [searchNo, searchStatus, searchBranch]);

    // --- Summary Calculations ---
    const summary = useMemo(() => {
        return auditItems.reduce((acc, item) => ({
            totalSystemQty: acc.totalSystemQty + item.systemQty,
            totalActualQty: acc.totalActualQty + item.actualQty,
            totalDiffQty: acc.totalDiffQty + item.diffQty,
            totalDiffAmount: acc.totalDiffAmount + item.diffAmount,
        }), { totalSystemQty: 0, totalActualQty: 0, totalDiffQty: 0, totalDiffAmount: 0 });
    }, [auditItems]);

    // Focus barcode input on detail view load
    useEffect(() => {
        if (viewMode === 'DETAIL') {
            barcodeInputRef.current?.focus();
        }
    }, [viewMode]);

    // --- Renderers ---

    const renderList = () => (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-primary rounded-sm"></div>
                    <h2 className="text-xl font-black text-[#374151] uppercase tracking-tight">Тооллогын жагсаалт</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-12 px-8 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        <span className="material-icons-round text-lg">add_circle</span> Шинэ тооллого эхлэх
                    </button>
                    <PosExcelButton />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 shrink-0">
                <PosDateRangePicker label="Тоолсон хугацаа" value={dateRange} onChange={setDateRange} />
                <PosDropdown label="Салбар" icon="storefront" value={searchBranch} onChange={setSearchBranch} options={branchOptions} disabled={userName !== 'Админ'} />
                <PosDropdown label="Төлөв" icon="flag" value={searchStatus} onChange={setSearchStatus} options={statusOptions} />
                <div className="flex flex-col gap-1.5 lg:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Дугаараар хайх</label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><span className="material-icons-round text-sm">confirmation_number</span></span>
                            <input type="text" value={searchNo} onChange={e => setSearchNo(e.target.value)} className="w-full h-11 pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-xs font-bold focus:outline-none focus:border-primary transition-all" placeholder="Тооллогын №" />
                        </div>
                        <button className="h-11 px-6 bg-[#111827] text-white rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                            <span className="material-icons-round text-sm">search</span> ХАЙЛТ ХИЙХ
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-x-auto no-scrollbar">
                    <div className="min-w-[1200px] h-full flex flex-col">
                        <div className="sticky top-0 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] z-10">
                            <div className="w-[180px] shrink-0">Тооллогын №</div>
                            <div className="w-[140px] shrink-0">Огноо</div>
                            <div className="w-[160px] shrink-0">Салбар</div>
                            <div className="w-[160px] shrink-0">Төрөл</div>
                            <div className="w-[120px] shrink-0 text-center">Нийт бараа</div>
                            <div className="w-[120px] shrink-0 text-center">Зөрүү (Тоо)</div>
                            <div className="w-[140px] shrink-0 text-right">Зөрүү (Мөнгө)</div>
                            <div className="flex-1 text-right pr-6">Төлөв</div>
                        </div>
                        <div className="divide-y divide-gray-50 flex-1">
                            {filteredAudits.map(a => (
                                <div
                                    key={a.id}
                                    onClick={() => { setActiveAudit(a); setAuditItems(a.items || []); setViewMode('DETAIL'); }}
                                    className="flex px-8 py-5 items-center text-[12px] group transition-all hover:bg-primary/[0.02] cursor-pointer"
                                >
                                    <div className="w-[180px] shrink-0 font-black text-primary group-hover:underline text-sm">{a.id}</div>
                                    <div className="w-[140px] shrink-0 font-bold text-gray-400">{a.date}</div>
                                    <div className="w-[160px] shrink-0 font-bold text-gray-700">{a.branchName}</div>
                                    <div className="w-[160px] shrink-0 font-bold text-gray-500">{a.type}</div>
                                    <div className="w-[120px] shrink-0 text-center font-black text-gray-800">{a.totalProducts}</div>
                                    <div className={`w-[120px] shrink-0 text-center font-black ${a.totalDiffQty === 0 ? 'text-gray-400' : a.totalDiffQty > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {a.totalDiffQty > 0 ? '+' : ''}{a.totalDiffQty}
                                    </div>
                                    <div className={`w-[140px] shrink-0 text-right font-black ${a.totalDiffAmount === 0 ? 'text-gray-400' : a.totalDiffAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {a.totalDiffAmount > 0 ? '+' : ''}{a.totalDiffAmount.toLocaleString()}₮
                                    </div>
                                    <div className="flex-1 flex justify-end items-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${getStatusColor(a.status)}`}>{a.status}</span>
                                        <span className="material-icons-round text-gray-200 ml-6 group-hover:text-primary transition-colors">arrow_forward</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <PosPagination totalItems={filteredAudits.length} itemsPerPage={10} currentPage={1} onPageChange={() => { }} />
            </div>
        </div>
    );

    const renderDetail = () => (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className="bg-white border-b border-gray-100 -mx-6 -mt-6 px-8 py-6 flex items-center justify-between shrink-0 mb-2">
                <div className="flex items-center gap-6">
                    <button onClick={() => setViewMode('LIST')} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">ШИНЭ ТООЛЛОГО</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${getStatusColor(activeAudit?.status || 'Процесс')}`}>{activeAudit?.status}</span>
                        </div>
                        <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase flex items-center gap-4">
                            {activeAudit?.id} <span className="text-gray-300 font-bold mx-2">|</span> {activeAudit?.branchName}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { if (window.confirm('Тооллогын явцыг түр хадгалах уу?')) setViewMode('LIST'); }} className="h-12 px-8 bg-gray-100 text-gray-500 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all">Түр хадгалах</button>
                    <button onClick={() => { if (window.confirm('Тооллогыг дуусгах уу? Дуусгасны дараа засах боломжгүй.')) setViewMode('LIST'); }} className="h-12 px-10 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:scale-105 transition-all">Тооллого дуусгах</button>
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6 shrink-0 mt-4">
                <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round">qr_code_scanner</span>
                        </span>
                        <input
                            ref={barcodeInputRef}
                            type="text"
                            value={scanningBarcode}
                            onChange={e => setScanningBarcode(e.target.value)}
                            className="w-full h-14 pl-14 pr-4 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                            placeholder="Барааны код эсвэл нэр хайх / Сканнердах..."
                        />
                        <button type="submit" className="absolute inset-y-0 right-4 flex items-center text-primary font-black text-[10px] uppercase tracking-widest group">
                            Enter дар <span className="material-icons-round ml-1 group-hover:translate-x-1 transition-transform">keyboard_return</span>
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-8 h-14 bg-gray-50 rounded-[24px] flex flex-col justify-center">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Тоолж буй</span>
                            <p className="text-lg font-black text-gray-700 leading-none">{auditItems.length}</p>
                        </div>
                    </div>
                </form>
            </div>

            {/* Audit Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-x-auto no-scrollbar">
                    <div className="min-w-[1200px] h-full flex flex-col">
                        <div className="sticky top-0 bg-gray-50/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] z-10">
                            <div className="w-[120px] shrink-0">Код</div>
                            <div className="flex-1">Барааны нэр</div>
                            <div className="w-[80px] shrink-0 text-center">Нэгж</div>
                            <div className="w-[120px] shrink-0 text-center">Систем үлдэгдэл</div>
                            <div className="w-[140px] shrink-0 text-center">Бодит тоологдсон</div>
                            <div className="w-[100px] shrink-0 text-center text-primary">Зөрүү</div>
                            <div className="w-[120px] shrink-0 text-right">Нэгж үнэ</div>
                            <div className="w-[140px] shrink-0 text-right">Зөрүү дүн</div>
                            <div className="w-[60px] shrink-0"></div>
                        </div>
                        <div className="divide-y divide-gray-50 flex-1 overflow-y-auto no-scrollbar pr-1">
                            {auditItems.map(item => (
                                <div key={item.productId} className="flex px-8 py-4 items-center text-[12px] group hover:bg-gray-50/50 transition-all">
                                    <div className="w-[120px] shrink-0 font-bold text-gray-400">{item.productCode}</div>
                                    <div className="flex-1 font-black text-gray-800">{item.productName}</div>
                                    <div className="w-[80px] shrink-0 text-center font-bold text-gray-400">{item.unit}</div>
                                    <div className="w-[120px] shrink-0 text-center font-black text-gray-600 bg-gray-50 py-2 rounded-xl border border-gray-100 mx-2">{item.systemQty}</div>
                                    <div className="w-[140px] shrink-0 flex justify-center">
                                        <input
                                            type="number"
                                            value={item.actualQty}
                                            onChange={e => updateItemQty(item.productId, parseInt(e.target.value) || 0)}
                                            className="w-24 h-10 text-center bg-white border-2 border-primary/20 rounded-xl font-black text-primary focus:outline-none focus:border-primary shadow-sm"
                                        />
                                    </div>
                                    <div className={`w-[100px] shrink-0 text-center font-black text-sm ${item.diffQty === 0 ? 'text-gray-400' : item.diffQty > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.diffQty > 0 ? '+' : ''}{item.diffQty}
                                    </div>
                                    <div className="w-[120px] shrink-0 text-right font-bold text-gray-400">{item.price.toLocaleString()}₮</div>
                                    <div className={`w-[140px] shrink-0 text-right font-black ${item.diffAmount === 0 ? 'text-gray-400' : item.diffAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.diffAmount > 0 ? '+' : ''}{item.diffAmount.toLocaleString()}₮
                                    </div>
                                    <div className="w-[60px] shrink-0 flex justify-end">
                                        <button onClick={() => removeItem(item.productId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                                            <span className="material-icons-round text-sm">delete_outline</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Audit Footer Summary */}
                <div className="bg-gray-900 border-t border-gray-800 p-8 flex items-center justify-between shrink-0">
                    <div className="flex gap-12">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Систем үлдэгдэл</span>
                            <span className="text-2xl font-black text-white">{summary.totalSystemQty} <span className="text-xs text-gray-500">ш</span></span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Бодит тоо</span>
                            <span className="text-2xl font-black text-white">{summary.totalActualQty} <span className="text-xs text-gray-500">ш</span></span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Нийт зөрүү</span>
                            <span className={`text-2xl font-black ${summary.totalDiffQty === 0 ? 'text-gray-400' : summary.totalDiffQty > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {summary.totalDiffQty > 0 ? '+' : ''}{summary.totalDiffQty} <span className="text-xs opacity-50 font-bold">ш</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Зөрүү мөнгөн дүн</span>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black ${summary.totalDiffAmount === 0 ? 'text-white' : summary.totalDiffAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {summary.totalDiffAmount > 0 ? '+' : ''}{summary.totalDiffAmount.toLocaleString()}
                            </span>
                            <span className="text-xl font-bold text-gray-500">₮</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 h-full bg-[#F8F9FA] p-6 overflow-hidden flex flex-col relative">
            {viewMode === 'LIST' ? renderList() : renderDetail()}

            {/* Create Audit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[500px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 flex flex-col gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mx-auto mb-6">
                                    <span className="material-icons-round text-4xl">fact_check</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-tight mb-2">ШИНЭ ТООЛЛОГО ЭХЛЭХ</h3>
                                <p className="text-gray-400 font-bold text-sm px-6 leading-relaxed">Та зөвхөн үлдэгдэлтэй барааг тоолох уу, эсвэл бүх барааг тоолох уу?</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setNewAuditType('Үлдэгдэлтэй бараа')}
                                    className={`flex items-center gap-5 p-6 rounded-[28px] border-2 transition-all ${newAuditType === 'Үлдэгдэлтэй бараа' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${newAuditType === 'Үлдэгдэлтэй бараа' ? 'bg-primary text-white' : 'bg-white text-gray-300'}`}>
                                        <span className="material-icons-round">rule</span>
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-black uppercase text-[10px] tracking-widest ${newAuditType === 'Үлдэгдэлтэй бараа' ? 'text-primary' : 'text-gray-400'}`}>Зөвлөмж</p>
                                        <p className="font-bold text-gray-800">Үлдэгдэлтэй барааг тоолох</p>
                                    </div>
                                    {newAuditType === 'Үлдэгдэлтэй бараа' && <span className="material-icons-round ml-auto text-primary">check_circle</span>}
                                </button>

                                <button
                                    onClick={() => setNewAuditType('Бүх бараа')}
                                    className={`flex items-center gap-5 p-6 rounded-[28px] border-2 transition-all ${newAuditType === 'Бүх бараа' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${newAuditType === 'Бүх бараа' ? 'bg-primary text-white' : 'bg-white text-gray-300'}`}>
                                        <span className="material-icons-round">inventory_2</span>
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-black uppercase text-[10px] tracking-widest ${newAuditType === 'Бүх бараа' ? 'text-primary' : 'text-gray-400'}`}>Дэлгэрэнгүй</p>
                                        <p className="font-bold text-gray-800">Бүх барааг тоолох</p>
                                    </div>
                                    {newAuditType === 'Бүх бараа' && <span className="material-icons-round ml-auto text-primary">check_circle</span>}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <PosDropdown label="Тоолох салбар" value={newAuditBranch} onChange={setNewAuditBranch} options={branchOptions.filter(o => o.value !== 'all')} />
                                <div className="flex flex-col gap-1.5 px-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Тооллогын тэмдэглэл</label>
                                    <textarea
                                        value={newAuditNotes}
                                        onChange={e => setNewAuditNotes(e.target.value)}
                                        className="w-full h-24 p-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner resize-none"
                                        placeholder="Нэмэлт тайлбар..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 h-16 bg-gray-100 text-gray-500 rounded-[24px] font-black uppercase text-[11px] tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    БОЛИХ
                                </button>
                                <button
                                    onClick={handleStartAudit}
                                    className="flex-2 h-16 bg-primary text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all px-12"
                                >
                                    ЭХЛЭХ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditListScreen;
