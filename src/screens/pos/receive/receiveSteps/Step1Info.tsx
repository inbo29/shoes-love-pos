import React, { useState } from 'react';
import type { OrderData } from '../../flow/ReceiveFlowScreen';

interface Step1InfoProps {
    onValidationChange: (isValid: boolean) => void;
    orderData: OrderData;
    calculations: {
        originalTotal: number;
        cancelledTotal: number;
        revisedTotal: number;
    };
}

const Step1Info: React.FC<Step1InfoProps> = ({ onValidationChange, orderData, calculations }) => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);

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
        if (phone.length >= 8) {
            return phone.substring(0, 2) + '****' + phone.substring(phone.length - 2);
        }
        return phone;
    };

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
            {/* Top Header Card */}
            <div className="lg:col-span-12">
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[24px] bg-primary/5 flex items-center justify-center shadow-inner">
                            <span className="material-icons-round text-primary text-3xl">qr_code_2</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Захиалгын №</p>
                            <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">{orderData.id}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-12">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Дууссан огноо</p>
                            <p className="text-lg font-black text-gray-800 tracking-tight">{orderData.finishedDate}</p>
                        </div>
                        <div className="bg-green-50 px-6 py-2.5 rounded-full border border-green-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">Хүлээлгэн өгөхөд бэлэн</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Column: Customer & Item Detail */}
            <div className="lg:col-span-8 flex flex-col gap-8 pr-2">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Захиалгын задаргаа</h1>
                </div>

                {/* Customer Info (Horizontal Card) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xs font-bold text-teal-500 uppercase mb-4 tracking-wider">Хэрэглэгчийн мэдээлэл</h3>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-widest">Нэр</p>
                            <p className="text-sm font-black text-gray-800">{maskName(orderData.customer.name)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-widest">Утас</p>
                            <p className="text-sm font-black text-primary underline underline-offset-4 decoration-dotted">{maskPhone(orderData.customer.phone)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-widest">Хаяг</p>
                            <p className="text-xs font-black text-gray-600 leading-tight">{orderData.customer.address}</p>
                        </div>
                    </div>
                </div>

                {/* Item Card Details */}
                <div className="flex flex-col gap-8">
                    {orderData.items.map((item) => {
                        const isCancelled = item.status === 'CANCELLED';
                        return (
                            <div key={item.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden group transition-all ${isCancelled ? 'border-red-100 bg-red-50/10' : 'border-gray-100'}`}>
                                <div className={`px-6 py-5 border-b flex items-center justify-between ${isCancelled ? 'bg-red-50/30 border-red-50' : 'bg-gray-50/30 border-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${isCancelled ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                            <span className="material-icons-round text-lg">{isCancelled ? 'block' : 'hiking'}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-black uppercase tracking-tight ${isCancelled ? 'text-gray-500 decoration-slice' : 'text-gray-800'}`}>
                                                {item.name}
                                                {isCancelled && <span className="ml-2 text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 tracking-wide">БУЦААГДСАН</span>}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {item.id}</p>
                                                {isCancelled && <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                                    Мөрийн төлөв: Буцаагдсан
                                                </p>}
                                                {!isCancelled && <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-green-500"></span>
                                                    Мөрийн төлөв: Болсон
                                                </p>}
                                            </div>
                                        </div>
                                    </div>
                                    {isCancelled && (
                                        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-200">
                                            Үйлчилгээ цуцлагдсан
                                        </div>
                                    )}
                                </div>

                                <div className={`p-8 space-y-8 ${isCancelled ? 'opacity-60 grayscale-[0.5] pointer-events-none select-none' : ''}`}>
                                    {/* 1. Services */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-teal-500 uppercase mb-4 tracking-widest opacity-80">1. Үйлчилгээний дэлгэрэнгүй</h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {item.services.map((s, sIdx) => {
                                                // Mock price per service
                                                const servicePrice = s.includes('бага') ? 5000 : 10000;
                                                return (
                                                    <span key={s} className="px-4 py-2 bg-white border-2 border-primary/5 text-primary text-[11px] font-black rounded-xl shadow-sm flex items-center gap-2.5 hover:border-primary/20 transition-colors">
                                                        <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)] ${isCancelled ? 'bg-gray-400' : 'bg-green-400'}`}></span>
                                                        {s} <span className="opacity-60 font-bold ml-1">{servicePrice.toLocaleString()}₮</span> {isCancelled && '(Цуцлагдсан)'}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Conditions */}
                                    <div className="pt-6 border-t border-gray-50">
                                        <h4 className="text-[10px] font-black text-teal-500 uppercase mb-4 tracking-widest opacity-80">2. Одоогийн байдал</h4>
                                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                                            <div className="flex flex-wrap gap-x-12 gap-y-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Бохирдол</span>
                                                    <p className="text-sm font-black text-gray-800">{item.cleanliness}</p>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Гэмтэл</span>
                                                    <div className={`flex items-center gap-2 text-sm font-black ${item.damage.hasDamage ? 'text-orange-500' : 'text-green-500'}`}>
                                                        {item.damage.hasDamage && <span className="material-icons-round text-sm">warning</span>}
                                                        {item.damage.hasDamage ? item.damage.desc : 'Үгүй'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Photos */}
                                    <div className="pt-6 border-t border-gray-50">
                                        <h4 className="text-[10px] font-black text-teal-500 uppercase mb-4 tracking-widest opacity-80">3. Гүйцэтгэлийн зураг</h4>
                                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                            {item.photos.map((p, pIdx) => (
                                                <div key={pIdx} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group cursor-pointer shrink-0 hover:ring-4 hover:ring-primary/10 transition-all">
                                                    <img src={p} alt="Result" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <span className="material-icons-round text-white scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all bg-black/30 p-1.5 rounded-full backdrop-blur-sm">zoom_in</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8 h-fit">
                <div className="bg-white rounded-[32px] shadow-xl border border-teal-50/50 overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-sm font-black text-gray-800 uppercase mb-8 flex items-center gap-3 border-l-4 border-yellow-400 pl-4">
                            Төлбөрийн мэдээлэл
                        </h2>

                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Төлөв</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-extrabold uppercase tracking-tight">{orderData.payment.status}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Хэлбэр</span>
                                <span className="text-xs font-black text-gray-700">{orderData.payment.method}</span>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Үйлчилгээний дүн</span>
                                <span className="text-sm font-black text-gray-800">{calculations.originalTotal.toLocaleString()}₮</span>
                            </div>
                            {calculations.cancelledTotal > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">- Цуцлагдсан үйлчилгээ</span>
                                    <span className="text-sm font-black text-red-500">-{calculations.cancelledTotal.toLocaleString()}₮</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 mt-4 bg-teal-50/30 rounded-2xl border border-teal-50 flex justify-between items-center mb-0">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Шинэчилсэн нийт дүн</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">{calculations.revisedTotal.toLocaleString()}₮</span>
                        </div>
                    </div>
                </div>

                {/* Confirmation Section */}
                <div className="bg-[#FFF8E1] rounded-[32px] border border-[#FFE082] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white shadow-lg ring-8 ring-yellow-400/10">
                            <span className="material-icons-round text-xl">verified</span>
                        </div>
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Баталгаажуулалт</h3>
                    </div>
                    <div className="space-y-4">
                        <label onClick={handleCheck1} className="flex items-center gap-4 cursor-pointer p-5 bg-white/50 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-yellow-200 group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked1 ? 'bg-yellow-400 border-yellow-400 shadow-md' : 'bg-white border-yellow-300'}`}>
                                {checked1 && <span className="material-icons-round text-white text-sm font-bold">check</span>}
                            </div>
                            <span className="text-[13px] font-black text-gray-700 leading-tight">Хэрэглэгч захиалгаа бүрэн бүтэн хүлээн авсан</span>
                        </label>
                        <label onClick={handleCheck2} className="flex items-center gap-4 cursor-pointer p-5 bg-white/50 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-yellow-200 group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked2 ? 'bg-yellow-400 border-yellow-400 shadow-md' : 'bg-white border-yellow-300'}`}>
                                {checked2 && <span className="material-icons-round text-white text-sm font-bold">check</span>}
                            </div>
                            <span className="text-[13px] font-black text-gray-700 leading-tight">Захиалгын гүйцэтгэлтэй танилцсан</span>
                        </label>
                    </div>
                </div>

                {/* Important Notice Board */}
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                        <span className="material-icons-round text-orange-500 text-lg">info</span>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-orange-800 uppercase mb-1 tracking-widest">Санамж</h4>
                        <p className="text-[10px] text-orange-700 leading-relaxed font-bold">
                            Дараагийн алхамд шилжих бөгөөд
                            <span className="text-orange-900 mx-1 underline decoration-orange-300">Баталгаажуулалт</span>
                            хийгдсэнээр захиалга бүрэн дуусна.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step1Info;
