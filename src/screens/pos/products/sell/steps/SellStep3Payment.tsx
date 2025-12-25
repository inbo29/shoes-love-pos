import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SelectedProduct } from '../ProductSellFlowScreen';

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Бэлэн', icon: 'payments', color: 'bg-green-500' },
    { id: 'card', label: 'Карт', icon: 'credit_card', color: 'bg-blue-500' },
    { id: 'qpay', label: 'QPAY', icon: 'qr_code_2', color: 'bg-red-500' },
    { id: 'candy', label: 'Candy', icon: 'stars', color: 'bg-pink-500' },
    { id: 'pocket', label: 'Pocket', icon: 'account_balance_wallet', color: 'bg-cyan-500' },
    { id: 'gift', label: 'Бэлгийн карт', icon: 'card_giftcard', color: 'bg-purple-500' },
    { id: 'barter', label: 'Бартер', icon: 'swap_horiz', color: 'bg-gray-500' },
];

interface Transaction {
    id: number;
    date: string;
    type: string;
    amount: number;
}

interface Props {
    selectedProducts: SelectedProduct[];
    totalAmount: number;
    discount: number;
    pointsUsed: number;
    onValidationChange: (isValid: boolean) => void;
}

const SellStep3Payment: React.FC<Props> = ({
    selectedProducts,
    totalAmount,
    discount,
    pointsUsed,
    onValidationChange
}) => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState<string>('cash');
    const [amountStr, setAmountStr] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([]);
    const [showReceiptPrinted, setShowReceiptPrinted] = useState(false);

    const vat = Math.floor(totalAmount * 0.1);
    const finalTotal = totalAmount + vat - discount - pointsUsed;
    const totalPaid = paymentHistory.reduce((sum, tx) => sum + tx.amount, 0);
    const remaining = Math.max(0, finalTotal - totalPaid);
    const isPaidFull = remaining === 0;

    // Notify parent validation state
    useEffect(() => {
        onValidationChange(totalPaid > 0 && showReceiptPrinted);
    }, [totalPaid, showReceiptPrinted, onValidationChange]);

    const inputValue = amountStr === '' ? 0 : parseInt(amountStr);
    const validToPay = selectedMethod && inputValue > 0 && inputValue <= remaining;

    const handleRegisterPayment = () => {
        if (!validToPay) return;
        setIsProcessing(true);
        setTimeout(() => {
            const newTx: Transaction = {
                id: Date.now(),
                date: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
                type: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || 'Төлбөр',
                amount: inputValue
            };
            setPaymentHistory(prev => [...prev, newTx]);
            setAmountStr('');
            setIsProcessing(false);
        }, 600);
    };

    const handlePrintReceipt = () => {
        // Simulate receipt printing
        setShowReceiptPrinted(true);
    };

    const handleFinish = () => {
        // Navigate back to sell screen or product list
        navigate('/pos/sell');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-12 overflow-visible h-full">
            {/* Left Column */}
            <div className="w-full lg:w-[64%] flex flex-col gap-8 overflow-visible min-w-0">
                {isPaidFull ? (
                    /* Full Payment Success Estado */
                    <div className="p-16 bg-green-50 rounded-[40px] border border-green-100 flex flex-col items-center text-center shadow-sm animate-in fade-in zoom-in-95">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8 text-green-600">
                            <span className="material-icons-round text-5xl">check_circle</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 uppercase mb-4 tracking-tight">Төлбөр бүрэн хийгдлээ</h2>
                        <p className="text-gray-500 text-sm font-bold mb-10 max-w-sm leading-relaxed">
                            Таны захиалга баталгаажлаа. Та захиалгаа дуусгах боломжтой.
                        </p>

                        {!showReceiptPrinted ? (
                            <button
                                onClick={handlePrintReceipt}
                                className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-gray-100 rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-gray-800 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-md active:scale-95 group"
                            >
                                <span className="material-icons-round text-xl group-hover:rotate-12 transition-transform">print</span>
                                Төлбөрийн баримт хэвлэх
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95"
                            >
                                <span className="material-icons-round text-xl">done</span>
                                Дуусгах
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* Partial Payment Banner */}
                        {totalPaid > 0 && (
                            <div className="p-8 bg-blue-50/80 backdrop-blur-sm rounded-[32px] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
                                        <span className="material-icons-round text-2xl">info</span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-black text-gray-800 uppercase leading-none mb-1.5 tracking-tight">Төлбөр бүртгэгдлээ</h3>
                                        <p className="text-blue-600/80 text-[11px] font-black uppercase tracking-wider">
                                            Үлдэгдэл төлбөрөө төлнө үү.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Methods */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                                <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Төлбөр хийх</h1>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 p-1">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group ${selectedMethod === method.id
                                            ? 'border-secondary bg-secondary/5 shadow-md scale-[1.02]'
                                            : 'border-gray-100 bg-white hover:border-secondary/30 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${method.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                            <span className="material-icons-round text-2xl">{method.icon}</span>
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-wider ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {method.label}
                                        </span>
                                        {selectedMethod === method.id && (
                                            <div className="absolute top-3 right-3">
                                                <span className="material-icons-round text-secondary text-base">check_circle</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Payment Summary */}
            <div className="w-full lg:w-[36%] shrink-0 flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-xl border border-primary/5 overflow-hidden sticky top-4">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-4 w-1 bg-[#FFD400] rounded-sm"></div>
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн тооцоо</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-500">Барааны дүн</span>
                                <span className="font-black text-gray-800 tracking-tight">{totalAmount.toLocaleString()} ₮</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-500">НӨАТ (10%)</span>
                                <span className="font-black text-gray-800 tracking-tight">{vat.toLocaleString()} ₮</span>
                            </div>

                            {pointsUsed > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-gray-500">Пойнт ашиглалт</span>
                                    <span className="font-black text-blue-500">- {pointsUsed.toLocaleString()} ₮</span>
                                </div>
                            )}

                            {/* Payment History */}
                            {paymentHistory.map(tx => (
                                <div key={tx.id} className="flex justify-between text-sm animate-in fade-in slide-in-from-right-4">
                                    <span className="font-bold text-gray-500 flex items-center gap-1.5">
                                        <span className="text-[10px] text-primary">●</span>
                                        {tx.type} ({tx.date})
                                    </span>
                                    <span className="font-black text-green-600">- {tx.amount.toLocaleString()} ₮</span>
                                </div>
                            ))}

                            <div className="w-full h-px bg-gray-200 mt-2" />

                            <div className="flex justify-between items-end pt-4">
                                <span className="font-black text-gray-800 uppercase tracking-widest text-[11px]">Үлдэгдэл</span>
                                <span className="text-3xl font-black text-primary tracking-tighter leading-none">{remaining.toLocaleString()} ₮</span>
                            </div>
                        </div>

                        {remaining > 0 && (
                            <div className="mt-8 space-y-6">
                                {/* Amount Input */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлөх дүн</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder={remaining.toString()}
                                            value={amountStr}
                                            max={remaining}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (isNaN(val)) setAmountStr('');
                                                else if (val <= remaining) setAmountStr(e.target.value);
                                            }}
                                            className="w-full text-2xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-all tracking-tighter text-gray-800"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-lg">₮</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                                            Сонгосон: {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}
                                        </span>
                                        <button
                                            onClick={() => setAmountStr(remaining.toString())}
                                            className="text-[9px] font-bold text-primary uppercase hover:underline"
                                        >
                                            Бүгдийг төлөх
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={!validToPay || isProcessing}
                                    onClick={handleRegisterPayment}
                                    className={`w-full py-6 rounded-2xl text-base font-black tracking-tight shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${validToPay && !isProcessing
                                        ? 'bg-secondary text-gray-900 shadow-secondary/50 hover:bg-yellow-400 cursor-pointer'
                                        : 'bg-gray-100 text-gray-300 border-gray-50 cursor-not-allowed shadow-none'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <span className="material-icons-round animate-spin text-2xl">sync</span>
                                    ) : (
                                        <>
                                            <span className="material-icons-round">add_circle</span>
                                            ТӨЛБӨР БҮРТГЭХ
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Info Note */}
                        {remaining > 0 && (
                            <div className="mt-6 px-4 py-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                <p className="text-[9px] text-blue-600 font-bold leading-relaxed text-center">
                                    Санамж: Төлбөр бүрэн төлсний дараа баримт хэвлэгдэнэ.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellStep3Payment;
