import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import { mockProductOrders, ProductOrder, ProductOrderItem, InventoryHistory, ProductOrderStatus } from '../../../../services/mockProductOrderData';
import { mockProducts } from '../../../../services/mockProductData';
import OrderStep1ProductSelect from './steps/OrderStep1ProductSelect';
import OrderStep2Confirmation from './steps/OrderStep2Confirmation';
import OrderStep3Success from './steps/OrderStep3Success';

export interface SelectedOrderProduct {
    productId: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
}

type ViewMode = 'LIST' | 'CREATE' | 'DETAIL';

const ProductOrderListScreen: React.FC = () => {
    const navigate = useNavigate();

    // View State
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [createStep, setCreateStep] = useState(1);

    // List State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Create State
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [isStep2Valid, setIsStep2Valid] = useState(false);

    // Detail State
    const [detailTab, setDetailTab] = useState<'ITEMS' | 'DISPATCH' | 'RECEIPT'>('ITEMS');
    const [dispatchQty, setDispatchQty] = useState<Record<string, number>>({});
    const [receiptQty, setReceiptQty] = useState<Record<string, number>>({});

    const selectedOrder = useMemo(() =>
        mockProductOrders.find(o => o.id === selectedOrderId),
        [selectedOrderId]);

    const filteredAndSortedData = useMemo(() => {
        let result = mockProductOrders.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.staff.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
            const matchesBranch = selectedBranch === 'all' || item.branch === selectedBranch;

            const itemDate = new Date(item.date.split(' ')[0].replace(/\./g, '-'));
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesStatus && matchesBranch && matchesDate;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.date.replace(/\./g, '-')).getTime();
            const dateB = new Date(b.date.replace(/\./g, '-')).getTime();
            if (sortBy === 'newest') return dateB - dateA;
            if (sortBy === 'oldest') return dateA - dateB;
            if (sortBy === 'amount-high') return b.totalAmount - a.totalAmount;
            if (sortBy === 'amount-low') return a.totalAmount - b.totalAmount;
            return 0;
        });

        return result;
    }, [searchTerm, selectedStatus, selectedBranch, startDate, endDate, sortBy]);

    const itemsPerPage = 8;
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusStyles = (status: ProductOrderStatus) => {
        switch (status) {
            case 'Бүрэн авсан': return 'bg-green-100 text-green-600 border-green-200';
            case 'Захиалсан': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Хүлээгдэж байна': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'Хэсэгчлэн авсан': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'Цуцалсан': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const handleRowClick = (id: string) => {
        setSelectedOrderId(id);
        setViewMode('DETAIL');
        setDetailTab('ITEMS');
    };

    const handleCreateNew = () => {
        setViewMode('CREATE');
        setCreateStep(1);
        setSelectedProducts([]);
    };

    const handleBackToList = () => {
        setViewMode('LIST');
        setSelectedOrderId(null);
    };

    // --- RENDERERS ---

    const renderList = () => (
        <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 shrink-0">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h2 className="text-[18px] font-bold text-[#374151]">Бараа удирдах</h2>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="bg-[#FFD400] hover:bg-[#eec600] text-gray-900 px-6 py-3 rounded-2xl shadow-lg shadow-yellow-500/10 flex items-center gap-2 transition-all font-black uppercase text-[11px] tracking-wider active:scale-95 w-fit shrink-0 whitespace-nowrap"
                    >
                        <span className="material-icons-round text-lg">add_circle</span>
                        Шинэ бараа захиалах
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[400px]">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-xl">search</span>
                        </span>
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full h-[48px] pl-11 pr-4 border border-gray-100 rounded-2xl bg-white text-sm"
                            placeholder="Захиалгын № / Ажилтан нэрээр хайх"
                            type="text"
                        />
                    </div>
                    <PosExcelButton />
                </div>
            </div>

            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0">
                <div className="w-full sm:w-auto flex-1 min-w-[240px]">
                    <PosDateRangePicker
                        start={startDate}
                        end={endDate}
                        onChange={(s, e) => { setStartDate(s); setEndDate(e); setCurrentPage(1); }}
                    />
                </div>
                <PosDropdown
                    label="Захиалсан салбар" icon="storefront" value={selectedBranch} onChange={setSelectedBranch}
                    options={[{ label: 'Бүх салбар', value: 'all' }, { label: 'Төв салбар', value: 'Төв салбар' }, { label: 'Салбар 1', value: 'Салбар 1' }, { label: 'Салбар 2', value: 'Салбар 2' }]}
                    className="w-full sm:w-[150px]"
                />
                <PosDropdown
                    label="Төлөв" icon="flag" value={selectedStatus} onChange={setSelectedStatus}
                    options={[{ label: 'Бүх төлөв', value: 'all' }, { label: 'Захиалсан', value: 'Захиалсан' }, { label: 'Хүлээгдэж байна', value: 'Хүлээгдэж байна' }, { label: 'Хэсэгчлэн авсан', value: 'Хэсэгчлэн авсан' }, { label: 'Бүрэн авсан', value: 'Бүрэн авсан' }, { label: 'Цуцлагдсан', value: 'Цуцлагдсан' }]}
                    className="w-full sm:w-[150px]"
                />
                <PosDropdown
                    label="Эрэмбэлэх" icon="sort" value={sortBy} onChange={setSortBy}
                    options={[{ label: 'Сүүлд нэмэгдсэн', value: 'newest' }, { label: 'Анх нэмэгдсэн', value: 'oldest' }, { label: 'Дүн (Өндөрөөс)', value: 'amount-high' }, { label: 'Дүн (Багаас)', value: 'amount-low' }]}
                    className="w-full sm:w-[160px]"
                />
                <button className="bg-primary hover:bg-primary/90 text-white px-6 h-[44px] rounded-xl shadow-lg flex items-center justify-center gap-2 font-bold text-sm active:scale-95 w-full lg:w-auto lg:ml-auto">
                    <span className="material-icons-round text-lg">sync</span> Шүүх
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                    <div className="min-w-[1000px] flex flex-col h-full uppercase">
                        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                            <div className="w-[150px] shrink-0">Захиалгын №</div>
                            <div className="w-[150px] shrink-0 px-2">Огноо</div>
                            <div className="w-[180px] shrink-0 px-2">Ажилтан</div>
                            <div className="w-[180px] shrink-0 px-2">Салбар</div>
                            <div className="w-[120px] shrink-0 px-2 text-center">Нийт тоо</div>
                            <div className="w-[140px] shrink-0 px-2 text-center">Төлөв</div>
                            <div className="w-[130px] shrink-0 px-2 text-right">Нийт дүн</div>
                            <div className="w-8 shrink-0"></div>
                        </div>
                        <div className="flex-1">
                            {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleRowClick(item.id)}
                                    className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group normal-case"
                                >
                                    <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">{item.id}</div>
                                    <div className="w-[150px] shrink-0 px-2 text-gray-400 text-xs font-medium">{item.date}</div>
                                    <div className="w-[180px] shrink-0 px-2 font-bold text-gray-800 truncate">{item.staff}</div>
                                    <div className="w-[180px] shrink-0 px-2 font-bold text-gray-500 truncate">{item.branch}</div>
                                    <div className="w-[120px] shrink-0 px-2 text-center font-bold text-gray-600">{item.totalQuantity}</div>
                                    <div className="w-[140px] shrink-0 px-2 flex justify-center">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Бүрэн авсан' ? 'bg-green-500' :
                                                item.status === 'Захиалсан' ? 'bg-blue-500' :
                                                    item.status === 'Цуцалсан' ? 'bg-red-500' :
                                                        item.status === 'Хэсэгчлэн авсан' ? 'bg-orange-500' : 'bg-yellow-500'
                                                }`}></span>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="w-[130px] shrink-0 px-2 text-right font-black text-gray-900">{item.totalAmount.toLocaleString()} ₮</div>
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
                </div>
                <PosPagination totalItems={filteredAndSortedData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
        </div>
    );

    const renderCreate = () => {
        const totalSteps = 3;
        const handleNext = () => {
            if (createStep < totalSteps) setCreateStep(s => s + 1);
        };
        const handleBack = () => {
            if (createStep > 1) setCreateStep(s => s - 1);
            else setViewMode('LIST');
        };

        return (
            <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
                {/* Custom Stepper Header */}
                <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <h3 className="text-lg font-black text-gray-800">Шинэ захиалга бүртгэх</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${createStep === s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' :
                                createStep > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
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
                        />
                    )}
                    {createStep === 2 && (
                        <OrderStep2Confirmation
                            selectedProducts={selectedProducts}
                            onValidationChange={setIsStep2Valid}
                        />
                    )}
                    {createStep === 3 && (
                        <OrderStep3Success />
                    )}
                </div>

                {createStep < 3 && (
                    <div className="shrink-0 p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
                        <button onClick={handleBack} className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-[11px] tracking-wider">Буцах</button>
                        <button
                            onClick={handleNext}
                            disabled={(createStep === 2 && !isStep2Valid) || selectedProducts.length === 0}
                            className={`px-12 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all shadow-lg ${((createStep === 2 && !isStep2Valid) || selectedProducts.length === 0)
                                ? 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                                : 'bg-[#FFD400] text-gray-900 hover:bg-[#FFC400] active:scale-95 shadow-yellow-200'
                                }`}
                        >
                            {createStep === 2 ? 'Захиалах' : 'Үргэлжлүүлэх'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderDetail = () => {
        if (!selectedOrder) return null;

        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
                {/* Header */}
                <div className="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBackToList} className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black text-gray-800">{selectedOrder.id}</h3>
                                <span className={`px-3 py-1 text-[9px] font-black rounded-full border ${getStatusStyles(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{selectedOrder.date} • {selectedOrder.branch} • {selectedOrder.staff}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all">
                            <span className="material-icons-round text-sm">print</span> Хэвлэх
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="shrink-0 flex px-6 bg-white border-b border-gray-50">
                    {[
                        { id: 'ITEMS', label: 'Барааны жагсаалт', icon: 'list_alt' },
                        { id: 'DISPATCH', label: 'Зарлага (Dispatch)', icon: 'outbox' },
                        { id: 'RECEIPT', label: 'Орлого (Receipt)', icon: 'inbox' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setDetailTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all ${detailTab === tab.id ? 'border-primary text-primary font-black' : 'border-transparent text-gray-400 font-bold hover:text-gray-600'
                                }`}
                        >
                            <span className="material-icons-round text-lg">{tab.icon}</span>
                            <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                    {detailTab === 'ITEMS' && (
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="sticky top-0 bg-gray-50/80 backdrop-blur-md px-6 py-4 border-b border-gray-50 flex text-[10px] font-black text-gray-400 tracking-widest uppercase">
                                <div className="flex-1">Барааны нэр</div>
                                <div className="w-[120px] text-center">Захиалсан</div>
                                <div className="w-[120px] text-center">Олгосон</div>
                                <div className="w-[120px] text-center">Хүлээн авсан</div>
                                <div className="w-[120px] text-center">Дутуу</div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {selectedOrder.items.map((item, idx) => {
                                    const missing = item.orderedQuantity - item.receivedQuantity;
                                    return (
                                        <div key={idx} className="px-6 py-5 flex items-center text-[13px]">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{item.category}</p>
                                            </div>
                                            <div className="w-[120px] text-center font-black text-gray-900">{item.orderedQuantity}</div>
                                            <div className="w-[120px] text-center font-bold text-blue-500">{item.dispatchedQuantity}</div>
                                            <div className="w-[120px] text-center font-bold text-green-500">{item.receivedQuantity}</div>
                                            <div className={`w-[120px] text-center font-bold ${missing > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                                                {missing}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {detailTab === 'DISPATCH' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="material-icons-round text-blue-500">local_shipping</span>
                                    Зарлага хийх (Салбар руу илгээх)
                                </h4>
                                <div className="divide-y divide-gray-50">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="py-4 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-[13px] font-bold text-gray-800">{item.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 capitalize">Үлдэгдэл: {item.orderedQuantity - item.dispatchedQuantity}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                                    <button onClick={() => setDispatchQty(prev => ({ ...prev, [item.productId]: Math.max(0, (prev[item.productId] || 0) - 1) }))} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500">
                                                        <span className="material-icons-round text-sm">remove</span>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={dispatchQty[item.productId] || 0}
                                                        onChange={e => setDispatchQty(prev => ({ ...prev, [item.productId]: parseInt(e.target.value) || 0 }))}
                                                        className="w-12 bg-transparent text-center font-black text-gray-800 focus:outline-none"
                                                    />
                                                    <button onClick={() => setDispatchQty(prev => ({ ...prev, [item.productId]: (prev[item.productId] || 0) + 1 }))} className="w-8 h-8 rounded-lg bg-primary text-white shadow-md flex items-center justify-center">
                                                        <span className="material-icons-round text-sm">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button className="bg-primary text-white px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Зарлага хадгалах</button>
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Зарлагын түүх</h4>
                                <div className="flex flex-col gap-3">
                                    {selectedOrder.history.filter(h => h.type === 'DISPATCH').length > 0 ? (
                                        selectedOrder.history.filter(h => h.type === 'DISPATCH').map((h, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                                        <span className="material-icons-round text-sm">local_shipping</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-gray-800">{h.staff}</p>
                                                        <p className="text-[9px] font-bold text-gray-400">{h.date}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-black text-blue-500">+{h.quantity} ширхэг</p>
                                            </div>
                                        ))
                                    ) : <p className="text-center py-6 text-gray-300 font-bold text-xs uppercase tracking-widest">Түүх олдсонгүй</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {detailTab === 'RECEIPT' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                                <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="material-icons-round text-green-500">inbox</span>
                                    Орлого авах (Салбар дээр хүлээн авах)
                                </h4>
                                <div className="divide-y divide-gray-50">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="py-4 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-[13px] font-bold text-gray-800">{item.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 capitalize">Илгээсэн: {item.dispatchedQuantity} | Авсан: {item.receivedQuantity}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                                    <button onClick={() => setReceiptQty(prev => ({ ...prev, [item.productId]: Math.max(0, (prev[item.productId] || 0) - 1) }))} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-500">
                                                        <span className="material-icons-round text-sm">remove</span>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={receiptQty[item.productId] || 0}
                                                        onChange={e => setReceiptQty(prev => ({ ...prev, [item.productId]: parseInt(e.target.value) || 0 }))}
                                                        className="w-12 bg-transparent text-center font-black text-gray-800 focus:outline-none"
                                                    />
                                                    <button onClick={() => setReceiptQty(prev => ({ ...prev, [item.productId]: (prev[item.productId] || 0) + 1 }))} className="w-8 h-8 rounded-lg bg-green-500 text-white shadow-md flex items-center justify-center">
                                                        <span className="material-icons-round text-sm">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button className="bg-green-500 text-white px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-all">Орлого хадгалах</button>
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Орлогын түүх</h4>
                                <div className="flex flex-col gap-3">
                                    {selectedOrder.history.filter(h => h.type === 'RECEIPT').length > 0 ? (
                                        selectedOrder.history.filter(h => h.type === 'RECEIPT').map((h, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                                                        <span className="material-icons-round text-sm">inbox</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-gray-800">{h.staff}</p>
                                                        <p className="text-[9px] font-bold text-gray-400">{h.date}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-black text-green-500">+{h.quantity} ширхэг</p>
                                            </div>
                                        ))
                                    ) : <p className="text-center py-6 text-gray-300 font-bold text-xs uppercase tracking-widest">Түүх олдсонгүй</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar">
            {viewMode === 'LIST' && renderList()}
            {viewMode === 'CREATE' && renderCreate()}
            {viewMode === 'DETAIL' && renderDetail()}
        </div>
    );
};

export default ProductOrderListScreen;
