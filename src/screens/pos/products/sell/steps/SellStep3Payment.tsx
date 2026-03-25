import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SelectedProduct } from '../ProductSellFlowScreen';

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Бэлэн', icon: 'payments', color: 'bg-green-500' },
    { id: 'card', label: 'Карт', icon: 'credit_card', color: 'bg-blue-500' },
    { id: 'qpay', label: 'QPAY', icon: 'qr_code_2', color: 'bg-red-500' },
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

    const [noVat, setNoVat] = useState(false);
    const [billingType, setBillingType] = useState<'individual' | 'company'>('individual');
    const [showCompanyPopup, setShowCompanyPopup] = useState(false);
    const [bizNumber, setBizNumber] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

    const MOCK_COMPANIES: Record<string, string> = {
        '6677207': 'ITWizard LLC'
    };

    const vat = noVat ? 0 : Math.floor(totalAmount * 0.1);
    const finalTotal = totalAmount + vat - discount - pointsUsed;
    const totalPaid = paymentHistory.reduce((sum, tx) => sum + tx.amount, 0);
    const remaining = Math.max(0, finalTotal - totalPaid);
    const isPaidFull = remaining === 0;

    useEffect(() => {
        onValidationChange(isPaidFull);
    }, [isPaidFull, onValidationChange]);

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

    const handleCompanyLookup = () => {
        const company = MOCK_COMPANIES[bizNumber];
        if (company) {
            setSelectedCompany(company);
        } else {
            alert('Байгууллага олдсонгүй');
        }
    };

    const handlePrintReceipt = () => {
        setShowReceiptPrinted(true);
    };

    const handleFinish = () => {
        navigate('/pos/sell');
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] gap-0 overflow-hidden">
            {/* ========== LEFT: Payment Methods ========== */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-3 md:p-4">
                {isPaidFull ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="p-12 bg-green-50 rounded-3xl border border-green-100 flex flex-col items-center text-center shadow-sm max-w-md w-full">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
                                <span className="material-icons-round text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase mb-3 tracking-tight">Төлбөр бүрэн хийгдлээ</h2>
                            <p className="text-gray-500 text-xs font-bold mb-8 max-w-sm leading-relaxed">
                                Таны захиалга баталгаажлаа. Та захиалгаа дуусгах боломжтой.
                            </p>

                            {!showReceiptPrinted ? (
                                <button
                                    onClick={handlePrintReceipt}
                                    className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-800 hover:bg-gray-50 transition-all shadow-md active:scale-95 group"
                                >
                                    <span className="material-icons-round text-lg group-hover:rotate-12 transition-transform">print</span>
                                    Төлбөрийн баримт хэвлэх
                                </button>
                            ) : (
                                <button
                                    onClick={handleFinish}
                                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95"
                                >
                                    <span className="material-icons-round text-lg">done</span>
                                    Дуусгах
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {/* Partial Payment Banner */}
                        {totalPaid > 0 && (
                            <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
                                    <span className="material-icons-round text-xl">info</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-800 uppercase mb-0.5">Төлбөр бүртгэгдлээ</h3>
                                    <p className="text-blue-600/80 text-[10px] font-bold uppercase tracking-wider">
                                        Үлдэгдэл төлбөрөө төлнө үү.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Methods */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                                <h1 className="text-lg font-black text-gray-800 uppercase tracking-tight">Төлбөр хийх</h1>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative group ${selectedMethod === method.id
                                            ? 'border-secondary bg-secondary/5 shadow-md scale-[1.02]'
                                            : 'border-gray-100 bg-white hover:border-secondary/30 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${method.color} shadow-sm group-hover:scale-110 transition-transform`}>
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

            {/* ========== RIGHT: Payment Summary ========== */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="h-4 w-1 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн тооцоо</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">Барааны дүн</span>
                            <span className="font-black text-gray-800">{totalAmount.toLocaleString()} ₮</span>
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className="font-bold text-gray-500">НӨАТ (10%)</span>
                            <span className="font-black text-gray-800">{vat.toLocaleString()} ₮</span>
                        </div>

                        {pointsUsed > 0 && (
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-500">Пойнт ашиглалт</span>
                                <span className="font-black text-blue-500">- {pointsUsed.toLocaleString()} ₮</span>
                            </div>
                        )}

                        {paymentHistory.map(tx => (
                            <div key={tx.id} className="flex justify-between text-xs">
                                <span className="font-bold text-gray-500 flex items-center gap-1">
                                    <span className="text-[8px] text-primary">●</span>
                                    {tx.type} ({tx.date})
                                </span>
                                <span className="font-black text-green-600">- {tx.amount.toLocaleString()} ₮</span>
                            </div>
                        ))}

                        <div className="w-full h-px bg-gray-200 mt-2" />

                        <div className="flex justify-between items-end pt-3">
                            <span className="font-black text-gray-800 uppercase tracking-widest text-[10px]">Үлдэгдэл</span>
                            <span className="text-2xl font-black text-primary tracking-tighter leading-none">{remaining.toLocaleString()} ₮</span>
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
                                        max={remaining}
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
                                    <button
                                        onClick={() => setAmountStr(remaining.toString())}
                                        className="text-[8px] font-bold text-primary uppercase hover:underline"
                                    >
                                        Бүгдийг төлөх
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={!validToPay || isProcessing}
                                onClick={handleRegisterPayment}
                                className={`w-full py-4 rounded-xl text-sm font-black tracking-tight shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${validToPay && !isProcessing
                                    ? 'bg-secondary text-gray-900 shadow-secondary/50 hover:bg-yellow-400 cursor-pointer'
                                    : 'bg-gray-100 text-gray-300 border-gray-50 cursor-not-allowed shadow-none'
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
                                <input
                                    type="checkbox"
                                    checked={noVat}
                                    onChange={(e) => setNoVat(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-4.5 h-4.5 rounded-md border-2 transition-all flex items-center justify-center ${noVat ? 'border-secondary bg-secondary' : 'border-gray-200 bg-white group-hover:border-secondary/50'}`}>
                                    {noVat && <span className="material-icons-round text-gray-900 text-[12px]">done</span>}
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Нөатгүй</span>
                        </label>

                        <div className="flex bg-gray-50 p-1 rounded-lg">
                            <button
                                onClick={() => setBillingType('individual')}
                                className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-md transition-all ${billingType === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Хувь хүн
                            </button>
                            <button
                                onClick={() => {
                                    setBillingType('company');
                                    if (!selectedCompany) setShowCompanyPopup(true);
                                }}
                                className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-wider rounded-md transition-all ${billingType === 'company' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Байгууллага
                            </button>
                        </div>

                        {billingType === 'company' && selectedCompany && (
                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-bold text-gray-900 uppercase">Сонгосон байгууллага</p>
                                        <p className="text-[10px] font-black text-gray-800">{selectedCompany}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowCompanyPopup(true)}
                                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-sm hover:scale-110 transition-transform"
                                    >
                                        <span className="material-icons-round text-sm">edit</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Company Search Popup */}
            {showCompanyPopup && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Байгууллагын мэдээлэл</h3>
                                <button onClick={() => setShowCompanyPopup(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <span className="material-icons-round">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Регистрийн №</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={bizNumber}
                                            onChange={(e) => setBizNumber(e.target.value)}
                                            placeholder="Регистрийн дугаар..."
                                            className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:bg-white transition-all font-black text-gray-800"
                                        />
                                        <button
                                            onClick={handleCompanyLookup}
                                            className="px-5 rounded-xl bg-secondary text-gray-900 font-black text-xs uppercase shadow-lg shadow-secondary/30 active:scale-95 transition-all hover:bg-yellow-400"
                                        >
                                            Шалгах
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Татвар төлөгчийн нэр</label>
                                    <div className="bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-black text-gray-800 min-h-[48px] flex items-center text-sm">
                                        {selectedCompany || <span className="text-gray-300">Байгууллагын нэр энд гарна...</span>}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowCompanyPopup(false)}
                                    disabled={!selectedCompany}
                                    className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-xl active:scale-95 ${selectedCompany ? 'bg-secondary text-gray-900 shadow-secondary/50 hover:bg-yellow-400' : 'bg-gray-100 text-gray-400 border-gray-50 cursor-not-allowed shadow-none'}`}
                                >
                                    Баталгаажуулах
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellStep3Payment;
