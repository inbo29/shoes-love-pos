import React, { useState, useEffect } from 'react';
import type { ReceiveOrder, ItemDecision } from '../receiveTypes';

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Бэлэн', icon: 'payments', color: 'bg-green-500' },
    { id: 'card', label: 'Карт', icon: 'credit_card', color: 'bg-blue-500' },
    { id: 'qpay', label: 'QPAY', icon: 'qr_code_2', color: 'bg-red-500' },
];

interface Transaction {
    id: number; date: string; type: string; amount: number;
}

interface Props {
    orderData: ReceiveOrder;
    itemDecisions: ItemDecision[];
    calculations: {
        receiveTotal: number;
        refundTotal: number;
        reorderTotal: number;
        currentPayment: number;
    };
    onPaymentComplete: (complete: boolean) => void;
}

const ReceiveStep3Payment: React.FC<Props> = ({
    orderData,
    itemDecisions,
    calculations,
    onPaymentComplete
}) => {
    const [selectedMethod, setSelectedMethod] = useState<string>('cash');
    const [amountStr, setAmountStr] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<Transaction[]>([]);

    const [noVat, setNoVat] = useState(false);
    const [billingType, setBillingType] = useState<'individual' | 'company'>('individual');

    const remaining = Math.max(0, calculations.currentPayment - paymentHistory.reduce((s, t) => s + t.amount, 0));
    const isPaidFull = remaining === 0;

    useEffect(() => {
        onPaymentComplete(isPaidFull);
    }, [isPaidFull, onPaymentComplete]);

    // Auto-complete if 0 payment
    useEffect(() => {
        if (calculations.currentPayment <= 0) {
            onPaymentComplete(true);
        }
    }, [calculations.currentPayment]);

    const inputValue = amountStr === '' ? 0 : parseInt(amountStr);
    const validToPay = selectedMethod && inputValue > 0 && inputValue <= remaining;

    const handleRegisterPayment = () => {
        if (!validToPay) return;
        setIsProcessing(true);
        setTimeout(() => {
            setPaymentHistory(prev => [...prev, {
                id: Date.now(),
                date: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
                type: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label || '',
                amount: inputValue
            }]);
            setAmountStr('');
            setIsProcessing(false);
        }, 500);
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] gap-0 overflow-hidden">
            {/* LEFT */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-3 md:p-4">
                {isPaidFull || calculations.currentPayment <= 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="p-12 bg-green-50 rounded-3xl border border-green-100 flex flex-col items-center text-center shadow-sm max-w-md w-full">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
                                <span className="material-icons-round text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase mb-3 tracking-tight">
                                {calculations.currentPayment <= 0 ? 'Төлбөр шаардлагагүй' : 'Төлбөр бүрэн хийгдлээ'}
                            </h2>
                            <p className="text-gray-500 text-xs font-bold max-w-sm leading-relaxed">
                                {calculations.currentPayment <= 0
                                    ? 'Урьдчилж төлсөн дүн хүрэлцэхүйц байна.'
                                    : 'Дараагийн алхамд шилжих боломжтой.'
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {/* Payment History */}
                        {paymentHistory.length > 0 && (
                            <div className="bg-blue-50/80 rounded-2xl border border-blue-100 p-4">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Төлбөрийн түүх</span>
                                <div className="mt-2 space-y-1.5">
                                    {paymentHistory.map(tx => (
                                        <div key={tx.id} className="flex justify-between text-xs">
                                            <span className="font-bold text-blue-700">{tx.type} ({tx.date})</span>
                                            <span className="font-black text-blue-600">- {tx.amount.toLocaleString()}₮</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Methods */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Төлбөр хийх</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative group ${selectedMethod === method.id
                                            ? 'border-secondary bg-secondary/5 shadow-md scale-[1.02]'
                                            : 'border-gray-100 bg-white hover:border-secondary/30'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${method.color} shadow-sm`}>
                                            <span className="material-icons-round text-xl">{method.icon}</span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {method.label}
                                        </span>
                                        {selectedMethod === method.id && (
                                            <div className="absolute top-2 right-2">
                                                <span className="material-icons-round text-secondary text-sm">check_circle</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="h-4 w-1 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн тооцоо</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">Үйлчилгээний дүн</span>
                            <span className="font-black text-gray-800">{orderData.payment.total.toLocaleString()}₮</span>
                        </div>
                        {calculations.refundTotal > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-red-500">Буцаалт</span>
                                <span className="font-black text-red-500">- {calculations.refundTotal.toLocaleString()}₮</span>
                            </div>
                        )}
                        {calculations.reorderTotal > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-orange-500">Дахин захиалга</span>
                                <span className="font-black text-orange-500">- {calculations.reorderTotal.toLocaleString()}₮</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">Урьдчилж төлсөн</span>
                            <span className="font-black text-green-600">- {orderData.payment.paid.toLocaleString()}₮</span>
                        </div>

                        {paymentHistory.map(tx => (
                            <div key={tx.id} className="flex justify-between text-xs">
                                <span className="font-bold text-gray-500 flex items-center gap-1">
                                    <span className="text-[8px] text-primary">●</span>
                                    {tx.type} ({tx.date})
                                </span>
                                <span className="font-black text-green-600">- {tx.amount.toLocaleString()}₮</span>
                            </div>
                        ))}

                        <div className="w-full h-px bg-gray-200 mt-2" />

                        <div className="flex justify-between items-end pt-3">
                            <span className="font-black text-gray-800 uppercase tracking-widest text-[10px]">Үлдэгдэл</span>
                            <span className="text-2xl font-black text-primary tracking-tighter leading-none">{remaining.toLocaleString()}₮</span>
                        </div>
                    </div>

                    {remaining > 0 && (
                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Төлөх дүн</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder={remaining.toString()}
                                        value={amountStr}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (isNaN(val)) setAmountStr('');
                                            else if (val <= remaining) setAmountStr(e.target.value);
                                        }}
                                        className="w-full text-xl font-black bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:bg-white transition-all tracking-tighter text-gray-800"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 font-black text-base">₮</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">
                                        Сонгосон: {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label}
                                    </span>
                                    <button onClick={() => setAmountStr(remaining.toString())} className="text-[8px] font-bold text-primary uppercase hover:underline">
                                        Бүгдийг төлөх
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={!validToPay || isProcessing}
                                onClick={handleRegisterPayment}
                                className={`w-full py-4 rounded-xl text-sm font-black tracking-tight shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${validToPay && !isProcessing
                                    ? 'bg-secondary text-gray-900 shadow-secondary/50 hover:bg-yellow-400 cursor-pointer'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="material-icons-round animate-spin text-xl">sync</span>
                                ) : (
                                    <>
                                        <span className="material-icons-round text-lg">add_circle</span>
                                        ТӨЛБӨР БҮРТГЭХ
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Options */}
                    <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" checked={noVat} onChange={e => setNoVat(e.target.checked)} className="sr-only" />
                                <div className={`w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center ${noVat ? 'border-secondary bg-secondary' : 'border-gray-200 bg-white group-hover:border-secondary/50'}`}>
                                    {noVat && <span className="material-icons-round text-gray-900 text-[12px]">done</span>}
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Нөатгүй</span>
                        </label>

                        <div className="flex bg-gray-50 p-1 rounded-lg">
                            <button
                                onClick={() => setBillingType('individual')}
                                className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-md transition-all ${billingType === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >Хувь хүн</button>
                            <button
                                onClick={() => setBillingType('company')}
                                className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-md transition-all ${billingType === 'company' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >Байгууллага</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiveStep3Payment;
