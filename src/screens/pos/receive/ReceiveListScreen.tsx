import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosPagination from '../../../shared/components/PosPagination';
import type { ReceiveOrderItem, OrderStatus } from './receiveTypes';
import { calcOrderStatus, getOrderStatusStyles, getItemStatusLabel, getItemStatusStyles } from './receiveTypes';

// ——— MOCK DATA ———
interface ListItem {
    id: string;
    customer: string;
    phone: string;
    items: { name: string; status: ReceiveOrderItem['status'] }[];
    finishDate: string;
    totalAmount: number;
    remainingAmount: number;
    branch: string;
    serviceType: string;
}

const INITIAL_DATA: ListItem[] = [
    {
        id: '#ORD-2310-001',
        customer: 'Б. Болд',
        phone: '9911-2345',
        items: [
            { name: 'Гутал 2', status: 'PENDING' },
            { name: 'Засвар', status: 'PENDING' },
        ],
        finishDate: '2023-10-27',
        totalAmount: 45000,
        remainingAmount: 15000,
        branch: 'Төв салбар',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-002',
        customer: 'Ч. Бат',
        phone: '9900-1122',
        items: [
            { name: 'Гутал 2', status: 'RECEIVED' },
            { name: 'Гутал (Timberland)', status: 'REORDER' },
            { name: 'Хими', status: 'REFUNDED' },
        ],
        finishDate: '2023-10-27',
        totalAmount: 55000,
        remainingAmount: 0,
        branch: 'Зайсан салбар',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-008',
        customer: 'Д. Сараа',
        phone: '8800-1234',
        items: [
            { name: 'Хими', status: 'RECEIVED' },
        ],
        finishDate: '2023-10-26',
        totalAmount: 25000,
        remainingAmount: 0,
        branch: 'Зайсан салбар',
        serviceType: 'Хими'
    },
    {
        id: '#ORD-2310-015',
        customer: 'Г. Тулга',
        phone: '9191-5678',
        items: [
            { name: 'Хивс 12м2', status: 'RECEIVED' },
        ],
        finishDate: '2023-10-25',
        totalAmount: 12000,
        remainingAmount: 5000,
        branch: 'Төв салбар',
        serviceType: 'Хивс'
    },
    {
        id: '#ORD-2310-022',
        customer: 'А. Анар',
        phone: '9988-7766',
        items: [
            { name: 'Ариутгал', status: 'REFUNDED' },
        ],
        finishDate: '2023-10-25',
        totalAmount: 60000,
        remainingAmount: 0,
        branch: 'Хүүхдийн 100',
        serviceType: 'Ариутгал'
    },
    {
        id: '#ORD-2310-041',
        customer: 'Б. Цэцэг',
        phone: '8080-9090',
        items: [
            { name: 'Clean Service', status: 'RECEIVED' },
        ],
        finishDate: '2023-10-24',
        totalAmount: 8000,
        remainingAmount: 0,
        branch: 'Зайсан салбар',
        serviceType: 'Clean Service'
    },
    {
        id: '#ORD-2310-055',
        customer: 'Н. Бат',
        phone: '9595-4321',
        items: [
            { name: 'Гутал', status: 'PENDING' },
        ],
        finishDate: '2023-10-23',
        totalAmount: 85000,
        remainingAmount: 20000,
        branch: 'Төв салбар',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-062',
        customer: 'Т. Тэмүүлэн',
        phone: '9900-8877',
        items: [
            { name: 'Гутал (Nike Air Force)', status: 'RECEIVED' },
            { name: 'Гутал (Adidas Ultra Boost)', status: 'REORDER_DONE' },
            { name: 'Засвар (Ул солих)', status: 'RECEIVED' },
        ],
        finishDate: '2023-10-22',
        totalAmount: 65000,
        remainingAmount: 15000,
        branch: 'Хүүхдийн 100',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-071',
        customer: 'С. Солонго',
        phone: '8811-2233',
        items: [
            { name: 'Хими', status: 'RECEIVED' },
        ],
        finishDate: '2023-10-21',
        totalAmount: 35000,
        remainingAmount: 0,
        branch: 'Зайсан салбар',
        serviceType: 'Хими'
    },
    {
        id: '#ORD-2310-085',
        customer: 'М. Мөнх',
        phone: '9494-0000',
        items: [
            { name: 'Хивс 20м2', status: 'PENDING' },
        ],
        finishDate: '2023-10-20',
        totalAmount: 20000,
        remainingAmount: 0,
        branch: 'Төв салбар',
        serviceType: 'Хивс'
    },
];

const ReceiveListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedServiceType, setSelectedServiceType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [data] = useState(INITIAL_DATA);

    // Masking helpers
    const maskName = (name: string) => {
        if (!name) return '';
        const parts = name.split(' ');
        return parts.map(part => {
            if (part.length <= 2) return part;
            const mid = Math.floor(part.length / 2);
            return `${part.slice(0, mid - 1)}**${part.slice(mid + 1)}`;
        }).join(' ');
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '';
        const clean = phone.replace(/-/g, '');
        if (clean.length === 8) return `${clean.slice(0, 2)}**-**${clean.slice(6)}`;
        return phone;
    };

    const filteredAndSortedData = useMemo(() => {
        let result = data.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone.includes(searchTerm);
            const matchesServiceType = selectedServiceType === 'all' || item.serviceType === selectedServiceType;

            // Status filter based on computed order status
            const orderStatus = calcOrderStatus(item.items as any);
            const matchesStatus = selectedStatus === 'all' || orderStatus === selectedStatus;

            const itemDate = new Date(item.finishDate);
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesServiceType && matchesStatus && matchesDate;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.finishDate).getTime();
            const dateB = new Date(b.finishDate).getTime();
            switch (sortBy) {
                case 'newest': return dateB - dateA;
                case 'oldest': return dateA - dateB;
                case 'amount-high': return b.totalAmount - a.totalAmount;
                case 'amount-low': return a.totalAmount - b.totalAmount;
                default: return 0;
            }
        });

        return result;
    }, [data, searchTerm, selectedServiceType, selectedStatus, startDate, endDate, sortBy]);

    const itemsPerPage = 10;
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const MAX_VISIBLE_ITEMS = 3;

    const renderServiceSummary = (items: ListItem['items']) => {
        if (!items) return null;
        const visible = items.slice(0, MAX_VISIBLE_ITEMS);
        const remaining = items.length - MAX_VISIBLE_ITEMS;

        return (
            <div className="flex flex-col gap-1.5 justify-center">
                {visible.map((item, idx) => {
                    const label = getItemStatusLabel(item.status);
                    const styles = getItemStatusStyles(item.status);
                    const itemNum = String(idx + 1).padStart(2, '0');
                    return (
                        <div
                            key={idx}
                            className={`px-2.5 py-0.5 rounded-full border flex items-center gap-1 text-[9px] font-black uppercase tracking-tight whitespace-nowrap ${styles}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.status === 'RECEIVED' ? 'bg-green-500' :
                                item.status === 'REFUNDED' ? 'bg-red-500' :
                                    item.status === 'REORDER' ? 'bg-orange-500' :
                                        item.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}></span>
                            <span className="font-black text-[9px] opacity-60">[{itemNum}]</span> {item.name} ({label})
                        </div>
                    );
                })}
                {remaining > 0 && (
                    <span className="text-[8px] text-gray-400 font-bold pl-1">+{remaining} бараа</span>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">
            {/* 1. Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h2 className="text-xl font-bold text-[#374151] uppercase tracking-tight">Хүлээлгэн өгөх жагсаалт</h2>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[400px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-sm">search</span>
                        </span>
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all"
                            placeholder="Системээс хайх (Утас, Нэр, №)"
                            type="text"
                        />
                    </div>
                    <PosExcelButton />
                </div>
            </div>

            {/* 2. Filter Bar */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap xl:flex-nowrap items-end gap-4 shrink-0 overflow-visible relative z-[30]">
                <div className="w-full sm:w-auto flex-1 min-w-[240px]">
                    <PosDateRangePicker
                        label="Хугацаа"
                        start={startDate}
                        end={endDate}
                        onChange={(s, e) => {
                            setStartDate(s);
                            setEndDate(e);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <PosDropdown
                    label="Үйлчилгээ"
                    icon="category"
                    value={selectedServiceType}
                    onChange={(val) => { setSelectedServiceType(val); setCurrentPage(1); }}
                    options={[
                        { label: 'Бүгд', value: 'all' },
                        { label: 'Гутал', value: 'Гутал' },
                        { label: 'Хими', value: 'Хими' },
                        { label: 'Хивс', value: 'Хивс' },
                        { label: 'Ариутгал', value: 'Ариутгал' },
                        { label: 'Clean Service', value: 'Clean Service' },
                    ]}
                    className="w-full sm:w-[160px] shrink-0"
                />

                <PosDropdown
                    label="Төлөв"
                    icon="fact_check"
                    value={selectedStatus}
                    onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
                    options={[
                        { label: 'Бүгд', value: 'all' },
                        { label: 'Хүлээн авахад бэлэн', value: 'Хүлээн авахад бэлэн' },
                        { label: 'Хэсэгчлэн хүлээлгэн өгсөн', value: 'Хэсэгчлэн хүлээлгэн өгсөн' },
                        { label: 'Буцаалттай', value: 'Буцаалттай' },
                        { label: 'Дахин захиалгатай', value: 'Дахин захиалгатай' },
                        { label: 'Бүрэн хүлээлгэн өгсөн', value: 'Бүрэн хүлээлгэн өгсөн' },
                    ]}
                    className="w-full sm:w-[200px] shrink-0"
                />

                <PosDropdown
                    label="Эрэмбэлэх"
                    icon="sort"
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                        { label: 'Сүүлд нэмэгдсэн', value: 'newest' },
                        { label: 'Анх нэмэгдсэн', value: 'oldest' },
                        { label: 'Дүн (Өндөрөөс)', value: 'amount-high' },
                        { label: 'Дүн (Багаас)', value: 'amount-low' },
                    ]}
                    className="w-full sm:w-[160px] shrink-0 xl:ml-auto"
                />
            </div>

            {/* 3. Data Table */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden relative z-[1]">
                <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                    <div className="min-w-[1400px] flex flex-col h-full">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[12px] font-bold tracking-widest items-center uppercase text-left">
                            <div className="w-[150px] shrink-0">Захиалгын №</div>
                            <div className="w-[150px] shrink-0 px-2">Үйлчлүүлэгч</div>
                            <div className="w-[120px] shrink-0 px-2">Утас</div>
                            <div className="w-[280px] shrink-0 px-2">Мөрийн төлөв</div>
                            <div className="w-[180px] shrink-0 px-2 text-center">Төлөв</div>
                            <div className="w-[100px] shrink-0 text-center">Огноо</div>
                            <div className="w-[130px] shrink-0 px-2 text-right">Үлдэгдэл дүн</div>
                            <div className="w-[130px] shrink-0 px-2 text-right">Нийт дүн</div>
                            <div className="w-8 shrink-0"></div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto flex-1 no-scrollbar bg-white">
                            {paginatedData.length > 0 ? paginatedData.map((item, idx) => {
                                const orderStatus = calcOrderStatus(item.items as any);
                                const statusStyles = getOrderStatusStyles(orderStatus);

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            const pureId = item.id.replace('#', '');
                                            navigate(`/pos/receive/${pureId}/step/1`);
                                        }}
                                        className="flex px-6 py-4 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group"
                                    >
                                        <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline truncate">{item.id}</div>
                                        <div className="w-[150px] shrink-0 px-2 font-bold text-gray-800 truncate">{maskName(item.customer)}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-gray-500 font-medium">{maskPhone(item.phone)}</div>
                                        <div className="w-[280px] shrink-0 px-2">
                                            {renderServiceSummary(item.items)}
                                        </div>
                                        <div className="w-[180px] shrink-0 px-2 flex justify-center">
                                            <span className={`px-3 py-1.5 text-[9px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${statusStyles}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${orderStatus === 'Хүлээн авахад бэлэн' ? 'bg-green-500' :
                                                    orderStatus === 'Бүрэн хүлээлгэн өгсөн' ? 'bg-gray-500' :
                                                        orderStatus === 'Буцаалттай' ? 'bg-red-500' :
                                                            orderStatus === 'Дахин захиалгатай' ? 'bg-orange-500' : 'bg-blue-500'
                                                    }`}></span>
                                                {orderStatus}
                                            </span>
                                        </div>
                                        <div className="w-[100px] shrink-0 text-center text-gray-400 font-bold text-[11px]">{item.finishDate}</div>
                                        <div className={`w-[130px] shrink-0 px-2 text-right font-black ${item.remainingAmount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {item.remainingAmount > 0 ? item.remainingAmount.toLocaleString() + '₮' : '0₮'}
                                        </div>
                                        <div className="w-[130px] shrink-0 px-2 text-right font-black text-gray-900">{item.totalAmount.toLocaleString()}₮</div>
                                        <div className="w-8 shrink-0 flex justify-end text-gray-300 group-hover:text-primary transition-colors">
                                            <span className="material-icons-round">chevron_right</span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                    <span className="material-icons-round text-6xl mb-4 opacity-20">search_off</span>
                                    <p className="font-bold text-lg">Мэдээлэл олдсонгүй</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-50 flex items-center justify-between">
                    <PosPagination
                        totalItems={filteredAndSortedData.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReceiveListScreen;
