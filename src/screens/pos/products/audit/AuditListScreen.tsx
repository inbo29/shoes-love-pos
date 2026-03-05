import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import { mockAudits, Audit, AuditStatus, AuditItem, AuditType } from '../../../../services/mockAuditData';
import { mockProducts } from '../../../../services/mockProductData';

interface Props {
    userName: string;
    initialBranch: string;
}

type ViewMode = 'LIST' | 'DETAIL' | 'RESULT';

// ─── Mock staff list ────────────────────────────────────────────────────────
const STAFF_LIST = ['Админ', 'Ажилтан 1', 'Ажилтан 2', 'Ажилтан 3', 'Ажилтан 4'];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getStatusColor = (status: AuditStatus) => {
    switch (status) {
        case 'Процесс': return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'Түр хадгалсан': return 'bg-amber-100 text-amber-600 border-amber-200';
        case 'Дууссан': return 'bg-green-100 text-green-600 border-green-200';
        default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
};

const getDotColor = (status: AuditStatus) => {
    switch (status) {
        case 'Процесс': return 'bg-blue-500';
        case 'Түр хадгалсан': return 'bg-amber-500';
        case 'Дууссан': return 'bg-green-500';
        default: return 'bg-gray-400';
    }
};

const playBeep = () => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    } catch (_) { /* Safari fallback */ }
};

const buildAuditItem = (p: typeof mockProducts[0]): AuditItem => ({
    productId: p.id,
    productCode: p.id,
    barcode: p.id,
    productName: p.name,
    unit: 'ш',
    systemQty: p.stock ?? 0,
    actualQty: 0,
    diffQty: -(p.stock ?? 0),
    price: p.price ?? 0,
    diffAmount: -(p.stock ?? 0) * (p.price ?? 0),
    highlight: null,
});

// ═══════════════════════════════════════════════════════════════════════════
//  AuditListScreen
// ═══════════════════════════════════════════════════════════════════════════
const AuditListScreen: React.FC<Props> = ({ userName, initialBranch }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [activeAudit, setActiveAudit] = useState<Audit | null>(null);
    const [audits, setAudits] = useState<Audit[]>(mockAudits);

    // ─── List Filters ────────────────────────────────────────────────────
    const [searchNo, setSearchNo] = useState('');
    const [searchStatus, setSearchStatus] = useState('all');
    const [searchBranch, setSearchBranch] = useState(userName === 'Админ' ? 'all' : (initialBranch || 'Төв салбар'));
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [listPage, setListPage] = useState(1);

    // ─── Modal creation state ────────────────────────────────────────────
    const [newAuditType, setNewAuditType] = useState<AuditType>('Үлдэгдэлтэй бараа');
    const [newAuditBranch, setNewAuditBranch] = useState(initialBranch || 'Төв салбар');
    const [newAuditStaff, setNewAuditStaff] = useState(userName || 'Админ');
    const [newAuditNotes, setNewAuditNotes] = useState('');

    // ─── Detail/Edit state ───────────────────────────────────────────────
    const [scanQuery, setScanQuery] = useState('');
    const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
    const [manualInputs, setManualInputs] = useState<Record<string, string>>({});
    const [lastScannedId, setLastScannedId] = useState<string | null>(null);
    const scanInputRef = useRef<HTMLInputElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    // ─── Result screen toggle ────────────────────────────────────────────
    const [resultFilterMode, setResultFilterMode] = useState<'DIFF' | 'ALL'>('DIFF');

    // Focus scan input when entering edit mode
    useEffect(() => {
        if (viewMode === 'DETAIL') setTimeout(() => scanInputRef.current?.focus(), 100);
    }, [viewMode]);

    // Auto-clear row highlighting
    useEffect(() => {
        if (!lastScannedId) return;
        const timer = setTimeout(() => {
            setAuditItems(prev => prev.map(item =>
                item.productId === lastScannedId && item.highlight === 'scan' ? { ...item, highlight: null } : item
            ));
            setLastScannedId(null);
        }, 2000);
        return () => clearTimeout(timer);
    }, [lastScannedId]);

    // ─── Summary ─────────────────────────────────────────────────────────
    const summary = useMemo(() => auditItems.reduce((acc, item) => ({
        systemQty: acc.systemQty + item.systemQty,
        actualQty: acc.actualQty + item.actualQty,
        diffQty: acc.diffQty + item.diffQty,
        diffAmount: acc.diffAmount + item.diffAmount,
    }), { systemQty: 0, actualQty: 0, diffQty: 0, diffAmount: 0 }), [auditItems]);

    // ─── Handlers (Edit) ─────────────────────────────────────────────────
    const recalcItem = (item: AuditItem, newActual: number): AuditItem => {
        const safeQty = Math.max(0, newActual);
        const diff = safeQty - item.systemQty;
        const p = item.price || 0;
        return { ...item, actualQty: safeQty, diffQty: diff, diffAmount: diff * p };
    };

    const handleScan = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const q = scanQuery.trim().toLowerCase();
        if (!q) return;

        setAuditItems(prev => {
            const idx = prev.findIndex(item =>
                item.barcode?.toLowerCase() === q ||
                item.productCode.toLowerCase() === q ||
                item.productName.toLowerCase().includes(q)
            );

            if (idx >= 0) {
                playBeep();
                const updated = [...prev];
                updated[idx] = recalcItem({ ...updated[idx], highlight: 'scan' }, updated[idx].actualQty + 1);
                setLastScannedId(updated[idx].productId);
                setTimeout(() => {
                    tableRef.current?.querySelector(`[data-row="${updated[idx].productId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
                return updated;
            } else {
                const product = mockProducts.find(p => p.id.toLowerCase() === q || p.name.toLowerCase().includes(q));
                if (product) {
                    playBeep();
                    const newItem = buildAuditItem(product);
                    newItem.actualQty = 1;
                    newItem.diffQty = 1 - newItem.systemQty;
                    newItem.diffAmount = newItem.diffQty * newItem.price;
                    newItem.highlight = 'scan';
                    setLastScannedId(newItem.productId);
                    return [newItem, ...prev];
                }
                return prev;
            }
        });
        setScanQuery('');
        scanInputRef.current?.focus();
    }, [scanQuery]);

    const applyManualInput = (productId: string) => {
        const qty = parseInt(manualInputs[productId] || '0', 10);
        if (!qty || qty <= 0) return;
        setAuditItems(prev => prev.map(item => item.productId === productId ? recalcItem({ ...item, highlight: 'manual' }, item.actualQty + qty) : item));
        setManualInputs(prev => ({ ...prev, [productId]: '' }));
        scanInputRef.current?.focus();
    };

    // ─── Starting/Finishing ──────────────────────────────────────────────
    const handleStartAudit = () => {
        const products = newAuditType === 'Үлдэгдэлтэй бараа' ? mockProducts.filter(p => (p.stock ?? 0) > 0) : mockProducts;
        const items = products.map(buildAuditItem);
        const newAudit: Audit = {
            id: `AD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900) + 100}`,
            date: new Date().toISOString().slice(0, 10),
            branchName: newAuditBranch,
            type: newAuditType,
            totalProducts: items.length,
            totalDiffQty: 0,
            totalDiffAmount: 0,
            status: 'Процесс',
            manager: userName,
            staff: newAuditStaff,
            items,
            notes: newAuditNotes,
        };
        setActiveAudit(newAudit);
        setAuditItems(items);
        setManualInputs({});
        setViewMode('DETAIL');
        setIsCreateModalOpen(false);
        setNewAuditNotes('');
    };

    const confirmFinishAudit = () => {
        if (!activeAudit) return;
        const doneAudit: Audit = {
            ...activeAudit,
            status: 'Дууссан',
            doneAt: new Date().toISOString(),
            doneBy: activeAudit.staff || userName, // locked staff
            totalDiffQty: summary.diffQty,
            totalDiffAmount: summary.diffAmount,
            items: [...auditItems],
            diffSummary: {
                systemQtyTotal: summary.systemQty,
                countedQtyTotal: summary.actualQty,
                diffQtyTotal: summary.diffQty,
                diffAmountTotal: summary.diffAmount
            }
        };
        setActiveAudit(doneAudit);

        // Save to global list
        setAudits(prev => {
            const exists = prev.some(a => a.id === doneAudit.id);
            return exists ? prev.map(a => a.id === doneAudit.id ? doneAudit : a) : [doneAudit, ...prev];
        });

        setIsConfirmModalOpen(false);
        setViewMode('RESULT');
    };

    // ─── Printing ────────────────────────────────────────────────────────
    const handlePrintBlankSheet = () => {
        const products = newAuditType === 'Үлдэгдэлтэй бараа' ? mockProducts.filter(p => (p.stock ?? 0) > 0) : mockProducts;
        const rows = products.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>ш</td><td></td></tr>`).join('');
        const html = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;font-size:11px;padding:20px}h2{text-align:center;margin-bottom:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#f5f5f5;font-weight:bold}td:last-child{width:80px;min-width:80px}</style></head><body><h2>ТООЛЛОГЫН ХУУДАС — ${newAuditBranch} (${new Date().toISOString().slice(0, 10)})</h2><table><thead><tr><th>Barcode</th><th>Барааны нэр</th><th>Нэгж</th><th>Тоолсон тоо</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); w.print(); }
    };

    const handlePrintResult = () => {
        if (!activeAudit) return;
        const items = resultFilterMode === 'DIFF' ? auditItems.filter(i => i.diffQty !== 0) : auditItems;
        const rows = items.map(p => `<tr><td>${p.productCode}</td><td>${p.productName}</td><td style="text-align:center">${p.systemQty}</td><td style="text-align:center">${p.actualQty}</td><td style="text-align:center;color:${p.diffQty === 0 ? '#666' : p.diffQty > 0 ? '#16a34a' : '#dc2626'}">${p.diffQty > 0 ? '+' : ''}${p.diffQty}</td><td style="text-align:right">${p.price > 0 ? p.price.toLocaleString() + '₮' : '-'}</td><td style="text-align:right">${p.diffAmount > 0 ? '+' : ''}${p.diffAmount.toLocaleString()}₮</td></tr>`).join('');

        const html = `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;font-size:12px;padding:20px;color:#111827}h2{text-align:center;margin-bottom:20px;text-transform:uppercase}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #e5e7eb;padding:8px;text-align:left}th{background:#f9fafb;font-weight:bold}.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;background:#f3f4f6;padding:15px;border-radius:8px}.meta{margin-bottom:20px}</style></head><body><h2>Тооллогын тайлан</h2><div class="meta"><p><strong>Тооллого №:</strong> ${activeAudit.id}</p><p><strong>Салбар:</strong> ${activeAudit.branchName}</p><p><strong>Огноо:</strong> ${activeAudit.doneAt ? new Date(activeAudit.doneAt).toLocaleDateString() : activeAudit.date}</p><p><strong>Ажилтан:</strong> ${activeAudit.doneBy || activeAudit.staff}</p></div><div class="summary-grid"><div><strong>Систем үлдэгдэл:</strong> ${activeAudit.diffSummary?.systemQtyTotal || 0}</div><div><strong>Бодит тоо:</strong> ${activeAudit.diffSummary?.countedQtyTotal || 0}</div><div><strong>Нийт зөрүү:</strong> ${activeAudit.diffSummary?.diffQtyTotal || 0}</div><div><strong>Зөрүү дүн:</strong> ${(activeAudit.diffSummary?.diffAmountTotal || 0).toLocaleString()}₮</div></div><table><thead><tr><th>Код</th><th>Барааны нэр</th><th>Систем</th><th>Тоолсон</th><th>Зөрүү</th><th>Нэг үнэ</th><th>Зөрүү үнэ</th></tr></thead><tbody>${rows}</tbody></table><p style="text-align:center;margin-top:20px;color:#9ca3af;font-size:10px">Powered by Shoes Love POS</p></body></html>`;
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); w.print(); }
    };

    // ─── List filtering ──────────────────────────────────────────────────
    const filteredAudits = useMemo(() => {
        return audits.filter(a => {
            const matchesNo = a.id.toLowerCase().includes(searchNo.toLowerCase());
            const matchesStatus = searchStatus === 'all' || a.status === searchStatus;
            const matchesBranch = searchBranch === 'all' || a.branchName === searchBranch;
            const aDate = new Date(a.date);
            const matchesDate = (!startDate || aDate >= startDate) && (!endDate || aDate <= endDate);
            return matchesNo && matchesStatus && matchesBranch && matchesDate;
        });
    }, [audits, searchNo, searchStatus, searchBranch, startDate, endDate]);


    // ═══ RENDER 1: LIST ══════════════════════════════════════════════════
    const renderList = () => (
        <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-primary rounded-sm" />
                    <h2 className="text-xl font-bold text-[#374151] uppercase tracking-tight">Тооллогын жагсаалт</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 h-[44px] rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold text-[12px] uppercase tracking-wider active:scale-95 transition-all w-full sm:w-auto">
                        <span className="material-icons-round text-lg">add_circle</span> Шинэ тооллого эхлэх
                    </button>
                    <PosExcelButton />
                </div>
            </div>

            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0">
                <div className="flex-1 min-w-[220px]">
                    <PosDateRangePicker label="Захиалсан хугацаа" start={startDate} end={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e); setListPage(1); }} />
                </div>
                <PosDropdown label="Салбар" icon="storefront" value={searchBranch} onChange={v => { setSearchBranch(v); setListPage(1); }} options={[{ label: 'Бүх салбар', value: 'all' }, { label: 'Төв салбар', value: 'Төв салбар' }, { label: 'Салбар 1', value: 'Салбар 1' }]} disabled={userName !== 'Админ'} className="w-[150px]" />
                <PosDropdown label="Төлөв" icon="flag" value={searchStatus} onChange={v => { setSearchStatus(v); setListPage(1); }} options={[{ label: 'Бүх төлөв', value: 'all' }, { label: 'Процесс', value: 'Процесс' }, { label: 'Түр хадгалсан', value: 'Түр хадгалсан' }, { label: 'Дууссан', value: 'Дууссан' }]} className="w-[160px]" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Дугаараар хайх</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none"><span className="material-icons-round text-sm">confirmation_number</span></span>
                        <input type="text" value={searchNo} onChange={e => { setSearchNo(e.target.value); setListPage(1); }} className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all" placeholder="Тооллогын №" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                    <div className="min-w-[1000px] flex flex-col">
                        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[12px] font-bold tracking-widest items-center uppercase text-left">
                            <div className="w-[180px] shrink-0">Тооллогын №</div>
                            <div className="w-[120px] shrink-0 px-2">Огноо</div>
                            <div className="w-[140px] shrink-0 px-2">Салбар</div>
                            <div className="w-[130px] shrink-0 px-2">Төрөл</div>
                            <div className="w-[200px] shrink-0 px-2">Тайлбар</div>
                            <div className="w-[100px] shrink-0 px-2 text-center">Зөрүү (тоо)</div>
                            <div className="w-[120px] shrink-0 px-2 text-right">Зөрүү (₮)</div>
                            <div className="flex-1 flex justify-end pr-4">Төлөв</div>
                        </div>
                        {filteredAudits.length > 0 ? filteredAudits.slice((listPage - 1) * 10, listPage * 10).map(a => (
                            <div key={a.id} onClick={() => { setActiveAudit(a); setAuditItems(a.items || []); setViewMode(a.status === 'Дууссан' ? 'RESULT' : 'DETAIL'); }} className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group">
                                <div className="w-[180px] shrink-0 font-extrabold text-primary group-hover:underline">{a.id}</div>
                                <div className="w-[120px] shrink-0 px-2 text-gray-400 text-xs font-medium">{a.doneAt ? new Date(a.doneAt).toLocaleDateString() : a.date}</div>
                                <div className="w-[140px] shrink-0 px-2 font-bold text-gray-700">{a.branchName}</div>
                                <div className="w-[130px] shrink-0 px-2 font-bold text-gray-500">{a.type}</div>
                                <div className="w-[200px] shrink-0 px-2 text-[11px] text-gray-400 truncate" title={a.notes}>{a.notes || '—'}</div>
                                <div className={`w-[100px] shrink-0 px-2 text-center font-black ${a.totalDiffQty === 0 ? 'text-gray-400' : a.totalDiffQty > 0 ? 'text-green-500' : 'text-red-500'}`}>{a.totalDiffQty > 0 ? '+' : ''}{a.totalDiffQty}</div>
                                <div className={`w-[120px] shrink-0 px-2 text-right font-black ${a.totalDiffAmount === 0 ? 'text-gray-400' : a.totalDiffAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>{a.totalDiffAmount > 0 ? '+' : ''}{a.totalDiffAmount.toLocaleString()}₮</div>
                                <div className="flex-1 flex justify-end items-center gap-2 pr-2">
                                    <span className={`px-3 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 ${getStatusColor(a.status)}`}><span className={`w-1.5 h-1.5 rounded-full ${getDotColor(a.status)}`} />{a.status}</span>
                                    <span className="material-icons-round text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-300"><span className="material-icons-round text-6xl mb-4 opacity-20">search_off</span><p className="font-bold text-lg">Мэдээлэл олдсонгүй</p></div>
                        )}
                    </div>
                </div>
                <PosPagination totalItems={filteredAudits.length} itemsPerPage={10} currentPage={listPage} onPageChange={setListPage} />
            </div>
        </div>
    );

    // ═══ RENDER 2: DETAIL (EDIT) ════════════════════════════════════════
    const renderDetail = () => (
        <div className="flex-1 flex flex-col overflow-hidden h-full">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setViewMode('LIST')} className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400">
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-0.5">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{activeAudit?.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border flex items-center gap-1 ${getStatusColor(activeAudit?.status || 'Процесс')}`}><span className={`w-1.5 h-1.5 rounded-full ${getDotColor(activeAudit?.status || 'Процесс')}`} />{activeAudit?.status}</span>
                        </div>
                        <h2 className="text-lg font-black text-gray-800">{activeAudit?.branchName} — {activeAudit?.type}{activeAudit?.staff && <span className="ml-3 text-sm font-bold text-gray-400">/ {activeAudit.staff}</span>}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { /* implicit save */ setViewMode('LIST'); }} className="h-11 px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest">Түр хадгалах</button>
                    <button onClick={() => setIsConfirmModalOpen(true)} className="h-11 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95">Тооллого дуусгах</button>
                </div>
            </div>

            <div className="bg-white border-b border-gray-100 px-6 py-3 shrink-0">
                <form onSubmit={handleScan} className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-[600px]">
                        <span className="absolute inset-y-0 left-4 flex items-center text-primary"><span className="material-icons-round text-xl">qr_code_scanner</span></span>
                        <input ref={scanInputRef} type="text" value={scanQuery} onChange={e => setScanQuery(e.target.value)} className="w-full h-12 pl-12 pr-32 bg-primary/5 border-2 border-primary/20 rounded-xl text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all" placeholder="Barcode / код / нэр хайх эсвэл сканнердах..." autoComplete="off" />
                    </div>
                    <div className="flex gap-4">
                        <div className="px-5 h-12 bg-gray-50 rounded-xl flex flex-col justify-center"><span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Нийт</span><p className="text-base font-black text-gray-800 leading-none">{auditItems.length}</p></div>
                        <div className="px-5 h-12 bg-emerald-50 rounded-xl flex flex-col justify-center"><span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Тоолсон</span><p className="text-base font-black text-emerald-600 leading-none">{auditItems.filter(i => i.actualQty > 0).length}</p></div>
                    </div>
                </form>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col bg-white min-h-0">
                <div className="overflow-x-auto overflow-y-auto no-scrollbar flex-1" ref={tableRef}>
                    <table className="w-full min-w-[1300px] border-collapse relative">
                        <thead className="sticky top-0 z-20 shadow-sm">
                            <tr className="bg-gray-50 border-b border-gray-100 text-[9.5px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="text-left px-4 py-3 w-[120px]">Barcode</th>
                                <th className="text-left px-2 py-3">Барааны нэр</th>
                                <th className="text-center px-2 py-3 w-[100px]">Систем</th>
                                <th className="text-center px-2 py-3 w-[90px] text-emerald-500">Тоолсон</th>
                                <th className="text-center px-2 py-3 w-[80px] text-primary">Зөрүү</th>
                                <th className="text-right px-2 py-3 w-[100px]">Нэг үнэ</th>
                                <th className="text-right px-2 py-3 w-[110px]">Зөрүү үнэ</th>
                                <th className="text-center px-2 py-3 w-[130px]">Гараас орсон</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {auditItems.map(item => (
                                <tr key={item.productId} data-row={item.productId} className={`text-[12px] transition-all duration-300 ${item.highlight === 'scan' ? 'bg-emerald-50 border-l-4 border-emerald-400' : item.highlight === 'manual' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-white border-l-4 border-transparent'}`}>
                                    <td className="px-4 py-3 font-mono text-[11px] text-gray-400">{item.barcode || item.productCode}</td>
                                    <td className="px-2 py-3 font-bold text-gray-800"><p className="truncate" title={item.productName}>{item.productName}</p></td>
                                    <td className="px-2 py-3 text-center"><span className="font-black text-gray-600">{item.systemQty}</span></td>
                                    <td className="px-2 py-3 text-center"><span className={`font-black text-lg ${item.actualQty > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>{item.actualQty}</span></td>
                                    <td className="px-2 py-3 text-center"><span className={`font-black text-sm ${item.diffQty === 0 ? 'text-gray-300' : item.diffQty > 0 ? 'text-green-500' : 'text-red-500'}`}>{item.diffQty > 0 ? '+' : ''}{item.diffQty}</span></td>
                                    <td className="px-2 py-3 text-right font-bold text-gray-400 text-[11px]">{item.price > 0 ? item.price.toLocaleString() + '₮' : <span className="text-[9px] bg-red-100 text-red-500 px-2 py-0.5 rounded">Үнэ байхгүй</span>}</td>
                                    <td className="px-2 py-3 text-right"><span className={`font-black text-[11px] ${item.diffAmount === 0 ? 'text-gray-300' : item.diffAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>{item.diffAmount > 0 ? '+' : ''}{item.diffAmount.toLocaleString()}₮</span></td>
                                    <td className="px-2 py-3 text-center">
                                        <div className="flex items-center gap-1 justify-center">
                                            <input type="number" min="0" value={manualInputs[item.productId] || ''} onChange={e => setManualInputs(prev => ({ ...prev, [item.productId]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyManualInput(item.productId); } }} className="w-20 h-8 text-center bg-white border-2 border-gray-100 rounded-lg text-[12px] font-black text-primary" placeholder="0" />
                                            <button onClick={() => applyManualInput(item.productId)} className="w-7 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg"><span className="material-icons-round text-sm">add</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-[#111827] px-8 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-10">
                        <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Систем үлдэгдэл</p><p className="text-xl font-black text-white">{summary.systemQty.toLocaleString()} <span className="text-xs text-gray-500">ш</span></p></div>
                        <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Бодит тоо</p><p className="text-xl font-black text-emerald-400">{summary.actualQty.toLocaleString()} <span className="text-xs text-gray-500">ш</span></p></div>
                        <div><p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Нийт зөрүү</p><p className={`text-xl font-black ${summary.diffQty === 0 ? 'text-gray-400' : summary.diffQty > 0 ? 'text-green-400' : 'text-red-400'}`}>{summary.diffQty > 0 ? '+' : ''}{summary.diffQty.toLocaleString()}</p></div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Зөрүү мөнгөн дүн</p>
                        <div className="flex items-baseline gap-1.5"><span className={`text-3xl font-black ${summary.diffAmount === 0 ? 'text-white' : summary.diffAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>{summary.diffAmount > 0 ? '+' : ''}{summary.diffAmount.toLocaleString()}</span><span className="text-lg font-bold text-gray-500">₮</span></div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ═══ RENDER 3: RESULT VIEW ══════════════════════════════════════════
    const renderResult = () => {
        if (!activeAudit) return null;

        // Grab diffs safely
        const sys = activeAudit.diffSummary?.systemQtyTotal || 0;
        const count = activeAudit.diffSummary?.countedQtyTotal || 0;
        const diffQ = activeAudit.diffSummary?.diffQtyTotal || 0;
        const diffA = activeAudit.diffSummary?.diffAmountTotal || 0;

        // Filter table data
        const displayItems = resultFilterMode === 'DIFF' ? (activeAudit.items || []).filter(i => i.diffQty !== 0) : (activeAudit.items || []);

        // Calculate mock adjustments
        const modified = (activeAudit.items || []).filter(i => i.diffQty !== 0).length;
        const added = (activeAudit.items || []).filter(i => i.systemQty === 0 && i.actualQty > 0).length;

        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden p-6 gap-6">
                {/* Header Section */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 shrink-0 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500"><span className="material-icons-round text-lg">check_circle</span></div>
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Тооллогын тайлан {diffQ === 0 && <span className="ml-2 text-sm text-gray-400 normal-case">— Зөрүү алга</span>}</h2>
                        </div>
                        <div className="flex gap-6 mt-4 text-[12px] text-gray-500 font-bold">
                            <p>№: <span className="text-gray-900 ml-1">{activeAudit.id}</span></p>
                            <p>Салбар: <span className="text-gray-900 ml-1">{activeAudit.branchName}</span></p>
                            <p>Огноо: <span className="text-gray-900 ml-1">{activeAudit.doneAt ? new Date(activeAudit.doneAt).toLocaleDateString() : activeAudit.date}</span></p>
                            <p>Ажилтан: <span className="text-primary ml-1">{activeAudit.doneBy || activeAudit.staff}</span></p>
                        </div>
                        {activeAudit.notes && <p className="mt-3 text-[11px] text-gray-400 border-l-2 border-gray-200 pl-3">Тайлбар: {activeAudit.notes}</p>}
                    </div>
                    {/* Auto-adjustment Mock */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-right">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center justify-end gap-1"><span className="material-icons-round text-[14px]">auto_fix_high</span> Автомат тохируулга</p>
                        <p className="text-[12px] font-bold text-gray-700">Зассан: <span className="text-blue-600 font-black">{modified}</span></p>
                        <p className="text-[12px] font-bold text-gray-700">Нэмэгдсэн: <span className="text-blue-600 font-black">{added}</span></p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-5 shrink-0">
                    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Систем үлдэгдэл</span>
                        <p className="text-2xl font-black text-gray-800">{sys.toLocaleString()} <span className="text-sm text-gray-400">ш</span></p>
                    </div>
                    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Бодит тоо</span>
                        <p className="text-2xl font-black text-emerald-600">{count.toLocaleString()} <span className="text-sm text-gray-400">ш</span></p>
                    </div>
                    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Нийт зөрүү</span>
                        <p className={`text-2xl font-black ${diffQ === 0 ? 'text-gray-400' : diffQ > 0 ? 'text-green-500' : 'text-red-500'}`}>{diffQ > 0 ? '+' : ''}{diffQ.toLocaleString()} <span className="text-sm opacity-50">ш</span></p>
                    </div>
                    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Зөрүү мөнгөн дүн</span>
                        <p className={`text-2xl font-black ${diffA === 0 ? 'text-gray-400' : diffA > 0 ? 'text-green-500' : 'text-red-500'}`}>{diffA > 0 ? '+' : ''}{diffA.toLocaleString()}₮</p>
                    </div>
                </div>

                {/* Table Area (Strict layout) */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden min-h-0 relative">
                    {/* Toolbar */}
                    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
                        <h3 className="font-black text-[13px] text-gray-800 uppercase tracking-widest">Зөрүүтэй бараанууд</h3>
                        {/* Toggle */}
                        <div className="bg-gray-100 rounded-lg p-1 flex">
                            <button onClick={() => setResultFilterMode('DIFF')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${resultFilterMode === 'DIFF' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}>Зөвхөн зөрүүтэй</button>
                            <button onClick={() => setResultFilterMode('ALL')} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${resultFilterMode === 'ALL' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}>Бүгд</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 border-b border-gray-100 shadow-sm">
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Барааны нэр</th>
                                    <th className="px-4 py-4 text-center w-[120px]">Систем</th>
                                    <th className="px-4 py-4 text-center w-[120px]">Тоолсон</th>
                                    <th className="px-4 py-4 text-center w-[100px]">Зөрүү</th>
                                    <th className="px-4 py-4 text-right w-[120px]">Нэг үнэ</th>
                                    <th className="px-6 py-4 text-right w-[140px]">Зөрүү үнэ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayItems.map(item => (
                                    <tr key={item.productId} className="text-[12px] hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            <p>{item.productName}</p>
                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.productCode}</p>
                                        </td>
                                        <td className="px-4 py-4 text-center font-bold text-gray-600">{item.systemQty}</td>
                                        <td className="px-4 py-4 text-center font-black text-gray-800">{item.actualQty}</td>
                                        <td className="px-4 py-4 text-center font-black">
                                            <span className={`px-2 py-1 rounded text-[11px] ${item.diffQty === 0 ? 'bg-gray-100 text-gray-400' : item.diffQty > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {item.diffQty > 0 ? '+' : ''}{item.diffQty}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-gray-400">
                                            {item.price > 0 ? item.price.toLocaleString() + '₮' : <span className="text-[9px] bg-red-100 text-red-500 px-2 py-0.5 rounded">Үнэ байхгүй</span>}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-black ${item.diffAmount === 0 ? 'text-gray-400' : item.diffAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.diffAmount > 0 ? '+' : ''}{item.diffAmount.toLocaleString()}₮
                                        </td>
                                    </tr>
                                ))}
                                {displayItems.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-10 text-gray-400 font-bold">Одоогоор харуулах дата алга</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex gap-4 shrink-0">
                    <button onClick={handlePrintResult} className="h-12 px-6 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"><span className="material-icons-round text-[16px]">print</span> Хэвлэх</button>
                    <button className="h-12 px-6 bg-white border border-gray-200 text-green-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"><span className="material-icons-round text-[16px]">sim_card_download</span> Excel татах</button>
                    <button onClick={() => setViewMode('LIST')} className="ml-auto h-12 px-8 bg-gray-900 text-white hover:bg-black rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Жагсаалт руу буцах</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 h-full relative overflow-hidden flex flex-col">
            {viewMode === 'LIST' && renderList()}
            {viewMode === 'DETAIL' && renderDetail()}
            {viewMode === 'RESULT' && renderResult()}

            {/* ═══ CREATE MODAL ══════════════════════════════════════ */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar">
                        <h3 className="text-xl font-black text-gray-800 uppercase text-center mb-2">Шинэ тооллого</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {(['Үлдэгдэлтэй бараа', 'Бүх бараа'] as AuditType[]).map(type => (
                                <button key={type} onClick={() => setNewAuditType(type)} className={`p-4 rounded-[20px] transition-all text-center border-2 ${newAuditType === type ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'}`}>
                                    <span className="material-icons-round text-2xl mb-1">{type === 'Үлдэгдэлтэй бараа' ? 'rule' : 'inventory_2'}</span>
                                    <p className="font-black text-[12px]">{type}</p>
                                </button>
                            ))}
                        </div>
                        <PosDropdown label="Салбар" icon="storefront" value={newAuditBranch} onChange={setNewAuditBranch} options={[{ label: 'Төв салбар', value: 'Төв салбар' }, { label: 'Салбар 1', value: 'Салбар 1' }]} />
                        <PosDropdown label="Хийж буй ажилтан" icon="person" value={newAuditStaff} onChange={setNewAuditStaff} options={STAFF_LIST.map(s => ({ label: s, value: s }))} />
                        <textarea value={newAuditNotes} onChange={e => setNewAuditNotes(e.target.value)} rows={3} className="w-full p-4 bg-gray-50 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Тайлбар..." />
                        <button onClick={handlePrintBlankSheet} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"><span className="material-icons-round text-sm">print</span> Хуудас хэвлэх</button>
                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-xl font-black text-[11px] uppercase tracking-widest">Болих</button>
                            <button onClick={handleStartAudit} className="flex-[2] py-4 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95">Эхлэх</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ CONFIRM MODAL ═════════════════════════════════════ */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-[420px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200 flex flex-col items-center">
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-5">
                            <span className="material-icons-round text-4xl">warning_rounded</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-800 uppercase text-center mb-2">Тооллого дуусгах уу?</h3>
                        <p className="text-sm font-bold text-gray-400 text-center mb-6 leading-relaxed">Системд өөрчлөлт хадгалагдах бөгөөд дахин засах боломжгүй.</p>

                        <div className="w-full bg-gray-50 rounded-2xl p-5 flex flex-col gap-3 mb-8">
                            <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Систем үлдэгдэл</span><span className="font-bold text-gray-800">{summary.systemQty} ш</span></div>
                            <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Тоолсон нийт тоо</span><span className="font-black text-emerald-600">{summary.actualQty} ш</span></div>
                            <div className="h-px bg-gray-200 w-full my-1" />
                            <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Зөрүү (Тоо)</span><span className={`font-black ${summary.diffQty === 0 ? 'text-gray-400' : summary.diffQty > 0 ? 'text-green-500' : 'text-red-500'}`}>{summary.diffQty > 0 ? '+' : ''}{summary.diffQty} ш</span></div>
                            <div className="flex justify-between items-center"><span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Зөрүү мөнгөн дүн</span><span className={`font-black ${summary.diffAmount === 0 ? 'text-gray-400' : summary.diffAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>{summary.diffAmount > 0 ? '+' : ''}{summary.diffAmount.toLocaleString()}₮</span></div>
                        </div>

                        <div className="flex w-full gap-3">
                            <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-[16px] font-black text-[11px] uppercase tracking-widest transition-all">Цуцлах</button>
                            <button onClick={confirmFinishAudit} className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-[16px] font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">Дуусгах <span className="material-icons-round text-[14px]">chevron_right</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditListScreen;
