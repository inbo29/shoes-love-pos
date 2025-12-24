import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosPagination from '../../../shared/components/PosPagination';

const INITIAL_DATA = [
    { id: '#ORD-2023-1001', info: 'Гутал (Угаалга, Будалт)', customer: 'Бат-Эрдэнэ Болд', phone: '9911-2345', date: '2023.10.27 14:15', status: 'Шинэ', amount: '45,000 ₮' },
    { id: '#ORD-2023-1002', info: 'Хими цэвэрлэгээ', customer: 'Сүхбаатар Сарнай', phone: '8800-5566', date: '2023.10.27 13:45', status: 'Хүлээгдэж буй', amount: '89,900 ₮' },
    { id: '#ORD-2023-1003', info: 'Хивс угаалга', customer: 'Доржпүрэв Гантулга', phone: '9191-3344', date: '2023.10.27 12:30', status: 'Бэлэн', amount: '245,000 ₮' },
    { id: '#ORD-2023-0998', info: 'Цэцэгмаа Энхтуяа', customer: 'Амарбаясгалан Энхтуяа', phone: '9988-7766', date: '2023.10.27 11:20', status: 'Хүргэгдсэн', amount: '55,000 ₮' },
    { id: '#ORD-2023-0995', info: 'Төмөрбаатар Жаргал', customer: 'Төмөрбаатар Жаргал', phone: '8080-1212', date: '2023.10.27 10:05', status: 'Буцаалт', amount: '0 ₮' },
    { id: '#ORD-2023-0990', info: 'Алтанхуяг Болор', customer: 'Алтанхуяг Болор', phone: '9595-6677', date: '2023.10.26 18:45', status: 'Шинэ', amount: '320,000 ₮' },
];

const OrderListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Default range
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [data] = useState(INITIAL_DATA);

    const filteredAndSortedData = useMemo(() => {
        let result = data.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone.includes(searchTerm);

            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

            const itemDate = new Date(item.date.split(' ')[0].replace(/\./g, '-'));
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesStatus && matchesDate;
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
    }, [data, searchTerm, selectedStatus, startDate, endDate, sortBy]);

    // Pagination
    const itemsPerPage = 8;
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Бэлэн':
            case 'Шинэ': return 'bg-green-100 text-green-600 border-green-200';
            case 'Хүлээгдэж буй': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'Буцаалт':
            case 'Цуцлагдсан': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">
                {/* 1. Header & Global Actions */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                            Нийт захиалгын жагсаалт
                        </h2>
                        <button
                            onClick={() => navigate('/pos/orders/new/step/1')}
                            className="bg-secondary hover:bg-yellow-400 text-gray-900 px-8 h-[48px] rounded-2xl shadow-lg shadow-secondary/20 flex items-center gap-2 transition-all font-black uppercase tracking-wide active:scale-95 w-fit"
                        >
                            <span className="material-icons-round">add_circle</span>
                            Шинэ захиалга авах
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-[400px]">
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
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap items-end gap-5 shrink-0 overflow-visible relative z-[10]">
                    <PosDateRangePicker
                        start={startDate}
                        end={endDate}
                        onChange={(s, e) => {
                            setStartDate(s);
                            setEndDate(e);
                            setCurrentPage(1);
                        }}
                    />

                    <PosDropdown
                        label="Төлөв шүүх"
                        icon="flag"
                        value={selectedStatus}
                        onChange={(val) => {
                            setSelectedStatus(val);
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: 'Бүх төлөв', value: 'all' },
                            { label: 'Шинэ', value: 'Шинэ' },
                            { label: 'Хүлээгдэж буй', value: 'Хүлээгдэж буй' },
                            { label: 'Бэлэн', value: 'Бэлэн' },
                            { label: 'Буцаалт', value: 'Буцаалт' },
                        ]}
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
                    />

                    <button className="bg-primary hover:bg-primary/90 text-white px-8 h-[44px] rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all font-bold text-sm active:scale-95 group ml-auto">
                        <span className="material-icons-round text-lg group-hover:rotate-180 transition-transform duration-700">sync</span>
                        Шүүх
                    </button>
                </div>

                {/* 3. Standardized List Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                    <div className="bg-gray-50/50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black uppercase tracking-widest items-center">
                        <div className="w-[160px] shrink-0">Захиалгын №</div>
                        <div className="flex-1 px-2">Хэрэглэгчийн нэр</div>
                        <div className="w-[120px] shrink-0 px-2">Утас</div>
                        <div className="w-[160px] shrink-0 px-2">Огноо</div>
                        <div className="w-[140px] shrink-0 px-2 text-center">Төлөв</div>
                        <div className="w-[140px] shrink-0 px-2 text-right">Нийт дүн</div>
                        <div className="w-8 shrink-0"></div>
                    </div>

                    <div className="overflow-y-auto flex-1 no-scrollbar">
                        {paginatedData.length > 0 ? paginatedData.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    const pureId = item.id.replace('#', '');
                                    navigate(`/pos/orders/${pureId}/edit/step/1`);
                                }}
                                className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group"
                            >
                                <div className="w-[160px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">{item.id}</div>
                                <div className="flex-1 px-2 font-bold text-gray-800 truncate">{item.customer}</div>
                                <div className="w-[120px] shrink-0 px-2 text-gray-500 font-medium">{item.phone}</div>
                                <div className="w-[160px] shrink-0 px-2 text-gray-400 text-xs font-medium">{item.date}</div>
                                <div className="w-[140px] shrink-0 px-2 flex justify-center">
                                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 ${getStatusStyles(item.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Шинэ' || item.status === 'Бэлэн' ? 'bg-green-500' :
                                            item.status === 'Хүлээгдэж буй' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></span>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="w-[140px] shrink-0 px-2 text-right font-black text-gray-900">{item.amount}</div>
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
    );
};

export default OrderListScreen;
