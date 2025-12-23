import React, { useState, useMemo } from 'react';
import { initialMemberCards, MemberCard } from '../../../services/mockMemberData';
import Popup from '../../../shared/components/Popup/Popup';

const CardManagementScreen: React.FC = () => {
    const [cards, setCards] = useState<MemberCard[]>(initialMemberCards);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCard, setSelectedCard] = useState<MemberCard | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

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

    // Filtering logic
    const filteredCards = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return cards.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.cardNo.toLowerCase().includes(query)
        );
    }, [cards, searchQuery]);

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
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 h-full overflow-y-auto no-scrollbar bg-gray-50/30">
            {/* Top Section: List */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-icons-round">view_list</span>
                        </div>
                        <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Картын жагсаалт</h2>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-round text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="нэр / утас / карт №"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 sticky top-0">
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Картын №</th>
                                <th className="px-6 py-4">Хэрэглэгчийн нэр</th>
                                <th className="px-6 py-4">Утас</th>
                                <th className="px-6 py-4">И-мэйл</th>
                                <th className="px-6 py-4">Төрсөн огноо</th>
                                <th className="px-6 py-4">Хөнгөлөлт %</th>
                                <th className="px-6 py-4">Идэвхтэй эсэх</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCards.map((card) => (
                                <tr
                                    key={card.cardNo}
                                    onClick={() => handleRowClick(card)}
                                    className={`cursor-pointer transition-colors hover:bg-primary/5 ${selectedCard?.cardNo === card.cardNo ? 'bg-primary/10' : ''}`}
                                >
                                    <td className="px-6 py-4 font-black text-gray-800 text-sm">{card.cardNo}</td>
                                    <td className="px-6 py-4 font-bold text-gray-600 text-sm">{card.name}</td>
                                    <td className="px-6 py-4 font-bold text-gray-500 text-sm">{card.phone}</td>
                                    <td className="px-6 py-4 font-medium text-gray-400 text-xs">{card.email || '-'}</td>
                                    <td className="px-6 py-4 font-medium text-gray-400 text-xs">{card.birthDate || '-'}</td>
                                    <td className="px-6 py-4 font-black text-gray-700 text-sm">{card.discountRate}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${card.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {card.isActive ? 'Тийм' : 'Үгүй'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Section: Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary-dark">
                        <span className="material-icons-round">edit_note</span>
                    </div>
                    <h2 className="text-lg font-black text-gray-800 tracking-tight uppercase">Картын мэдээлэл</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Картын дугаар *</label>
                        <input
                            type="text"
                            value={form.cardNo}
                            onChange={(e) => setForm(prev => ({ ...prev, cardNo: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хэрэглэгчийн нэр *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Утас *</label>
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">И-мэйл</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        />
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Хаяг</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Улаанбаатар, Сүхбаатар дүүрэг..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Төрсөн огноо</label>
                        <input
                            type="date"
                            value={form.birthDate}
                            onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
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
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Идэвхтэй эсэх</span>
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
                            className="flex-1 sm:flex-none px-8 py-4 bg-white border-2 border-primary/20 text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round text-lg">add</span>
                            Шинэ карт
                        </button>
                        <button
                            onClick={handleClose}
                            className="flex-1 sm:flex-none px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round text-lg">close</span>
                            Цуцлах
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-none px-12 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round text-lg">save</span>
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
    );
};

export default CardManagementScreen;
