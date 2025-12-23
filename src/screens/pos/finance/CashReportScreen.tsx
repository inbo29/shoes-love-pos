import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCashReportData, PaymentBreakdown } from '../../../services/mockCashReportData';
import Popup from '../../../shared/components/Popup/Popup';

const CashReportScreen: React.FC = () => {
    const navigate = useNavigate();
    const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
    const [expandedService, setExpandedService] = useState<{ method: string; service: string } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock constants for summary
    const totalSales = 1500000;
    const actualCashSubmitted = 352300; // From previous "Cash Submission" step
    const systemCashRevenue = 352300; // Calculated from mock data
    const isCashMismatch = actualCashSubmitted !== systemCashRevenue;

    const totalsByService = useMemo(() => {
        const services = { Gutal: 0, Chemical: 0, Carpet: 0 };
        mockCashReportData.forEach(p => {
            services.Gutal += p.services.Gutal.total;
            services.Chemical += p.services.Chemical.total;
            services.Carpet += p.services.Carpet.total;
        });
        return services;
    }, []);

    const handleMethodClick = (method: string) => {
        setExpandedMethod(expandedMethod === method ? null : method);
        setExpandedService(null);
    };

    const handleServiceClick = (e: React.MouseEvent, method: string, service: string) => {
        e.stopPropagation();
        if (expandedService?.method === method && expandedService?.service === service) {
            setExpandedService(null);
        } else {
            setExpandedService({ method, service });
        }
    };

    const handleFinalize = () => {
        setShowConfirm(true);
    };

    const confirmFinalize = () => {
        setIsProcessing(true);
        setShowConfirm(false);
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
        }, 1500);
    };

    return (
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 h-full overflow-hidden bg-gray-50/30">
            {/* Header Summary */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-icons-round text-2xl">assessment</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase">Кассын тайлан</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Өдрийн эцсийн нэгтгэл</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Огноо</p>
                        <p className="text-sm font-bold text-gray-700">2025.12.24</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100 hidden sm:block" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Салбар</p>
                        <p className="text-sm font-bold text-gray-700">Shoes Love Төв</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100 hidden sm:block" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ажилтан</p>
                        <p className="text-sm font-bold text-gray-700">Админ</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                {/* Left Column: Breakdown */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-6">
                    <div className="flex items-center justify-between ml-1">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Төлбөрийн дэлгэрэнгүй (Задгай)</h3>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Дарж дэлгэрэнгүйг харна уу</span>
                    </div>

                    {mockCashReportData.map((data) => (
                        <div key={data.method} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
                            <div
                                onClick={() => handleMethodClick(data.method)}
                                className={`p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors ${expandedMethod === data.method ? 'bg-gray-50/80 border-b border-gray-100' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${data.method === 'Бэлэн' ? 'bg-green-100 text-green-600' :
                                        data.method === 'Карт' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                        <span className="material-icons-round">{
                                            data.method === 'Бэлэн' ? 'payments' :
                                                data.method === 'Карт' ? 'credit_card' : 'qr_code_2'
                                        }</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-800 uppercase tracking-tight">{data.method}</h4>
                                        <p className="text-xs font-bold text-gray-400">Захиалгын тоо: {data.count}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-lg font-black text-gray-900 tracking-tighter">{data.total.toLocaleString()} ₮</p>
                                    </div>
                                    <span className={`material-icons-round text-gray-300 transition-transform duration-300 ${expandedMethod === data.method ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            {/* Services Breakdown (Tier 2) */}
                            {expandedMethod === data.method && (
                                <div className="p-4 space-y-2 bg-gray-50/30 animate-in slide-in-from-top-4 duration-300">
                                    {(Object.keys(data.services) as Array<keyof typeof data.services>).map((serviceKey) => {
                                        const service = data.services[serviceKey];
                                        const isExpanded = expandedService?.method === data.method && expandedService?.service === serviceKey;

                                        return (
                                            <div key={serviceKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                                <div
                                                    onClick={(e) => handleServiceClick(e, data.method, serviceKey)}
                                                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50 border-b border-gray-100' : ''}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                        <span className="font-bold text-gray-700">{service.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-gray-800 text-sm">{service.total.toLocaleString()} ₮</span>
                                                        {service.orders && service.orders.length > 0 && (
                                                            <span className={`material-icons-round text-gray-300 text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                                expand_more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Orders Breakdown (Tier 3) */}
                                                {isExpanded && service.orders && (
                                                    <div className="p-3 space-y-1.5 bg-gray-50/50 animate-in slide-in-from-top-2">
                                                        {service.orders.map((order) => (
                                                            <div key={order.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-[10px] font-black text-gray-400 tracking-tighter group-hover:text-primary transition-colors">{order.id}</span>
                                                                    <span className="text-xs font-bold text-gray-600">{order.customer}</span>
                                                                </div>
                                                                <span className="font-black text-gray-900 text-xs tracking-tighter">{order.amount.toLocaleString()} ₮</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Column: Summaries & Action */}
                <div className="w-full md:w-[320px] lg:w-96 flex flex-col gap-6 shrink-0 overflow-y-auto no-scrollbar pb-6">

                    {/* Service Breakdown Summary */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gray-100/50 border-b border-gray-100 flex items-center gap-2">
                            <span className="material-icons-round text-primary text-sm">category</span>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Үйлчилгээний нэгтгэл</h4>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-500">Гутал</span>
                                <span className="font-black text-gray-800 tracking-tight">{totalsByService.Gutal.toLocaleString()} ₮</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-500">Хими цэвэрлэгээ</span>
                                <span className="font-black text-gray-800 tracking-tight">{totalsByService.Chemical.toLocaleString()} ₮</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-500">Хивс цэвэрлэгээ</span>
                                <span className="font-black text-gray-800 tracking-tight">{totalsByService.Carpet.toLocaleString()} ₮</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-primary/5 border-b border-gray-100 flex items-center gap-2">
                            <span className="material-icons-round text-primary text-sm">account_balance</span>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Санхүүгийн нэгтгэл</h4>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <span className="text-sm font-bold text-gray-500">Нийт орлого</span>
                                <span className="text-xl font-black text-gray-900 tracking-tighter">{totalSales.toLocaleString()} ₮</span>
                            </div>

                            <div className="space-y-4">
                                {mockCashReportData.map((data) => (
                                    <div key={data.method} className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-500">{data.method}</span>
                                        <span className="font-black text-gray-800 tracking-tight">{data.total.toLocaleString()} ₮</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cash Validation */}
                    <div className={`rounded-3xl p-6 border shadow-xl transition-all ${isCashMismatch
                        ? 'bg-orange-50 border-orange-100 text-orange-600'
                        : 'bg-green-50 border-green-100 text-green-600'
                        }`}>
                        <div className="flex items-start gap-3">
                            <span className="material-icons-round">{isCashMismatch ? 'warning' : 'check_circle'}</span>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-tight">Бэлэн мөнгөний тулгалт</p>
                                <p className="text-[11px] font-bold opacity-80 leading-relaxed">
                                    {isCashMismatch
                                        ? 'Тушаасан бэлэн мөнгө системийн дүнгээс зөрүүтэй байна!'
                                        : 'Бэлэн мөнгөний дүн системийн тооцоотой таарч байна.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-6 mt-auto">
                        <button
                            onClick={handleFinalize}
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 ${isProcessing
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                : 'bg-secondary text-[#111827] shadow-secondary/30 hover:bg-yellow-400 cursor-pointer'
                                }`}
                        >
                            {isProcessing ? (
                                <span className="material-icons-round animate-spin">sync</span>
                            ) : (
                                <>
                                    <span className="material-icons-round">lock</span>
                                    Өдөр хаах
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-400 text-center leading-relaxed font-bold uppercase tracking-tighter">
                            * Магад хийсний дараа өөрчлөлт оруулах боломжгүй
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 text-center space-y-4">
                            <div className="w-20 h-20 bg-secondary rounded-full mx-auto flex items-center justify-center mb-4 text-[#111827] shadow-lg shadow-secondary/30">
                                <span className="material-icons-round text-4xl">event_available</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Өдөр хаах уу?</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                Өнөөдрийн бүх гүйлгээг баталгаажуулж, өдрийг хаахдаа итгэлтэй байна уу?
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-4 bg-white border-2 border-gray-200 rounded-2xl text-[10px] font-black text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest"
                            >
                                Буцах
                            </button>
                            <button
                                onClick={confirmFinalize}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 uppercase tracking-widest"
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
                onClose={() => navigate('/pos/dashboard')}
                type="success"
                title="Амжилттай"
                message="Өдрийн хаалт амжилттай хийгдлээ."
            />
        </div>
    );
};

export default CashReportScreen;
