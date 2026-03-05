import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosPagination from '../../../shared/components/PosPagination';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import Popup from '../../../shared/components/Popup/Popup';

interface DetailedShipmentItem {
    productId: string;
    barcode: string;
    productCode: string;
    model: string;
    color: string;
    material: string;
    type: string;
    size: string;
    brand: string;
    quantity: number;
}

interface Shipment {
    id: string;
    orderNo: string;
    date: string; // Date of status or creation
    createdAt: string;
    fromBranch: string;
    toFactory: string;
    driver: string;
    creator: string;
    receivedBy?: string;
    dispatchRemark?: string;
    receiveRemark?: string;
    status: 'READY' | 'DISPATCHED' | 'RECEIVED';
    items: DetailedShipmentItem[];
}

const MOCK_DATA: Shipment[] = [
    {
        id: '#SH-2023-001',
        orderNo: '#ORD-001',
        date: '2023.10.27 10:30',
        createdAt: '2023.10.27 09:00',
        fromBranch: 'Төв салбар',
        toFactory: 'Үйлдвэр А',
        driver: 'Б.Болд',
        creator: 'С.Сараа',
        status: 'DISPATCHED',
        dispatchRemark: 'Яаралтай',
        items: [
            { productId: 'p1', barcode: '865201', productCode: 'AJ1', model: 'Air Jordan 1', color: 'Улаан/Хар', material: 'Арьс', type: 'Пүүз', size: '42', brand: 'Nike', quantity: 2 },
            { productId: 'p2', barcode: '865202', productCode: 'AF1', model: 'Air Force 1', color: 'Цагаан', material: 'Арьс', type: 'Пүүз', size: '40', brand: 'Nike', quantity: 1 }
        ]
    },
    {
        id: '#SH-2023-002',
        orderNo: '#ORD-002',
        date: '2023.10.26 16:45',
        createdAt: '2023.10.26 10:00',
        fromBranch: '3-р хороолол',
        toFactory: 'Төв салбар',
        driver: 'Д.Дорж',
        creator: 'Б.Бат',
        receivedBy: 'О.Оюун',
        status: 'RECEIVED',
        receiveRemark: 'Бүрэн хүлээж авсан',
        items: [
            { productId: 'p3', barcode: '865203', productCode: 'NB574', model: '574 Core', color: 'Саарал', material: 'Илгэ', type: 'Кет', size: '39', brand: 'New Balance', quantity: 3 }
        ]
    },
    {
        id: '#SH-2023-003',
        orderNo: '#ORD-003',
        date: '2023.10.25 10:00',
        createdAt: '2023.10.25 09:00',
        fromBranch: 'Төв салбар',
        toFactory: '3-р хороолол',
        driver: 'Б.Бат',
        creator: 'О.Оюун',
        status: 'READY',
        items: [
            { productId: 'p4', barcode: '865204', productCode: 'CM87', model: 'Chuck 70', color: 'Хар', material: 'Даавуу', type: 'Кет', size: '41', brand: 'Converse', quantity: 1 },
            { productId: 'p5', barcode: '865205', productCode: 'STAN', model: 'Stan Smith', color: 'Цагаан/Ногоон', material: 'Арьс', type: 'Пүүз', size: '38', brand: 'Adidas', quantity: 2 }
        ]
    }
];

const ShipmentListScreen: React.FC = () => {
    const navigate = useNavigate();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [branch, setBranch] = useState('all');
    const [factory, setFactory] = useState('all');
    const [status, setStatus] = useState('all');
    const [driver, setDriver] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Export state
    const [popupState, setPopupState] = useState({ isOpen: false, type: 'info' as 'info' | 'success', title: '', message: '' });

    const filteredData = useMemo(() => {
        return MOCK_DATA.filter(item => {
            const query = searchTerm.toLowerCase();
            const matchesSearch = query === '' ||
                item.id.toLowerCase().includes(query) ||
                item.orderNo.toLowerCase().includes(query) ||
                item.items.some(i =>
                    i.model.toLowerCase().includes(query) ||
                    i.brand.toLowerCase().includes(query) ||
                    i.barcode.includes(query)
                );

            const matchesStatus = status === 'all' || item.status === status;
            const matchesBranch = branch === 'all' || item.fromBranch === (branch === 'main' ? 'Төв салбар' : branch);
            const matchesFactory = factory === 'all' || item.toFactory === (factory === 'main' ? 'Төв салбар' : factory);
            const matchesDriver = driver === 'all' || item.driver === driver;

            // Simple date range mock logic...
            let matchesDate = true;
            if (startDate && endDate) {
                // ... usually date parsing goes here
                matchesDate = true;
            }

            return matchesSearch && matchesStatus && matchesBranch && matchesFactory && matchesDriver && matchesDate;
        });
    }, [searchTerm, status, branch, factory, driver, startDate, endDate]);

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'READY': return 'bg-green-100 text-green-600 border-green-200';
            case 'DISPATCHED': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'RECEIVED': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'READY': return 'Ачихад бэлэн';
            case 'DISPATCHED': return 'Ачилт хийсэн';
            case 'RECEIVED': return 'Хүлээж авсан';
            default: return status;
        }
    };

    const toggleRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedRow(prev => prev === id ? null : id);
    };

    const exportToExcel = () => {
        // Flatten logic
        const rows: any[] = [];
        filteredData.forEach(shipment => {
            shipment.items.forEach(item => {
                rows.push({
                    "Ачилтын №": shipment.id,
                    "Order №": shipment.orderNo,
                    "Огноо (Ачилт)": shipment.date,
                    "Илгээсэн": shipment.fromBranch,
                    "Хүлээн авах": shipment.toFactory,
                    "Жолооч": shipment.driver,
                    "Бүртгэсэн": shipment.creator,
                    "Хүлээн авсан (Хүн)": shipment.receivedBy || '',
                    "Төлөв": getStatusLabel(shipment.status),
                    "Ачилтын тайлбар": shipment.dispatchRemark || '',
                    "Хүлээн авалтын тайлбар": shipment.receiveRemark || '',
                    "Product ID": item.productId,
                    "Брэнд": item.brand,
                    "Төрөл": item.type,
                    "Загвар": item.model,
                    "Өнгө": item.color,
                    "Хэмжээ": item.size,
                    "Материал": item.material,
                    "Тоо ширхэг": item.quantity,
                    "Баркод": item.barcode,
                });
            });
        });

        // Building generic CSV just for demonstration
        const keys = Object.keys(rows[0] || {});
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + keys.join(",") + "\n";
        rows.forEach(row => {
            csvContent += keys.map(k => `"${row[k] || ''}"`).join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Shipments_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setPopupState({ isOpen: true, type: 'success', title: 'Амжилттай', message: 'Тайлан татагдлаа.' });
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <div>
                        <h2 className="text-lg font-bold text-[#374151] uppercase tracking-tight">Ачилтын жагсаалт</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Shipment List</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 lg:w-[350px]">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-sm">search</span>
                        </span>
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-[44px] pl-9 pr-4 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-[#40C1C7] focus:ring-4 focus:ring-[#40C1C7]/10 transition-all shadow-sm"
                            placeholder="Ачилт №, Захиалга №, Загвар, Брэнд, Баркод..."
                            type="text"
                        />
                    </div>
                    <button
                        onClick={() => navigate('new')}
                        className="bg-[#40C1C7] hover:bg-[#35a8ad] text-white h-[44px] px-5 rounded-xl shadow-lg shadow-[#40C1C7]/20 flex items-center gap-2 font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all"
                    >
                        <span className="material-icons-round text-lg">local_shipping</span> Ачилт хийх
                    </button>
                    <button
                        onClick={() => navigate('receive')}
                        className="bg-gray-800 hover:bg-black text-white h-[44px] px-5 rounded-xl shadow-lg flex items-center gap-2 font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all"
                    >
                        <span className="material-icons-round text-lg">call_received</span> Ачилт авах
                    </button>
                    <PosExcelButton onClick={exportToExcel} />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-3 shrink-0 overflow-visible relative z-[30]">
                <div className="flex-1 min-w-[200px]">
                    <PosDateRangePicker
                        label="Хугацаа"
                        start={startDate}
                        end={endDate}
                        onChange={(s, e) => {
                            setStartDate(s);
                            setEndDate(e);
                        }}
                    />
                </div>
                <PosDropdown
                    label="Илгээх салбар"
                    options={[
                        { value: 'all', label: 'Бүгд' },
                        { value: 'main', label: 'Төв салбар' },
                        { value: 'd3', label: '3-р хороолол' },
                        { value: 'zaisan', label: 'Зайсан' },
                    ]}
                    value={branch}
                    onChange={setBranch}
                    className="w-full sm:w-[150px] shrink-0"
                />
                <PosDropdown
                    label="Хүлээн авах"
                    options={[
                        { value: 'all', label: 'Бүгд' },
                        { value: 'main', label: 'Төв салбар' },
                        { value: 'Үйлдвэр А', label: 'Үйлдвэр А' },
                    ]}
                    value={factory}
                    onChange={setFactory}
                    className="w-full sm:w-[150px] shrink-0"
                />
                <PosDropdown
                    label="Жолооч"
                    options={[
                        { value: 'all', label: 'Бүгд' },
                        { value: 'Б.Болд', label: 'Б.Болд' },
                        { value: 'Д.Дорж', label: 'Д.Дорж' },
                        { value: 'Б.Бат', label: 'Б.Бат' },
                    ]}
                    value={driver}
                    onChange={setDriver}
                    className="w-full sm:w-[130px] shrink-0"
                />
                <PosDropdown
                    label="Төлөв"
                    options={[
                        { value: 'all', label: 'Бүгд' },
                        { value: 'READY', label: 'Ачихад бэлэн' },
                        { value: 'DISPATCHED', label: 'Ачилт хийсэн' },
                        { value: 'RECEIVED', label: 'Хүлээж авсан' },
                    ]}
                    value={status}
                    onChange={setStatus}
                    className="w-full sm:w-[140px] shrink-0"
                />
            </div>

            {/* List Table */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden relative z-[1]">
                <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                    <div className="min-w-[1400px] flex flex-col h-full">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest uppercase text-left">
                            <div className="w-[150px] shrink-0">Ачилтын №</div>
                            <div className="w-[120px] shrink-0 px-2">Order №</div>
                            <div className="w-[140px] shrink-0 px-2">Огноо</div>
                            <div className="w-[180px] shrink-0 px-2">Хаанаас <span className="text-gray-300 mx-1">→</span> Хаашаа</div>
                            <div className="w-[120px] shrink-0 px-2 text-center">Барааны тоо</div>
                            <div className="w-[160px] shrink-0 px-2">Ажилтан / Жолооч</div>
                            <div className="w-[80px] shrink-0 px-2 text-center">Тайлбар</div>
                            <div className="flex-1 shrink-0 px-2 text-right">Төлөв</div>
                            <div className="w-[60px] shrink-0"></div>
                        </div>

                        {/* Content */}
                        <div className="bg-white">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => {
                                    const totalQty = item.items.reduce((sum, i) => sum + i.quantity, 0);
                                    const hasRemark = item.dispatchRemark || item.receiveRemark;
                                    const isExp = expandedRow === item.id;

                                    return (
                                        <div key={item.id} className={`border-b border-gray-50 transition-colors ${isExp ? 'bg-primary/5' : 'hover:bg-gray-50'}`}>
                                            <div
                                                className="flex px-6 py-5 cursor-pointer items-center text-[13px] group"
                                                onClick={(e) => toggleRow(item.id, e)}
                                            >
                                                <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">{item.id}</div>
                                                <div className="w-[120px] shrink-0 px-2">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800">{item.orderNo}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase">{item.items.length} төрөл</span>
                                                    </div>
                                                </div>
                                                <div className="w-[140px] shrink-0 px-2 text-gray-500 font-bold text-[12px]">{item.date}</div>
                                                <div className="w-[180px] shrink-0 px-2">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-gray-800 text-xs">{item.fromBranch}</span>
                                                        <span className="material-icons-round text-gray-300 text-[10px] rotate-90 w-fit">straight</span>
                                                        <span className="font-bold text-gray-800 text-xs">{item.toFactory}</span>
                                                    </div>
                                                </div>
                                                <div className="w-[120px] shrink-0 px-2 text-center">
                                                    <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 font-black">{totalQty} ш</span>
                                                </div>
                                                <div className="w-[160px] shrink-0 px-2">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <span className="material-icons-round text-[14px] text-gray-400">person</span>
                                                            <span className="font-bold text-gray-600">{item.creator}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px]">
                                                            <span className="material-icons-round text-[14px] text-gray-400">directions_car</span>
                                                            <span className="font-bold text-gray-500">{item.driver}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-[80px] shrink-0 px-2 flex justify-center">
                                                    {hasRemark ? (
                                                        <div className="group/tooltip relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                                            <span className="material-icons-round text-[16px]">chat</span>
                                                            <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-64 p-3 bg-gray-800 text-white text-[11px] rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none">
                                                                {item.dispatchRemark && (
                                                                    <div className="mb-2 last:mb-0">
                                                                        <span className="text-gray-400 block text-[9px] uppercase tracking-wider mb-1">Ачилтын тайлбар:</span>
                                                                        {item.dispatchRemark}
                                                                    </div>
                                                                )}
                                                                {item.receiveRemark && (
                                                                    <div className="mb-2 last:mb-0">
                                                                        <span className="text-gray-400 block text-[9px] uppercase tracking-wider mb-1">Хүлээн авсан тайлбар:</span>
                                                                        {item.receiveRemark}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 shrink-0 px-2 flex justify-end">
                                                    <span className={`px-3 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'READY' ? 'bg-green-500' :
                                                            item.status === 'DISPATCHED' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                                                        {getStatusLabel(item.status)}
                                                    </span>
                                                </div>
                                                <div className="w-[60px] shrink-0 flex justify-end text-gray-400 group-hover:text-[#40C1C7] pr-2">
                                                    <span className={`material-icons-round transition-transform duration-300 ${isExp ? 'rotate-90 text-[#40C1C7]' : ''}`}>
                                                        chevron_right
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Expanded Row Content */}
                                            {isExp && (
                                                <div className="bg-gray-50/80 border-t border-b border-gray-100">
                                                    <div className="p-6">
                                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                                            <div className="bg-[#f0fbfa] px-4 py-3 flex items-center justify-between border-b border-gray-100">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="material-icons-round text-[#40C1C7] text-lg">format_list_bulleted</span>
                                                                    <span className="text-xs font-black text-[#40C1C7] uppercase tracking-widest">Ачилтын дэлгэрэнгүй</span>
                                                                </div>
                                                            </div>
                                                            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                                                <table className="w-full text-left text-xs">
                                                                    <thead className="bg-white sticky top-0 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                                        <tr>
                                                                            <th className="px-4 py-3">Р/Д</th>
                                                                            <th className="px-4 py-3">Баркод</th>
                                                                            <th className="px-4 py-3">Загвар</th>
                                                                            <th className="px-4 py-3">Брэнд</th>
                                                                            <th className="px-4 py-3">Өнгө</th>
                                                                            <th className="px-4 py-3">Материал</th>
                                                                            <th className="px-4 py-3 text-center">Төрөл</th>
                                                                            <th className="px-4 py-3 text-center">Хэмжээ</th>
                                                                            <th className="px-4 py-3 text-right">Тоо ширхэг</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-50">
                                                                        {item.items.map(sub => (
                                                                            <tr key={sub.productId} className="hover:bg-gray-50 transition-colors text-gray-700">
                                                                                <td className="px-4 py-3 font-medium text-gray-500">{sub.productId}</td>
                                                                                <td className="px-4 py-3 font-bold">{sub.barcode}</td>
                                                                                <td className="px-4 py-3 font-black text-gray-800">{sub.model} <span className="text-[10px] text-gray-400 ml-1 font-bold">({sub.productCode})</span></td>
                                                                                <td className="px-4 py-3 font-bold">{sub.brand}</td>
                                                                                <td className="px-4 py-3 font-medium">{sub.color}</td>
                                                                                <td className="px-4 py-3 font-medium">{sub.material}</td>
                                                                                <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-gray-100 text-[10px] rounded-md font-bold text-gray-600">{sub.type}</span></td>
                                                                                <td className="px-4 py-3 text-center font-black">{sub.size}</td>
                                                                                <td className="px-4 py-3 text-right font-black text-primary text-sm">{sub.quantity}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-gray-300">
                                    <span className="material-icons-round text-6xl mb-4 opacity-20">local_shipping</span>
                                    <p className="font-bold text-lg">Одоогоор ачилт бүртгэгдээгүй байна</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-50 flex items-center justify-between p-4 bg-white shrink-0">
                    <PosPagination
                        currentPage={currentPage}
                        totalItems={filteredData.length}
                        itemsPerPage={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <Popup
                isOpen={popupState.isOpen}
                onClose={() => setPopupState(prev => ({ ...prev, isOpen: false }))}
                title={popupState.title}
                message={popupState.message}
                type={popupState.type}
            />
        </div>
    );
};

export default ShipmentListScreen;
