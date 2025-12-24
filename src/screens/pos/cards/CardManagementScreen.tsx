import React, { useState, useMemo } from 'react';
import { initialMemberCards, MemberCard } from '../../../services/mockMemberData';
import Popup from '../../../shared/components/Popup/Popup';
import PosPagination from '../../../shared/components/PosPagination';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosDropdown from '../../../shared/components/PosDropdown';

const CardManagementScreen: React.FC = () => {
    const [cards, setCards] = useState<MemberCard[]>(initialMemberCards);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCard, setSelectedCard] = useState<MemberCard | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest');

    // Form State
    const [form, setForm] = useState<MemberCard>({
        cardNo: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        birthDate: '',
        discountRate: 0,
        isActive: true
    });

    // Filtering & Sorting logic
    const filteredAndSortedCards = useMemo(() => {
        const query = searchQuery.toLowerCase();
        let result = cards.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.cardNo.toLowerCase().includes(query)
        );

        // Standard sorting for cards
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return b.cardNo.localeCompare(a.cardNo);
                case 'oldest': return a.cardNo.localeCompare(b.cardNo);
                case 'name-asc': return a.name.localeCompare(b.name);
                default: return 0;
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
            cardNo: `MEM-${Math.floor(10000 + Math.random() * 90000)}`, // Auto-gen dummy card no
            name: '',
            phone: '',
            email: '',
            address: '',
            birthDate: '',
            discountRate: 0,
            isActive: true
        });
    };

    const handleSave = () => {
        // Simple validation
        if (!form.cardNo || !form.name || !form.phone) {
            alert('Шаардлагатай талбаруудыг бөглөнө үү.');
            return;
        }

        if (selectedCard) {
            // Update
            setCards(prev => prev.map(c => c.cardNo === selectedCard.cardNo ? form : c));
            setSuccessMsg('Мэдээлэл амжилттай шинэчлэгдлээ.');
        } else {
            // Create
            if (cards.some(c => c.cardNo === form.cardNo)) {
                alert('Энэ картын дугаар аль хэдийн бүртгэгдсэн байна.');
                return;
            }
            setCards(prev => [...prev, form]);
            setSuccessMsg('Шинэ карт амжилттай бүртгэгдлээ.');
        }
        setShowSuccess(true);
        setSelectedCard(form);
    };

    const handleClose = () => {
        if (selectedCard) {
            setForm(selectedCard);
        } else {
            setForm({
                cardNo: '',
                name: '',
                phone: '',
                email: '',
                address: '',
                birthDate: '',
                discountRate: 0,
                isActive: true
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">
                {/* 1. List Section */}
                <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 flex flex-col min-h-[480px] overflow-visible relative z-[1]">
                    {/* Standardized Header */}
                    <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row items-end justify-between gap-6">
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Картын жагсаалт</h2>
                                <p className="text-xs text-gray-400 font-medium">Нийт бүртгэлтэй хэрэглэгчид</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 min-w-[260px]">
                                <span className="absolute left-4 top-1/2 -translated-y-1/2 material-icons-round text-gray-400">search</span>
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
                                onChange={setSortBy}
                                options={[
                                    { label: 'Сүүлд нэмэгдсэн', value: 'newest' },
                                    { label: 'Анх нэмэгдсэн', value: 'oldest' },
                                    { label: 'Нэрээр (А-Я)', value: 'name-asc' },
                                ]}
                                className="w-[200px]"
                            />

                            <PosExcelButton />
                        </div>
                    </div>

                    {/* Standardized Table UI */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50">
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Картын №</th>
                                    <th className="px-6 py-4">Хэрэглэгчийн нэр</th>
                                    <th className="px-6 py-4">Утас</th>
                                    <th className="px-6 py-4 hidden lg:table-cell">Төрсөн огноо</th>
                                    <th className="px-6 py-4 text-center">Хөнгөлөлт</th>
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
                                        <td className="px-6 py-5 font-bold text-gray-800 text-[13px]">{card.name}</td>
                                        <td className="px-6 py-5 font-bold text-gray-500 text-[13px] whitespace-nowrap">{card.phone}</td>
                                        <td className="px-6 py-5 font-medium text-gray-400 text-xs hidden lg:table-cell">{card.birthDate || '-'}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-2.5 py-1 bg-secondary/10 text-secondary-dark rounded-lg font-black text-xs">
                                                {card.discountRate}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center justify-center gap-1.5 whitespace-nowrap min-w-[90px]
                                                ${card.isActive ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}
                                            `}>
                                                    <span className={`w-1 h-1 rounded-full ${card.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    {card.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-300 group-hover:text-primary transition-colors">
                                            <span className="material-icons-round text-lg">chevron_right</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-20 text-center">
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

                {/* 2. Form Section - Standardized spacing & controls */}
                <div className="bg-white rounded-[24px] shadow-xl border border-gray-100 p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary-dark">
                            <span className="material-icons-round text-2xl">edit_note</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Картын мэдээлэл засварлах</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer Details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Картын дугаар *</label>
                            <input
                                type="text"
                                value={form.cardNo}
                                onChange={(e) => setForm(prev => ({ ...prev, cardNo: e.target.value }))}
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хэрэглэгчийн нэр *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Утас *</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">И-мэйл</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хаяг</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Улаанбаатар, Сүхбаатар дүүрэг..."
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Төрсөн огноо</label>
                            <input
                                type="date"
                                value={form.birthDate}
                                onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хөнгөлөлтийн хувь (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={form.discountRate}
                                onChange={(e) => setForm(prev => ({ ...prev, discountRate: parseInt(e.target.value) || 0 }))}
                                className="w-full h-[48px] px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлөв:</span>
                            <button
                                onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${form.isActive ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-gray-200'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleNewCard}
                                className="flex-1 sm:flex-none h-[52px] px-8 bg-white border-2 border-primary/20 text-primary rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round">add</span>
                                Шинэ бүртгэл
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 sm:flex-none h-[52px] px-8 bg-gray-100 text-gray-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round">close</span>
                                Цуцлах
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 sm:flex-none h-[52px] px-12 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-round">save</span>
                                Хадгалах
                            </button>
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
