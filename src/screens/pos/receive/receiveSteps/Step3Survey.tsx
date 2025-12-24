import React, { useState } from 'react';

const EMOJI_RATINGS = [
    { value: 1, icon: '😡', label: 'Маш муу' },
    { value: 2, icon: '😐', label: 'Муу' },
    { value: 3, icon: '🙂', label: 'Дунд' },
    { value: 4, icon: '😊', label: 'Сайн' },
    { value: 5, icon: '😍', label: 'Маш сайн' },
];

const Step3Survey: React.FC = () => {
    const [rating, setRating] = useState<number | null>(null);
    const [wantsServiceAgain, setWantsServiceAgain] = useState(false);
    const [comment, setComment] = useState('');

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-12 overflow-visible relative">
            {/* Left Column (Main Content) - 64% */}
            <div className="w-full lg:w-[64%] flex flex-col items-center pt-8 overflow-visible min-w-0">

                {/* Main Survey Card */}
                <div className="w-full max-w-xl bg-white rounded-[32px] border border-gray-100 shadow-xl p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-primary to-teal-400 opacity-20" />

                    {/* 1. Title Area */}
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

                    {/* 2. Emoji Selection */}
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

                    {/* 3. Additional Checkbox */}
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

                    {/* 4. Comment Area */}
                    <div className="w-full relative">
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none min-h-[120px]"
                            placeholder="Санал хүсэлт (сонголтоор)..."
                            maxLength={200}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        {rating && rating <= 2 && !comment && (
                            <div className="absolute top-4 left-4 right-4 pointer-events-none text-orange-400 text-xs font-bold animate-pulse flex items-center gap-2 bg-gray-50">
                                <span className="material-icons-round text-sm">edit</span>
                                Юу сайжруулах хэрэгтэй вэ?
                            </div>
                        )}
                        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-gray-300">
                            {comment.length} / 200
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary (Sticky) - 36% */}
            {/* Keeping it simple as per "Sticky Rule" but simplified content since this is Survey Step */}
            <div className="w-full lg:w-[36%] shrink-0 flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-xl border border-primary/5 overflow-hidden sticky top-4 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="p-8">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 border-l-4 border-gray-200 pl-3">
                            Захиалгын мэдээлэл
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold">Захиалгын №</span>
                                <span className="text-gray-800 font-black">#ORD-2310-001</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold">Нийт дүн</span>
                                <span className="text-gray-800 font-black">₮ 38,900</span>
                            </div>
                            <div className="h-px bg-gray-50 my-4" />
                            <div className="flex items-center gap-3 text-green-500 bg-green-50 p-3 rounded-xl border border-green-100">
                                <span className="material-icons-round text-lg">check_circle</span>
                                <span className="text-xs font-bold">Төлбөр төлөгдсөн</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3Survey;
