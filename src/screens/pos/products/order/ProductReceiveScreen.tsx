import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    getProductOrders,
    updateProductOrderStatus,
    ProductOrder,
} from '../../../../services/mockProductOrderData';

// ─── Helpers ──────────────────────────────────────────────────────
const formatDate = (dateStr: string) => dateStr;

// ══════════════════════════════════════════════════════════════════
//  ProductReceiveScreen — 2-step receiving flow
// ══════════════════════════════════════════════════════════════════
const ProductReceiveScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialOrder = useMemo(() => {
        if (location.state?.orderId) {
            return getProductOrders().find(o => o.id === location.state.orderId) || null;
        }
        return null;
    }, [location.state?.orderId]);

    const [step, setStep] = useState<1 | 2>(initialOrder ? 2 : 1);
    const [orders, setOrders] = useState<ProductOrder[]>(() => getProductOrders());
    const [selectedOrder, setSelectedOrder] = useState<ProductOrder | null>(initialOrder);
    const [receiptQuantities, setReceiptQuantities] = useState<Record<string, number>>(() => {
        if (initialOrder) {
            const init: Record<string, number> = {};
            initialOrder.items.forEach(item => { init[item.productId] = item.orderedQuantity; });
            return init;
        }
        return {};
    });
    const [receiptRemarks, setReceiptRemarks] = useState('');
    const [isDone, setIsDone] = useState(false);

    // Only show Ирсэн orders
    const irssenOrders = useMemo(
        () => orders.filter(o => o.status === 'Ирсэн'),
        [orders]
    );

    const handleSelectOrder = (order: ProductOrder) => {
        setSelectedOrder(order);
        const init: Record<string, number> = {};
        order.items.forEach(item => { init[item.productId] = item.orderedQuantity; });
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
        const n = Math.min(max, Math.max(0, parseInt(val) || 0));
        setReceiptQuantities(prev => ({ ...prev, [productId]: n }));
    };

    const handleConfirm = () => {
        if (!selectedOrder) return;
        updateProductOrderStatus(selectedOrder.id, 'Авсан', {
            receivedQuantities: receiptQuantities,
            receiptRemarks,
            staff: 'Ажилтан',
        });
        setOrders(getProductOrders());
        setIsDone(true);
    };

    const handleDirectReceive = (order: ProductOrder) => {
        const fullQty: Record<string, number> = {};
        order.items.forEach(item => { fullQty[item.productId] = item.orderedQuantity; });
        updateProductOrderStatus(order.id, 'Авсан', {
            receivedQuantities: fullQty,
            receiptRemarks: 'Бүрэн хүлээн авсан (Шууд бүртгэгдсэн)',
            staff: 'Ажилтан',
        });
        setOrders(getProductOrders());
        setSelectedOrder(order);
        setIsDone(true);
    };

    // ─── Step 2 total ─────────────────────────────────────────────
    const receiptTotal = useMemo(() => {
        if (!selectedOrder) return 0;
        return selectedOrder.items.reduce((sum, item) => {
            return sum + item.price * (receiptQuantities[item.productId] ?? item.orderedQuantity);
        }, 0);
    }, [selectedOrder, receiptQuantities]);

    // ══════════════════════════════════════════════════════════
    //  SUCCESS screen
    // ══════════════════════════════════════════════════════════
    if (isDone) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
                <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-sm w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <span className="material-icons-round text-6xl text-green-500">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-4">
                        Орлого бүртгэгдлээ
                    </h3>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed mb-10 px-4">
                        Бараа амжилттай хүлээн авагдлаа.<br />
                        Нөөцөд нэмэгдлээ.
                    </p>
                    <button
                        onClick={() => navigate('/pos/product-order')}
                        className="w-full py-5 bg-[#FFD400] text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-yellow-200 hover:bg-[#FFC400] transition-all active:scale-95"
                    >
                        Жагсаалт руу буцах
                    </button>
                </div>
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════
    //  SHARED: page header with back + stepper
    // ══════════════════════════════════════════════════════════
    const renderHeader = () => (
        <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        if (location.state?.orderId && step === 2) {
                            navigate('/pos/product-order');
                        } else {
                            step === 2 ? setStep(1) : navigate('/pos/product-order');
                        }
                    }}
                    className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors"
                >
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <div>
                    <h3 className="text-lg font-black text-gray-800">Бараа орлого авах</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {step === 1 ? 'Захиалга сонгох' : 'Орлого бүртгэх'}
                    </p>
                </div>
            </div>
            {/* Stepper */}
            <div className="flex items-center gap-2">
                {[1, 2].map(s => (
                    <div
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === s
                            ? 'bg-[#FFD400] text-gray-900 scale-110 shadow-lg shadow-yellow-200'
                            : step > s
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                    >
                        {step > s ? <span className="material-icons-round text-sm">check</span> : s}
                    </div>
                ))}
            </div>
        </div>
    );

    // ══════════════════════════════════════════════════════════
    //  STEP 1: Select an Ирсэн order
    // ══════════════════════════════════════════════════════════
    if (step === 1) {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                {renderHeader()}

                {/* Yellow highlight banner */}
                <div className="shrink-0 mx-6 mt-5 flex items-center gap-3 px-5 py-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="material-icons-round text-amber-500">move_to_inbox</span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-amber-700">ОРЛОГО АВАХ</p>
                        <p className="text-[11px] font-bold text-amber-500">Ирсэн барааг шалгаад хүлээн авна уу</p>
                    </div>
                </div>

                {/* Order list */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 flex flex-col gap-4">
                    {irssenOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                            <span className="material-icons-round text-6xl mb-4 opacity-30">inbox</span>
                            <p className="font-bold text-lg">Ирсэн захиалга байхгүй байна</p>
                            <p className="text-xs font-bold mt-1 text-gray-400">Төв салбараас бараа ирсний дараа энд харагдана</p>
                        </div>
                    ) : irssenOrders.map(order => (
                        <div
                            key={order.id}
                            onClick={() => handleSelectOrder(order)}
                            className="bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group px-6 py-5 flex items-center gap-5"
                        >
                            {/* Amber dot indicator */}
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                <span className="material-icons-round text-amber-400">local_shipping</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[14px] font-extrabold text-[#40C1C7] group-hover:underline">{order.id}</span>
                                    <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                                        Ирсэн
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{order.date} • {order.from}</p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 shrink-0">
                                <div className="text-center hidden sm:block">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт тоо</p>
                                    <p className="text-[15px] font-black text-gray-800">{order.totalQuantity} ш</p>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Дүн</p>
                                    <p className="text-[15px] font-black text-primary">{order.totalAmount.toLocaleString()} ₮</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={e => { e.stopPropagation(); handleDirectReceive(order); }}
                                        className="px-4 py-2.5 bg-[#40C1C7] hover:bg-[#35a8ae] text-white rounded-xl font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all shadow-sm shadow-cyan-200 whitespace-nowrap"
                                    >
                                        Шууд авах
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleSelectOrder(order); }}
                                        className="px-4 py-2.5 bg-[#FFD400] hover:bg-[#eec600] text-gray-900 rounded-xl font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all shadow-sm shadow-yellow-200 whitespace-nowrap"
                                    >
                                        Шалгах
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════
    //  STEP 2: Process receiving for selected order
    // ══════════════════════════════════════════════════════════
    if (!selectedOrder) return null;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            {renderHeader()}

            {/* Yellow info banner */}
            <div className="shrink-0 mx-6 mt-4 flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="material-icons-round text-amber-400 text-base">info</span>
                <p className="text-[11px] font-bold text-amber-600">
                    Тоо хэмжээ болон тайлбарыг засаж болно. Бараа, үнэ, захиалгын тоог өөрчилж болохгүй.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col gap-5">

                {/* Order meta card */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Захиалгын №</p>
                        <p className="text-[13px] font-black text-[#40C1C7]">{selectedOrder.id}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаанаас</p>
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-[13px] text-gray-400">storefront</span>
                            <p className="text-[13px] font-bold text-gray-800">{selectedOrder.to}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаашаа</p>
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-[13px] text-[#40C1C7]">east</span>
                            <p className="text-[13px] font-bold text-gray-800">{selectedOrder.from}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Захиалсан огноо</p>
                        <p className="text-[13px] font-bold text-gray-800">{selectedOrder.date}</p>
                    </div>
                </div>

                {/* Product list – scrollable, max-height */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2">
                        <span className="material-icons-round text-sm text-gray-400">list_alt</span>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Барааны жагсаалт</h4>
                    </div>

                    {/* Table header */}
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex-1">Бараа</div>
                        <div className="w-[120px] text-right pr-4">Нэгж үнэ</div>
                        <div className="w-[100px] text-center">Захиалсан</div>
                        <div className="w-[160px] text-center">Хүлээн авах</div>
                    </div>

                    {/* Items – scrollable */}
                    <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '320px' }}>
                        {selectedOrder.items.map(item => {
                            const qty = receiptQuantities[item.productId] ?? item.orderedQuantity;
                            return (
                                <div key={item.productId} className="px-6 py-4 border-b border-gray-50 flex items-center">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-gray-800 truncate">{item.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.category}</p>
                                    </div>
                                    {/* Unit price — read-only */}
                                    <div className="w-[120px] text-right pr-4">
                                        <p className="text-[13px] font-bold text-gray-600">{item.price.toLocaleString()} ₮</p>
                                    </div>
                                    {/* Ordered qty — read-only */}
                                    <div className="w-[100px] text-center">
                                        <p className="text-[13px] font-black text-gray-900">{item.orderedQuantity}</p>
                                    </div>
                                    {/* Receipt qty stepper — editable */}
                                    <div className="w-[160px] flex items-center justify-center">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                                            <button
                                                onClick={() => handleQtyDelta(item.productId, -1, item.orderedQuantity)}
                                                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-100 active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">remove</span>
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                max={item.orderedQuantity}
                                                value={qty}
                                                onChange={e => handleQtyInput(item.productId, e.target.value, item.orderedQuantity)}
                                                className="w-20 px-1 text-center font-black text-amber-600 bg-transparent focus:outline-none text-sm"
                                            />
                                            <button
                                                onClick={() => handleQtyDelta(item.productId, 1, item.orderedQuantity)}
                                                className="w-8 h-8 rounded-xl bg-amber-500 text-white shadow-sm flex items-center justify-center hover:bg-amber-600 active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary footer */}
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Нийт дүн</p>
                        <p className="text-lg font-black text-primary">{receiptTotal.toLocaleString()} ₮</p>
                    </div>
                </div>

                {/* Remarks textarea */}
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-icons-round text-sm">notes</span>
                        Орлогын тайлбар
                    </label>
                    <textarea
                        value={receiptRemarks}
                        onChange={e => setReceiptRemarks(e.target.value)}
                        rows={3}
                        placeholder="Бараа шалгасан тэмдэглэл... (예: 일부 수량 미수령, 상품 상태 확인 필요)"
                        className="w-full resize-none rounded-xl border border-gray-200 bg-[#F9FAFB] px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 font-medium"
                    />
                </div>

            </div>

            {/* Footer action */}
            <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
                <div className="text-[11px] font-bold text-gray-400">
                    <span className="font-black text-gray-700">{selectedOrder.id}</span> • {selectedOrder.items.length} барааны нэр төрөл
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (location.state?.orderId) {
                                navigate('/pos/product-order');
                            } else {
                                setStep(1);
                            }
                        }}
                        className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-[11px] tracking-wider border border-gray-100"
                    >
                        Буцах
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-icons-round text-base">check_circle</span>
                        Орлого бүртгэх
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductReceiveScreen;
