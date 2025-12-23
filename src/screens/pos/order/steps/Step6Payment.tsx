import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
    id: string;
    label: string;
    icon: string;
    color: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'cash', label: 'Belen (Бэлэн)', icon: 'payments', color: 'bg-green-500' },
    { id: 'card', label: 'Kart (Карт)', icon: 'credit_card', color: 'bg-blue-500' },
    { id: 'qpay', label: 'QPAY', icon: 'qr_code_2', color: 'bg-red-500' },
    { id: 'bank', label: 'Dansaar (Дансаар)', icon: 'account_balance', color: 'bg-indigo-500' },
    { id: 'candy', label: 'Candy', icon: 'stars', color: 'bg-pink-500' },
    { id: 'voucher', label: 'Эрхийн бичиг', icon: 'confirmation_number', color: 'bg-orange-500' },
    { id: 'gift', label: 'Бэлгийн карт', icon: 'card_giftcard', color: 'bg-purple-500' },
    { id: 'nomin', label: 'Номин', icon: 'shopping_bag', color: 'bg-teal-500' },
    { id: 'pocket', label: 'Pocket', icon: 'account_balance_wallet', color: 'bg-cyan-500' },
    { id: 'storepay', label: 'storepay', icon: 'shopping_cart', color: 'bg-emerald-500' },
    { id: 'barter', label: 'Бартер', icon: 'swap_horiz', color: 'bg-gray-500' },
];

const Step6Payment: React.FC = () => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState<string>('cash');
    const [receivedAmount, setReceivedAmount] = useState<string>('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Final total passed from Step 5 (Mocked for now)
    const finalTotal = 43900;
    const changeAmount = Math.max(0, (parseInt(receivedAmount) || 0) - finalTotal);
    const isReadyToPay = selectedMethod === 'cash' ? (parseInt(receivedAmount) || 0) >= finalTotal : !!selectedMethod;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment logic
        setTimeout(() => {
            setIsProcessing(false);
            setShowReceipt(true);
        }, 1500);
    };

    const handleFinish = () => {
        navigate('/pos/orders');
    };

    return (
        <div className="max-w-7xl mx-auto w-full p-4 h-full flex flex-col lg:flex-row gap-8 overflow-hidden">
            {/* Left Column: Payment Methods (60%) */}
            <div className="lg:w-[60%] flex flex-col gap-6 overflow-y-auto pr-4 pb-24">
                <h1 className="text-xl font-bold text-gray-800 uppercase">Төлбөрийн хэрэгсэл</h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${selectedMethod === method.id
                                    ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                    : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${method.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <span className="material-icons-round">{method.icon}</span>
                            </div>
                            <span className={`text-xs font-bold ${selectedMethod === method.id ? 'text-primary' : 'text-gray-500'}`}>
                                {method.label}
                            </span>
                            {selectedMethod === method.id && (
                                <div className="absolute top-2 right-2">
                                    <span className="material-icons-round text-primary text-sm">check_circle</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Conditional Inputs */}
                {selectedMethod === 'cash' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Авах дүн</label>
                                <div className="text-3xl font-black text-gray-800">₮ {finalTotal.toLocaleString()}</div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Авсан дүн</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        autoFocus
                                        placeholder="0"
                                        value={receivedAmount}
                                        onChange={(e) => setReceivedAmount(e.target.value)}
                                        className="w-full text-2xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 focus:outline-none focus:border-primary focus:bg-white transition-all"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₮</div>
                                </div>
                            </div>
                        </div>

                        {receivedAmount && (
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${changeAmount > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <span className="material-icons-round">toll</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-500">Хариулт:</span>
                                </div>
                                <div className={`text-3xl font-black ${changeAmount > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                                    ₮ {changeAmount.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {selectedMethod === 'qpay' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 mt-4 flex flex-col items-center gap-6 animate-in fade-in duration-300 text-center">
                        <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center relative">
                            <span className="material-icons-round text-gray-200 text-6xl">qr_code_2</span>
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
                                <span className="material-icons-round text-primary animate-spin text-4xl mb-3">sync</span>
                                <p className="text-xs font-bold text-primary">QR үүсгэж байна...</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">Төлбөр хүлээж байна</p>
                            <p className="text-[11px] text-gray-400 mt-1">Төлбөр хийгдсэний дараа автоматаар баталгаажна.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Summary (40%) */}
            <div className="lg:w-[40%] flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-xl border border-primary/5 overflow-hidden">
                    <div className="p-8">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Төлбөрийн хураангуй</h3>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end pb-6 border-b border-gray-50">
                                <span className="text-sm font-bold text-gray-500">Нийт төлөх дүн</span>
                                <div className="text-4xl font-black text-primary tracking-tighter">
                                    ₮ {finalTotal.toLocaleString()}
                                </div>
                            </div>

                            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold">Сонгосон:</span>
                                    <span className="text-gray-800 font-black flex items-center gap-2">
                                        <span className="material-icons-round text-primary text-sm">
                                            {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.icon}
                                        </span>
                                        {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold">Төлөв:</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[9px] font-black uppercase tracking-wider">
                                        Төлбөр хүлээгдэж буй
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!isReadyToPay || isProcessing}
                            onClick={handlePayment}
                            className={`w-full mt-10 py-5 rounded-2xl text-base font-black tracking-tight shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isReadyToPay && !isProcessing
                                    ? 'bg-primary text-white shadow-primary/30 hover:bg-primary-dark cursor-pointer'
                                    : 'bg-gray-100 text-gray-300 border-gray-50 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isProcessing ? (
                                <span className="material-icons-round animate-spin text-2xl">sync</span>
                            ) : (
                                <>
                                    <span className="material-icons-round">task_alt</span>
                                    Төлбөр баталгаажуулах
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-4">
                    <span className="material-icons-round text-blue-400 text-lg">info</span>
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                        Төлбөр баталгаажсаны дараа 영수증(Receipt) 출력 팝업이 나타나며, 확인 후 주문 목록으로 자동 이동합니다.
                    </p>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300 flex flex-col">
                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Төлбөр амжилттай</h3>
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                                <span className="material-icons-round text-sm">check</span>
                            </div>
                        </div>

                        {/* Receipt Content Placeholder */}
                        <div className="p-8 bg-white flex flex-col items-center">
                            <div className="w-full bg-gray-50/50 rounded-xl border border-gray-100 p-6 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                                    <span className="material-icons-round text-gray-300 text-3xl">print</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-gray-800">Бэлтгэл дууслаа</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Баримтыг хэвлэх эсвэл хадгална уу.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex flex-col gap-3">
                            <button className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/30 flex items-center justify-center gap-3 hover:bg-primary-dark transition-colors">
                                <span className="material-icons-round text-sm">print</span>
                                Баримт хэвлэх (80mm)
                            </button>
                            <button className="w-full py-4 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl text-xs font-black hover:bg-gray-100 transition-colors flex items-center justify-center gap-3">
                                <span className="material-icons-round text-sm">picture_as_pdf</span>
                                PDF хадгалах
                            </button>
                            <button
                                onClick={handleFinish}
                                className="w-full py-3 mt-2 text-[11px] font-bold text-gray-400 hover:text-gray-800 transition-colors underline decoration-dotted"
                            >
                                Дуусгах (Жагсаалт руу буцах)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step6Payment;
