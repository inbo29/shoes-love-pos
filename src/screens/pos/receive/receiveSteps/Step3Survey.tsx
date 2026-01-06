import React, { useState } from 'react';
import type { OrderData } from '../../flow/ReceiveFlowScreen';

const EMOJI_RATINGS = [
    { value: 1, icon: '😡', label: 'Маш муу' },
    { value: 2, icon: '😐', label: 'Муу' },
    { value: 3, icon: '🙂', label: 'Дунд' },
    { value: 4, icon: '😊', label: 'Сайн' },
    { value: 5, icon: '😍', label: 'Маш сайн' },
];

interface Step3SurveyProps {
    noVat?: boolean;
    orderData: OrderData;
    calculations: {
        originalTotal: number;
        cancelledTotal: number;
        revisedTotal: number;
        vat: number;
        finalTotal: number;
        remaining: number;
        paidAmount: number;
        discount: number;
        pointsUsed: number;
    };
}

const Step3Survey: React.FC<Step3SurveyProps> = ({ noVat, orderData, calculations }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [wantsServiceAgain, setWantsServiceAgain] = useState(false);
    const [comment, setComment] = useState('');

    const currentFinalTotal = calculations.finalTotal - (noVat ? calculations.vat : 0);
    const isFullyPaid = calculations.remaining <= 0; // The consolidated remaining in flow might be different if Step 2 added payments, but survey usually shows final state of mock base.

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-12 overflow-visible relative">
            {/* Left Column (Main Content) */}
            <div className={`flex flex-col items-center pt-8 overflow-visible min-w-0 transition-all duration-500 w-full lg:w-[64%]`}>

                {/* Main Survey Card */}
                <div className="w-full max-w-xl bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-primary to-teal-400 opacity-20" />

                    <div className="mb-10">
                        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 shadow-inner text-gray-300">
                            <span className="material-icons-round text-3xl">reviews</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-3">
                            Сэтгэл ханамжийн<br />санал асуулга
                        </h2>
                        <p className="text-sm font-bold text-gray-400 tracking-wide">
                            Үйлчилгээ болон гүйцэтгэлд өгөх үнэлгээ
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 w-full">
                        {EMOJI_RATINGS.map((item) => {
                            const isSelected = rating === item.value;
                            return (
                                <button
                                    key={item.value}
                                    onClick={() => setRating(item.value)}
                                    className={`group flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105 opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-sm transition-all border-2 ${isSelected
                                        ? 'bg-yellow-50 border-yellow-400 shadow-yellow-200'
                                        : 'bg-white border-gray-100 group-hover:border-gray-200'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-gray-800' : 'text-gray-300'
                                        }`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-full mb-8">
                        <label className="flex items-center justify-center gap-3 group cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all"
                                checked={wantsServiceAgain}
                                onChange={(e) => setWantsServiceAgain(e.target.checked)}
                            />
                            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                                Дахин үйлчилгээ авах хүсэлтэй байна
                            </span>
                        </label>
                    </div>

                    <div className="w-full relative">
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none min-h-[120px]"
                            placeholder="Санал хүсэлт (сонголтоор)..."
                            maxLength={200}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-300">
                            {comment.length} / 200
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="w-full lg:w-[36%] shrink-0 flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="bg-white rounded-[32px] shadow-xl border border-primary/5 overflow-hidden sticky top-4">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-6 w-1 bg-[#40C1C7] rounded-sm shrink-0"></div>
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                Захиалгын мэдээлэл
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Захиалгын №</span>
                                <span className="text-gray-800 font-black">{orderData.id}</span>
                            </div>

                            <div className="h-px bg-gray-50 my-4" />

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Анхны дүн</span>
                                    <span className="font-black text-gray-800">{calculations.originalTotal.toLocaleString()}₮</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-red-400 uppercase tracking-widest text-[9px]">Цуцлагдсан үйлчилгээ</span>
                                    <span className="font-black text-red-500">-{calculations.cancelledTotal.toLocaleString()}₮</span>
                                </div>
                                <div className="flex justify-between text-xs pt-2 border-t border-gray-50">
                                    <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Төлсөн дүн</span>
                                    <span className="font-black text-gray-800">{calculations.paidAmount.toLocaleString()}₮</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="font-black text-gray-800 uppercase tracking-widest text-[11px]">Үлдэгдэл</span>
                                    <span className="text-3xl font-black text-primary tracking-tighter leading-none">{calculations.remaining.toLocaleString()}₮</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-50 my-6" />

                            <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${isFullyPaid ? 'text-green-500 bg-green-50 border-green-100' : 'text-orange-500 bg-orange-50 border-orange-100'}`}>
                                <span className="material-icons-round text-xl">{isFullyPaid ? 'check_circle' : 'pending'}</span>
                                <span className="text-[11px] font-black uppercase tracking-widest">{isFullyPaid ? 'Төлбөр төлөгдсөн' : 'Төлбөрийн үлдэгдэлтэй'}</span>
                            </div>

                            <div className="pt-4">
                                <button className="w-full py-4 bg-white border-2 border-gray-100 hover:border-primary hover:bg-primary/5 rounded-2xl flex items-center justify-center gap-3 text-gray-700 hover:text-primary transition-all active:scale-95 group">
                                    <span className="material-icons-round text-xl group-hover:rotate-12 transition-transform">print</span>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Төлбөрийн баримт хэвлэх</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3Survey;
