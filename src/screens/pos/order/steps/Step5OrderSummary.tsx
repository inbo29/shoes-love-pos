import React, { useState } from 'react';

// Reusing types locally for now
interface SummaryItem {
    id: number;
    category: string;
    model?: string;
    status?: 'completed' | 'ready' | 'pending';
    services: string[];
    priceDetails: { label: string, price: number }[];
    conditions: { label: string, value: string, warning?: boolean }[];
    photos: string[];
}

const Step5OrderSummary: React.FC = () => {
    const [usePoints, setUsePoints] = useState(false);
    const [showPointPopup, setShowPointPopup] = useState(false);
    const [appliedPoints, setAppliedPoints] = useState(0);
    const [pointInput, setPointInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    // Mock Data for Summary
    const customerInfo = {
        name: 'Б. Болд-Эрдэнэ',
        phone: '9911-2345',
        address: 'ХУД, 11-р хороо, Зайсан 45-2'
    };

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
        return phone.substring(0, 2) + '****' + phone.substring(phone.length - 2);
    };

    const orderItems: SummaryItem[] = [
        {
            id: 1,
            category: 'Гутал',
            model: 'Nike Air Max 97',
            status: 'completed',
            services: ['Угаах (Deep Clean)', 'Будах (Whole)'],
            priceDetails: [
                { label: 'Угаах (Стандарт)', price: 23900 },
                { label: 'Будах (Хар)', price: 15000 },
            ],
            conditions: [
                { label: 'Бохирдол', value: 'Их (Тос)' },
                { label: 'Материал', value: 'Илгэ / Арьс' },
                { label: 'Гэмтэл', value: 'Ул хагарсан', warning: true },
            ],
            photos: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200',
                'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=200'
            ]
        },
        {
            id: 2,
            category: 'Гутал',
            model: 'Adidas Superstar',
            status: 'ready',
            services: ['Ул наах', 'Ус хамгаалалт'],
            priceDetails: [
                { label: 'Ул наах', price: 15000 },
                { label: 'Ус хамгаалалт', price: 5000 },
            ],
            conditions: [
                { label: 'Бохирдол', value: 'Бага' },
                { label: 'Материал', value: 'Арьс' },
                { label: 'Гэмтэл', value: 'Үгүй' },
            ],
            photos: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'
            ]
        }
    ];

    const serviceTotal = orderItems.reduce((acc, item) =>
        acc + item.priceDetails.reduce((pAcc, p) => pAcc + p.price, 0), 0
    );
    const discount = serviceTotal * 0.1; // 10% VIP discount
    const vat = (serviceTotal - discount) * 0.1;
    const subtotal = serviceTotal - discount + vat;
    const finalTotal = subtotal - appliedPoints;

    const handleConfirmPoints = () => {
        const points = parseInt(pointInput);
        if (!isNaN(points) && points > 0) {
            setAppliedPoints(points);
            setShowPointPopup(false);
        }
    };

    const handlePointCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setShowPointPopup(true);
        } else {
            setAppliedPoints(0);
            setUsePoints(false);
        }
    };

    return (
        <div className="w-full p-4 md:p-6 h-full flex flex-col lg:flex-row gap-6 overflow-y-auto no-scrollbar overflow-visible">
            {/* Left Column: Summary (65%) */}
            <div className="lg:w-[65%] flex flex-col gap-6 overflow-visible pr-2 pb-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Захиалгын хураангуй</h1>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-xs font-bold text-teal-500 uppercase mb-4 tracking-wider">Хэрэглэгчийн мэдээлэл</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Нэр</p>
                            <p className="text-sm font-bold text-gray-800">{maskName(customerInfo.name)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Утас</p>
                            <p className="text-sm font-bold text-gray-800">{maskPhone(customerInfo.phone)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Хаяг</p>
                            <p className="text-sm font-bold text-gray-800">{customerInfo.address}</p>
                        </div>
                    </div>
                </div>

                {/* Service Overview Tags - REMOVED as per request */}

                {/* Detailed Item Summary Blocks */}
                <div className="flex flex-col gap-6">
                    {orderItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Card Header */}
                            <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-icons-round text-sm">hiking</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">{item.category} {item.id}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.model}</p>
                                    </div>
                                </div>
                                {/* Status Badge */}
                            </div>

                            <div className="p-5 space-y-6">
                                {/* 1. Service Details (Read Only) */}
                                <div>
                                    <h4 className="text-[10px] font-black text-teal-500 uppercase mb-3 tracking-wider opacity-70">1. Үйлчилгээний дэлгэрэнгүй</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {item.services.map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-white border-2 border-primary/5 text-primary text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Current Status (Conditions) */}
                                <div className="pt-4 border-t border-gray-50">
                                    <h4 className="text-[10px] font-black text-teal-500 uppercase mb-3 tracking-wider opacity-70">2. Одоогийн байдал</h4>
                                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                                            {item.conditions.map(c => (
                                                <div key={c.label} className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{c.label}</span>
                                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${c.warning ? 'text-orange-500' : 'text-gray-700'}`}>
                                                        {c.warning && <span className="material-icons-round text-sm">warning</span>}
                                                        {c.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Photos */}
                                <div className="pt-4 border-t border-gray-50">
                                    <h4 className="text-[10px] font-black text-teal-500 uppercase mb-3 tracking-wider opacity-70">3. Гүйцэтгэлийн зураг</h4>
                                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {item.photos.map((p, idx) => (
                                            <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative group cursor-pointer shrink-0 hover:ring-2 hover:ring-primary/20 transition-all">
                                                <img src={p} alt="Result" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <span className="material-icons-round text-white opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-200 bg-black/20 p-1 rounded-full backdrop-blur-sm">zoom_in</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Payment & Points (35%) */}
            <div className="lg:w-[35%] flex flex-col gap-6 lg:sticky lg:top-0 h-fit">
                <div className="bg-white rounded-2xl shadow-xl border border-teal-50/50 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-sm font-bold text-gray-800 uppercase mb-6 flex items-center gap-2 border-l-4 border-yellow-400 pl-3">
                            Төлбөр
                        </h2>

                        {/* Price Breakdown */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Үйлчилгээний дүн</span>
                                <span className="font-medium text-gray-800">₮ {serviceTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>НӨАТ (10%)</span>
                                <span>₮ {(serviceTotal * 0.1).toLocaleString()}</span>
                            </div>
                            {appliedPoints > 0 && (
                                <div className="flex justify-between text-xs text-blue-500 font-bold italic">
                                    <span>Пойнт ашиглалт</span>
                                    <span>- ₮ {appliedPoints.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Total Highlight */}
                        <div className="p-4 bg-teal-50/30 rounded-2xl border border-teal-50 flex justify-between items-center mb-8">
                            <span className="text-xs font-bold text-gray-600 uppercase">Нийт төлөх дүн</span>
                            <span className="text-xl font-black text-teal-600">₮ {(serviceTotal * 1.1 - appliedPoints).toLocaleString()}</span>
                        </div>

                        {/* Point Usage Checkbox */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={usePoints || appliedPoints > 0}
                                        onChange={handlePointCheckbox}
                                        className="sr-only"
                                    />
                                    <div className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${(usePoints || appliedPoints > 0) ? 'bg-teal-500 border-teal-500 shadow-sm' : 'border-gray-200 bg-gray-50/50 group-hover:border-teal-300'
                                        }`}>
                                        {(usePoints || appliedPoints > 0) && <span className="material-icons-round text-white text-sm">check</span>}
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-600">Пойнт ашиглах</span>
                            </label>

                            {appliedPoints > 0 && (
                                <div className="text-[10px] text-blue-500 font-medium bg-blue-50 px-3 py-2 rounded-lg">
                                    Ашигласан пойнт: <span className="font-bold underline">₮ {appliedPoints.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Visual Polish: Notice */}
                <div className="p-5 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                    <span className="material-icons-round text-orange-400 text-sm mt-0.5">info</span>
                    <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                        Дараагийн алхамд шилжих бөгөөд
                        Төлбөр хийгдсэний дараа захиалга баталгаажна.
                    </p>
                </div>
            </div>

            {/* Point Usage Popup */}
            {
                showPointPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-800">Пойнт ашиглах</h3>
                                <button onClick={() => setShowPointPopup(false)} className="text-gray-400 hover:text-gray-600">
                                    <span className="material-icons-round">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Ашиглах пойнт</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={pointInput}
                                        onChange={(e) => setPointInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                                    />
                                    <div className="mt-2 flex justify-between text-[9px] font-medium">
                                        <span className="text-gray-400">Боломжит: <span className="text-teal-600">₮ 50,000</span></span>
                                        <button onClick={() => setPointInput('50000')} className="text-blue-500 hover:underline">Бүгдийг ашиглах</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Пин код</label>
                                    <input
                                        type="password"
                                        placeholder="****"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400"
                                    />
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 flex gap-3">
                                <button
                                    onClick={() => setShowPointPopup(false)}
                                    className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Буцах
                                </button>
                                <button
                                    onClick={handleConfirmPoints}
                                    className="flex-1 py-3 bg-teal-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all active:scale-95"
                                >
                                    Баталгаажуулах
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Step5OrderSummary;
