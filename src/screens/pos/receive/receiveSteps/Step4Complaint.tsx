
import React, { useState } from 'react';

const Step4Complaint: React.FC = () => {

    // Mock Data for "Target Selection" (Which shoes?)
    const ORDER_ITEMS = [
        { id: 1, name: 'Nike Air Force 1', model: 'Цагаан, 42', price: 150000 },
        { id: 2, name: 'Ус нэвтэрдэггүй шүршигч', model: 'Cleaning', price: 25000 },
        { id: 3, name: 'Гутлын үдээс', model: 'Хар', price: 5000 }
    ];

    const CLAIM_TYPES = [
        { id: 'quality', label: 'Чанарын асуудал (Алчилгааны чанар)' },
        { id: 'incomplete', label: 'Бохирдол дутуу арилсан' },
        { id: 'damage', label: 'Гэмтэл үүссэн' },
        { id: 'late', label: 'Хугацаа хоцорсон' },
        { id: 'other', label: 'Бусад' }
    ];

    const ACTION_OPTIONS = [
        { id: 'retry', label: 'Дахин үйлчилгээ хийх' },
        { id: 'discount', label: 'Хөнгөлөлт олгох' },
        { id: 'refund', label: 'Буцаалт (Refund)' },
        { id: 'later', label: 'Дараа шийдвэрлэх' }
    ];

    const [selectedTargets, setSelectedTargets] = useState<number[]>([]);
    const [selectedType, setSelectedType] = useState<string>('');
    const [description, setDescription] = useState('');
    const [selectedAction, setSelectedAction] = useState<string>('');
    const [photos, setPhotos] = useState<string[]>([]);

    const toggleTarget = (id: number) => {
        setSelectedTargets(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Calculate Refund Amount (Mock logic)
    const selectedAmount = ORDER_ITEMS.filter(i => selectedTargets.includes(i.id)).reduce((acc, i) => acc + i.price, 0);
    const refundAmount = selectedAction === 'refund' ? selectedAmount : 0;

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-12 overflow-visible relative">

            {/* Left Column: Complaint Form (64%) */}
            <div className="w-full lg:w-[64%] flex flex-col gap-6 overflow-visible min-w-0">

                {/* 0. Order Info Header (From Mockup) */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Захиалгын мэдээлэл</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Захиалгын №</span>
                            <span className="text-xs font-black text-gray-800 bg-gray-50 px-2 py-1.5 rounded-lg block border border-gray-100">ORD-231027-001</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Хэрэглэгчийн нэр</span>
                            <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1.5 rounded-lg block border border-gray-100">Б. Болд-Эрдэнэ</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Утас</span>
                            <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1.5 rounded-lg block border border-gray-100">9911-2345</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Хүлээлгэн өгсөн огноо</span>
                            <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1.5 rounded-lg block border border-gray-100">2023.10.25</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Гомдол гаргасан огноо</span>
                            <div className="text-xs font-bold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                                <span className="material-icons-round text-sm text-gray-400">calendar_today</span>
                                2023.10.27 (Өнөөдөр)
                            </div>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 block mb-1">Гомдол бүртгэсэн ажилтан</span>
                            <div className="text-xs font-bold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                                <span className="material-icons-round text-sm text-gray-400">person</span>
                                Админ
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1. Claim Target */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                            Ямар бараанд хамаарах вэ?
                        </h3>
                        {selectedTargets.length > 0 && <span className="text-[10px] font-bold text-primary">{selectedTargets.length} бараа сонгогдсон</span>}
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded text-primary focus:ring-primary/20 border-gray-300"
                                    checked={selectedTargets.length === ORDER_ITEMS.length}
                                    onChange={() => {
                                        if (selectedTargets.length === ORDER_ITEMS.length) setSelectedTargets([]);
                                        else setSelectedTargets(ORDER_ITEMS.map(i => i.id));
                                    }}
                                />
                                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">Бүгдийг сонгох</span>
                            </label>

                            {ORDER_ITEMS.map(item => (
                                <label key={item.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all group ${selectedTargets.includes(item.id)
                                        ? 'bg-primary/5 border-primary/20'
                                        : 'border-gray-100 hover:bg-gray-50'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded text-primary focus:ring-primary/20 border-gray-300"
                                            checked={selectedTargets.includes(item.id)}
                                            onChange={() => toggleTarget(item.id)}
                                        />
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${selectedTargets.includes(item.id) ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {item.name} <span className="font-normal text-gray-500">({item.model})</span>
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 line-through decoration-red-400 decoration-2">
                                        ₮ {item.price.toLocaleString()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Claim Type & Description */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-4 flex items-center gap-1">
                                Гомдлын агуулга <span className="text-red-500">*</span>
                            </h3>
                            <textarea
                                className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder-gray-300"
                                placeholder="Хэрэглэгчийн гомдлын дэлгэрэнгүйг энд бичнэ үү..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-tight mb-3">Гомдлын төрөл</h3>
                            <div className="flex flex-wrap gap-2">
                                {CLAIM_TYPES.map(type => (
                                    <label key={type.id} className={`px-4 py-2 rounded-full border text-xs font-bold cursor-pointer transition-all ${selectedType === type.id
                                            ? 'bg-gray-800 border-gray-800 text-white'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="claimType"
                                            className="hidden"
                                            checked={selectedType === type.id}
                                            onChange={() => setSelectedType(type.id)}
                                        />
                                        {type.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Photos */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                            <span className="material-icons-round text-gray-400 text-lg">photo_camera</span>
                            4. Зураг / Нотлох баримт (Сонголтоор)
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-5 gap-3">
                            <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                                <span className="material-icons-round text-2xl mb-1">add_a_photo</span>
                                <span className="text-[9px] font-bold uppercase">Нэмэх</span>
                            </div>
                            {/* Photo Placeholders */}
                            {[1, 2].map((_, i) => (
                                <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-200 relative group hidden">
                                    {/* This would be real photo logic */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Financial Impact & Actions (36%) */}
            <div className="w-full lg:w-[36%] shrink-0 flex flex-col gap-6">

                {/* Financial Impact (From Mockup) */}
                <div className="bg-white rounded-[24px] shadow-xl border border-blue-100 overflow-hidden sticky top-4">
                    <div className="p-5 border-b border-blue-50 bg-blue-50/30">
                        <h2 className="text-xs font-black text-gray-600 uppercase">Санхүүгийн нөлөө (Автомат)</h2>
                    </div>
                    <div className="p-6 bg-blue-50/10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500">Сонгогдсон барааны дүн:</span>
                                <span className="text-sm font-black text-gray-800">₮ {selectedAmount.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-blue-100" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-gray-800">Нийт буцаалтын дүн:</span>
                                <span className="text-lg font-black text-teal-500">₮ {refundAmount.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 italic leading-snug">
                                * Энэ дүн нь зөвхөн мэдээллийн чанартай болно.
                            </p>
                        </div>
                    </div>

                    {/* Action Selection */}
                    <div className="p-6 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Шийдвэрлэлт сонгох</h3>
                        <div className="space-y-2">
                            {ACTION_OPTIONS.map(opt => (
                                <label key={opt.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedAction === opt.id
                                        ? 'bg-gray-50 border-gray-400'
                                        : 'border-gray-100 hover:bg-gray-50'
                                    }`}>
                                    <span className={`text-xs font-bold ${selectedAction === opt.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {opt.label}
                                    </span>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAction === opt.id ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
                                        }`}>
                                        {selectedAction === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Step4Complaint;
