import React, { useState } from 'react';

// Reusing types locally for now
interface SummaryItem {
    id: number;
    category: string;
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

    const orderItems: SummaryItem[] = [
        {
            id: 1,
            category: 'Гутал',
            services: ['Угаах', 'Будах'],
            priceDetails: [
                { label: 'Угаах (Стандарт)', price: 23900 },
                { label: 'Будах (Хар)', price: 15000 },
            ],
            conditions: [
                { label: 'Өнгө', value: 'Хар' },
                { label: 'Материал', value: 'Арьс' },
                { label: 'Толбо', value: 'Тосны толботой' },
                { label: 'Гэмтэл', value: 'Ул хагарсан' },
                { label: 'УДӨ', value: 'Өнгө хувирч болзошгүй', warning: true },
            ],
            photos: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200'
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
        <div className="max-w-7xl mx-auto w-full p-4 h-full flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* Left Column: Summary (65%) */}
            <div className="lg:w-[65%] flex flex-col gap-6 overflow-y-auto pr-2 pb-20">
                <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Захиалгын хураангуй</h1>

                {/* Customer Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-xs font-bold text-teal-500 uppercase mb-4 tracking-wider">Хэрэглэгчийн мэдээлэл</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Нэр</p>
                            <p className="text-sm font-bold text-gray-800">{customerInfo.name}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Утас</p>
                            <p className="text-sm font-bold text-gray-800">{customerInfo.phone}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Хаяг</p>
                            <p className="text-sm font-bold text-gray-800">{customerInfo.address}</p>
                        </div>
                    </div>
                </div>

                {/* Service Overview Tags */}
                <div className="bg-white rounded-xl shadow-sm border border-white p-5 flex gap-3">
                    <div className="flex items-center gap-2 bg-blue-50/50 text-blue-500 px-3 py-1.5 rounded-lg border border-blue-50">
                        <span className="material-icons-round text-sm">directions_walk</span>
                        <span className="text-xs font-bold">Гутал × 1</span>
                    </div>
                </div>

                {/* Detailed Item Summary Blocks */}
                {orderItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 space-y-6">
                            {/* Selected Services Title */}
                            <div>
                                <h3 className="text-xs font-bold text-teal-500 uppercase mb-3 tracking-wider">Үйлчилгээний хураангуй</h3>
                                <div className="flex gap-2">
                                    {item.services.map(s => (
                                        <span key={s} className="px-3 py-1 bg-gray-50 text-gray-500 text-[11px] font-bold rounded-lg border border-gray-100 italic">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price Details */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t border-gray-50">
                                {item.priceDetails.map(p => (
                                    <div key={p.label} className="flex justify-between items-center bg-gray-50/30 p-2 rounded-lg pr-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                                            <span className="text-xs text-gray-600">{p.label}</span>
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">₮ {p.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Condition State Summary */}
                            <div className="pt-4 border-t border-gray-50">
                                <h3 className="text-[11px] font-bold text-teal-500 uppercase mb-3 tracking-wider">Одоогийн байдал</h3>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {item.conditions.map(c => (
                                        <div key={c.label} className="flex items-center gap-1.5 text-xs">
                                            <span className="text-gray-400">{c.label}:</span>
                                            <span className={`font-bold ${c.warning ? 'text-orange-500 underline decoration-dotted' : 'text-gray-700'}`}>
                                                {c.value}
                                                {c.warning && <span className="material-icons-round text-[10px] ml-0.5">warning</span>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Photo Thumbnails */}
                            <div className="pt-4 border-t border-gray-50 flex gap-3">
                                {item.photos.map((p, idx) => (
                                    <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group cursor-pointer">
                                        <img src={p} alt="Thumbnail" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="material-icons-round text-white text-sm">zoom_in</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Column: Payment & Points (35%) */}
            <div className="lg:w-[35%] flex flex-col gap-6">
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
                            <div className="flex justify-between text-xs text-green-500 font-bold italic">
                                <span>Хөнгөлөлт (10%)</span>
                                <span>- ₮ {discount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>НӨАТ (10%)</span>
                                <span>₮ {vat.toLocaleString()}</span>
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
                            <span className="text-xl font-black text-teal-600">₮ {finalTotal.toLocaleString()}</span>
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
                        Дараагийн алхамд шилжихэд 결제(Payment) 단계로 이동합니다.
                        Төлбөр хийгдсэний дараа захиалга баталгаажна.
                    </p>
                </div>
            </div>

            {/* Point Usage Popup */}
            {showPointPopup && (
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
                                Цуцлах
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
            )}
        </div>
    );
};

export default Step5OrderSummary;
