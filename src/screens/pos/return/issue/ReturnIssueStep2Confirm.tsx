import React from 'react';

interface IssueStep2Props {
    returnOrder: any;
    confirmations: { receivedGoods: boolean; acknowledgedReason: boolean };
    onToggleConfirmation: (key: 'receivedGoods' | 'acknowledgedReason') => void;
}

const ReturnIssueStep2Confirm: React.FC<IssueStep2Props> = ({
    returnOrder,
    confirmations,
    onToggleConfirmation
}) => {
    if (!returnOrder) return null;

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

    const allConfirmed = confirmations.receivedGoods && confirmations.acknowledgedReason;

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20">
            {/* Page Title */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Захиалгын задаргаа</h1>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
                <h3 className="text-xs font-bold text-[#40C1C7] uppercase mb-5 tracking-wider">Хэрэглэгчийн мэдээлэл</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase font-black tracking-widest">Захиалгын №</p>
                        <p className="text-sm font-bold text-[#40C1C7]">{returnOrder.id}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase font-black tracking-widest">Нэр</p>
                        <p className="text-sm font-bold text-gray-800">{maskName(returnOrder.customer)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase font-black tracking-widest">Утас</p>
                        <p className="text-sm font-bold text-gray-800">{maskPhone(returnOrder.phone)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase font-black tracking-widest">Буцаалт хийсэн огноо</p>
                        <p className="text-sm font-bold text-gray-800">{returnOrder.date}</p>
                    </div>
                </div>

                {/* Return Reason Badge */}
                <div className="mt-6 pt-6 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 mb-2 uppercase font-black tracking-widest">Буцаалтын шалтгаан</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl">
                        <span className="material-icons-round text-orange-500 text-sm">warning</span>
                        <span className="text-xs font-bold text-orange-700">{returnOrder.returnReason}</span>
                    </div>
                </div>
            </div>

            {/* Service Summary */}
            <div className="space-y-6">
                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-3">
                    <div className="h-6 w-1 bg-yellow-400 rounded-full"></div>
                    Үйлчилгээний хураангуй
                </h2>

                {returnOrder.items.map((item: any) => (
                    <div key={item.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                        {/* Item Header */}
                        <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#40C1C7]">
                                    <span className="material-icons-round text-lg">hiking</span>
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-black text-gray-800 uppercase tracking-tight">{item.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">{item.type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Returned Services */}
                            <div>
                                <h4 className="text-[10px] font-black text-[#40C1C7] uppercase mb-4 tracking-[0.2em] opacity-80">Буцаагдсан үйлчилгээ</h4>
                                <div className="flex flex-wrap gap-3">
                                    {item.services?.filter((s: any) => s.isReturned).map((service: any) => (
                                        <div key={service.id} className="px-5 py-2.5 border-2 border-red-100 bg-red-50/20 text-red-600 rounded-2xl flex items-center gap-3 shadow-sm">
                                            <span className="material-icons-round text-sm">block</span>
                                            <span className="text-xs font-black uppercase tracking-tight">{service.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Status */}
                            <div className="pt-6 border-t border-gray-50">
                                <h4 className="text-[10px] font-black text-[#40C1C7] uppercase mb-4 tracking-[0.2em] opacity-80">Одоогийн байдал</h4>
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-50 border-2 border-yellow-100 rounded-2xl shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                    <span className="text-xs font-black text-yellow-700 uppercase tracking-wider">Буцаалт олгоход бэлэн</span>
                                </div>
                            </div>

                            {/* Photos */}
                            {item.photos && item.photos.length > 0 && (
                                <div className="pt-6 border-t border-gray-50">
                                    <h4 className="text-[10px] font-black text-[#40C1C7] uppercase mb-4 tracking-[0.2em] opacity-80">Гүйцэтгэлийн зураг</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {item.photos.map((photo: string, idx: number) => (
                                            <div key={idx} className="aspect-square rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden">
                                                <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Section */}
            <div className="bg-yellow-50/50 rounded-[32px] border-2 border-yellow-100/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <span className="material-icons-round text-xl">task_alt</span>
                    </div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Баталгаажуулалт</h3>
                </div>

                <div className="space-y-4">
                    {/* Checkbox 1 */}
                    <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-2xl hover:bg-yellow-50 transition-colors">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${confirmations.receivedGoods ? 'bg-yellow-500 border-yellow-500 shadow-sm shadow-yellow-200' : 'bg-white border-gray-200 group-hover:border-yellow-300'}`}>
                            {confirmations.receivedGoods && <span className="material-icons-round text-white text-sm">check</span>}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={confirmations.receivedGoods}
                            onChange={() => onToggleConfirmation('receivedGoods')}
                        />
                        <div className="flex-1">
                            <span className="text-sm font-bold text-gray-700 block">Хэрэглэгчээс бараа бүрэн хүлээн авсан</span>
                            <span className="text-[10px] text-gray-400 mt-1 block">Барааны байдал, тоо ширхэг тохирч байна</span>
                        </div>
                    </label>

                    {/* Checkbox 2 */}
                    <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-2xl hover:bg-yellow-50 transition-colors">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${confirmations.acknowledgedReason ? 'bg-yellow-500 border-yellow-500 shadow-sm shadow-yellow-200' : 'bg-white border-gray-200 group-hover:border-yellow-300'}`}>
                            {confirmations.acknowledgedReason && <span className="material-icons-round text-white text-sm">check</span>}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={confirmations.acknowledgedReason}
                            onChange={() => onToggleConfirmation('acknowledgedReason')}
                        />
                        <div className="flex-1">
                            <span className="text-sm font-bold text-gray-700 block">Буцаалтын шалтгаан, байдалтай танилцсан</span>
                            <span className="text-[10px] text-gray-400 mt-1 block">Буцаалтын шалтгаан тодорхой бөгөөд зөвшөөрөгдсөн</span>
                        </div>
                    </label>
                </div>

                {/* Warning if not all confirmed */}
                {!allConfirmed && (
                    <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                        <span className="material-icons-round text-orange-500 text-sm mt-0.5">info</span>
                        <p className="text-[11px] text-orange-700 leading-relaxed font-bold">
                            Бүх баталгаажуулалтыг шалгаж, хэрэглэгчид олгох боломжтой болно.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReturnIssueStep2Confirm;
