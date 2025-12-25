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
        finishDate: '2023-10-27',
        totalAmount: '45,000₮',
        status: 'Бэлэн',
        branch: 'Төв салбар',
        serviceType: 'Гутал'
    },
    {
        id: '#ORD-2310-008',
        customer: 'Д. Сараа',
        phone: '8800-1234',
        services: 'Костюм угаалга ×1',
        finishDate: '2023-10-26',
        totalAmount: '25,000₮',
        status: 'Бэлэн',
        branch: 'Зайсан салбар',
        serviceType: 'Хими'
    },
    {
        id: '#ORD-2310-015',
        customer: 'Г. Тулга',
        phone: '9191-5678',
        services: 'Хивс цэвэрлэгээ 12м2',
        finishDate: '2023-10-25',
        totalAmount: '12,000₮',
        status: 'Хүлээлгэн өгөх',
        branch: 'Төв салбар',
        serviceType: 'Хивс'
    },
    {
        id: '#ORD-2310-022',
        customer: 'А. Анар',
        phone: '9988-7766',
        services: 'Гэр ариутгал хэмжээ 1',
        finishDate: '2023-10-25',
        totalAmount: '60,000₮',
        status: 'Буцаалт',
        branch: 'Хүүхдийн 100',
        serviceType: 'Ариутгал'
    },
    {
        id: '#ORD-2310-041',
        customer: 'Б. Цэцэг',
        phone: '8080-9090',
        services: 'Clean Service багц 1',
        finishDate: '2023-10-24',
        totalAmount: '8,000₮',
        status: 'Бэлэн',
        branch: 'Зайсан салбар',
        serviceType: 'Clean Service'
    },
    {
        id: '#ORD-2310-055',
        customer: 'Н. Бат',
        phone: '9595-4321',
        services: 'Гутал засвар ×1',
        finishDate: '2023-10-23',
        totalAmount: '85,000₮',
        status: 'Бэлэн',
        branch: 'Төв салбар',
        serviceType: 'Гутал'
    },
];

const ReceiveListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [selectedServiceType, setSelectedServiceType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

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

            const itemDate = new Date(item.finishDate);
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesBranch && matchesServiceType && matchesDate;
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
    }, [data, searchTerm, selectedBranch, selectedServiceType, startDate, endDate, sortBy]);

    // Pagination
    const itemsPerPage = 10;
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Бэлэн': return 'bg-green-100 text-green-600 border-green-200';
            case 'Хүлээлгэн өгөх': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'Буцаалт': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-400 border-gray-200';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">
                {/* 1. Header Section */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h2 className="text-[18px] font-bold text-[#374151]">
                            Хүлээлгэн өгөх жагсаалт
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[360px]">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round text-xl">search</span>
                            </span>
                            <input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="block w-full h-[48px] pl-11 pr-4 py-3 border border-gray-100 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm shadow-sm transition-all"
                                placeholder="Системээс хайх (Утас, Нэр, №)"
                                type="text"
                            />
                        </div>
                        <PosExcelButton />
                    </div>
                </div>

                {/* 2. Filter Bar */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap md:flex-nowrap items-end gap-3 lg:gap-5 shrink-0 overflow-visible relative z-[30]">
                    <div className="w-full md:w-auto md:flex-1 min-w-[260px]">
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
                        label="Салбар"
                        icon="storefront"
                        value={selectedBranch}
                        onChange={(val) => {
                            setSelectedBranch(val);
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: 'Бүх салбар', value: 'all' },
                            { label: 'Төв салбар', value: 'Төв салбар' },
                            { label: 'Зайсан салбар', value: 'Зайсан салбар' },
                            { label: 'Хүүхдийн 100', value: 'Хүүхдийн 100' },
                        ]}
                        className="w-full md:w-[150px] shrink-0"
                    />

                    <PosDropdown
                        label="Төрөл"
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
                        className="w-full md:w-[160px] shrink-0"
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
                        className="w-full md:w-[150px] shrink-0"
                    />

                    <button className="bg-primary hover:bg-primary/90 text-white px-6 h-[44px] rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all font-bold text-sm active:scale-95 group w-full md:w-auto md:ml-auto shrink-0">
                        <span className="material-icons-round text-lg group-hover:rotate-180 transition-transform duration-700">sync</span>
                        Шүүх
                    </button>
                </div>

                {/* 3. Data Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col relative z-[1] min-h-0">
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[1250px] flex flex-col h-full uppercase">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                                <div className="w-[120px] shrink-0">Захиалгын №</div>
                                <div className="w-[180px] shrink-0 px-2">Хэрэглэгч</div>
                                <div className="w-[120px] shrink-0 px-2">Утас</div>
                                <div className="w-[300px] shrink-0 px-2">Үйлчилгээ (товч)</div>
                                <div className="w-[120px] shrink-0 px-2 text-right">Нийт дүн</div>
                                <div className="w-[130px] shrink-0 px-2 text-center">Төлөв</div>
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
                                        <div className="w-[120px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline truncate">{item.id}</div>
                                        <div className="w-[180px] shrink-0 px-2 font-bold text-gray-800 truncate">{item.customer}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-gray-500 font-medium">{item.phone}</div>
                                        <div className="w-[300px] shrink-0 px-2 text-gray-600 truncate">{item.services}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-right font-black text-gray-900">{item.totalAmount}</div>
                                        <div className="w-[130px] shrink-0 px-2 flex justify-center">
                                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap min-w-[90px] justify-center ${getStatusStyles(item.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Бэлэн' ? 'bg-green-500' :
                                                    item.status === 'Хүлээлгэн өгөх' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}></span>
                                                {item.status}
                                            </span>
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
