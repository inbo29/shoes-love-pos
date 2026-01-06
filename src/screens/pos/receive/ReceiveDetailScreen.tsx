import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Service {
    name: string;
    price: number;
    status: 'ACTIVE' | 'CANCELLED';
}

interface OrderItem {
    id: number;
    name: string;
    services: Service[];
    quantity: number;
    cleanliness: string;
    damage: {
        hasDamage: boolean;
        desc?: string;
    };
    photos: string[];
    status: 'COMPLETED' | 'CANCELLED';
}

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
        paid: 30000,
        discount: 5000,
        pointsUsed: 0
    },
    items: [
        {
            id: 1,
            name: 'Гутал (Nike Air Max)',
            status: 'COMPLETED',
            services: [
                { name: 'Гутал цэвэрлэгээ', price: 25000, status: 'ACTIVE' },
                { name: 'Ус хамгаалалт', price: 10000, status: 'CANCELLED' }
            ],
            quantity: 1,
            cleanliness: 'Дунд',
            damage: { hasDamage: false },
            photos: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
                'https://images.unsplash.com/photo-1549298916-b41d501d377b?w=200',
            ]
        },
        {
            id: 2,
            name: 'Гутал (Timberland)',
            status: 'CANCELLED',
            services: [
                { name: 'Илгэн цэвэрлэгээ', price: 30000, status: 'ACTIVE' }
            ],
            quantity: 1,
            cleanliness: 'Их',
            damage: { hasDamage: true, desc: 'Тийм (Өсгий)' },
            photos: [
                'https://images.unsplash.com/photo-1520639889456-78443213ecdc?w=200',
            ]
        }
    ] as OrderItem[]
};

const STEP_LABELS = [
    'Захиалгын мэдээлэл шалгах',
    'Үлдэгдэл төлбөр шалгах / төлөх',
    'Сэтгэл ханамжийн санал асуулга',
    'Хүлээлгэн өгсөн'
];

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Бэлэн', icon: 'payments', color: 'bg-green-500' },
    { id: 'card', label: 'Карт', icon: 'credit_card', color: 'bg-blue-500' },
    { id: 'qpay', label: 'QPAY', icon: 'qr_code_2', color: 'bg-red-500' },
    { id: 'bank', label: 'Дансаар', icon: 'account_balance', color: 'bg-indigo-500' },
    { id: 'candy', label: 'Candy', icon: 'stars', color: 'bg-pink-500' },
    { id: 'voucher', label: 'Эрхийн бичиг', icon: 'confirmation_number', color: 'bg-orange-500' },
    { id: 'gift', label: 'Бэлгийн карт', icon: 'card_giftcard', color: 'bg-purple-500' },
    { id: 'nomin', label: 'Номин', icon: 'shopping_bag', color: 'bg-teal-500' },
    { id: 'pocket', label: 'Pocket', icon: 'account_balance_wallet', color: 'bg-cyan-500' },
    { id: 'storepay', label: 'storepay', icon: 'shopping_cart', color: 'bg-emerald-500' },
    { id: 'barter', label: 'Бартер', icon: 'swap_horiz', color: 'bg-gray-500' },
];

const ReceiveDetailScreen: React.FC = () => {
    const { id, step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);

    // Централизован тооцоолол
    const calculations = React.useMemo(() => {
        let originalTotal = 0;
        let cancelledTotal = 0;

        MOCK_ORDER.items.forEach(item => {
            item.services.forEach(service => {
                originalTotal += service.price;
                if (service.status === 'CANCELLED' || item.status === 'CANCELLED') {
                    cancelledTotal += service.price;
                }
            });
        });

        const revisedTotal = originalTotal - cancelledTotal;
        const discount = MOCK_ORDER.payment.discount || 0;
        const pointsUsed = MOCK_ORDER.payment.pointsUsed || 0;
        const vat = Math.round(revisedTotal * 0.1);
        const finalTotal = revisedTotal + vat - discount - pointsUsed;
        const paidAmount = MOCK_ORDER.payment.paid || 0;
        const remaining = Math.max(0, finalTotal - paidAmount);

        return {
            originalTotal,
            cancelledTotal,
            revisedTotal,
            vat,
            finalTotal,
            remaining,
            paidAmount,
            discount,
            pointsUsed
        };
    }, []);

    const [isProcessing, setIsProcessing] = useState(false);

    // Step 1 states
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const step1Valid = checked1 && checked2;

    // Step 2 states
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [receivedAmount, setReceivedAmount] = useState('');
    const finalTotalToPay = calculations.remaining;
    const changeAmount = Math.max(0, (parseInt(receivedAmount) || 0) - finalTotalToPay);
    const isStep2Ready = selectedMethod === 'cash' ? (parseInt(receivedAmount) || 0) >= finalTotalToPay : !!selectedMethod;
    const [isPaid, setIsPaid] = useState(false);

    const handleNext = () => {
        if (currentStep === 1 && !step1Valid) return;
        if (currentStep === 2 && !isPaid && calculations.remaining > 0) return;

        if (currentStep < 4) {
            navigate(`/pos/receive/${id}/step/${currentStep + 1}`);
        } else {
            navigate('/pos/receive');
        }
    };

    const handleBack = () => {
        if (isProcessing) return;
        if (currentStep > 1) {
            navigate(`/pos/receive/${id}/step/${currentStep - 1}`);
        } else {
            navigate('/pos/receive');
        }
    };

    const handlePaymentAction = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsPaid(true);
            setIsProcessing(false);
        }, 1500);
    };

    // UI Render functions
    const renderStepIndicator = () => (
        <div className="bg-white border-b border-gray-100 flex flex-col items-center py-6 shrink-0">
            <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: 4 }).map((_, i) => {
                    const stepNum = i + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;
                    return (
                        <React.Fragment key={stepNum}>
                            {i > 0 && (
                                <div className={`w-12 h-0.5 ${stepNum <= currentStep ? 'bg-primary' : 'bg-gray-100'}`} />
                            )}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${isActive ? 'bg-primary border-primary text-white shadow-lg ring-4 ring-primary/10' :
                                isCompleted ? 'bg-white border-primary text-primary' : 'bg-gray-50 border-gray-200 text-gray-300'
                                }`}>
                                {isCompleted ? <span className="material-icons-round text-sm">check</span> : stepNum}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                STEP {currentStep} — {STEP_LABELS[currentStep - 1]}
            </p>
        </div>
    );

    const renderStep1 = () => (
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
                        <div className="h-6 w-1 bg-[#40C1C7] rounded-sm shrink-0"></div>
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
                        <div className="h-6 w-1 bg-[#40C1C7] rounded-sm shrink-0"></div>
                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Төлбөрийн мэдээлэл</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Анхны дүн</span>
                            <span className="font-black text-gray-800 leading-none">{calculations.originalTotal.toLocaleString()}₮</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-red-500 uppercase tracking-widest text-[9px]">Цуцлагдсан үйлчилгээ</span>
                            <span className="font-black text-red-500 leading-none">-{calculations.cancelledTotal.toLocaleString()}₮</span>
                        </div>
                        <div className="flex justify-between text-xs pt-2 border-t border-gray-50">
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-[9px]">Төлсөн дүн</span>
                            <span className="font-black text-gray-800 leading-none">{calculations.paidAmount.toLocaleString()}₮</span>
                        </div>
                        <div className="flex justify-between items-end pt-4">
                            <span className="font-black text-gray-800 uppercase tracking-widest text-[11px]">Үлдэгдэл</span>
                            <span className="text-3xl font-black text-primary tracking-tighter leading-none">{calculations.remaining.toLocaleString()}₮</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Breakdown */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-visible">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1 bg-[#40C1C7] rounded-sm shrink-0"></div>
                            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Захиалгын задаргаа</h3>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {MOCK_ORDER.items.map((item, idx) => (
                            <div key={item.id} className={`p-8 group hover:bg-gray-50/50 transition-all duration-300 ${item.status === 'CANCELLED' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-2xl font-black text-gray-200">{idx + 1}.</span>
                                            <h4 className="text-xl font-black text-gray-800 tracking-tight">{item.name}</h4>
                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-tight ${item.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                                                }`}>
                                                <span className={`w-1 h-1 rounded-full ${item.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {item.status === 'COMPLETED' ? 'Болсон' : 'Буцаагдсан'}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.services.map(s => {
                                                const isServiceCancelled = s.status === 'CANCELLED' || item.status === 'CANCELLED';
                                                return (
                                                    <span key={s.name} className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border flex items-center gap-2 ${isServiceCancelled
                                                        ? 'bg-gray-50 text-gray-400 border-gray-100 italic line-through'
                                                        : 'bg-primary/5 text-primary border-primary/10'
                                                        }`}>
                                                        {s.name}
                                                        {isServiceCancelled && <span className="text-[9px] font-normal">(цуцлагдсан)</span>}
                                                    </span>
                                                );
                                            })}
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
                                            {item.photos.slice(0, 3).map((p, pi) => (
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
                        <label onClick={() => setChecked1(!checked1)} className="flex items-center gap-4 cursor-pointer p-4 bg-white/40 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-yellow-200 group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked1 ? 'bg-yellow-400 border-yellow-400 shadow-lg' : 'bg-white border-yellow-200'}`}>
                                {checked1 && <span className="material-icons-round text-white text-sm font-bold">check</span>}
                            </div>
                            <span className="text-[13px] font-bold text-gray-700">Хэрэглэгч захиалгаа бүрэн бүтэн хүлээн авсан</span>
                        </label>
                        <label onClick={() => setChecked2(!checked2)} className="flex items-center gap-4 cursor-pointer p-4 bg-white/40 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-yellow-200 group">
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

    const renderStep2 = () => (
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-8 pb-32 animate-in fade-in duration-500 overflow-visible">
            {/* Left Column: Payment Methods (60%) */}
            <div className="lg:w-[60%] flex flex-col gap-6 overflow-visible">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm shrink-0"></div>
                    <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Төлбөрийн хэрэгсэл</h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 p-1">
                    {PAYMENT_METHODS.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => !isPaid && setSelectedMethod(method.id)}
                            className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group ${selectedMethod === method.id
                                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm'
                                } ${isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${method.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <span className="material-icons-round text-2xl">{method.icon}</span>
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-wider ${selectedMethod === method.id ? 'text-primary' : 'text-gray-500'}`}>
                                {method.label}
                            </span>
                            {selectedMethod === method.id && (
                                <div className="absolute top-3 right-3">
                                    <span className="material-icons-round text-primary text-base">check_circle</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Conditional Inputs (Synced with Step6Payment) */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Авах дүн</label>
                            <div className="text-4xl font-black text-gray-800 tracking-tighter">₮ {calculations.remaining.toLocaleString()}</div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Авсан дүн</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    disabled={selectedMethod !== 'cash' || isPaid}
                                    placeholder="0"
                                    value={selectedMethod === 'cash' ? receivedAmount : calculations.remaining}
                                    onChange={(e) => setReceivedAmount(e.target.value)}
                                    className="w-full text-3xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all tracking-tighter"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">₮</div>
                            </div>
                        </div>
                    </div>

                    {selectedMethod === 'cash' && receivedAmount && (
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${changeAmount > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <span className="material-icons-round">toll</span>
                                </div>
                                <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Хариулт:</span>
                            </div>
                            <div className={`text-3xl font-black tracking-tighter ${changeAmount > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                                ₮ {changeAmount.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Summary (40%) */}
            <div className="lg:w-[40%] flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-xl border border-primary/5 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-6 w-1 bg-[#40C1C7] rounded-sm shrink-0"></div>
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн хураангуй</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex justify-between items-end pb-8 border-b border-gray-50">
                                <span className="text-sm font-bold text-gray-500 font-bold">Нийт төлөх дүн</span>
                                <div className="text-5xl font-black text-primary tracking-tighter italic">
                                    ₮ {calculations.remaining.toLocaleString()}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 space-y-5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Сонгосон:</span>
                                    <span className="text-gray-800 font-black flex items-center gap-2 uppercase tracking-tight">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] ${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.color}`}>
                                            <span className="material-icons-round">{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.icon}</span>
                                        </div>
                                        {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Төлөв:</span>
                                    {isPaid ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            Төлбөр төлөгдсөн
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            Төлбөр хүлээгдэж буй
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!isStep2Ready || isProcessing || isPaid}
                            onClick={handlePaymentAction}
                            className={`w-full mt-10 py-6 rounded-2xl text-base font-black tracking-tight shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${isStep2Ready && !isProcessing && !isPaid
                                ? 'bg-[#FFD400] text-gray-900 shadow-yellow-200/50 hover:bg-[#FFC400] cursor-pointer'
                                : isPaid
                                    ? 'bg-green-500 text-white shadow-green-200/30 cursor-default'
                                    : 'bg-gray-100 text-gray-300 border-gray-50 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isProcessing ? (
                                <span className="material-icons-round animate-spin text-2xl">sync</span>
                            ) : isPaid ? (
                                <>
                                    <span className="material-icons-round">check_circle</span>
                                    АМЖИЛТТАЙ
                                </>
                            ) : (
                                <>
                                    <span className="material-icons-round">task_alt</span>
                                    ТӨЛБӨР БАТАЛГААЖУУЛАХ
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-[24px] border border-blue-100/50 flex items-start gap-4">
                    <span className="material-icons-round text-blue-400 text-lg">info</span>
                    <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wider leading-relaxed">
                        Төлбөр баталгаажсаны дараа 영수증(Receipt) 출력 팝업이 나타나며, 확인 후 주문 목록으로 자동 이동합니다.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="max-w-[1440px] mx-auto p-12 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[500px]">
            <span className="material-icons-round text-gray-200 text-6xl mb-6">poll</span>
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">Сэтгэл ханамжийн санал асуулга</h2>
            <p className="text-gray-400 font-bold mb-12">Үйлчилгээ болон гүйцэтгэлд өгөх үнэлгээ</p>
            <div className="w-full max-w-lg bg-gray-50 rounded-2xl p-8 border border-gray-100 italic text-center text-gray-400">
                Судалгааны UI хөгжүүлэгдэж байна...
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="max-w-[1440px] mx-auto p-12 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[500px]">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/30">
                <span className="material-icons-round text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Хүлээлгэн өгсөн / Гомдол</h2>
            <p className="text-gray-400 font-bold mb-12">Захиалга амжилттай хүлээлгэн өгөгдлөө</p>
            <button onClick={() => navigate('/pos/receive')} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                Жагсаалт руу буцах
            </button>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-[#F3F6F9] overflow-hidden">
            {renderStepIndicator()}

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
            </div>

            <div className="bg-white border-t border-gray-100 p-4 md:px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-[20] shrink-0">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-icons-round text-lg">west</span>
                        БУЦАХ
                    </button>

                    <button
                        className="px-8 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-icons-round text-lg">print</span>
                        КАСС БАРИМТ ДАХИН ХЭВЛЕХ
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={(currentStep === 1 && !step1Valid) || (currentStep === 2 && !isPaid && calculations.remaining > 0) || isProcessing}
                        className={`px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-yellow-200/50 ${((currentStep === 1 && !step1Valid) || (currentStep === 2 && !isPaid && calculations.remaining > 0))
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-[#FFD400] text-gray-900 hover:bg-[#FFC400]'
                            }`}
                    >
                        {isProcessing ? (
                            <span className="material-icons-round animate-spin text-lg text-gray-900">sync</span>
                        ) : (
                            <>
                                <span>{currentStep === 4 ? 'ДУУСГАХ' : 'ДАРААГИЙН АЛХАМ'}</span>
                                <span className="material-icons-round text-lg">east</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiveDetailScreen;
