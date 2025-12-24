import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../../../shared/components/Popup/Popup';

const DENOMINATIONS = [20000, 10000, 5000, 1000, 500, 100, 50, 20, 10, 5];

interface CashSubmissionScreenProps { }

const CashSubmissionScreen: React.FC<CashSubmissionScreenProps> = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState<Record<number, number>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mocked expected totals (from "server")
    const salesTotal = 1500000;
    const orderTotal = 250000;
    const expenseTotal = 15000;
    const expectedTotal = salesTotal + orderTotal - expenseTotal; // Example calculation

    const actualTotal = useMemo(() => {
        return DENOMINATIONS.reduce((sum, den) => {
            return sum + (den * (counts[den] || 0));
        }, 0);
    }, [counts]);

    const canSubmit = actualTotal > 0;

    const handleCountChange = (den: number, val: string) => {
        const num = parseInt(val) || 0;
        if (num < 0) return;
        setCounts(prev => ({ ...prev, [den]: num }));
    };

    const handleSubmit = () => {
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        setIsSubmitting(true);
        setShowConfirm(false);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
        }, 1200);
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/pos/dashboard');
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6 overflow-y-auto md:overflow-hidden h-full bg-gray-50/30 no-scrollbar">
            {/* Left Column: Denominations */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-4 md:p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-tight">Мөнгөний жагсаалт</h2>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Бэлэн мөнгөний бүртгэл
                    </div>
                </div>

                <div className="overflow-y-auto no-scrollbar flex-1">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="px-3 md:px-8 py-4 w-[30%]">Дэвсгэрт</th>
                                <th className="px-3 md:px-8 py-4 w-[40%] text-center">Тоо</th>
                                <th className="px-3 md:px-8 py-4 w-[30%] text-right">Нийт</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {DENOMINATIONS.map((den) => (
                                <tr key={den} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-3 md:px-8 py-4 font-bold text-gray-600 text-[13px] md:text-sm whitespace-nowrap">
                                        {den.toLocaleString()} ₮
                                    </td>
                                    <td className="px-3 md:px-8 py-4">
                                        <div className="flex justify-center">
                                            <input
                                                type="number"
                                                min="0"
                                                value={counts[den] || ''}
                                                onChange={(e) => handleCountChange(den, e.target.value)}
                                                placeholder="0"
                                                className="w-full max-w-[120px] md:max-w-[140px] py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-black text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary transition-all text-sm md:text-base shadow-inner"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-8 py-4 text-right font-black text-gray-900 text-[13px] md:text-base">
                                        {(den * (counts[den] || 0)).toLocaleString()} ₮
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Column: Summary */}
            <div className="w-full md:w-[320px] lg:w-96 flex flex-col gap-6 shrink-0 overflow-y-auto no-scrollbar pb-10">
                {/* Statistics Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                        <span className="material-icons-round text-primary text-xl">payments</span>
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Нийт дүн</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="pt-2">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Бичсэн дүн (Тоологдсон)</div>
                            <div className={`rounded-2xl p-4 border flex items-center justify-between transition-all ${actualTotal > 0
                                ? 'bg-primary/5 border-primary/20 text-primary'
                                : 'bg-gray-50 border-gray-100 text-gray-300'
                                }`}>
                                <span className="material-icons-round">account_balance_wallet</span>
                                <div className="text-2xl font-black tracking-tighter">
                                    {actualTotal.toLocaleString()} ₮
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="pt-2">
                            {actualTotal > 0 && (
                                <div className="flex items-center gap-3 p-4 rounded-xl border bg-green-50 text-green-600 border-green-100 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                                    <span className="material-icons-round text-lg">check_circle</span>
                                    <div>Мөнгө тушаахад бэлэн байна</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Date & Action Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Мөнгө тушаах огноо</label>
                        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-600 flex items-center gap-3">
                            <span className="material-icons-round text-gray-300 text-lg">calendar_today</span>
                            {new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}
                        </div>
                    </div>

                    <button
                        disabled={!canSubmit || isSubmitting}
                        onClick={handleSubmit}
                        className={`w-full py-5 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${canSubmit && !isSubmitting
                            ? 'bg-secondary text-[#111827] shadow-secondary/30 hover:bg-yellow-400 cursor-pointer'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="material-icons-round animate-spin text-2xl">sync</span>
                        ) : (
                            <>
                                <span className="material-icons-round">task_alt</span>
                                Тушаах
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                        * Тушаах товчийг дарж гүйлгээг баталгаажуулна уу.
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 text-center space-y-4">
                            <div className="w-20 h-20 bg-secondary rounded-full mx-auto flex items-center justify-center mb-4 text-[#111827] shadow-lg shadow-secondary/30">
                                <span className="material-icons-round text-4xl">payments</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-800">Мөнгө тушаах</h3>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Тушаах дүн</p>
                                <p className="text-2xl font-black text-gray-900">{actualTotal.toLocaleString()} ₮</p>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                Та мэдээллээ шалгасан уу?<br />Та итгэлтэй байна уу?
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest"
                            >
                                Буцах
                            </button>
                            <button
                                onClick={confirmSubmit}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 uppercase tracking-widest"
                            >
                                Тийм
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            <Popup
                isOpen={showSuccess}
                onClose={handleSuccessClose}
                type="success"
                title="Амжилттай"
                message="Мөнгө амжилттай тушаагдлаа."
            />
        </div>
    );
};

export default CashSubmissionScreen;
