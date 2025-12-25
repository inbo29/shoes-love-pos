import React, { useState, useMemo } from 'react';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import PosPagination from '../../../../shared/components/PosPagination';

// Same masking as OrderListScreen
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

const MOCK_ORDERS = [
    {
        id: 'ORD-2023-1001',
        customer: 'Бат-Эрдэнэ Болд',
        phone: '9911-2345',
        services: 'Гутал 2, Хими 1',
        date: '2023.10.27 14:15',
        status: 'Захиалсан',
        remainingAmount: '0 ₮',
        amount: '45,000 ₮',
        items: [
            { id: 'I1', name: 'Гутал 1', type: 'Cleaning', services: [{ id: 'S1', name: 'Угаах', price: 10000 }, { id: 'S2', name: 'Будах', price: 5000 }] },
            { id: 'I2', name: 'Гутал 2', type: 'Cleaning', services: [{ id: 'S3', name: 'Угаах', price: 15000 }] },
            { id: 'I3', name: 'Хими 1', type: 'Repair', services: [{ id: 'S4', name: 'Хими 1', price: 15000 }] },
        ]
    },
    {
        id: 'ORD-2023-1002',
        customer: 'Сүхбаатар Сарнай',
        phone: '8800-5566',
        services: 'Хими 3',
        date: '2023.10.27 13:45',
        status: 'Захиалж байна',
        remainingAmount: '40,000 ₮',
        amount: '89,900 ₮',
        items: [
            { id: 'I4', name: 'Хими 1', type: 'Repair', services: [{ id: 'S5', name: 'Хими 1', price: 30000 }] },
            { id: 'I5', name: 'Хими 2', type: 'Repair', services: [{ id: 'S6', name: 'Хими 2', price: 30000 }] },
            { id: 'I6', name: 'Хими 3', type: 'Repair', services: [{ id: 'S7', name: 'Хими 3', price: 29900 }] },
        ]
    },
    {
        id: 'ORD-2023-1003',
        customer: 'Доржпүрэв Гантулга',
        phone: '9191-3344',
        services: 'Хивс 1',
        date: '2023.10.27 12:30',
        status: 'Хүлээлгэн өгсөн',
        remainingAmount: '0 ₮',
        amount: '245,000 ₮',
        items: [
            { id: 'I7', name: 'Хивс 1', type: 'Cleaning', services: [{ id: 'S8', name: 'Угаах', price: 245000 }] },
        ]
    },
    { id: 'ORD-2023-0998', customer: 'Амарбаясгалан Энхтуяа', phone: '9988-7766', services: 'Гутал 1, Хими 2', date: '2023.10.27 11:20', status: 'Захиалсан', remainingAmount: '55,000 ₮', amount: '55,000 ₮', items: [] },
    { id: 'ORD-2023-0995', customer: 'Төмөрбаатар Жавхлан', phone: '8011-2312', services: 'Clean Service 1', date: '2023.10.27 10:05', status: 'Захиалж байна', remainingAmount: '60,000 ₮', amount: '120,000 ₮', items: [] },
    { id: 'ORD-2023-0990', customer: 'Алтанхуяг Болор', phone: '9511-3377', services: 'Гутал 5', date: '2023.10.26 18:45', status: 'Захиалсан', remainingAmount: '0 ₮', amount: '320,000 ₮', items: [] },
];

interface Step1Props {
    selectedOrderId: string | null;
    onSelectOrder: (order: any) => void;
}

const ReturnStep1SelectOrder: React.FC<Step1Props> = ({ selectedOrderId, onSelectOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredData = useMemo(() => {
        let result = MOCK_ORDERS.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.phone.includes(searchTerm);

            const itemDate = new Date(order.date.split(' ')[0].replace(/\./g, '-'));
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesDate;
        });

        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.date.replace(/\./g, '-')).getTime() - new Date(a.date.replace(/\./g, '-')).getTime());
        } else {
            result.sort((a, b) => new Date(a.date.replace(/\./g, '-')).getTime() - new Date(b.date.replace(/\./g, '-')).getTime());
        }

        return result;
    }, [searchTerm, startDate, endDate, sortBy]);

    const paginatedData = useMemo(() => {
        return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredData, currentPage]);

    return (
        <div className="flex flex-col h-full gap-6 overflow-visible">
            {/* Header & Search */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h2 className="text-[18px] font-black text-gray-800 uppercase tracking-tighter">Захиалга сонгох</h2>
                </div>
                <div className="relative flex-1 lg:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <span className="material-icons-round text-xl">search</span>
                    </span>
                    <input
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="block w-full h-[48px] pl-11 pr-4 border border-gray-100 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm shadow-sm transition-all"
                        placeholder="Системээс хайх (Утас, Нэр, №)"
                        type="text"
                    />
                </div>
            </div>

            {/* Filter bar */}
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
                    label="Эрэмбэлэх"
                    icon="sort"
                    value={sortBy}
                    onChange={(val) => {
                        setSortBy(val);
                        setCurrentPage(1);
                    }}
                    options={[
                        { label: 'Сүүлд нэмэгдсэн', value: 'newest' },
                        { label: 'Анх нэмэгдсэн', value: 'oldest' },
                    ]}
                    className="w-full sm:w-[160px] shrink-0"
                />
            </div>

            {/* Grid Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col min-h-[400px] overflow-hidden">
                <div className="flex-1 overflow-x-auto no-scrollbar">
                    <div className="min-w-[1200px] flex flex-col h-full uppercase">
                        {/* Table Header */}
                        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                            <div className="w-12 shrink-0"></div>
                            <div className="w-[150px] shrink-0 px-2">Захиалгын №</div>
                            <div className="w-[180px] shrink-0 px-2">Үйлчлүүлэгч</div>
                            <div className="w-[120px] shrink-0 px-2">Утас</div>
                            <div className="w-[280px] shrink-0 px-2">Үйлчилгээ (товч)</div>
                            <div className="w-[150px] shrink-0 px-2">Огноо</div>
                            <div className="w-[140px] shrink-0 px-2 text-center">Төлөв</div>
                            <div className="w-[130px] shrink-0 px-2 text-right">Үлдэгдэл дүн</div>
                            <div className="w-[130px] shrink-0 px-2 text-right">Нийт дүн</div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 no-scrollbar overflow-y-auto bg-white">
                            {paginatedData.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => onSelectOrder(order)}
                                    className={`flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-all items-center text-[13px] group normal-case ${selectedOrderId === order.id ? 'bg-primary/10' : ''}`}
                                >
                                    <div className="w-12 shrink-0 flex items-center justify-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOrderId === order.id ? 'border-primary bg-primary' : 'border-gray-200 bg-white'}`}>
                                            {selectedOrderId === order.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                    </div>
                                    <div className="w-[150px] shrink-0 px-2 font-extrabold text-[#40C1C7]">{order.id}</div>
                                    <div className="w-[180px] shrink-0 px-2 font-bold text-gray-800 truncate">{maskNameSmart(order.customer)}</div>
                                    <div className="w-[120px] shrink-0 px-2 text-gray-400 font-bold tracking-tighter">{maskPhone(order.phone)}</div>
                                    <div className="w-[280px] shrink-0 px-2 font-bold text-gray-500 truncate">{order.services}</div>
                                    <div className="w-[150px] shrink-0 px-2 text-gray-400 text-xs font-medium">{order.date}</div>
                                    <div className="w-[140px] shrink-0 px-2 flex justify-center">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap 
                                            ${order.status === 'Захиалсан' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                                                order.status === 'Захиалж байна' ? 'bg-yellow-100 text-yellow-600 border-yellow-200' :
                                                    'bg-green-100 text-green-600 border-green-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Захиалсан' ? 'bg-blue-500' : order.status === 'Захиалж байна' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className={`w-[130px] shrink-0 px-2 text-right font-black ${order.remainingAmount !== '0 ₮' ? 'text-red-500' : 'text-gray-900'}`}>{order.remainingAmount}</div>
                                    <div className="w-[130px] shrink-0 px-2 text-right font-black text-gray-900">{order.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <PosPagination
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ReturnStep1SelectOrder;
