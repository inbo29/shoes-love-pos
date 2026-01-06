import React, { useState, useMemo } from 'react';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import { mockInventoryData, InventoryItem } from '../../../../services/mockInventoryData';

interface InventoryListScreenProps {
    userName?: string;
    initialBranch?: string;
}

const InventoryListScreen: React.FC<InventoryListScreenProps> = ({ userName, initialBranch }) => {
    // Filter States
    const [selectedBranch, setSelectedBranch] = useState(initialBranch || 'all');
    const [productCode, setProductCode] = useState('');
    const [productName, setProductName] = useState('');
    const [unit, setUnit] = useState('all');
    const [productType, setProductType] = useState('all');
    const [qtyFrom, setQtyFrom] = useState('');
    const [qtyTo, setQtyTo] = useState('');
    const [costFrom, setCostFrom] = useState('');
    const [costTo, setCostTo] = useState('');
    const [onlyWithStock, setOnlyWithStock] = useState(false);

    // UI States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredData = useMemo(() => {
        const isAdmin = userName === 'Админ';
        const effectiveBranch = isAdmin ? selectedBranch : (initialBranch || 'Төв салбар');

        return mockInventoryData.filter(item => {
            const matchesBranch = effectiveBranch === 'all' || item.branchName === effectiveBranch;
            const matchesCode = item.productCode.toLowerCase().includes(productCode.toLowerCase());
            const matchesName = item.productName.toLowerCase().includes(productName.toLowerCase());
            const matchesUnit = unit === 'all' || item.unit === unit;
            const matchesType = productType === 'all' || item.productType === productType;

            const qFrom = qtyFrom === '' ? -Infinity : Number(qtyFrom);
            const qTo = qtyTo === '' ? Infinity : Number(qtyTo);
            const matchesQty = item.onHandQty >= qFrom && item.onHandQty <= qTo;

            const cFrom = costFrom === '' ? -Infinity : Number(costFrom);
            const cTo = costTo === '' ? Infinity : Number(costTo);
            const matchesCost = item.cost >= cFrom && item.cost <= cTo;

            const matchesStock = !onlyWithStock || item.onHandQty > 0;

            return matchesBranch && matchesCode && matchesName && matchesUnit && matchesType && matchesQty && matchesCost && matchesStock;
        });
    }, [selectedBranch, productCode, productName, unit, productType, qtyFrom, qtyTo, costFrom, costTo, onlyWithStock]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    // Summary Calculations
    const totals = useMemo(() => {
        return filteredData.reduce((acc, item) => {
            acc.onHand += item.onHandQty;
            acc.available += item.availableQty;
            acc.reserve += item.reserveQty;
            acc.cost += item.cost;
            return acc;
        }, { onHand: 0, available: 0, reserve: 0, cost: 0 });
    }, [filteredData]);

    const resetFilters = () => {
        setSelectedBranch(userName === 'Админ' ? 'all' : (initialBranch || 'Төв салбар'));
        setProductCode('');
        setProductName('');
        setUnit('all');
        setProductType('all');
        setQtyFrom('');
        setQtyTo('');
        setCostFrom('');
        setCostTo('');
        setOnlyWithStock(false);
        setCurrentPage(1);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden relative">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-[100px]">
                <div className="w-full flex flex-col p-4 md:p-6 gap-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                            <h2 className="text-[18px] font-bold text-[#374151]">Бараа үлдэгдэл</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <PosExcelButton />
                        </div>
                    </div>

                    {/* Filters Area */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            <PosDropdown
                                label="Салбар" icon="storefront" value={selectedBranch} onChange={setSelectedBranch}
                                disabled={userName !== 'Админ'}
                                options={[
                                    { label: 'Бүх салбар', value: 'all' },
                                    { label: 'Төв салбар', value: 'Төв салбар' },
                                    { label: 'Салбар 1', value: 'Салбар 1' },
                                    { label: 'Салбар 2', value: 'Салбар 2' }
                                ]}
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Барааны код</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-icons-round text-sm">qr_code</span>
                                    </span>
                                    <input
                                        type="text" value={productCode} onChange={e => setProductCode(e.target.value)}
                                        className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Кодоор хайх"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 lg:col-span-2 xl:col-span-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Бараа нэр</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <span className="material-icons-round text-sm">inventory_2</span>
                                    </span>
                                    <input
                                        type="text" value={productName} onChange={e => setProductName(e.target.value)}
                                        className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Нэрээр хайх"
                                    />
                                </div>
                            </div>

                            <PosDropdown
                                label="Хэмжих нэгж" icon="straighten" value={unit} onChange={setUnit}
                                options={[
                                    { label: 'Бүгд', value: 'all' },
                                    { label: 'ш', value: 'ш' },
                                    { label: 'кг', value: 'кг' },
                                    { label: 'л', value: 'л' }
                                ]}
                            />

                            <PosDropdown
                                label="Төрөл" icon="category" value={productType} onChange={setProductType}
                                options={[
                                    { label: 'Бүгд', value: 'all' },
                                    { label: 'Бараа', value: 'Бараа' },
                                    { label: 'Хангамж', value: 'Хангамж' }
                                ]}
                            />

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Тоо хэмжээ</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number" value={qtyFrom} onChange={e => setQtyFrom(e.target.value)}
                                        className="w-full h-[44px] px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="0"
                                    />
                                    <span className="text-gray-300">~</span>
                                    <input
                                        type="number" value={qtyTo} onChange={e => setQtyTo(e.target.value)}
                                        className="w-full h-[44px] px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="999"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 lg:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Өртөг</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number" value={costFrom} onChange={e => setCostFrom(e.target.value)}
                                        className="w-full h-[44px] px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Доод дүн"
                                    />
                                    <span className="text-gray-300">~</span>
                                    <input
                                        type="number" value={costTo} onChange={e => setCostTo(e.target.value)}
                                        className="w-full h-[44px] px-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Дээд дүн"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 lg:col-span-2 xl:col-span-1 pt-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={onlyWithStock}
                                            onChange={(e) => setOnlyWithStock(e.target.checked)}
                                        />
                                        <div className={`w-10 h-6 rounded-full transition-colors ${onlyWithStock ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${onlyWithStock ? 'translate-x-4 shadow-md' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-primary transition-colors">Зөвхөн үлдэгдэлтэй харах</span>
                                </label>
                            </div>

                            <div className="flex items-end gap-2 lg:ml-auto">
                                <button onClick={resetFilters} className="h-[44px] px-6 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm">Цэвэрлэх</button>
                                <button className="h-[44px] px-8 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                                    <span className="material-icons-round text-lg">search</span> Хайлт хийх
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
                        <div className="flex-1 overflow-x-auto no-scrollbar">
                            <div className="min-w-[1400px]">
                                <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center uppercase">
                                    <div className="w-[100px] shrink-0">Салбар №</div>
                                    <div className="w-[150px] shrink-0 px-2">Салбарын нэр</div>
                                    <div className="w-[120px] shrink-0 px-2">Барааны код</div>
                                    <div className="flex-1 px-2">Бараа нэр</div>
                                    <div className="w-[150px] shrink-0 px-2">Бар код</div>
                                    <div className="w-[80px] shrink-0 px-2 text-center">Нэгж</div>
                                    <div className="w-[100px] shrink-0 px-2 text-center">Төрөл</div>
                                    <div className="w-[120px] shrink-0 px-2 text-right">Гар дээрх</div>
                                    <div className="w-[120px] shrink-0 px-2 text-right">Боломжит</div>
                                    <div className="w-[100px] shrink-0 px-2 text-right">Нөөц</div>
                                    <div className="w-[120px] shrink-0 px-2 text-right">Захиалга</div>
                                    <div className="w-[130px] shrink-0 px-2 text-right">Өртөг</div>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                                        <div key={idx} className="flex px-6 py-4 hover:bg-primary/5 transition-colors items-center text-[12px] group">
                                            <div className="w-[100px] shrink-0 font-bold text-gray-400 mb-0">{item.branchId}</div>
                                            <div className="w-[150px] shrink-0 px-2 font-black text-gray-700">{item.branchName}</div>
                                            <div className="w-[120px] shrink-0 px-2 font-black text-primary">{item.productCode}</div>
                                            <div className="flex-1 px-2 font-bold text-gray-800 line-clamp-1">{item.productName}</div>
                                            <div className="w-[150px] shrink-0 px-2 font-medium text-gray-400">{item.barcode}</div>
                                            <div className="w-[80px] shrink-0 px-2 text-center text-gray-500 font-bold">{item.unit}</div>
                                            <div className="w-[100px] shrink-0 px-2 text-center">
                                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${item.productType === 'Бараа' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                                                    {item.productType}
                                                </span>
                                            </div>
                                            <div className={`w-[120px] shrink-0 px-2 text-right font-black ${item.onHandQty <= 0 ? 'text-red-500' : 'text-gray-900'}`}>{item.onHandQty.toLocaleString()}</div>
                                            <div className={`w-[120px] shrink-0 px-2 text-right font-bold ${item.availableQty <= 0 ? 'text-red-500' : 'text-primary'}`}>{item.availableQty.toLocaleString()}</div>
                                            <div className="w-[100px] shrink-0 px-2 text-right font-bold text-gray-500">{item.reserveQty.toLocaleString()}</div>
                                            <div className="w-[120px] shrink-0 px-2 text-right font-black text-green-600">{item.orderableQty.toLocaleString()}</div>
                                            <div className="w-[130px] shrink-0 px-2 text-right font-black text-gray-900">{item.cost.toLocaleString()} ₮</div>
                                        </div>
                                    )) : (
                                        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                                            <span className="material-icons-round text-6xl mb-4 opacity-20">inventory_2</span>
                                            <p className="font-bold text-lg">Үлдэгдэл олдсонгүй</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <PosPagination totalItems={filteredData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between px-8 py-4 z-20">
                <div className="flex items-center gap-10">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт гар дээрх</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-gray-800">{totals.onHand.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">ширхэг</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт боломжит</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-primary">{totals.available.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">ширхэг</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт нөөц</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-gray-500">{totals.reserve.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">ширхэг</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Нийт өртөг (Дүн)</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#40C1C7]">{totals.cost.toLocaleString()} ₮</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryListScreen;
