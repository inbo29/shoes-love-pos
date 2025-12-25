import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosPagination from '../../../shared/components/PosPagination';

// Helper for masking (Matching OrderListScreen)
const maskNameSmart = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(part => {
        if (part.length <= 2) return part;
        if (part.length <= 4) return `${part[0]}**${part[part.length - 1]}`;
        const mid = Math.floor(part.length / 2);
        return `${part.slice(0, mid - 1)}**${part.slice(mid + 1)}`;
    }).join(' ');
};

const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/-/g, '');
    if (clean.length === 8) {
        return `${clean.slice(0, 2)}**-**${clean.slice(6)}`;
    }
    return phone;
};

interface ReturnOrder {
    id: string;
    customer: string;
    phone: string;
    items: string;
    date: string;
    status: 'Захиалсан' | 'Захиалж байна' | 'Хүлээлгэн өгсөн' | 'Буцаалт хийгдсэн' | 'Буцаалт хүлээгдэж буй';
    remainingAmount: number;
    totalAmount: number;
}

const MOCK_DATA: ReturnOrder[] = [
    { id: '#ORD-2023-1001', customer: 'Бат-Эрдэнэ Болд', phone: '9911-2345', items: 'Гутал 2, Хими 1', date: '2023.10.27 14:15', status: 'Захиалсан', remainingAmount: 0, totalAmount: 45000 },
    { id: '#ORD-2023-1002', customer: 'Сүхбаатар Сарнай', phone: '8800-5566', items: 'Хими 3', date: '2023.10.27 13:45', status: 'Захиалж байна', remainingAmount: 40000, totalAmount: 89900 },
    { id: '#ORD-2023-1003', customer: 'Доржпүрэв Гантулга', phone: '9191-3344', items: 'Хивс 1', date: '2023.10.27 12:30', status: 'Хүлээлгэн өгсөн', remainingAmount: 0, totalAmount: 245000 },
    { id: '#ORD-2023-0998', customer: 'Амарбаясгалан Энхтуяа', phone: '9988-7766', items: 'Гутал 1, Хими 2', date: '2023.10.27 11:20', status: 'Буцаалт хийгдсэн', remainingAmount: 55000, totalAmount: 55000 },
    { id: '#ORD-2023-0995', customer: 'Төмөрбаатар Жаргал', phone: '8080-1212', items: 'Clean Service 1', date: '2023.10.27 10:05', status: 'Буцаалт хүлээгдэж буй', remainingAmount: 60000, totalAmount: 120000 },
    { id: '#ORD-2023-0990', customer: 'Алтанхуяг Болор', phone: '9595-6677', items: 'Гутал 5', date: '2023.10.26 18:45', status: 'Захиалсан', remainingAmount: 0, totalAmount: 320000 },
];

const ReturnListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const itemsPerPage = 8;

    const filteredData = useMemo(() => {
        return MOCK_DATA.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone.includes(searchTerm);
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

            // Simple date filter
            const itemDate = new Date(item.date.split(' ')[0].replace(/\./g, '-'));
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [searchTerm, selectedStatus, startDate, endDate]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Захиалсан': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Захиалж байна': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'Хүлээлгэн өгсөн': return 'bg-green-100 text-green-600 border-green-200';
            case 'Буцаалт хийгдсэн': return 'bg-red-100 text-red-600 border-red-200';
            case 'Буцаалт хүлээгдэж буй': return 'bg-orange-100 text-orange-600 border-orange-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Захиалсан': return 'bg-blue-500';
            case 'Захиалж байна': return 'bg-yellow-500';
            case 'Хүлээлгэн өгсөн': return 'bg-green-500';
            case 'Буцаалт хийгдсэн': return 'bg-red-500';
            case 'Буцаалт хүлээгдэж буй': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">

                {/* 1. Header & Global Actions (Shipment style) */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 shrink-0">
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                            <h2 className="text-[18px] font-bold text-[#374151]">
                                Буцаалт хийх / олгох
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => navigate('/pos/returns/new/step/1')}
                                className="flex-1 md:flex-none px-6 py-3 bg-[#40C1C7] hover:bg-[#35a8ae] text-white rounded-2xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-cyan-200/50 font-black uppercase text-[11px] tracking-wider whitespace-nowrap"
                            >
                                <span className="material-icons-round text-base">add_circle</span>
                                Буцаалт хийх
                            </button>
                            <button
                                onClick={() => navigate('/pos/returns/issue/step/1')}
                                className="flex-1 md:flex-none bg-[#FFD400] hover:bg-[#eec600] text-gray-900 px-6 py-3 rounded-2xl shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 transition-all font-black uppercase text-[11px] tracking-wider hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                            >
                                <span className="material-icons-round text-lg">keyboard_return</span>
                                Буцаалт олгох
                            </button>
                        </div>
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
                                placeholder="Системээс хайх (Утас, Нэр, №)"
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
                        label="Салбар"
                        options={[
                            { value: 'all', label: 'Бүх салбар' },
                        ]}
                        value="all"
                        onChange={() => { }}
                        className="w-full sm:w-[150px] shrink-0"
                    />

                    <PosDropdown
                        label="Төлөв"
                        value={selectedStatus}
                        onChange={(val) => {
                            setSelectedStatus(val);
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: 'Бүгд', value: 'all' },
                            { label: 'Захиалсан', value: 'Захиалсан' },
                            { label: 'Захиалж байна', value: 'Захиалж байна' },
                            { label: 'Хүлээлгэн өгсөн', value: 'Хүлээлгэн өгсөн' },
                            { label: 'Буцаалт хийгдсэн', value: 'Буцаалт хийгдсэн' },
                            { label: 'Буцаалт хүлээгдэж буй', value: 'Буцаалт хүлээгдэж буй' },
                        ]}
                        className="w-full sm:w-[180px] shrink-0"
                    />

                    <button className="bg-primary hover:bg-primary/90 text-white px-6 h-[44px] rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all font-bold text-sm active:scale-95 group w-full lg:w-auto lg:ml-auto shrink-0">
                        <span className="material-icons-round text-lg group-hover:rotate-180 transition-transform duration-700">sync</span>
                        Шүүх
                    </button>
                </div>

                {/* 3. Main List (Order style) */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[1400px] flex flex-col h-full uppercase">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                                <div className="w-[150px] shrink-0">Захиалгын №</div>
                                <div className="w-[180px] shrink-0 px-2">Үйлчлүүлэгч</div>
                                <div className="w-[120px] shrink-0 px-2">Утас</div>
                                <div className="w-[300px] shrink-0 px-2">Үйлчилгээ (товч)</div>
                                <div className="w-[150px] shrink-0 px-2">Огноо</div>
                                <div className="w-[180px] shrink-0 px-2 text-center">Төлөв</div>
                                <div className="w-[130px] shrink-0 px-2 text-right">Үлдэгдэл дүн</div>
                                <div className="w-[130px] shrink-0 px-2 text-right">Нийт дүн</div>
                                <div className="w-8 shrink-0"></div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto flex-1 no-scrollbar bg-white">
                                {paginatedData.length > 0 ? paginatedData.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => { }}
                                        className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group normal-case"
                                    >
                                        <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">{item.id}</div>
                                        <div className="w-[180px] shrink-0 px-2 font-bold text-gray-800 truncate">{maskNameSmart(item.customer)}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-gray-500 font-medium">{maskPhone(item.phone)}</div>
                                        <div className="w-[300px] shrink-0 px-2 font-bold text-gray-500 truncate">{item.items}</div>
                                        <div className="w-[150px] shrink-0 px-2 text-gray-400 text-xs font-medium">{item.date}</div>
                                        <div className="w-[180px] shrink-0 px-2 flex justify-center">
                                            <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusStyles(item.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(item.status)}`}></span>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className={`w-[130px] shrink-0 px-2 text-right font-bold ${item.remainingAmount > 0 ? 'text-red-500' : 'text-gray-900'}`}>{item.remainingAmount.toLocaleString()} ₮</div>
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

                    <PosPagination
                        totalItems={filteredData.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReturnListScreen;
