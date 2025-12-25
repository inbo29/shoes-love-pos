import React, { useState, useMemo } from 'react';
import { initialMemberCards, MemberCard } from '../../../services/mockMemberData';
import Popup from '../../../shared/components/Popup/Popup';
import PosPagination from '../../../shared/components/PosPagination';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosDropdown from '../../../shared/components/PosDropdown';

// Helper for masking
const maskName = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0].slice(0, 1)}**. ${parts[1].slice(0, 1)}***`;
    }
    return `${name.slice(0, 1)}***`;
};

const maskPhone = (phone: string) => {
    if (!phone) return '';
    // Assumes 0000-0000 format
    return `${phone.slice(0, 4)}-****`;
};

const maskDate = (date: string) => {
    if (!date) return '';
    // Assumes YYYY.MM.DD
    const parts = date.split('.');
    if (parts.length === 3) {
        return `****.${parts[1]}.${parts[2]}`;
    }
    return date;
};

const getMembershipLabel = (type: MemberCard['membershipType']) => {
    switch (type) {
        case 'VIP': return 'VIP';
        case 'ORGANIZATION': return 'Байгууллага';
        case 'BASIC':
        default: return 'Энгийн';
    }
};

const CardManagementScreen: React.FC = () => {
    const [cards, setCards] = useState<MemberCard[]>(initialMemberCards);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCard, setSelectedCard] = useState<MemberCard | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest'); // Using for filter as requested

    // Form State
    const [form, setForm] = useState<MemberCard>({
        cardNo: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        birthDate: '',
        discountRate: 0,
        isActive: true,
        status: 'ACTIVE',
        membershipType: 'BASIC'
    });

    // Formatting Helpers
    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 4) return numbers;
        return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
    };

    const formatDate = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 4) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 4)}.${numbers.slice(4)}`;
        return `${numbers.slice(0, 4)}.${numbers.slice(4, 6)}.${numbers.slice(6, 8)}`;
    };

    // Filtering & Sorting logic
    const filteredAndSortedCards = useMemo(() => {
        let result = cards;

        // 1. Filtering by search
        const query = searchQuery.toLowerCase();
        if (query) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.phone.includes(query) ||
                c.cardNo.toLowerCase().includes(query)
            );
        }

        // 2. Filtering by "Filter Options" (passed via sortBy state as per user context)
        // Options: 'newest', 'oldest', 'name-asc', 'requested', 'active', 'inactive'
        // Mapping standard sort to filter logic where applicable
        switch (sortBy) {
            case 'requested':
                result = result.filter(c => c.status === 'REQUESTED');
                break;
            case 'active':
                result = result.filter(c => c.status === 'ACTIVE');
                break;
            case 'inactive':
                result = result.filter(c => c.status === 'INACTIVE');
                break;
        }


        // 3. Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return b.cardNo.localeCompare(a.cardNo);
                case 'oldest': return a.cardNo.localeCompare(b.cardNo);
                case 'name-asc': return a.name.localeCompare(b.name);
                default: return 0; // Filter modes don't enforce specific sort, keep default or ID sort
            }
        });

        return result;
    }, [cards, searchQuery, sortBy]);

    // Pagination
    const itemsPerPage = 6;
    const paginatedCards = filteredAndSortedCards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleRowClick = (card: MemberCard) => {
        setSelectedCard(card);
        setForm(card);
    };

    const handleNewCard = () => {
        setSelectedCard(null);
        setForm({
            cardNo: `MEM-${Math.floor(10000 + Math.random() * 90000)}`,
            name: '',
            phone: '',
            email: '',
            address: '',
            birthDate: '',
            discountRate: 0,
            isActive: true,
            status: 'ACTIVE', // Default for form, but will be REQUESTED on save
            membershipType: 'BASIC'
        });
    };

    const handleRequest = () => {
        // Validation
        if (!form.cardNo || !form.name || !form.phone) {
            alert('Шаардлагатай талбаруудыг бөглөнө үү.');
            return;
        }

        if (selectedCard) {
            // Should not happen if button disabled in view mode, but essentially read-only
            return;
        } else {
            // Create New Request
            if (cards.some(c => c.cardNo === form.cardNo)) {
                alert('Энэ гишүүнчлэлийн дугаар аль хэдийн бүртгэгдсэн байна.');
                return;
            }

            const newRequest = { ...form, status: 'REQUESTED' as const, isActive: false };
            setCards(prev => [...prev, newRequest]);
            setSuccessMsg('Шинэ гишүүнчлэлийн хүсэлт амжилттай илгээгдлээ.');
            setSelectedCard(newRequest); // Switch to view mode
            setForm(newRequest);
        }
        setShowSuccess(true);
    };

    const handleClose = () => {
        if (selectedCard) {
            setForm(selectedCard);
        } else {
            handleNewCard();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">
                {/* 1. List Section */}
                <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 flex flex-col min-h-[480px] overflow-visible relative z-[1]">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row items-end justify-between gap-6">
                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                            <div>
                                <h2 className="text-[18px] font-bold text-[#374151] tracking-tight">Гишүүнчлэлийн жагсаалт</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Нийт бүртгэлтэй хэрэглэгчид</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                            <div className="relative flex-1 min-w-[260px]">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-400">
                                    <span className="material-icons-round text-xl">search</span>
                                </span>
                                <input
                                    type="text"
                                    placeholder="нэр / утас / карт №"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full h-[44px] pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
                                />
                            </div>

                            <PosDropdown
                                icon="sort"
                                value={sortBy}
                                onChange={(val) => {
                                    setSortBy(val);
                                    setCurrentPage(1);
                                }}
                                options={[
                                    { label: 'Сүүлд нэмэгдсэн', value: 'newest' },
                                    { label: 'Анх нэмэгдсэн', value: 'oldest' },
                                    { label: 'Нэрээр (А-Я)', value: 'name-asc' },
                                    { label: 'Хүсэлт илгээсэн', value: 'requested' },
                                    { label: 'Идэвхтэй', value: 'active' },
                                    { label: 'Идэвхгүй', value: 'inactive' },
                                ]}
                                className="w-[200px]"
                            />

                            <PosExcelButton />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50">
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Гишүүнчлэлийн №</th>
                                    <th className="px-6 py-4">Хэрэглэгчийн нэр</th>
                                    <th className="px-6 py-4">Төрөл</th>
                                    <th className="px-6 py-4">Утас</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Төрсөн огноо</th>
                                    <th className="px-6 py-4 text-center">Пойнт</th>
                                    <th className="px-6 py-4 text-center">Төлөв</th>
                                    <th className="px-6 py-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedCards.length > 0 ? paginatedCards.map((card) => (
                                    <tr
                                        key={card.cardNo}
                                        onClick={() => handleRowClick(card)}
                                        className={`cursor-pointer transition-all hover:bg-primary/5 group ${selectedCard?.cardNo === card.cardNo ? 'bg-primary/5' : ''}`}
                                    >
                                        <td className="px-6 py-5 font-black text-primary text-[13px]">{card.cardNo}</td>
                                        <td className="px-6 py-5 font-bold text-gray-800 text-[13px]">{maskName(card.name)}</td>
                                        <td className="px-6 py-5 font-bold text-gray-600 text-[11px] uppercase tracking-wide">
                                            {getMembershipLabel(card.membershipType)}
                                        </td>
                                        <td className="px-6 py-5 font-bold text-gray-500 text-[13px] whitespace-nowrap">{maskPhone(card.phone)}</td>
                                        <td className="px-6 py-5 font-medium text-gray-400 text-xs hidden lg:table-cell">{maskDate(card.birthDate || '')}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-2.5 py-1 bg-secondary/10 text-secondary-dark rounded-lg font-black text-xs">
                                                {card.discountRate.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center justify-center gap-1.5 whitespace-nowrap min-w-[100px]
                                                ${card.status === 'ACTIVE' ? 'bg-green-100 text-green-600 border border-green-200' :
                                                        card.status === 'REQUESTED' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                                                            'bg-red-100 text-red-600 border border-red-200'}
                                            `}>
                                                    <span className={`w-1 h-1 rounded-full ${card.status === 'ACTIVE' ? 'bg-green-500' :
                                                        card.status === 'REQUESTED' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                                    {card.status === 'ACTIVE' ? 'Идэвхтэй' :
                                                        card.status === 'REQUESTED' ? 'Хүсэлт илгээсэн' : 'Идэвхгүй'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-300 group-hover:text-primary transition-colors">
                                            <span className="material-icons-round text-lg">chevron_right</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <span className="material-icons-round text-6xl text-gray-100 block mb-4">style</span>
                                            <p className="text-gray-300 font-bold">Мэдээлэл олдсонгүй</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <PosPagination
                        totalItems={filteredAndSortedCards.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>

                {/* 2. Form Section */}
                <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#FFD400] rounded-sm"></div>
                        <div>
                            <h2 className="text-[18px] font-bold text-[#374151] tracking-tight uppercase">Гишүүний мэдээлэл</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer Details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Гишүүнчлэлийн дугаар <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.cardNo}
                                readOnly // Always generated
                                className="w-full h-[48px] px-4 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хэрэглэгчийн нэр <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={selectedCard ? maskName(form.name) : form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                readOnly={!!selectedCard} // Read-only if viewing existing
                                className={`w-full h-[48px] px-4 rounded-2xl text-sm font-bold transition-all
                                    ${selectedCard
                                        ? 'bg-gray-50 border border-gray-200 text-gray-500'
                                        : 'bg-white border border-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'
                                    }`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Утас <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={selectedCard ? maskPhone(form.phone) : form.phone}
                                onChange={(e) => {
                                    if (!selectedCard) setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))
                                }}
                                maxLength={9} // 8 digits + 1 hyphen
                                readOnly={!!selectedCard}
                                placeholder="0000-0000"
                                className={`w-full h-[48px] px-4 rounded-2xl text-sm font-bold transition-all
                                    ${selectedCard
                                        ? 'bg-gray-50 border border-gray-200 text-gray-500'
                                        : 'bg-white border border-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'
                                    }`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">И-мэйл</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                readOnly={!!selectedCard}
                                className={`w-full h-[48px] px-4 rounded-2xl text-sm font-bold transition-all
                                    ${selectedCard
                                        ? 'bg-gray-50 border border-gray-200 text-gray-500'
                                        : 'bg-white border border-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'
                                    }`}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хаяг</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                                readOnly={!!selectedCard}
                                placeholder="Улаанбаатар, Сүхбаатар дүүрэг..."
                                className={`w-full h-[48px] px-4 rounded-2xl text-sm font-bold transition-all
                                    ${selectedCard
                                        ? 'bg-gray-50 border border-gray-200 text-gray-500'
                                        : 'bg-white border border-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'
                                    }`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Төрсөн огноо</label>
                            <input
                                type="text"
                                value={selectedCard ? maskDate(form.birthDate || '') : form.birthDate}
                                onChange={(e) => {
                                    if (!selectedCard) setForm(prev => ({ ...prev, birthDate: formatDate(e.target.value) }))
                                }}
                                maxLength={10}
                                placeholder="YYYY.MM.DD"
                                readOnly={!!selectedCard}
                                className={`w-full h-[48px] px-4 rounded-2xl text-sm font-bold transition-all
                                    ${selectedCard
                                        ? 'bg-gray-50 border border-gray-200 text-gray-500'
                                        : 'bg-white border border-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary'
                                    }`}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Пойнт</label>
                            <input
                                type="text"
                                value={form.discountRate.toLocaleString()}
                                readOnly
                                className="w-full h-[48px] px-4 rounded-2xl text-sm font-bold bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлөв:</span>
                            {/* Status is display-only mostly, unless editing active status in ADMIN mode (not handled here yet as per instructions 'read only') */}
                            <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase flex items-center gap-2
                                ${form.status === 'ACTIVE' ? 'bg-green-100 text-green-600 border-green-200' :
                                    form.status === 'REQUESTED' ? 'bg-orange-100 text-orange-600 border-orange-200' :
                                        'bg-red-100 text-red-600 border-red-200'}
                            `}>
                                <div className={`w-2 h-2 rounded-full ${form.status === 'ACTIVE' ? 'bg-green-500' : form.status === 'REQUESTED' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                {form.status === 'ACTIVE' ? 'Идэвхтэй' : form.status === 'REQUESTED' ? 'Хүсэлт илгээсэн' : 'Идэвхгүй'}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap lg:flex-nowrap">
                            <button
                                onClick={handleNewCard}
                                className="w-full sm:flex-1 lg:flex-none h-[52px] px-6 lg:px-8 bg-white border-2 border-primary/20 text-primary rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <span className="material-icons-round">add</span>
                                Шинэ бүртгэл
                            </button>
                            {/* Cancel button always available to reset form */}
                            <button
                                onClick={handleClose}
                                className="w-full sm:flex-1 lg:flex-none h-[52px] px-6 lg:px-8 bg-gray-100 text-gray-500 rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <span className="material-icons-round">close</span>
                                Буцах
                            </button>

                            {!selectedCard && (
                                <button
                                    onClick={handleRequest}
                                    className="w-full sm:flex-1 lg:flex-none h-[52px] px-8 lg:px-12 bg-primary text-white rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <span className="material-icons-round">send</span>
                                    Хүсэлт илгээх
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <Popup
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                    title="Амжилттай"
                    message={successMsg}
                    type="success"
                />
            </div>
        </div>
    );
};

export default CardManagementScreen;
