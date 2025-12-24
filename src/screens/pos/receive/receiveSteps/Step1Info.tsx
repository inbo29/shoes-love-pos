import React, { useState } from 'react';

// MOCK DATA (Ideally passed via props or context)
const MOCK_ORDER = {
    id: '#ORD-23910',
    finishedDate: '2023.10.26',
    customer: {
        name: 'Б. Болд-Эрдэнэ',
        phone: '8811-2233',
        address: 'УБ, Хан-Уул, 19-р хороолол, 12-р байр'
    },
    payment: {
        status: 'Хэсэгчлэн',
        method: 'QPay / Банкны апп',
        total: 45000,
        paid: 30000,
        remaining: 15000
    },
    items: [
        {
            id: 1,
            name: 'Гутал (Nike Air Max)',
            services: ['Гутал цэвэрлэгээ', 'Ус хамгаалалт'],
            quantity: 1,
            cleanliness: 'Дунд',
            damage: { hasDamage: false },
            photos: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
                'https://images.unsplash.com/photo-1549298916-b41d501d377b?w=200',
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200',
            ]
        },
        {
            id: 2,
            name: 'Гутал (Timberland)',
            services: ['Илгэн цэвэрлэгээ'],
            quantity: 1,
            cleanliness: 'Их',
            damage: { hasDamage: true, desc: 'Тийм (Өсгий)' },
            photos: [
                'https://images.unsplash.com/photo-1520639889456-78443213ecdc?w=200',
                'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200',
            ]
        }
    ]
};

interface Step1InfoProps {
    onValidationChange: (isValid: boolean) => void;
}

const Step1Info: React.FC<Step1InfoProps> = ({ onValidationChange }) => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);

    const handleCheck1 = () => {
        const newVal = !checked1;
        setChecked1(newVal);
        onValidationChange(newVal && checked2);
    };

    const handleCheck2 = () => {
        const newVal = !checked2;
        setChecked2(newVal);
        onValidationChange(checked1 && newVal);
    };

    return (
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32 animate-in fade-in duration-500 overflow-visible">
            {/* Top Unified Order Info Card */}
            <div className="lg:col-span-12">
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-primary/5 flex items-center justify-center shadow-inner">
                            <span className="material-icons-round text-primary text-3xl">qr_code_2</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Захиалгын №</p>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">{MOCK_ORDER.id}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Дууссан огноо</p>
                            <p className="text-lg font-black text-gray-800 tracking-tight">{MOCK_ORDER.finishedDate}</p>
                        </div>
                        <div className="bg-green-50 px-6 py-2.5 rounded-full border border-green-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">Хүлээлгэн өгөхөд бэлэн</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Column: Customer & Payment */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <span className="material-icons-round text-primary">person_outline</span>
                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Хэрэглэгчийн мэдээлэл</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Нэр:</span>
                            <span className="text-sm font-black text-gray-800">{MOCK_ORDER.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Утас:</span>
                            <span className="text-sm font-black text-primary underline decoration-dotted underline-offset-4 cursor-pointer">{MOCK_ORDER.customer.phone}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-50">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Хаяг:</span>
                            <span className="text-xs font-bold text-gray-600 leading-relaxed">{MOCK_ORDER.customer.address}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-50 pb-4">
                        <span className="material-icons-round text-primary">account_balance_wallet</span>
                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Төлбөрийн мэдээлэл</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Төлөв:</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{MOCK_ORDER.payment.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Төлбөрийн хэлбэр:</span>
                            <span className="text-xs font-bold text-gray-700">{MOCK_ORDER.payment.method}</span>
                        </div>
                        <div className="pt-6 border-t border-gray-50 flex justify-between items-baseline">
                            <span className="text-sm font-black text-gray-800">Нийт дүн:</span>
                            <span className="text-4xl font-black text-primary tracking-tighter">{MOCK_ORDER.payment.total.toLocaleString()}₮</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Breakdown */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-visible">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-icons-round text-primary">view_list</span>
                            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Захиалгын задаргаа</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {MOCK_ORDER.items.map((item: any, idx: number) => (
                            <div key={item.id} className="p-8 group hover:bg-gray-50/50 transition-all duration-300">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-2xl font-black text-gray-200">{idx + 1}.</span>
                                            <h4 className="text-xl font-black text-gray-800 tracking-tight">{item.name}</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.services.map((s: string) => (
                                                <span key={s} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/10">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Бохирдлын зэрэг</p>
                                                <p className="text-sm font-bold text-gray-700">{item.cleanliness}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Гэмтэл байгаа эсэх</p>
                                                <p className={`text-sm font-bold ${item.damage.hasDamage ? 'text-red-500' : 'text-green-500'}`}>
                                                    {item.damage.hasDamage ? item.damage.desc : 'Үгүй'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="flex gap-2">
                                            {item.photos.slice(0, 3).map((p: string, pi: number) => (
                                                <div key={pi} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                    <img src={p} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#FFF8E1] rounded-[32px] border border-[#FFE082] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white shadow-md">
                            <span className="material-icons-round text-lg">verified</span>
                        </div>
                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Баталгаажуулалт</h3>
                    </div>
                    <div className="space-y-4">
                        <label onClick={handleCheck1} className="flex items-center gap-4 cursor-pointer p-4 bg-white/40 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-yellow-200 group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked1 ? 'bg-yellow-400 border-yellow-400 shadow-lg' : 'bg-white border-yellow-200'}`}>
                                {checked1 && <span className="material-icons-round text-white text-sm font-bold">check</span>}
                            </div>
                            <span className="text-[13px] font-bold text-gray-700">Хэрэглэгч захиалгаа бүрэн бүтэн хүлээн авсан</span>
                        </label>
                        <label onClick={handleCheck2} className="flex items-center gap-4 cursor-pointer p-4 bg-white/40 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-yellow-200 group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked2 ? 'bg-yellow-400 border-yellow-400 shadow-lg' : 'bg-white border-yellow-200'}`}>
                                {checked2 && <span className="material-icons-round text-white text-sm font-bold">check</span>}
                            </div>
                            <span className="text-[13px] font-bold text-gray-700">Захиалгын гүйцэтгэлтэй танилцсан</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1Info;
