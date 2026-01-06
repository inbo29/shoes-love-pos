import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosPagination from '../../../shared/components/PosPagination';

const INITIAL_DATA = [
    {
        id: '#ORD-2310-001',
        customer: 'Б. Болд',
        phone: '9911-2345',
        services: 'Гутал цэвэрлэгээ ×2, Ул солих ×1',
        serviceItems: [
            { name: 'Гутал', count: 2, status: 'DONE' },
            { name: 'Засвар', count: 1, status: 'DONE' }
        ],
        finishDate: '2023-10-27',
        totalAmount: '45,000₮',
        remainingAmount: '15,000₮',
        status: 'Хүлээж авсан',
        branch: 'Төв салбар',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-008',
        customer: 'Д. Сараа',
        phone: '8800-1234',
        services: 'Костюм угаалга ×1',
        serviceItems: [
            { name: 'Хими', count: 1, status: 'DONE' }
        ],
        finishDate: '2023-10-26',
        totalAmount: '25,000₮',
        remainingAmount: '0₮',
        status: 'Хүлээж авсан',
        branch: 'Зайсан салбар',
        serviceType: 'Хими'
    },
    {
        id: '#ORD-2310-015',
        customer: 'Г. Тулга',
        phone: '9191-5678',
        services: 'Хивс цэвэрлэгээ 12м2',
        serviceItems: [
            { name: 'Хивс', count: 12, unit: 'м2', status: 'DONE' }
        ],
        finishDate: '2023-10-25',
        totalAmount: '12,000₮',
        remainingAmount: '5,000₮',
        status: 'Хүлээж авсан',
        branch: 'Төв салбар',
        serviceType: 'Хивс'
    },
    {
        id: '#ORD-2310-022',
        customer: 'А. Анар',
        phone: '9988-7766',
        services: 'Гэр ариутгал хэмжээ 1',
        serviceItems: [
            { name: 'Ариутгал', count: 1, status: 'CANCEL' }
        ],
        finishDate: '2023-10-25',
        totalAmount: '60,000₮',
        remainingAmount: '0₮',
        status: 'Хүлээлгэн өгсөн',
        branch: 'Хүүхдийн 100',
        serviceType: 'Ариутгал'
    },
    {
        id: '#ORD-2310-041',
        customer: 'Б. Цэцэг',
        phone: '8080-9090',
        services: 'Clean Service багц 1',
        serviceItems: [
            { name: 'Clean Service', count: 1, status: 'DONE' }
        ],
        finishDate: '2023-10-24',
        totalAmount: '8,000₮',
        remainingAmount: '0₮',
        status: 'Хүлээлгэн өгсөн',
        branch: 'Зайсан салбар',
        serviceType: 'Clean Service'
    },
    {
        id: '#ORD-2310-055',
        customer: 'Н. Бат',
        phone: '9595-4321',
        services: 'Гутал засвар ×1',
        serviceItems: [
            { name: 'Гутал', count: 1, status: 'CANCEL' }
        ],
        finishDate: '2023-10-23',
        totalAmount: '85,000₮',
        remainingAmount: '20,000₮',
        status: 'Хүлээж авсан',
        branch: 'Төв салбар',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-062',
        customer: 'Т. Тэмүүлэн',
        phone: '9900-8877',
        services: 'Гутал цэвэрлэгээ ×1',
        serviceItems: [
            { name: 'Гутал', count: 1, status: 'DONE' }
        ],
        finishDate: '2023-10-22',
        totalAmount: '15,000₮',
        remainingAmount: '5,000₮',
        status: 'Хүлээж авсан',
        branch: 'Хүүхдийн 100',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-071',
        customer: 'С. Солонго',
        phone: '8811-2233',
        services: 'Пальто угаалга ×1',
        serviceItems: [
            { name: 'Хими', count: 1, status: 'DONE' }
        ],
        finishDate: '2023-10-21',
        totalAmount: '35,000₮',
        remainingAmount: '0₮',
        status: 'Хүлээлгэн өгсөн',
        branch: 'Зайсан салбар',
        serviceType: 'Хими'
    },
    {
        id: '#ORD-2310-085',
        customer: 'М. Мөнх',
        phone: '9494-0000',
        services: 'Хивс цэвэрлэгээ 20м2',
        serviceItems: [
            { name: 'Хивс', count: 20, unit: 'м2', status: 'DONE' }
        ],
        finishDate: '2023-10-20',
        totalAmount: '20,000₮',
        remainingAmount: '0₮',
        status: 'Хүлээлгэн өгсөн',
        branch: 'Төв салбар',
        serviceType: 'Хивс'
    },
];

const ReceiveListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [selectedServiceType, setSelectedServiceType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    // Masking helpers
    const maskName = (name: string) => {
        if (!name) return '';
        if (name.length <= 1) return name;
        if (name.length === 2) return name[0] + '*';
        let masked = name[0];
        for (let i = 1; i < name.length - 1; i++) {
            masked += (name[i] === ' ' || name[i] === '-') ? name[i] : '*';
        }
        masked += name[name.length - 1];
        return masked;
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '';
        const parts = phone.split('-');
        if (parts.length === 2) {
            return parts[0].substring(0, 2) + '**' + '-' + '****';
        }
        return phone.substring(0, 2) + '****';
    };

    // Default to October 2023 range for mock data visibility
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [data] = useState(INITIAL_DATA);

    const filteredAndSortedData = useMemo(() => {
        let result = data.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone.includes(searchTerm);

            const matchesBranch = selectedBranch === 'all' || item.branch === selectedBranch;
            const matchesServiceType = selectedServiceType === 'all' || item.serviceType === selectedServiceType;
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

            const itemDate = new Date(item.finishDate);
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesServiceType && matchesStatus && matchesDate;
        });

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.finishDate).getTime();
            const dateB = new Date(b.finishDate).getTime();
            const amountA = parseInt(a.totalAmount.replace(/[^0-9]/g, ''));
            const amountB = parseInt(b.totalAmount.replace(/[^0-9]/g, ''));

            switch (sortBy) {
                case 'newest': return dateB - dateA;
                case 'oldest': return dateA - dateB;
                case 'amount-high': return amountB - amountA;
                case 'amount-low': return amountA - amountB;
                default: return 0;
            }
        });

        return result;
    }, [data, searchTerm, selectedServiceType, selectedStatus, startDate, endDate, sortBy]);

    // Pagination
    const itemsPerPage = 10;
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Хүлээж авсан': return 'bg-green-100 text-green-600 border-green-200';
            case 'Хүлээлгэн өгсөн': return 'bg-blue-100 text-blue-600 border-blue-200';
            default: return 'bg-gray-100 text-gray-400 border-gray-200';
        }
    };

    const renderServiceBadges = (serviceItems: any[]) => {
        if (!serviceItems) return null;

        // Grouping logic: { "Name_Status": { name, status, count } }
        const groups: Record<string, { name: string; status: string; count: number; unit?: string }> = {};
        serviceItems.forEach(item => {
            const key = `${item.name}_${item.status}`;
            if (groups[key]) {
                groups[key].count += item.count || 1;
            } else {
                groups[key] = { ...item, count: item.count || 1 };
            }
        });

        return (
            <div className="flex flex-wrap gap-1.5">
                {Object.values(groups).map((group, idx) => {
                    const isDone = group.status === 'DONE';
                    return (
                        <span
                            key={idx}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-black uppercase tracking-tight whitespace-nowrap ${isDone ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                                }`}
                        >
                            <span className={`w-1 h-1 rounded-full ${isDone ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {group.name} {group.count > 1 ? group.count : ''}{group.unit || ''} ({isDone ? 'Болсон' : 'Буцаагдсан'})
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">
                {/* 1. Header Section */}
                <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h2 className="text-[18px] font-bold text-[#374151]">
                            Хүлээлгэн өгөх жагсаалт
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 w-full xl:w-auto">
                        <div className="relative flex-1 xl:w-[400px]">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round text-xl">search</span>
                            </span>
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="block w-full h-[48px] pl-11 pr-4 border border-gray-100 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm shadow-sm transition-all"
                                placeholder="Системээс хайх (Утас, Нэр, №)"
                                type="text"
                            />
                        </div>
                        <PosExcelButton />
                    </div>
                </div>

                {/* 2. Filter Bar */}
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
                        label="Үйлчилгээ"
                        icon="category"
                        value={selectedServiceType}
                        onChange={(val) => {
                            setSelectedServiceType(val);
                            setCurrentPage(1);
                        }}
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
                        onChange={(val) => {
                            setSelectedStatus(val);
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: 'Бүгд', value: 'all' },
                            { label: 'Хүлээж авсан', value: 'Хүлээж авсан' },
                            { label: 'Хүлээлгэн өгсөн', value: 'Хүлээлгэн өгсөн' },
                        ]}
                        className="w-full sm:w-[180px] shrink-0"
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
                        className="w-full sm:w-[150px] shrink-0"
                    />

                    <button className="bg-primary hover:bg-primary/90 text-white px-6 h-[44px] rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all font-bold text-sm active:scale-95 group w-full lg:w-auto lg:ml-auto shrink-0">
                        <span className="material-icons-round text-lg group-hover:rotate-180 transition-transform duration-700">sync</span>
                        Шүүх
                    </button>
                </div>

                {/* 3. Data Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col relative z-[1] min-h-0">
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[1100px] flex flex-col h-full uppercase">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                                <div className="w-[130px] shrink-0 px-4">Захиалгын №</div>
                                <div className="w-[140px] shrink-0 px-4">Үйлчлүүлэгч</div>
                                <div className="w-[110px] shrink-0 px-4">Утас</div>
                                <div className="w-[240px] shrink-0 px-4">Мөрийн төлөв</div>
                                <div className="w-[140px] shrink-0 px-4 text-center">Төлөв</div>
                                <div className="w-[100px] shrink-0 text-center">Огноо</div>
                                <div className="w-[150px] shrink-0 px-4 text-right">Үлдэгдэл дүн</div>
                                <div className="w-[120px] shrink-0 px-4 text-right">Нийт дүн</div>
                                <div className="w-8 shrink-0"></div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto flex-1 no-scrollbar bg-white">
                                {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            const pureId = item.id.replace('#', '');
                                            navigate(`/pos/receive/${pureId}`);
                                        }}
                                        className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group"
                                    >
                                        <div className="w-[130px] shrink-0 px-4 font-extrabold text-[#40C1C7] group-hover:underline truncate">{item.id}</div>
                                        <div className="w-[140px] shrink-0 px-4 font-bold text-gray-800 truncate">{maskName(item.customer)}</div>
                                        <div className="w-[110px] shrink-0 px-4 text-gray-500 font-medium">{maskPhone(item.phone)}</div>
                                        <div className="w-[240px] shrink-0 px-4">
                                            {renderServiceBadges((item as any).serviceItems)}
                                        </div>
                                        <div className="w-[140px] shrink-0 px-4 flex justify-center">
                                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap justify-center ${getStatusStyles(item.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Хүлээж авсан' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="w-[100px] shrink-0 text-center text-gray-400 font-bold text-[11px]">{item.finishDate}</div>
                                        <div className="w-[150px] shrink-0 px-4 text-right font-black text-red-500">{item.remainingAmount}</div>
                                        <div className="w-[120px] shrink-0 px-4 text-right font-black text-gray-900">{item.totalAmount}</div>
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

                            <PosPagination
                                totalItems={filteredAndSortedData.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiveListScreen;
