import React from 'react';

interface Step2Props {
    order: any;
    selectedItemIds: Set<string>;
    selectedServiceIds: Set<string>;
    onToggleItem: (itemId: string) => void;
    onToggleService: (serviceId: string) => void;
    onToggleAll: (checked: boolean) => void;
}

const ReturnStep2Detail: React.FC<Step2Props> = ({
    order,
    selectedItemIds,
    selectedServiceIds,
    onToggleItem,
    onToggleService,
    onToggleAll
}) => {
    if (!order) return null;

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

    // Calculate refund amount based on items and services
    const refundAmount = order.items.reduce((acc: number, item: any) => {
        if (selectedItemIds.has(item.id)) {
            // Whole item selected
            const itemTotal = item.services?.reduce((sum: number, s: any) => sum + s.price, 0) || 0;
            return acc + itemTotal;
        } else {
            // Individual services selected
            const servicesTotal = item.services?.reduce((sum: number, s: any) => {
                return selectedServiceIds.has(s.id) ? sum + s.price : sum;
            }, 0) || 0;
            return acc + servicesTotal;
        }
    }, 0);

    const originalTotal = parseInt(order.amount.replace(/[^0-9]/g, ''));
    const finalTotal = originalTotal - refundAmount;

    // Check if everything is selected
    const isAllSelected = order.items.every((item: any) => selectedItemIds.has(item.id));

    return (
        <div className="w-full h-full flex flex-col lg:flex-row gap-6 overflow-y-auto no-scrollbar overflow-visible pb-20">
            {/* Left Column: Summary (65%) */}
            <div className="lg:w-[65%] flex flex-col gap-6 overflow-visible pr-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Захиалгын хураангуй</h1>
                </div>

                {/* Customer Info Header - Clean Horizontal Style like Image 2 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-wrap items-center gap-12">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Нэр</span>
                        <span className="text-sm font-bold text-gray-800">{maskName(order.customer)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Утас</span>
                        <span className="text-sm font-bold text-gray-800">{maskPhone(order.phone)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Захиалгын №</span>
                        <span className="text-sm font-bold text-[#40C1C7]">{order.id}</span>
                    </div>
                </div>

                {/* Detailed Item List */}
                <div className="flex flex-col gap-6">
                    {order.items.map((item: any) => {
                        const isItemSelected = selectedItemIds.has(item.id);

                        return (
                            <div key={item.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                                {/* Item Header (Bundle selection - ⭕) */}
                                <div
                                    className={`px-8 py-5 border-b border-gray-50 flex justify-between items-center cursor-pointer transition-colors ${isItemSelected ? 'bg-[#40C1C7]/5' : 'bg-gray-50/30 hover:bg-white'}`}
                                    onClick={() => onToggleItem(item.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#40C1C7]">
                                            <span className="material-icons-round text-lg">hiking</span>
                                        </div>
                                        <div>
                                            <h3 className="text-[15px] font-black text-gray-800 uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">{item.type}</p>
                                        </div>
                                    </div>

                                    {/* Item Radio Selector (⭕) */}
                                    <div className={`w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all ${isItemSelected ? 'border-red-500 bg-red-500 shadow-md shadow-red-100' : 'border-gray-200 bg-white'}`}>
                                        {isItemSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></div>}
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* 1. Service List (Individual selection - ☐) */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-[#40C1C7] uppercase mb-5 tracking-[0.2em] opacity-80">1. Үйлчилгээний дэлгэрэнгүй</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {item.services?.map((service: any) => {
                                                const isServiceSelected = selectedServiceIds.has(service.id) || isItemSelected;

                                                return (
                                                    <button
                                                        key={service.id}
                                                        onClick={() => !isItemSelected && onToggleService(service.id)}
                                                        disabled={isItemSelected}
                                                        className={`px-6 py-3.5 border-2 rounded-2xl flex items-center gap-4 transition-all ${isItemSelected
                                                                ? 'bg-gray-50/50 border-gray-100 text-gray-300 cursor-not-allowed'
                                                                : isServiceSelected
                                                                    ? 'border-red-500 bg-red-50/20 text-red-600 shadow-sm'
                                                                    : 'border-gray-50 bg-white text-gray-700 hover:border-gray-100 shadow-sm'
                                                            }`}
                                                    >
                                                        {/* Service Checkbox Selector (☐) */}
                                                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isItemSelected
                                                                ? 'border-gray-100 bg-gray-50'
                                                                : isServiceSelected ? 'border-red-500 bg-red-500 shadow-sm shadow-red-100' : 'border-gray-200 bg-white'
                                                            }`}>
                                                            {(isServiceSelected || isItemSelected) && (
                                                                <span className="material-icons-round text-white text-[14px] font-black">check</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start translate-y-[1px]">
                                                            <span className="text-[11px] font-black uppercase tracking-tight">{service.name}</span>
                                                            <span className={`text-[10px] font-bold ${isServiceSelected ? 'text-red-400' : 'text-gray-400'}`}>{service.price.toLocaleString()} ₮</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Mocking Current Status */}
                                    <div className="pt-6 border-t border-gray-50">
                                        <h4 className="text-[10px] font-black text-[#40C1C7] uppercase mb-4 tracking-[0.2em] opacity-80">2. Одоогийн байдал</h4>
                                        <div className="bg-gray-50/30 rounded-2xl p-6 border border-gray-100/50 grid grid-cols-2 gap-8">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Бохирдол</span>
                                                <div className="text-sm font-bold text-gray-700">Дунд</div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Материал</span>
                                                <div className="text-sm font-bold text-gray-700">Арьс</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: Sticky Summary Panel */}
            <div className="lg:w-[35%] flex flex-col gap-6 lg:sticky lg:top-0 h-fit">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-6 w-1.5 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-[15px] font-black text-gray-800 uppercase tracking-widest">төлбөр</h2>
                        </div>

                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Анхны нийт дүн</span>
                                <span className="font-black text-gray-600 text-[15px]">₮ {originalTotal.toLocaleString()}</span>
                            </div>
                            {refundAmount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-red-500 uppercase tracking-widest text-[10px]">Буцаалтын дүн (–)</span>
                                    <span className="font-black text-red-500 text-[15px] italic">- ₮ {refundAmount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-teal-50/20 rounded-[32px] border-2 border-teal-50/50 flex flex-col gap-2 relative overflow-hidden mb-6">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#40C1C7]/5 rounded-full -mr-8 -mt-8"></div>
                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">Шинэчилсэн нийт дүн</span>
                            <span className="text-3xl font-black text-[#40C1C7] tracking-tighter">₮ {finalTotal.toLocaleString()}</span>
                        </div>

                        {/* Cancel All Services Checkbox - Like "Point ashiglax" in Image 2 */}
                        <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAllSelected ? 'bg-[#40C1C7] border-[#40C1C7] shadow-sm shadow-[#40C1C7]/30' : 'bg-white border-gray-200 group-hover:border-[#40C1C7]'}`}>
                                {isAllSelected && <span className="material-icons-round text-white text-sm">check</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isAllSelected}
                                onChange={(e) => onToggleAll(e.target.checked)}
                            />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Бүх үйлчилгээг цуцлах</span>
                        </label>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="p-6 bg-orange-50/50 rounded-3xl border border-orange-100/50 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-orange-100/50 flex items-center justify-center text-orange-500 shrink-0">
                        <span className="material-icons-round text-[16px]">info</span>
                    </div>
                    <p className="text-[11px] text-orange-700 leading-relaxed font-bold">
                        Багц (⭕) эсвэл тухайн үйлчилгээг (☐) сонгон буцаалтын дүнг тооцоолно уу.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReturnStep2Detail;
