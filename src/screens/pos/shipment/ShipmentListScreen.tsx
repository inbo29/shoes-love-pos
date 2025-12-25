import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosDropdown from '../../../shared/components/PosDropdown';
import PosPagination from '../../../shared/components/PosPagination';
import PosExcelButton from '../../../shared/components/PosExcelButton';

interface Shipment {
    id: string;
    date: string;
    fromBranch: string;
    toFactory: string;
    driver: string;
    creator: string;
    status: 'READY' | 'SHIPPED' | 'RETURNED' | 'RECEIVED';
}

const MOCK_DATA: Shipment[] = [
    { id: '#SH-2023-001', date: '2023.10.27 10:30', fromBranch: 'Төв салбар', toFactory: 'Үйлдвэр А', driver: 'Б.Болд', creator: 'С.Сараа', status: 'SHIPPED' },
    { id: '#SH-2023-002', date: '2023.10.26 16:45', fromBranch: '3-р хороолол', toFactory: 'Үйлдвэр Б', driver: 'Д.Дорж', creator: 'Б.Бат', status: 'RECEIVED' },
    { id: '#SH-2023-003', date: '2023.10.26 09:15', fromBranch: 'Зайсан', toFactory: 'Үйлдвэр А', driver: 'Г.Ганбаа', creator: 'О.Оюун', status: 'RECEIVED' },
    { id: '#SH-2023-004', date: '2023.10.25 14:20', fromBranch: 'Сансар', toFactory: 'Үйлдвэр В', driver: 'М.Мөнхөө', creator: 'Н.Нараа', status: 'RECEIVED' },
    { id: '#SH-2023-005', date: '2023.10.25 11:00', fromBranch: 'Төв салбар', toFactory: 'Үйлдвэр А', driver: 'Б.Болд', creator: 'Э.Энхээ', status: 'RECEIVED' },
    { id: '#SH-2023-006', date: '2023.10.24 15:30', fromBranch: 'Хан-Уул', toFactory: 'Үйлдвэр Б', driver: 'Д.Дорж', creator: 'С.Сараа', status: 'READY' },
    { id: '#SH-2023-007', date: '2023.10.24 09:00', fromBranch: 'Төв салбар', toFactory: 'Үйлдвэр А', driver: 'Г.Ганбаа', creator: 'Б.Бат', status: 'RETURNED' },
];

const ShipmentListScreen: React.FC = () => {
    const navigate = useNavigate();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '2023-10-01', endDate: '2023-10-31' });
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [branch, setBranch] = useState('all');
    const [factory, setFactory] = useState('all');
    const [status, setStatus] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = useMemo(() => {
        return MOCK_DATA.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.driver.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = status === 'all' || item.status === status;
            const matchesBranch = branch === 'all' || item.fromBranch === (branch === 'main' ? 'Төв салбар' : branch);
            const matchesFactory = factory === 'all' || item.toFactory === (factory === 'facA' ? 'Үйлдвэр А' : factory);

            return matchesSearch && matchesStatus && matchesBranch && matchesFactory;
        });
    }, [searchTerm, status, branch, factory]);

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'READY':
                return 'bg-green-100 text-green-600 border-green-200';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'RETURNED':
                return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'RECEIVED':
                return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'READY': return 'Ачихад бэлэн';
            case 'SHIPPED': return 'Ачилт хийсэн';
            case 'RETURNED': return 'Буцаасан';
            case 'RECEIVED': return 'Хүлээж авсан';
            default: return status;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 shrink-0">
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                            <h2 className="text-[18px] font-bold text-[#374151]">
                                Ачилтын жагсаалт
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('new')}
                                className="bg-[#40C1C7] hover:bg-[#3bb1b7] text-white px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/10 flex items-center gap-2 transition-all font-black uppercase text-[11px] tracking-wider hover:-translate-y-0.5 active:scale-95 w-fit shrink-0 whitespace-nowrap"
                            >
                                <span className="material-icons-round text-lg">add_circle</span>
                                Ачилт хийх
                            </button>
                            <button
                                onClick={() => navigate('receive')}
                                className="bg-[#FFD400] hover:bg-[#eec600] text-gray-900 px-6 py-3 rounded-2xl shadow-lg shadow-yellow-500/10 flex items-center gap-2 transition-all font-black uppercase text-[11px] tracking-wider hover:-translate-y-0.5 active:scale-95 w-fit shrink-0 whitespace-nowrap"
                            >
                                <span className="material-icons-round text-lg">download</span>
                                Ачилт авах
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-[400px]">
                            <span className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
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

                {/* Filters */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0 overflow-visible relative z-[30]">
                    <div className="w-full sm:w-auto flex-1 min-w-[240px]">
                        <PosDateRangePicker
                            start={startDate}
                            end={endDate}
                            onChange={(s, e) => {
                                setStartDate(s);
                                setEndDate(e);
                            }}
                        />
                    </div>
                    <PosDropdown
                        label="Салбар"
                        options={[
                            { value: 'all', label: 'Бүх салбар' },
                            { value: 'main', label: 'Төв салбар' },
                            { value: 'd3', label: '3-р хороолол' },
                            { value: 'zaisan', label: 'Зайсан' },
                        ]}
                        value={branch}
                        onChange={setBranch}
                        className="w-full sm:w-[150px] shrink-0"
                    />
                    <PosDropdown
                        label="Хүлээн авах үйлдвэр"
                        options={[
                            { value: 'all', label: 'Бүх үйлдвэр' },
                            { value: 'facA', label: 'Үйлдвэр А' },
                            { value: 'facB', label: 'Үйлдвэр Б' },
                        ]}
                        value={factory}
                        onChange={setFactory}
                        className="w-full sm:w-[160px] shrink-0"
                    />
                    <PosDropdown
                        label="Төлөв"
                        options={[
                            { value: 'all', label: 'Бүгд' },
                            { value: 'READY', label: 'Ачихад бэлэн' },
                            { value: 'SHIPPED', label: 'Ачилт хийсэн' },
                            { value: 'RECEIVED', label: 'Хүлээж авсан' },
                            { value: 'RETURNED', label: 'Буцаасан' },
                        ]}
                        value={status}
                        onChange={setStatus}
                        className="w-full sm:w-[140px] shrink-0"
                    />

                    <button className="bg-primary hover:bg-primary/90 text-white px-6 h-[44px] rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all font-bold text-sm active:scale-95 group w-full lg:w-auto lg:ml-auto shrink-0">
                        <span className="material-icons-round text-lg group-hover:rotate-180 transition-transform duration-700">sync</span>
                        Шүүх
                    </button>
                </div>

                {/* List Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[1200px] flex flex-col h-full uppercase">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center">
                                <div className="w-[160px] shrink-0">Ачилтын №</div>
                                <div className="w-[140px] shrink-0 px-2">Огноо</div>
                                <div className="w-[250px] shrink-0 px-2">Илгээсэн салбар & үйлдвэр</div>
                                <div className="w-[250px] shrink-0 px-2">Хүлээн авах салбар & үйлдвэр</div>
                                <div className="w-[140px] shrink-0 px-2">Жолооч</div>
                                <div className="w-[140px] shrink-0 px-2">Ачилт хийсэн</div>
                                <div className="w-[160px] shrink-0 px-2 text-center">Төлөв</div>
                                <div className="w-8 shrink-0"></div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto flex-1 no-scrollbar bg-white">
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex px-6 py-5 border-b border-gray-50 hover:bg-primary/5 cursor-pointer transition-colors items-center text-[13px] group normal-case"
                                        // onClick={() => navigate(`${item.id}`)}
                                        >
                                            <div className="w-[160px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">{item.id}</div>
                                            <div className="w-[140px] shrink-0 px-2 text-gray-500 font-medium">{item.date}</div>
                                            <div className="w-[250px] shrink-0 px-2 font-bold text-gray-800 truncate">{item.fromBranch}</div>
                                            <div className="w-[250px] shrink-0 px-2 font-bold text-gray-800 truncate">{item.toFactory}</div>
                                            <div className="w-[140px] shrink-0 px-2 text-gray-600 font-medium">{item.driver}</div>
                                            <div className="w-[140px] shrink-0 px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                                                            ${['С.Сараа', 'Н.Нараа'].includes(item.creator) ? 'bg-pink-400' :
                                                            ['Б.Бат', 'М.Мөнхөө'].includes(item.creator) ? 'bg-purple-400' :
                                                                ['О.Оюун'].includes(item.creator) ? 'bg-yellow-400' : 'bg-blue-400'}
                                                        `}>
                                                        {item.creator.charAt(2)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600">{item.creator}</span>
                                                </div>
                                            </div>
                                            <div className="w-[160px] shrink-0 px-2 flex justify-center">
                                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 ${getStatusStyles(item.status)}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'READY' ? 'bg-green-500' :
                                                        item.status === 'SHIPPED' ? 'bg-blue-500' :
                                                            item.status === 'RECEIVED' ? 'bg-yellow-500' : 'bg-purple-500'
                                                        }`}></span>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </div>
                                            <div className="w-8 shrink-0 flex justify-end text-gray-300 group-hover:text-primary transition-colors">
                                                <span className="material-icons-round">chevron_right</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                        <span className="material-icons-round text-6xl mb-4 opacity-20">local_shipping</span>
                                        <p className="font-bold text-lg">Одоогоор ачилт бүртгэгдээгүй байна</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                        <PosPagination
                            currentPage={currentPage}
                            totalItems={MOCK_DATA.length}
                            itemsPerPage={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentListScreen;
