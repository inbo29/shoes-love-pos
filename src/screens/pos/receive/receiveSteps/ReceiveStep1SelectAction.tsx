import React, { useState } from 'react';
import type { ReceiveOrder, ItemDecision, ComplaintType } from '../receiveTypes';
import { COMPLAINT_TYPES } from '../receiveTypes';

interface Props {
    orderData: ReceiveOrder;
    itemDecisions: ItemDecision[];
    onDecisionsChange: (decisions: ItemDecision[]) => void;
    onValidationChange: (isValid: boolean) => void;
}

const ReceiveStep1SelectAction: React.FC<Props> = ({
    orderData,
    itemDecisions,
    onDecisionsChange,
    onValidationChange
}) => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const getDecision = (itemId: number) => itemDecisions.find(d => d.itemId === itemId);

    // Masking helpers
    const maskName = (name: string) => {
        if (!name) return '';
        if (name.length <= 2) return name[0] + '*';
        let masked = name[0];
        for (let i = 1; i < name.length - 1; i++) {
            masked += (name[i] === ' ' || name[i] === '.' || name[i] === '-') ? name[i] : '*';
        }
        masked += name[name.length - 1];
        return masked;
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '';
        const parts = phone.split('-');
        if (parts.length === 2) return parts[0].substring(0, 2) + '**-****';
        return phone.substring(0, 2) + '****';
    };

    const updateDecision = (itemId: number, updates: Partial<ItemDecision>) => {
        const existing = itemDecisions.find(d => d.itemId === itemId);
        let newDecisions: ItemDecision[];
        if (existing) {
            newDecisions = itemDecisions.map(d =>
                d.itemId === itemId ? { ...d, ...updates } : d
            );
        } else {
            newDecisions = [...itemDecisions, { itemId, action: 'receive', ...updates } as ItemDecision];
        }
        onDecisionsChange(newDecisions);
        validateAll(newDecisions);
    };

    // Toggle complaint type (multi-select)
    const toggleComplaintType = (itemId: number, type: ComplaintType) => {
        const dec = itemDecisions.find(d => d.itemId === itemId);
        if (!dec) return;
        const current = dec.complaintTypes || (dec.complaintType ? [dec.complaintType] : []);
        const updated = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        updateDecision(itemId, { complaintTypes: updated, complaintType: updated[0] });
    };

    const validateAll = (decisions: ItemDecision[], c1 = checked1, c2 = checked2) => {
        const actionableItems = orderData.items.filter(i => i.status === 'PENDING' || i.status === 'REORDER_DONE');
        const allDecided = actionableItems.every(item => {
            const dec = decisions.find(d => d.itemId === item.id);
            if (!dec) return false;
            if (dec.action === 'complaint') {
                return dec.complaintReason && dec.complaintReason.trim().length > 0;
            }
            return true;
        });
        onValidationChange(allDecided && c1 && c2);
    };

    // Re-validate when checkboxes change
    React.useEffect(() => {
        if (itemDecisions.length > 0) {
            validateAll(itemDecisions, checked1, checked2);
        }
    }, [checked1, checked2, itemDecisions]);

    // Determine which items are actionable (PENDING / REORDER_DONE) vs read-only (RECEIVED / REFUNDED)
    const actionableItems = orderData.items.filter(i => i.status === 'PENDING' || i.status === 'REORDER_DONE');
    const processedItems = orderData.items.filter(i => i.status === 'RECEIVED' || i.status === 'REFUNDED');
    const hasReorderDoneItems = orderData.items.some(i => i.status === 'REORDER_DONE');

    // Auto-initialize only for actionable items
    React.useEffect(() => {
        if (itemDecisions.length === 0 && actionableItems.length > 0) {
            const initial = actionableItems.map(item => ({
                itemId: item.id,
                action: 'receive' as const,
            }));
            onDecisionsChange(initial);
            onValidationChange(true);
        }
    }, []);

    const hasComplaints = itemDecisions.some(d => d.action === 'complaint');
    const receiveCount = itemDecisions.filter(d => d.action === 'receive').length;
    const complaintCount = itemDecisions.filter(d => d.action === 'complaint').length;

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] gap-0 overflow-hidden">
            {/* LEFT: Items */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-3 md:p-5">
                <div className="overflow-y-auto flex-1 no-scrollbar space-y-6 pb-4">

                    {/* Order Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span className="material-icons-round text-primary text-2xl">receipt_long</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Захиалгын №</span>
                                    <span className="text-lg font-black text-gray-800">{orderData.id}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                        <span className="material-icons-round text-xs">calendar_today</span>
                                        Дуусан огноо: {orderData.finishedDate}
                                    </span>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border border-primary/20 whitespace-nowrap shrink-0">
                                Хүлээлгэн өгөхөд бэлэн
                            </span>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-gray-50 rounded-xl p-3">
                            <span className="text-[8px] font-black text-primary uppercase tracking-wider">Хэрэглэгчийн мэдээлэл</span>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                <div>
                                    <span className="text-[8px] text-gray-400 font-bold block uppercase">Нэр</span>
                                    <span className="text-xs font-black text-gray-800">{maskName(orderData.customer.name)}</span>
                                </div>
                                <div>
                                    <span className="text-[8px] text-gray-400 font-bold block uppercase">Утас</span>
                                    <span className="text-xs font-black text-gray-800">{maskPhone(orderData.customer.phone)}</span>
                                </div>
                                <div>
                                    <span className="text-[8px] text-gray-400 font-bold block uppercase">Хүлээлгэн өгөх огноо</span>
                                    <span className="text-xs font-black text-gray-800">{orderData.finishedDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== PREVIOUSLY PROCESSED ITEMS (read-only) ===== */}
                    {processedItems.length > 0 && (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-1.5 bg-gray-300 rounded-sm"></div>
                                <h2 className="text-[14px] font-bold text-gray-400">Өмнө шийдвэрлэсэн</h2>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 ml-1 border border-gray-200">
                                    {processedItems.length} бараа
                                </span>
                            </div>
                            {processedItems.map((item, pIdx) => {
                                const globalIdx = orderData.items.findIndex(i => i.id === item.id);
                                const itemNum = String(globalIdx + 1).padStart(2, '0');
                                return (
                                <div key={`processed-${item.id}`} className="bg-white/60 rounded-2xl border-2 border-gray-100 opacity-70 overflow-hidden">
                                    <div className="p-4 flex flex-col sm:flex-row gap-3">
                                        <div className="relative w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                            <span className="absolute -top-0.5 -left-0.5 z-10 bg-gray-400 text-white text-[8px] font-black rounded-br-lg rounded-tl-lg px-1.5 py-0.5 leading-none shadow-sm">{itemNum}</span>
                                            {item.photos[0] ? (
                                                <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover grayscale" />
                                            ) : (
                                                <span className="material-icons-round text-gray-300 text-2xl">inventory_2</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-gray-500"><span className="text-gray-400">[{itemNum}]</span> {item.name}</h3>
                                                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'RECEIVED'
                                                    ? 'text-green-600 bg-green-50 border-green-200'
                                                    : 'text-red-500 bg-red-50 border-red-200'
                                                    }`}>
                                                    {item.status === 'RECEIVED' ? '✓ Хүлээн авсан' : '↩ Буцаагдсан'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] text-gray-400 font-bold">{item.details?.brand}</span>
                                                {item.details?.brand && <span className="text-gray-200 text-[8px]">|</span>}
                                                <span className="text-[9px] text-gray-400 font-medium">{item.services.join(', ')}</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-400 mt-1">{item.price.toLocaleString()}₮</p>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </>
                    )}

                    {/* ===== ACTIONABLE ITEMS ===== */}
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h2 className="text-[14px] font-bold text-[#374151]">
                            {hasReorderDoneItems ? 'Дахин хүлээн авах бараа' : 'Захиалгын задаргаа'}
                        </h2>
                        <span className="text-[10px] font-bold text-white bg-primary rounded-full px-2 py-0.5 ml-1">
                            {actionableItems.length} бараа
                        </span>
                        {hasReorderDoneItems && (
                            <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 ml-1">
                                재주문 완료
                            </span>
                        )}
                    </div>

                    {/* Actionable Item Cards */}
                    {actionableItems.map(item => {
                        const decision = getDecision(item.id);
                        const isComplaint = decision?.action === 'complaint';
                        const isReceive = decision?.action === 'receive';
                        const globalIdx = orderData.items.findIndex(i => i.id === item.id);
                        const itemNum = String(globalIdx + 1).padStart(2, '0');

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${isComplaint
                                    ? 'border-orange-200 shadow-lg shadow-orange-100/50'
                                    : isReceive
                                        ? 'border-green-200 shadow-sm'
                                        : 'border-gray-100'
                                    }`}
                            >
                                {/* Reorder History Banner (for REORDER_DONE items) */}
                                {item.reorderHistory && (
                                    <div className="bg-purple-50 border-b-2 border-purple-100 px-4 py-3">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span className="material-icons-round text-purple-500 text-sm">history</span>
                                            <span className="text-[9px] font-black text-purple-600 uppercase tracking-wider">Дахин захиалгын түүх</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <div>
                                                <span className="text-[7px] text-purple-400 font-bold uppercase block">Гомдлын ID</span>
                                                <span className="text-[10px] font-black text-purple-800">{item.reorderHistory.originalComplaintId}</span>
                                            </div>
                                            <div>
                                                <span className="text-[7px] text-purple-400 font-bold uppercase block">Дахин захиалсан</span>
                                                <span className="text-[10px] font-black text-purple-800">{item.reorderHistory.reorderDate}</span>
                                            </div>
                                            <div>
                                                <span className="text-[7px] text-purple-400 font-bold uppercase block">Дуусан огноо</span>
                                                <span className="text-[10px] font-black text-purple-800">{item.reorderHistory.reorderCompleteDate}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-[7px] text-purple-400 font-bold uppercase block">Гомдлын шалтгаан</span>
                                            <p className="text-[10px] font-bold text-purple-700 mt-0.5">{item.reorderHistory.complaintReason}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {item.reorderHistory.complaintTypes.map((ct, ci) => (
                                                <span key={ci} className="text-[8px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                                                    {ct}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Item Header with Actions */}
                                <div className="p-4 flex flex-col sm:flex-row gap-3">
                                    {/* Photo with Number Badge */}
                                    <div className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                        <span className={`absolute -top-0.5 -left-0.5 z-10 text-white text-[9px] font-black rounded-br-lg rounded-tl-lg px-2 py-0.5 leading-none shadow-sm ${
                                            isComplaint ? 'bg-orange-500' : isReceive ? 'bg-green-500' : 'bg-primary'
                                        }`}>{itemNum}</span>
                                        {item.photos[0] ? (
                                            <img src={item.photos[0]} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-icons-round text-gray-300 text-2xl">inventory_2</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="material-icons-round text-primary text-sm">hiking</span>
                                            <h3 className="text-sm font-black text-gray-800 uppercase"><span className="text-primary">[{itemNum}]</span> {item.name}</h3>
                                            {item.damage.hasDamage && (
                                                <span className="text-[8px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                                                    ГЭМТЭЛТЭЙ
                                                </span>
                                            )}
                                            {item.status !== 'PENDING' && (
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${item.status === 'RECEIVED' ? 'text-green-600 bg-green-50 border-green-100' :
                                                    item.status === 'REFUNDED' ? 'text-red-500 bg-red-50 border-red-100' :
                                                        'text-orange-500 bg-orange-50 border-orange-100'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] text-primary font-black">{item.details?.brand || ''}</span>
                                            {item.details?.brand && <span className="text-gray-300 text-[8px]">|</span>}
                                            <span className="text-[9px] text-gray-400 font-bold">{item.services.join(', ')}</span>
                                        </div>
                                        <p className="text-sm font-black text-primary mt-1">
                                            {item.price.toLocaleString()}₮
                                        </p>
                                        {/* Per-item status indicator */}
                                        <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] font-black ${
                                            isComplaint ? 'text-orange-500' : isReceive ? 'text-green-600' : 'text-gray-400'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                isComplaint ? 'bg-orange-500' : isReceive ? 'bg-green-500' : 'bg-gray-300'
                                            }`}></span>
                                            Төлөв: {isComplaint ? 'гомдол' : isReceive ? 'хүлээж авах' : '—'}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex sm:flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => updateDecision(item.id, {
                                                action: 'receive',
                                                complaintReason: undefined,
                                                complaintType: undefined,
                                                complaintTypes: undefined,
                                                complaintPhotos: undefined,
                                            })}
                                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${isReceive
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:border-green-200 hover:text-green-500'
                                                }`}
                                        >
                                            <span className="material-icons-round text-sm">check_circle</span>
                                            Хүлээн авах
                                        </button>
                                        <button
                                            onClick={() => updateDecision(item.id, { action: 'complaint' })}
                                            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${isComplaint
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-500'
                                                }`}
                                        >
                                            <span className="material-icons-round text-sm">warning</span>
                                            Гомдол
                                        </button>
                                    </div>
                                </div>

                                {/* ── Product Detail Grid ── */}
                                {item.details && (
                                    <div className="px-4 pb-3">
                                        {/* 1. Одоогийн байдал */}
                                        <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 mb-3">
                                            <span className="text-[8px] font-black text-orange-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                                                <span className="material-icons-round text-[10px]">flag</span> Одоогийн байдал
                                            </span>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5">
                                                {item.details.style && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Загвар</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.style}</span>
                                                    </div>
                                                )}
                                                {item.details.color && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Өнгө</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.color}</span>
                                                    </div>
                                                )}
                                                {item.details.size && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Размер</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.size}</span>
                                                    </div>
                                                )}
                                                {item.details.material && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Материал</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.material}</span>
                                                    </div>
                                                )}
                                                {item.details.type && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Төрөл</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.type}</span>
                                                    </div>
                                                )}
                                                {item.details.brand && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Брэндийн нэр</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.brand}</span>
                                                    </div>
                                                )}
                                                {item.details.condition && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Бэлдэл</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.condition}</span>
                                                    </div>
                                                )}
                                                {item.details.buttonType && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Товч</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.buttonType}</span>
                                                    </div>
                                                )}
                                                {item.damage.hasDamage && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Гэмтэл</span>
                                                        <span className="text-[11px] font-black text-orange-600">{item.damage.desc || 'Тийм'}</span>
                                                    </div>
                                                )}
                                                {item.details.scuffStatus && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Хурц дээвэр</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.scuffStatus}</span>
                                                    </div>
                                                )}
                                                {item.details.stockCondition && (
                                                    <div>
                                                        <span className="text-[7px] text-gray-400 font-bold uppercase block">Нөөц дараах байдал</span>
                                                        <span className="text-[11px] font-black text-gray-800">{item.details.stockCondition}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Additional notes */}
                                            {item.details.additionalNotes && item.details.additionalNotes.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-orange-100">
                                                    <span className="text-[7px] text-gray-400 font-bold uppercase block mb-1">Нөмөлт нөшөлгүүд</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.details.additionalNotes.map((note, ni) => (
                                                            <span key={ni} className="text-[9px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                                                                {note}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 2. Selected Services */}
                                        {item.selectedServices && item.selectedServices.length > 0 && (
                                            <div className="mb-1">
                                                <span className="text-[7px] text-gray-400 font-bold uppercase block mb-1.5">Сонгосон үйлчилгээнүүд</span>
                                                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                                                    {['Угаах', 'Намалт', 'Засвар', 'Өвх', 'Ул / Өстий', 'Будах', 'VIP'].map(svc => {
                                                        const isActive = item.selectedServices?.includes(svc);
                                                        const iconMap: Record<string, string> = {
                                                            'Угаах': 'local_laundry_service',
                                                            'Намалт': 'dry_cleaning',
                                                            'Засвар': 'build',
                                                            'Өвх': 'content_cut',
                                                            'Ул / Өстий': 'design_services',
                                                            'Будах': 'brush',
                                                            'VIP': 'star',
                                                        };
                                                        return (
                                                            <div
                                                                key={svc}
                                                                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all cursor-default ${isActive
                                                                    ? 'bg-primary/10 border-primary/30 shadow-sm'
                                                                    : 'bg-gray-50 border-gray-100 opacity-30'
                                                                    }`}
                                                            >
                                                                <span className={`material-icons-round text-lg ${isActive ? 'text-primary' : 'text-gray-300'}`}>
                                                                    {iconMap[svc] || 'circle'}
                                                                </span>
                                                                <span className={`text-[8px] font-bold text-center leading-tight ${isActive ? 'text-primary' : 'text-gray-300'}`}>
                                                                    {svc}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Гүйцэтгэлийн зураг */}
                                        {item.photos.length > 0 && (
                                            <div className="mt-3">
                                                <span className="text-[7px] text-gray-400 font-bold uppercase block mb-1.5">Гүйцэтгэлийн зураг</span>
                                                <div className="flex gap-2 flex-wrap">
                                                    {item.photos.map((photo, pi) => (
                                                        <div key={pi} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                                            <img src={photo} alt={`photo-${pi}`} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Complaint Details (inline, inside card) */}
                                {isComplaint && (
                                    <div className="border-t-2 border-orange-100 bg-orange-50/30 p-4 space-y-3">
                                        <div className="flex items-center gap-1.5 text-orange-600">
                                            <span className="material-icons-round text-sm">edit_note</span>
                                            <span className="text-[10px] font-black uppercase tracking-wider">Гомдлын мэдээлэл</span>
                                        </div>

                                        {/* Complaint Reason */}
                                        <div>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Гомдлын агуулга *</span>
                                            <textarea
                                                value={decision?.complaintReason || ''}
                                                onChange={e => updateDecision(item.id, { complaintReason: e.target.value })}
                                                placeholder="Харилцагчийн гомдлын дэлгэрэнгүй энд бичнэ үү..."
                                                className="w-full px-3 py-2.5 bg-white border-2 border-orange-100 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-300 resize-none transition-all"
                                                rows={2}
                                            />
                                        </div>

                                        {/* Photo upload placeholder */}
                                        <div>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                                <span className="material-icons-round text-[10px] align-middle mr-0.5">photo_camera</span>
                                                Зураг / нотлох баримт (сонголтоор)
                                            </span>
                                            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition-colors">
                                                <span className="material-icons-round text-gray-300 text-lg">add_photo_alternate</span>
                                                <span className="text-[7px] text-gray-300 font-bold mt-0.5">Нэмэх</span>
                                            </div>
                                        </div>

                                        {/* Validation warning */}
                                        {(() => {
                                            if (!decision?.complaintReason) {
                                                return (
                                                    <p className="text-[9px] text-red-400 font-bold flex items-center gap-1">
                                                        <span className="material-icons-round text-xs">info</span>
                                                        Гомдлын агуулга заавал оруулна уу
                                                    </p>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT: Summary Panel */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col h-auto lg:h-full">
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    {/* Payment Info */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                        <div className="h-7 w-1.5 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн мэдээлэл</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-lg p-2.5">
                                <span className="text-[8px] font-bold text-gray-400 uppercase block">Төлөв</span>
                                <span className="text-xs font-black text-primary">{orderData.payment.status}</span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2.5">
                                <span className="text-[8px] font-bold text-gray-400 uppercase block">Хэлбэр</span>
                                <span className="text-xs font-black text-gray-800">{orderData.payment.method}</span>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-500">Үйлчилгээний дүн</span>
                                <span className="font-black text-gray-800">{orderData.payment.total.toLocaleString()}₮</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-500">Урьдчилж төлсөн</span>
                                <span className="font-black text-green-600">- {orderData.payment.paid.toLocaleString()}₮</span>
                            </div>
                        </div>

                        {/* Revised Total */}
                        <div className="bg-primary/5 rounded-xl p-3 border-2 border-primary/20 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-600 uppercase">Шинэчилсэн нийт дүн</span>
                                <span className="text-xl font-black text-primary">{orderData.payment.total.toLocaleString()}₮</span>
                            </div>
                        </div>

                        <div className="border-t-2 border-dashed border-gray-100 my-3"></div>

                        {/* Confirmation Section */}
                        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-secondary mb-3">
                                <span className="material-icons-round text-lg">verified</span>
                                <span className="text-[11px] font-black uppercase tracking-wider">Баталгаажуулалт</span>
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="flex items-start gap-2 cursor-pointer group"
                                    onClick={() => setChecked1(!checked1)}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${checked1
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-200 bg-white group-hover:border-primary'
                                        }`}>
                                        {checked1 && <span className="material-icons-round text-white text-xs">check</span>}
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-bold leading-relaxed">Хэрэглэгч захиалгаа бүрэн бүтэн хүлээн авсан</span>
                                </label>
                                <label
                                    className="flex items-start gap-2 cursor-pointer group"
                                    onClick={() => setChecked2(!checked2)}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${checked2
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-200 bg-white group-hover:border-primary'
                                        }`}>
                                        {checked2 && <span className="material-icons-round text-white text-xs">check</span>}
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-bold leading-relaxed">Захиалгын гүйцэтгэлтэй танилцсан</span>
                                </label>
                            </div>
                        </div>

                        {/* Decision Summary */}
                        <div className="space-y-2 pt-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Шийдвэр</span>
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-green-600 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Хүлээн авах
                                </span>
                                <span className="font-black text-gray-800">
                                    {receiveCount} бараа
                                </span>
                            </div>
                            {hasComplaints && (
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-orange-600 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-orange-500"></span> Гомдолтой
                                    </span>
                                    <span className="font-black text-gray-800">
                                        {complaintCount} бараа
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Caution Note */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 mt-2">
                            <p className="text-[9px] text-orange-700 font-bold flex items-start gap-1.5">
                                <span className="material-icons-round text-xs mt-0.5 text-orange-500">info</span>
                                <span>Дараагийн алхамд шилжихийн өмнө Баталгаажуулалт хэсгийг зөвшөөрнө үү.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiveStep1SelectAction;
