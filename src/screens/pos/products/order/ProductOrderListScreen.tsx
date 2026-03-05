import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import {
    getProductOrders,
    addProductOrder,
    ProductOrder,
    ProductOrderStatus,
} from '../../../../services/mockProductOrderData';
import OrderStep1ProductSelect from './steps/OrderStep1ProductSelect';
import OrderStep2Confirmation from './steps/OrderStep2Confirmation';
import OrderStep3Success from './steps/OrderStep3Success';

export interface SelectedOrderProduct {
    productId: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
    stock?: number;
}

type ViewMode = 'LIST' | 'CREATE' | 'DETAIL';

// ─── Helpers ───────────────────────────────────────────────────────
const getStatusStyles = (status: ProductOrderStatus) => {
    switch (status) {
        case 'Захиалсан': return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'Ирсэн': return 'bg-amber-100 text-amber-600 border-amber-200';
        case 'Авсан': return 'bg-green-100 text-green-600 border-green-200';
        default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
};

const getDotColor = (status: ProductOrderStatus) => {
    switch (status) {
        case 'Захиалсан': return 'bg-blue-500';
        case 'Ирсэн': return 'bg-amber-500';
        case 'Авсан': return 'bg-green-500';
        default: return 'bg-gray-400';
    }
};

const generateOrderId = () => {
    const now = new Date();
    const seq = Math.floor(Math.random() * 900) + 100;
    return `#PO-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${seq}`;
};

// ══════════════════════════════════════════════════════════════════
//  ProductOrderListScreen
// ══════════════════════════════════════════════════════════════════
const ProductOrderListScreen: React.FC = () => {
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [createStep, setCreateStep] = useState(1);
    const [orders, setOrders] = useState<ProductOrder[]>(() => getProductOrders());

    // List filters
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Create flow state
    const [selectedProducts, setSelectedProducts] = useState<SelectedOrderProduct[]>([]);
    const [isStep2Valid, setIsStep2Valid] = useState(false);
    const [orderRemarks, setOrderRemarks] = useState('');

    const selectedOrder = useMemo(
        () => orders.find(o => o.id === selectedOrderId),
        [orders, selectedOrderId]
    );

    // ── Filtering / sorting ─────────────────────────────────────────
    const filteredData = useMemo(() => {
        let result = [...orders].filter(item => {
            const matchesSearch =
                item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.staff.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
            const matchesBranch = selectedBranch === 'all' || item.from === selectedBranch;
            const itemDate = new Date(item.date.split(' ')[0].replace(/\./g, '-'));
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
            return matchesSearch && matchesStatus && matchesBranch && matchesDate;
        });

        result.sort((a, b) => {
            const tA = new Date(a.date.replace(/\./g, '-')).getTime();
            const tB = new Date(b.date.replace(/\./g, '-')).getTime();
            if (sortBy === 'newest') return tB - tA;
            if (sortBy === 'oldest') return tA - tB;
            if (sortBy === 'amount-high') return b.totalAmount - a.totalAmount;
            if (sortBy === 'amount-low') return a.totalAmount - b.totalAmount;
            return 0;
        });
        return result;
    }, [orders, searchTerm, selectedStatus, selectedBranch, startDate, endDate, sortBy]);

    const itemsPerPage = 8;
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // ── Handlers ──────────────────────────────────────────────────
    const handleRowClick = (id: string) => {
        setSelectedOrderId(id);
        setViewMode('DETAIL');
    };

    const handleCreateNew = () => {
        setViewMode('CREATE');
        setCreateStep(1);
        setSelectedProducts([]);
        setIsStep2Valid(false);
        setOrderRemarks('');
    };

    const handleBackToList = () => {
        setViewMode('LIST');
        setSelectedOrderId(null);
    };

    const handleConfirmOrder = () => {
        const total = selectedProducts.reduce((s, p) => s + p.price * p.quantity, 0);
        const qty = selectedProducts.reduce((s, p) => s + p.quantity, 0);
        const newOrder: ProductOrder = {
            id: generateOrderId(),
            date: new Date().toLocaleString('mn-MN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',
            }).replace(/\//g, '.'),
            staff: 'Ажилтан',
            from: 'Салбар 1',
            to: 'Төв салбар',
            totalAmount: total,
            totalQuantity: qty,
            status: 'Захиалсан',
            remarks: orderRemarks,
            items: selectedProducts.map(p => ({
                productId: p.productId,
                name: p.name,
                category: p.category,
                price: p.price,
                orderedQuantity: p.quantity,
                receivedQuantity: 0,
            })),
            receiptHistory: [],
        };
        addProductOrder(newOrder);
        setOrders(getProductOrders());
        setCreateStep(3);
    };

    // ══════════════════════════════════════════════════════════
    //  RENDER: LIST
    // ══════════════════════════════════════════════════════════
    const renderList = () => (
        <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">

            {/* ── header row ── */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-primary rounded-sm" />
                    <h2 className="text-xl font-bold text-[#374151] uppercase tracking-tight">Бараа удирдах</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCreateNew}
                        className="bg-[#FFD400] hover:bg-[#eec600] text-gray-900 px-6 py-3 h-[44px] rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold text-[12px] uppercase tracking-wider active:scale-95 transition-all w-full sm:w-auto"
                    >
                        <span className="material-icons-round text-lg">add_circle</span>
                        Шинэ бараа захиалах
                    </button>
                    <button
                        onClick={() => navigate('/pos/product-receive')}
                        className="bg-[#111827] hover:bg-[#1f2937] text-white px-6 py-3 h-[44px] rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold text-[12px] uppercase tracking-wider active:scale-95 transition-all w-full sm:w-auto"
                    >
                        <span className="material-icons-round text-lg">move_to_inbox</span>
                        Орлого авах
                    </button>
                    <PosExcelButton />
                </div>
            </div>

            {/* ── filters ── */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0">
                <div className="flex-1 min-w-[220px]">
                    <PosDateRangePicker
                        label="Захиалсан хугацаа"
                        start={startDate}
                        end={endDate}
                        onChange={(s, e) => { setStartDate(s); setEndDate(e); setCurrentPage(1); }}
                    />
                </div>
                <PosDropdown
                    label="Захиалсан салбар" icon="storefront" value={selectedBranch}
                    onChange={v => { setSelectedBranch(v); setCurrentPage(1); }}
                    options={[
                        { label: 'Бүх салбар', value: 'all' },
                        { label: 'Салбар 1', value: 'Салбар 1' },
                        { label: 'Салбар 2', value: 'Салбар 2' },
                    ]}
                    className="w-[150px]"
                />
                <PosDropdown
                    label="Төлөв" icon="flag" value={selectedStatus}
                    onChange={v => { setSelectedStatus(v); setCurrentPage(1); }}
                    options={[
                        { label: 'Бүх төлөв', value: 'all' },
                        { label: 'Захиалсан', value: 'Захиалсан' },
                        { label: 'Ирсэн', value: 'Ирсэн' },
                        { label: 'Авсан', value: 'Авсан' },
                    ]}
                    className="w-[160px]"
                />
                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Хайх</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-sm">search</span>
                        </span>
                        <input
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all"
                            placeholder="Захиалгын №, ажилтан..."
                        />
                    </div>
                </div>
                <PosDropdown
                    label="Эрэмбэлэх" icon="sort" value={sortBy} onChange={setSortBy}
                    options={[
                        { label: 'Сүүлд нэмэгдсэн', value: 'newest' },
                        { label: 'Анх нэмэгдсэн', value: 'oldest' },
                        { label: 'Дүн (өндөрөөс)', value: 'amount-high' },
                        { label: 'Дүн (багаас)', value: 'amount-low' },
                    ]}
                    className="w-[160px]"
                />
            </div>

            {/* ── table — flex-1 so it fills remaining height ── */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                    <div className="min-w-[1000px] flex flex-col">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[12px] font-bold tracking-widest items-center uppercase text-left">
                            <div className="w-[150px] shrink-0">Захиалгын №</div>
                            <div className="w-[120px] shrink-0 px-2">Огноо</div>
                            <div className="w-[140px] shrink-0 px-2">Ажилтан</div>
                            <div className="w-[120px] shrink-0 px-2">Хаанаас</div>
                            <div className="w-[120px] shrink-0 px-2">Хаашаа</div>
                            <div className="w-[90px] shrink-0 px-2 text-center">Нийт тоо</div>
                            <div className="flex-1 px-2 text-right">Нийт дүн</div>
                            <div className="w-[140px] shrink-0 px-2 flex justify-center">Төлөв</div>
                            <div className="w-[40px] shrink-0 px-1 text-center">Тайл</div>
                            <div className="w-8 shrink-0" />
                        </div>

                        {/* Rows */}
                        {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleRowClick(item.id)}
                                className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group normal-case"
                            >
                                <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline text-sm truncate pr-2">{item.id}</div>
                                <div className="w-[120px] shrink-0 px-2 text-gray-400 text-xs font-medium">{item.date}</div>
                                <div className="w-[140px] shrink-0 px-2 font-bold text-gray-800 truncate text-[12px]">{item.staff}</div>
                                <div className="w-[120px] shrink-0 px-2 font-bold text-gray-600 truncate flex items-center gap-1 text-[12px]">
                                    <span className="material-icons-round text-[13px] text-gray-300">storefront</span>
                                    {item.from}
                                </div>
                                <div className="w-[120px] shrink-0 px-2 font-bold text-[#40C1C7] truncate flex items-center gap-1 text-[12px]">
                                    <span className="material-icons-round text-[13px] text-[#40C1C7]/70">east</span>
                                    {item.to}
                                </div>
                                <div className="w-[90px] shrink-0 px-2 text-center font-bold text-gray-800">
                                    {item.totalQuantity} <span className="text-[10px] text-gray-400 font-medium ml-0.5">ш</span>
                                </div>
                                <div className="flex-1 px-2 text-right font-black text-gray-900">{item.totalAmount.toLocaleString()} ₮</div>
                                <div className="w-[140px] shrink-0 px-2 flex justify-center">
                                    <span className={`px-3 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(item.status)}`} />
                                        {item.status}
                                    </span>
                                </div>
                                <div className="w-[40px] shrink-0 px-1 flex justify-center">
                                    {item.remarks && (
                                        <span className="material-icons-round text-[16px] text-amber-400" title={item.remarks}>notes</span>
                                    )}
                                </div>
                                <div className="w-8 shrink-0 flex justify-end text-gray-300 group-hover:text-primary transition-colors">
                                    <span className="material-icons-round">chevron_right</span>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                <span className="material-icons-round text-6xl mb-4 opacity-20">search_off</span>
                                <p className="font-bold text-lg">Мэдээлэл олдсонгүй</p>
                            </div>
                        )}
                    </div>
                </div>
                <PosPagination
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );

    // ══════════════════════════════════════════════════════════
    //  RENDER: CREATE (3-step inline flow)
    // ══════════════════════════════════════════════════════════
    const renderCreate = () => {
        const handleNextStep = () => {
            if (createStep === 2) { handleConfirmOrder(); return; }
            if (createStep < 3) setCreateStep(s => s + 1);
        };
        const handleBackStep = () => {
            if (createStep > 1) setCreateStep(s => s - 1);
            else setViewMode('LIST');
        };
        const nextLabel = createStep === 2 ? 'ЗАХИАЛАХ' : 'Үргэлжлүүлэх';
        const nextDisabled =
            (createStep === 1 && selectedProducts.length === 0) ||
            (createStep === 2 && !isStep2Valid);

        return (
            <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
                {/* Step header */}
                <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackStep} className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <div>
                            <h3 className="text-lg font-black text-gray-800">Шинэ захиалга бүртгэх</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {createStep === 1 ? 'Бараа сонгох' : createStep === 2 ? 'Баталгаажуулах' : 'Амжилттай'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${createStep === s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20'
                                : createStep > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {createStep > s ? <span className="material-icons-round text-sm">check</span> : s}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {createStep === 1 && (
                        <OrderStep1ProductSelect
                            selectedProducts={selectedProducts}
                            onProductsChange={setSelectedProducts}
                            fromBranch="Салбар 1"
                        />
                    )}
                    {createStep === 2 && (
                        <OrderStep2Confirmation
                            selectedProducts={selectedProducts}
                            onValidationChange={setIsStep2Valid}
                            onRemarksChange={setOrderRemarks}
                            fromBranch="Салбар 1"
                        />
                    )}
                    {createStep === 3 && (
                        <OrderStep3Success onBackToList={handleBackToList} />
                    )}
                </div>

                {createStep < 3 && (
                    <div className="shrink-0 p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={handleBackStep} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-[11px] tracking-wider">
                            Буцах
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={nextDisabled}
                            className={`px-12 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all shadow-lg ${nextDisabled
                                ? 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                                : createStep === 2
                                    ? 'bg-[#111827] text-white hover:bg-[#1f2937] active:scale-95'
                                    : 'bg-[#FFD400] text-gray-900 hover:bg-[#FFC400] active:scale-95 shadow-yellow-200'
                                }`}
                        >
                            {nextLabel}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // ══════════════════════════════════════════════════════════
    //  RENDER: DETAIL (read-only view; receiving via /product-receive)
    // ══════════════════════════════════════════════════════════
    const renderDetail = () => {
        if (!selectedOrder) return null;
        const isIrsen = selectedOrder.status === 'Ирсэн';

        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                {/* Header */}
                <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackToList} className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-gray-800">{selectedOrder.id}</h3>
                                <span className={`px-3 py-1 text-[9px] font-black rounded-full border ${getStatusStyles(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                {selectedOrder.date} • {selectedOrder.staff}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* CTA to receive if Ирсэн */}
                        {isIrsen && (
                            <button
                                onClick={() => navigate('/pos/product-receive', { state: { orderId: selectedOrder.id } })}
                                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-sm shadow-amber-200"
                            >
                                <span className="material-icons-round text-sm">move_to_inbox</span>
                                Орлого авах
                            </button>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all">
                            <span className="material-icons-round text-sm">print</span> Хэвлэх
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-5">

                    {/* Order meta */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 grid grid-cols-2 md:grid-cols-4 gap-5">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаанаас</p>
                            <div className="flex items-center gap-1.5">
                                <span className="material-icons-round text-sm text-gray-400">storefront</span>
                                <p className="text-[13px] font-bold text-gray-800">{selectedOrder.from}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Хаашаа</p>
                            <div className="flex items-center gap-1.5">
                                <span className="material-icons-round text-sm text-[#40C1C7]">east</span>
                                <p className="text-[13px] font-bold text-[#40C1C7]">{selectedOrder.to}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Нийт тоо / дүн</p>
                            <p className="text-[13px] font-bold text-gray-800">
                                {selectedOrder.totalQuantity} ш&nbsp;/&nbsp;
                                <span className="text-primary">{selectedOrder.totalAmount.toLocaleString()} ₮</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Захиалга өгсөн</p>
                            <p className="text-[13px] font-bold text-gray-800">{selectedOrder.date}</p>
                        </div>
                    </div>

                    {/* Items table — max-height + scroll */}
                    <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex text-[10px] font-black text-gray-400 tracking-widest uppercase items-center">
                            <div className="flex-1">Барааны нэр</div>
                            <div className="w-[130px] text-right">Нэгж үнэ</div>
                            <div className="w-[110px] text-center">Захиалсан</div>
                            <div className="w-[120px] text-center">Хүлээн авсан</div>
                        </div>
                        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '340px' }}>
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="px-6 py-4 border-b border-gray-50 flex items-center text-[13px]">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.category}</p>
                                    </div>
                                    <div className="w-[130px] text-right font-bold text-gray-600">{item.price.toLocaleString()} ₮</div>
                                    <div className="w-[110px] text-center font-black text-gray-900">{item.orderedQuantity}</div>
                                    <div className={`w-[120px] text-center font-bold ${item.receivedQuantity > 0 ? 'text-green-500' : 'text-gray-300'}`}>
                                        {item.receivedQuantity > 0 ? item.receivedQuantity : '–'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order remarks */}
                    {selectedOrder.remarks && (
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-icons-round text-sm text-gray-400">notes</span>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Захиалгын тайлбар</h4>
                            </div>
                            <p className="text-sm font-medium text-gray-700 leading-relaxed">{selectedOrder.remarks}</p>
                        </div>
                    )}

                    {/* Receipt history */}
                    {selectedOrder.receiptHistory.length > 0 && (
                        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-icons-round text-sm text-green-500">history</span>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Орлогын түүх</h4>
                            </div>
                            {selectedOrder.receiptHistory.map((h, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl mb-2">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 shrink-0">
                                        <span className="material-icons-round text-sm">inbox</span>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-gray-800">{h.staff}</p>
                                        <p className="text-[9px] font-bold text-gray-400">{h.date}</p>
                                        {h.remarks && <p className="text-xs font-medium text-gray-600 mt-1">{h.remarks}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Confirmed receipt remarks */}
                    {selectedOrder.status === 'Авсан' && selectedOrder.receiptRemarks && (
                        <div className="bg-green-50 rounded-[20px] border border-green-100 p-5 flex items-start gap-3">
                            <span className="material-icons-round text-green-500 mt-0.5">check_circle</span>
                            <div>
                                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Орлого баталгаажсан</p>
                                <p className="text-sm font-medium text-gray-700">{selectedOrder.receiptRemarks}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ══════════════════════════════════════════════════════════
    //  Root
    // ══════════════════════════════════════════════════════════
    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            {viewMode === 'LIST' && renderList()}
            {viewMode === 'CREATE' && renderCreate()}
            {viewMode === 'DETAIL' && renderDetail()}
        </div>
    );
};

export default ProductOrderListScreen;
