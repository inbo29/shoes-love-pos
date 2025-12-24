import React, { useState } from 'react';

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

interface Transaction {
    id: number;
    date: string;
    type: string;
    description: string;
    amount: number;
    isMinus: boolean;
}

// Mock initial history
const INITIAL_HISTORY: Transaction[] = [
    { id: 1, date: '2023.10.20', type: '💵 Бэлэн', description: 'Анхны төлбөр', amount: 30000, isMinus: false },
    { id: 2, date: '2023.10.20', type: '⭐ Point', description: 'Ашигласан', amount: 15000, isMinus: true }, // Point used effectively acts as a payment/descrease of debt, wait, "used" point means user paid with points. 
    // In the User Request table: 
    // 2023.10.20 💵 Бэлэн Анхны төлбөр +30,000  (Paid)
    // 2023.10.20 ⭐ Point Ашигласан -15,000 (Discount/Usage?)
    // This table logic in prompt is a bit confusing on signs. 
    // Usually: Service Total (Positive Debt). Payment (Credit).
    // Prompt says: "Remaining Payment" = Service - Discount - Points - All Payments.
    // Let's stick to the prompt's visual table example:
    // +30000 (Paid), -15000 (Used Point? Wait, used point reduces balance? Yes. But wait, is +30000 reducing balance too? Yes.)
    // Let's assume all entries in this table reduce the outstanding amount unless specified.
    // Or maybe the table just lists events. 
    // Let's follow the "Settlement Summary" logic:
    // Service Amount: 38,900
    // Discount: -3,890
    // Point: -15,000
    // Pre-paid: - ? (Auto calc)
    // Remaining: Calculation.

    // So History should likely show all credits.
];

interface Step2PaymentProps {
    onPaymentComplete: (isComplete: boolean) => void;
}

const Step2Payment: React.FC<Step2PaymentProps> = ({ onPaymentComplete }) => {
    const [selectedMethod, setSelectedMethod] = useState<string>('cash');
    const [amountStr, setAmountStr] = useState<string>('');
    const [isPointUsed, setIsPointUsed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Derived State from Mock Data
    const serviceTotal = 38900;
    const discount = 3890;
    const pointsUsedPrevious = 15000;
    const prePaid = 0; // Calculated from history?

    // Calculate remaining
    // For now, let's just use the values to match the prompt example:
    // Service: 38900
    // Discount: -3890
    // Point: -15000
    // Paid: 0 (Let's say)
    // Remaining = 38900 - 3890 - 15000 - 0 = 20010

    const [history, setHistory] = useState<Transaction[]>([
        { id: 1, date: '2023.10.20', type: '💵 Бэлэн', description: 'Урьдчилгаа', amount: 5000, isMinus: false }
    ]);

    const totalPaid = history.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = Math.max(0, serviceTotal - discount - pointsUsedPrevious - totalPaid);

    const inputValue = amountStr === '' ? '' : parseInt(amountStr);
    const changeAmount = inputValue ? Math.max(0, inputValue - remaining) : 0;

    // Determine if input is valid
    const isValidAmount = inputValue && inputValue > 0 && inputValue <= remaining + (selectedMethod === 'cash' ? 100000 : 0); // Allow overpay for cash change? "Modification possible (<= Balance)" says Prompt. Overpay for cash -> change.
    // Prompt says: "Modification possible (<= Balance)". "Excess input X".
    // Usually for Cash, you input what user GAVE, and calculate change.
    // But specific rule: "Modification (<= Balance)". Maybe it means the *recorded* payment amount cannot exceed balance?
    // Let's assume for Cash we input Tendered Amount, but for others we input exact amount.
    // Actually, prompt says: "Input Payment Amount. Default = Remaining. .. Excess Input X".
    // This implies we can't pay MORE than remaining. 
    // For cash, if user gives 20000 for 15000 debt, we record 15000 payment and give 5000 change.
    // I will implement "Tendered" concept for Cash, but "Amount to Pay" for others.
    // Let's stick to "Amount to Pay" to be safe with "Excess Input X".

    const validToSubmit = selectedMethod && inputValue && inputValue > 0 && inputValue <= remaining;

    const handleConfirm = () => {
        if (!validToSubmit) return;
        setIsProcessing(true);
        setTimeout(() => {
            // Add to history
            const newTx: Transaction = {
                id: Date.now(),
                date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
                type: PAYMENT_METHODS.find(m => m.id === selectedMethod)?.label.split(' ')[0] || 'Payment',
                description: 'Нэмэлт төлбөр',
                amount: inputValue as number,
                isMinus: false
            };
            setHistory(prev => [...prev, newTx]);
            setAmountStr('');
            setIsProcessing(false);
            // If remaining becomes 0, maybe notify parent?
            if (remaining - (inputValue as number) <= 0) {
                // onPaymentComplete(true); // Maybe not auto-advance, user clicks Next manually? 
                // User said "Condition: Amount=0 X". 
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-12 overflow-visible relative">

            <div className="w-full lg:w-[64%] flex flex-col gap-8 overflow-visible min-w-0">
                {/* Left Column (Main Content) */}
                {/* Payment History Timeline */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-icons-round text-primary">history</span>
                        <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">Төлбөрийн түүх</h3>
                    </div>

                    <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gray-100">
                        {/* Static Past Entries (Mock) */}
                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-gray-200 ring-4 ring-white" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400">2023.10.20</p>
                                    <p className="text-sm font-bold text-gray-800">🎁 Хөнгөлөлт (Member 10%)</p>
                                </div>
                                <span className="text-sm font-black text-green-500">- {discount.toLocaleString()}₮</span>
                            </div>
                        </div>

                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-gray-200 ring-4 ring-white" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400">2023.10.20</p>
                                    <p className="text-sm font-bold text-gray-800">⭐ Point Ашигласан</p>
                                </div>
                                <span className="text-sm font-black text-green-500">- {pointsUsedPrevious.toLocaleString()}₮</span>
                            </div>
                        </div>

                        {history.map(tx => (
                            <div key={tx.id} className="relative pl-8 animate-in fade-in slide-in-from-left-4">
                                <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-white" />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400">{tx.date}</p>
                                        <p className="text-sm font-bold text-gray-800">{tx.type} — {tx.description}</p>
                                    </div>
                                    <span className="text-sm font-black text-gray-800">+ {tx.amount.toLocaleString()}₮</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Payment Section */}
                {remaining > 0 ? (
                    <div className="flex flex-col gap-6">
                        <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Одоо төлөх</h1>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 p-1">
                            {PAYMENT_METHODS.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group ${selectedMethod === method.id
                                        ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                        : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm'
                                        }`}
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

                        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
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
                                        className="w-full text-3xl font-black bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all tracking-tighter"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">₮</div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Үлдэгдэл: {remaining.toLocaleString()}₮</span>
                                    <button
                                        onClick={() => setAmountStr(remaining.toString())}
                                        className="text-[10px] font-bold text-primary uppercase hover:underline"
                                    >
                                        Бүгдийг төлөх
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 bg-green-50 rounded-[32px] border border-green-100 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 text-green-600">
                            <span className="material-icons-round text-4xl">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase mb-2">Төлбөр бүрэн төлөгдсөн</h2>
                        <p className="text-gray-500 text-sm font-bold">Энэ захиалгын бүх тооцоо хийгдсэн байна.</p>
                    </div>
                )}
            </div>

            {/* Right Column: Settlement Summary (Sticky) - 36% */}
            <div className="w-full lg:w-[36%] shrink-0 flex flex-col gap-6">
                <div className="bg-white rounded-[32px] shadow-xl border border-primary/5 overflow-hidden sticky top-4">
                    <div className="p-8">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-8">Төлбөрийн тооцоо</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-500">Үйлчилгээний дүн</span>
                                <span className="font-black text-gray-800">{serviceTotal.toLocaleString()} ₮</span>
                            </div>
                            <div className="w-full h-px bg-gray-100" />

                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-500">Хөнгөлөлт (10%)</span>
                                <span className="font-black text-red-500">- {discount.toLocaleString()} ₮</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-500">Point ашигласан</span>
                                <span className="font-black text-red-500">- {pointsUsedPrevious.toLocaleString()} ₮</span>
                            </div>
                            <div className="w-full h-px bg-gray-100" />

                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-gray-500">Өмнө төлсөн</span>
                                <span className="font-black text-red-500">- {totalPaid.toLocaleString()} ₮</span>
                            </div>

                            <div className="w-full h-px bg-gray-200" />

                            <div className="flex justify-between items-end pt-2">
                                <span className="font-black text-gray-800 uppercase tracking-widest">Үлдэгдэл төлөх дүн</span>
                                <span className="text-3xl font-black text-primary tracking-tighter">{remaining.toLocaleString()} ₮</span>
                            </div>
                        </div>

                        {remaining > 0 && (
                            <button
                                disabled={!validToSubmit || isProcessing}
                                onClick={handleConfirm}
                                className={`w-full mt-10 py-6 rounded-2xl text-base font-black tracking-tight shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${validToSubmit && !isProcessing
                                    ? 'bg-[#FFD400] text-gray-900 shadow-yellow-200/50 hover:bg-[#FFC400] cursor-pointer'
                                    : 'bg-gray-100 text-gray-300 border-gray-50 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {isProcessing ? (
                                    <span className="material-icons-round animate-spin text-2xl">sync</span>
                                ) : (
                                    <>
                                        <span className="material-icons-round">task_alt</span>
                                        ТӨЛБӨР БАТАЛГААЖУУЛАХ
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    {remaining > 0 && (
                        <div className="px-8 py-6 bg-yellow-50/50 border-t border-yellow-100/50">
                            <div className="flex items-start gap-3">
                                <span className="material-icons-round text-yellow-600 text-lg">warning</span>
                                <p className="text-[10px] text-yellow-700 font-bold leading-relaxed">
                                    Анхааруулга: Илүү төлөлт хийх боломжгүй. Төлбөр хийгдсэний дараа буцаах боломжгүйг анхаарна уу.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step2Payment;
