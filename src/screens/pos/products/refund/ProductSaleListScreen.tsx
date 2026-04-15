import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../../shared/components/PosDropdown';
import PosDateRangePicker from '../../../../shared/components/PosDateRangePicker';
import PosExcelButton from '../../../../shared/components/PosExcelButton';
import PosPagination from '../../../../shared/components/PosPagination';
import { mockReceipts } from '../../../../services/mockReceiptData';
import type { MockReceipt, ReceiptStatus, ReceiptPaymentMethod } from '../../../../services/mockReceiptData';

const paymentLabel: Record<ReceiptPaymentMethod, string> = {
    cash: 'Бэлэн',
    card: 'Карт',
    qpay: 'QPAY',
};

const paymentStyle: Record<ReceiptPaymentMethod, string> = {
    cash: 'bg-green-50 text-green-600 border-green-100',
    card: 'bg-blue-50 text-blue-600 border-blue-100',
    qpay: 'bg-red-50 text-red-600 border-red-100',
};

const statusLabel: Record<ReceiptStatus, string> = {
    completed: 'Борлуулалт хийгдсэн',
    refunded: 'Бүрэн буцаалттай',
    partial_refunded: 'Хэсэгчлэн буцаалттай',
};

const statusStyle: Record<ReceiptStatus, string> = {
    completed: 'bg-green-50 text-green-600 border-green-100',
    refunded: 'bg-red-50 text-red-600 border-red-100',
    partial_refunded: 'bg-orange-50 text-orange-600 border-orange-100',
};

const statusDotStyle: Record<ReceiptStatus, string> = {
    completed: 'bg-green-500',
    refunded: 'bg-red-500',
    partial_refunded: 'bg-orange-500',
};

const maskPhone = (phone?: string) => {
    if (!phone) return '-';
    const clean = phone.replace(/-/g, '');
    if (clean.length === 8) return `${clean.slice(0, 2)}**-**${clean.slice(6)}`;
    return phone;
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const ProductSaleListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState<'all' | ReceiptStatus>('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const itemsPerPage = 10;

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        let list: MockReceipt[] = mockReceipts.filter(r => {
            const matchesSearch = !q ||
                r.receiptNo.toLowerCase().includes(q) ||
                (r.customerPhone || '').toLowerCase().includes(q) ||
                r.items.some(it => it.name.toLowerCase().includes(q));
            const matchesStatus = status === 'all' || r.status === status;
            const d = new Date(r.soldAt);
            const matchesDate = (!startDate || d >= startDate) && (!endDate || d <= endDate);
            return matchesSearch && matchesStatus && matchesDate;
        });

        list.sort((a, b) => {
            const ta = new Date(a.soldAt).getTime();
            const tb = new Date(b.soldAt).getTime();
            switch (sortBy) {
                case 'newest': return tb - ta;
                case 'oldest': return ta - tb;
                case 'amount-high': return b.totalAmount - a.totalAmount;
                case 'amount-low': return a.totalAmount - b.totalAmount;
                default: return 0;
            }
        });
        return list;
    }, [searchTerm, status, sortBy, startDate, endDate]);

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h2 className="text-xl font-bold text-[#374151] uppercase tracking-tight">Борлуулалтын жагсаалт</h2>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[400px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-sm">search</span>
                        </span>
                        <input
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full h-[44px] pl-9 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all"
                            placeholder="Баримтын №, утас эсвэл барааны нэрээр хайх"
                            type="text"
                        />
                    </div>
                    <PosExcelButton />
                </div>
            </div>

            {/* Filter Bar */}
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
                    label="Төлөв"
                    icon="fact_check"
                    value={status}
                    onChange={(v) => { setStatus(v as any); setCurrentPage(1); }}
                    options={[
                        { label: 'Бүгд', value: 'all' },
                        { label: 'Борлуулалт хийгдсэн', value: 'completed' },
                        { label: 'Хэсэгчлэн буцаалттай', value: 'partial_refunded' },
                        { label: 'Бүрэн буцаалттай', value: 'refunded' },
                    ]}
                    className="w-full sm:w-[220px] shrink-0"
                />

                <PosDropdown
                    label="Эрэмбэлэх"
                    icon="sort"
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                        { label: 'Шинэ эхэнд', value: 'newest' },
                        { label: 'Хуучин эхэнд', value: 'oldest' },
                        { label: 'Дүн (Өндөрөөс)', value: 'amount-high' },
                        { label: 'Дүн (Багаас)', value: 'amount-low' },
                    ]}
                    className="w-full sm:w-[180px] shrink-0 xl:ml-auto"
                />
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden relative z-[1]">
                <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
                    <div className="min-w-[1300px] flex flex-col h-full">
                        <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[12px] font-bold tracking-widest items-center uppercase">
                            <div className="w-[170px] shrink-0">Баримтын №</div>
                            <div className="w-[160px] shrink-0 px-2">Огноо</div>
                            <div className="w-[140px] shrink-0 px-2">Салбар</div>
                            <div className="w-[120px] shrink-0 px-2">Ажилтан</div>
                            <div className="w-[120px] shrink-0 px-2">Утас</div>
                            <div className="w-[70px] shrink-0 px-2 text-center">Бараа</div>
                            <div className="w-[110px] shrink-0 px-2 text-center">Төлсөн</div>
                            <div className="w-[180px] shrink-0 px-2 text-center">Төлөв</div>
                            <div className="w-[130px] shrink-0 px-2 text-right">Нийт дүн</div>
                            <div className="w-[140px] shrink-0 px-2 text-right">Үйлдэл</div>
                        </div>

                        <div className="overflow-y-auto flex-1 no-scrollbar bg-white">
                            {paginated.length > 0 ? paginated.map(r => {
                                const disabled = r.status === 'refunded';
                                return (
                                    <div
                                        key={r.receiptNo}
                                        className="flex px-6 py-4 border-b border-gray-50 items-center text-[13px] group hover:bg-primary/5 transition-colors"
                                    >
                                        <div className="w-[170px] shrink-0 font-extrabold text-[#40C1C7] truncate">{r.receiptNo}</div>
                                        <div className="w-[160px] shrink-0 px-2 text-gray-500 font-medium">{formatDate(r.soldAt)}</div>
                                        <div className="w-[140px] shrink-0 px-2 font-bold text-gray-700 truncate">{r.branch}</div>
                                        <div className="w-[120px] shrink-0 px-2 font-bold text-gray-700 truncate">{r.cashier}</div>
                                        <div className="w-[120px] shrink-0 px-2 text-gray-500 font-medium">{maskPhone(r.customerPhone)}</div>
                                        <div className="w-[70px] shrink-0 px-2 text-center font-black text-gray-800">{r.items.length}</div>
                                        <div className="w-[110px] shrink-0 px-2 flex justify-center">
                                            <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${paymentStyle[r.paymentMethod]}`}>
                                                {paymentLabel[r.paymentMethod]}
                                            </span>
                                        </div>
                                        <div className="w-[180px] shrink-0 px-2 flex justify-center">
                                            <span className={`px-3 py-1.5 text-[9px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap ${statusStyle[r.status]}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusDotStyle[r.status]}`}></span>
                                                {statusLabel[r.status]}
                                            </span>
                                        </div>
                                        <div className="w-[130px] shrink-0 px-2 text-right font-black text-gray-900">
                                            {r.totalAmount.toLocaleString()}₮
                                        </div>
                                        <div className="w-[140px] shrink-0 px-2 flex justify-end">
                                            <button
                                                disabled={disabled}
                                                onClick={() => navigate(`/pos/product-refund/${r.receiptNo}/step/1`)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${disabled
                                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                    : 'bg-secondary text-gray-900 hover:bg-yellow-400 shadow-md shadow-secondary/30 active:scale-95'
                                                    }`}
                                            >
                                                <span className="material-icons-round text-sm">assignment_return</span>
                                                Буцаалт хийх
                                            </button>
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
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductSaleListScreen;
