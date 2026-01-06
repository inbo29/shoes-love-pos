import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosPagination from '../../../shared/components/PosPagination';

// Helper for masking
const maskName = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
        // Mask middle part of first name and last name logic if needed, 
        // but user asked for "middle masking". 
        // Example: "B** B***" or "Bat-Erdene Bold" -> "Bat-Erd*** Bold" ? 
        // Interpret "중간에 두글자 띄엄 띄엄 마스킹" (masking two characters in the middle spaced out)
        // Simple strategy: Mask characters from index 2 to length-2?
        // Let's stick to the previous pattern "B**. B***" or similar but more "middle" as requested?
        // User said: "Don't mask just one side, mask sporadically in the middle".
        // Let's try: "Bat-Er**ne Bo**d"
        return name.replace(/(\w{2})\w+(\w{1})/, '$1**$2');
    }
    return name.replace(/(\w{1})\w+(\w{1})/, '$1**$2');
};

// Better masking strategy for names to look like "Бат-Эрд** *олд"
const maskNameSmart = (name: string) => {
    if (!name) return '';
    // Masking 3rd and 4th chars of each word if possible
    return name.split(' ').map(part => {
        if (part.length <= 2) return part;
        if (part.length <= 4) return `${part[0]}**${part[part.length - 1]}`;
        const mid = Math.floor(part.length / 2);
        return `${part.slice(0, mid - 1)}**${part.slice(mid + 1)}`;
    }).join(' ');
};

const maskPhone = (phone: string) => {
    if (!phone) return '';
    // Request: "Mask 2 chars in middle spaced"? 
    // Standard KR/MN phone: 9911-2345
    // Let's mask the middle digits: 99**-23** ? Or 9911-**45?
    // User: "중간에 두글자 띄엄 띄엄" -> likely 99xx-xx45 or similar.
    // Let's do: 9911-2345 -> 99**-23** (too much?)
    // Let's try: 99**-**45
    const clean = phone.replace(/-/g, '');
    if (clean.length === 8) {
        return `${clean.slice(0, 2)}**-**${clean.slice(6)}`;
    }
    return phone;
};

const INITIAL_DATA = [
    {
        id: '#ORD-2023-1001',
        items: [{ name: 'Гутал', count: 2 }, { name: 'Хими', count: 1 }],
        customer: 'Бат-Эрдэнэ Болд',
        phone: '9911-2345',
        date: '2023.10.27 14:15',
        status: 'Захиалсан',
        amount: '45,000 ₮',
        remainingAmount: '0 ₮',
        paymentStatus: 'paid'
    },
    {
        id: '#ORD-2023-1002',
        items: [{ name: 'Хими', count: 3 }],
        customer: 'Сүхбаатар Сарнай',
        phone: '8800-5566',
        date: '2023.10.27 13:45',
        status: 'Захиалж байна',
        amount: '89,900 ₮',
        remainingAmount: '40,000 ₮',
        paymentStatus: 'partial'
    },
    {
        id: '#ORD-2023-1003',
        items: [{ name: 'Хивс', count: 1 }],
        customer: 'Доржпүрэв Гантулга',
        phone: '9191-3344',
        date: '2023.10.27 12:30',
        status: 'Хүлээлгэн өгсөн',
        amount: '245,000 ₮',
        remainingAmount: '0 ₮',
        paymentStatus: 'paid'
    },
    {
        id: '#ORD-2023-0998',
        items: [{ name: 'Гутал', count: 1 }, { name: 'Хими', count: 2 }],
        customer: 'Амарбаясгалан Энхтуяа',
        phone: '9988-7766',
        date: '2023.10.27 11:20',
        status: 'Захиалсан',
        amount: '55,000 ₮',
        remainingAmount: '55,000 ₮',
        paymentStatus: 'unpaid'
    },
    {
        id: '#ORD-2023-0995',
        items: [{ name: 'Clean Service', count: 1 }],
        customer: 'Төмөрбаатар Жаргал',
        phone: '8080-1212',
        date: '2023.10.27 10:05',
        status: 'Захиалж байна',
        amount: '120,000 ₮',
        remainingAmount: '60,000 ₮',
        paymentStatus: 'partial'
    },
    {
        id: '#ORD-2023-0990',
        items: [{ name: 'Гутал', count: 5 }],
        customer: 'Алтанхуяг Болор',
        phone: '9595-6677',
        date: '2023.10.26 18:45',
        status: 'Захиалсан',
        amount: '320,000 ₮',
        remainingAmount: '0 ₮',
        paymentStatus: 'paid'
    },
];

const OrderListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Default range
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [data] = useState(INITIAL_DATA);

    const formatServiceItems = (items: { name: string, count: number }[]) => {
        return items ? items.map(i => `${i.name} ${i.count}`).join(', ') : '';
    };

    const filteredAndSortedData = useMemo(() => {
        let result = data.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone.includes(searchTerm);

            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

            const matchesPayment = selectedPaymentStatus === 'all' ||
                (selectedPaymentStatus === 'paid' && item.paymentStatus === 'paid') ||
                (selectedPaymentStatus === 'unpaid' && item.paymentStatus === 'unpaid') ||
                (selectedPaymentStatus === 'partial' && item.paymentStatus === 'partial');

            const itemDate = new Date(item.date.split(' ')[0].replace(/\./g, '-'));
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesStatus && matchesDate && matchesPayment;
        });

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.date.replace(/\./g, '-')).getTime();
            const dateB = new Date(b.date.replace(/\./g, '-')).getTime();
            const amountA = parseInt(a.amount.replace(/[^0-9]/g, '')) || 0;
            const amountB = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;

            switch (sortBy) {
                case 'newest': return dateB - dateA;
                case 'oldest': return dateA - dateB;
                case 'amount-high': return amountB - amountA;
                case 'amount-low': return amountA - amountB;
                default: return 0;
            }
        });

        return result;
    }, [data, searchTerm, selectedStatus, selectedPaymentStatus, startDate, endDate, sortBy]);

    // Pagination
    const itemsPerPage = 8;
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Хүлээлгэн өгсөн': return 'bg-green-100 text-green-600 border-green-200';
            case 'Захиалсан': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Захиалж байна': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getPaymentStatusLabel = (status: string) => {
        switch (status) {
            case 'paid': return 'Төлөгдөж дууссан';
            case 'unpaid': return 'Төлөгдөөгүй';
            case 'partial': return 'Төлөгдөж байгаа';
            default: return '';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">
                {/* 1. Header & Global Actions */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 shrink-0">
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                            <h2 className="text-[18px] font-bold text-[#374151]">
                                Захиалгын жагсаалт
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/pos/orders/new/step/1')}
                            className="bg-[#FFD400] hover:bg-[#eec600] text-gray-900 px-6 py-3 rounded-2xl shadow-lg shadow-yellow-500/10 flex items-center gap-2 transition-all font-black uppercase text-[11px] tracking-wider hover:-translate-y-0.5 active:scale-95 w-fit shrink-0 whitespace-nowrap"
                        >
                            <span className="material-icons-round text-lg">add_circle</span>
                            Шинэ захиалга авах
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
                                className="block w-full h-[48px] pl-11 pr-4 border border-gray-100 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm shadow-sm transition-all"
                                placeholder="Нэр / утас / захиалга №-р хайх"
                                type="text"
                            />
                        </div>
                        <PosExcelButton />
                    </div>
                </div>

                {/* 2. Standardized Filter bar */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0 overflow-visible relative z-[30]">
                    <div className="w-full sm:w-auto flex-1 min-w-[240px]">
                        <PosDateRangePicker
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
                        label="Төлөв"
                        icon="flag"
                        value={selectedStatus}
                        onChange={(val) => {
                            setSelectedStatus(val);
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: 'Бүх төлөв', value: 'all' },
                            { label: 'Захиалж байна', value: 'Захиалж байна' },
                            { label: 'Захиалсан', value: 'Захиалсан' },
                        ]}
                        className="w-full sm:w-[150px] shrink-0"
                    />

                    <PosDropdown
                        label="Төлбөр"
                        icon="payments"
                        value={selectedPaymentStatus}
                        onChange={(val) => {
                            setSelectedPaymentStatus(val);
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: 'Бүгд', value: 'all' },
                            { label: 'Төлөгдөж дууссан', value: 'paid' },
                            { label: 'Төлөгдөөгүй', value: 'unpaid' },
                            { label: 'Төлөгдөж байгаа', value: 'partial' },
                        ]}
                        className="w-full sm:w-[130px] shrink-0"
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
                        className="w-full sm:w-[160px] shrink-0"
                    />

                    <button className="bg-primary hover:bg-primary/90 text-white px-6 h-[44px] rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all font-bold text-sm active:scale-95 group w-full lg:w-auto lg:ml-auto shrink-0">
                        <span className="material-icons-round text-lg group-hover:rotate-180 transition-transform duration-700">sync</span>
                        Шүүх
                    </button>
                </div>

                {/* 3. Standardized List Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[1400px] flex flex-col h-full uppercase">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                                <div className="w-[150px] shrink-0">Захиалгын №</div>
                                <div className="w-[180px] shrink-0 px-2">Үйлчлүүлэгч</div>
                                <div className="w-[120px] shrink-0 px-2">Утас</div>
                                <div className="w-[300px] shrink-0 px-2">Үйлчилгээ (товч)</div>
                                <div className="w-[150px] shrink-0 px-2">Огноо</div>
                                <div className="w-[140px] shrink-0 px-2 text-center">Төлөв</div>
                                <div className="w-[130px] shrink-0 px-2 text-right">Үлдэгдэл дүн</div>
                                <div className="w-[130px] shrink-0 px-2 text-right">Нийт дүн</div>
                                <div className="w-8 shrink-0"></div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto flex-1 no-scrollbar bg-white">
                                {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            const pureId = item.id.replace('#', '');
                                            navigate(`/pos/orders/${pureId}/edit/step/1`);
                                        }}
                                        className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group normal-case"
                                    >
                                        <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">{item.id}</div>
                                        <div className="w-[180px] shrink-0 px-2 font-bold text-gray-800 truncate">{maskNameSmart(item.customer)}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-gray-500 font-medium">{maskPhone(item.phone)}</div>
                                        <div className="w-[300px] shrink-0 px-2 font-bold text-gray-500 truncate">{formatServiceItems(item.items)}</div>
                                        <div className="w-[150px] shrink-0 px-2 text-gray-400 text-xs font-medium">{item.date}</div>
                                        <div className="w-[140px] shrink-0 px-2 flex justify-center">
                                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Хүлээлгэн өгсөн' ? 'bg-green-500' :
                                                    item.status === 'Захиалсан' ? 'bg-blue-500' : 'bg-yellow-500'
                                                    }`}></span>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="w-[130px] shrink-0 px-2 text-right font-bold text-red-500">{item.remainingAmount}</div>
                                        <div className="w-[130px] shrink-0 px-2 text-right font-black text-gray-900">{item.amount}</div>
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

export default OrderListScreen;
