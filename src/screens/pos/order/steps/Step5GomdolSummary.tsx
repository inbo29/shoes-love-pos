import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GomdolOrderData, GomdolSelectedItem } from '../../receive/receiveTypes';

interface Step5GomdolSummaryProps {
    onValidationChange?: (isValid: boolean) => void;
}

const Step5GomdolSummary: React.FC<Step5GomdolSummaryProps> = ({ onValidationChange }) => {
    const navigate = useNavigate();
    const [gomdolData, setGomdolData] = useState<GomdolOrderData | null>(null);

    // Load gomdol data from sessionStorage
    useEffect(() => {
        const storedData = sessionStorage.getItem('gomdolOrderData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData) as GomdolOrderData;
                setGomdolData(parsed);
            } catch (e) {
                console.error('Failed to parse gomdol data', e);
                // 데이터 없으면 접근 차단
                navigate('/pos/receive');
            }
        } else {
            // gomdol 데이터 없이 접근 시 차단
            navigate('/pos/receive');
        }
    }, [navigate]);

    // Gomdol 주문은 항상 valid (read-only이므로)
    useEffect(() => {
        onValidationChange?.(true);
    }, [onValidationChange]);

    // Mock customer data (실제로는 원본 주문에서 가져옴)
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

    // Complaint type label
    const getComplaintTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'quality': 'Чанарын асуудал',
            'incomplete': 'Бохирдол дутуу арилсан',
            'damage': 'Гэмтэл үүссэн',
            'late': 'Хугацаа хоцорсон',
            'other': 'Бусад'
        };
        return types[type] || type;
    };

    if (!gomdolData) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <span className="material-icons-round text-6xl text-gray-300 mb-4">hourglass_empty</span>
                    <p className="text-gray-500">Уншиж байна...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 md:p-6 h-full flex flex-col lg:flex-row gap-6 overflow-y-auto no-scrollbar overflow-visible">
            {/* Left Column: Summary (65%) */}
            <div className="lg:w-[65%] flex flex-col gap-6 overflow-visible pr-2 pb-20">

                {/* Gomdol Badge - 상단 고정 표시 */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg shadow-orange-200/50">
                        <span className="material-icons-round text-white text-2xl">warning</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-orange-700 uppercase tracking-wider">
                            Дахин захиалга
                        </h2>
                        <p className="text-[10px] text-orange-600 mt-0.5">
                            Гомдлоор дахин илгээх захиалга • Төлбөргүй
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className="px-3 py-1 bg-orange-400 text-white text-[10px] font-black uppercase rounded-full">
                            Дахин илгээх
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
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

                {/* Complaint Info */}
                <div className="bg-orange-50/50 rounded-xl shadow-sm border border-orange-100 p-5">
                    <h3 className="text-xs font-bold text-orange-600 uppercase mb-4 tracking-wider flex items-center gap-2">
                        <span className="material-icons-round text-sm">report_problem</span>
                        Гомдлын мэдээлэл
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Гомдлын дугаар</p>
                            <p className="text-sm font-bold text-gray-800">{gomdolData.complaintId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 mb-1">Гомдлын төрөл</p>
                            <p className="text-sm font-bold text-gray-800">{getComplaintTypeLabel(gomdolData.complaintType)}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[10px] text-gray-400 mb-1">Тайлбар</p>
                            <p className="text-sm font-medium text-gray-700 bg-white/50 p-3 rounded-lg border border-orange-100">
                                {gomdolData.complaintDescription || '(Тайлбар оруулаагүй)'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Selected Items - READ ONLY */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Сонгогдсон бараа ({gomdolData.selectedItems.length})
                    </h3>

                    {gomdolData.selectedItems.map((item, idx) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden opacity-90">
                            {/* Card Header */}
                            <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                        <span className="material-icons-round text-sm">hiking</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">
                                            {item.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {item.model}
                                        </p>
                                    </div>
                                </div>
                                {/* Read-only Badge */}
                                <span className="px-2 py-1 bg-gray-100 text-gray-400 text-[9px] font-bold uppercase rounded-lg flex items-center gap-1">
                                    <span className="material-icons-round text-xs">lock</span>
                                    Засах боломжгүй
                                </span>
                            </div>

                            <div className="p-5">
                                {/* Quantity - READ ONLY */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xs font-bold text-gray-500">Тоо ширхэг</span>
                                    <span className="text-sm font-black text-gray-800">{item.quantity} ш</span>
                                </div>

                                {/* Price - Always 0 */}
                                <div className="flex items-center justify-between p-3 mt-2 bg-green-50 rounded-lg border border-green-100">
                                    <span className="text-xs font-bold text-green-600">Үнэ</span>
                                    <span className="text-sm font-black text-green-600">₮ 0 (Үнэгүй)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Payment Summary (35%) - LOCKED FOR GOMDOL */}
            <div className="lg:w-[35%] flex flex-col gap-6 lg:sticky lg:top-0 h-fit">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-sm font-bold text-gray-800 uppercase mb-6 flex items-center gap-2 border-l-4 border-orange-400 pl-3">
                            Төлбөр
                        </h2>

                        {/* Price Breakdown - All zeros */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Үйлчилгээний дүн</span>
                                <span className="font-medium text-gray-500 line-through">₮ 0</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>НӨАТ (10%)</span>
                                <span>₮ 0</span>
                            </div>
                        </div>

                        {/* Total Highlight - 0 */}
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-gray-600 uppercase">Нийт төлөх дүн</span>
                            <span className="text-xl font-black text-green-600">₮ 0</span>
                        </div>

                        {/* Disabled Point Usage */}
                        <div className="space-y-3 opacity-50 pointer-events-none">
                            <label className="flex items-center gap-3 cursor-not-allowed">
                                <div className="w-6 h-6 rounded border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                    <span className="material-icons-round text-gray-400 text-sm">block</span>
                                </div>
                                <span className="text-xs font-bold text-gray-400">Пойнт ашиглах (Боломжгүй)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Gomdol Info Notice */}
                <div className="p-5 bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3">
                    <span className="material-icons-round text-orange-500 text-sm mt-0.5">info</span>
                    <div>
                        <p className="text-[10px] text-orange-700 leading-relaxed font-bold mb-1">
                            Дахин захиалга
                        </p>
                        <p className="text-[10px] text-orange-600 leading-relaxed">
                            Энэ захиалга нь гомдлоор дахин илгээж буй захиалга тул төлбөр 0₮ болно.
                            Тайлан дээр тусдаа бүртгэгдэнэ.
                        </p>
                    </div>
                </div>

                {/* Original Order Reference */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Анхны захиалгын мэдээлэл</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-[10px] text-gray-400">Захиалгын дугаар</span>
                            <span className="text-[10px] font-bold text-gray-600">{gomdolData.originalOrderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[10px] text-gray-400">Хүлээлгэн өгөх дугаар</span>
                            <span className="text-[10px] font-bold text-gray-600">{gomdolData.originalReceiveId || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5GomdolSummary;
