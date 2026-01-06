import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCashReportData, PaymentMethodData, CancellationData } from '../../../services/mockCashReportData';
import Popup from '../../../shared/components/Popup/Popup';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';
import PosDropdown from '../../../shared/components/PosDropdown';

interface CashReportScreenProps {
    userName: string;
    initialBranch: string;
}

const CashReportScreen: React.FC<CashReportScreenProps> = ({ userName, initialBranch }) => {
    const navigate = useNavigate();
    const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
    const [expandedProductMethod, setExpandedProductMethod] = useState<string | null>(null);
    const [expandedService, setExpandedService] = useState<{ method: string; service: string } | null>(null);
    const [expandedProduct, setExpandedProduct] = useState<{ method: string; product: string } | null>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter states
    const [startDate, setStartDate] = useState<Date | null>(new Date('2025-12-24'));
    const [endDate, setEndDate] = useState<Date | null>(new Date('2025-12-24'));
    const [selectedBranch, setSelectedBranch] = useState(initialBranch);

    const isAdmin = userName === 'Админ';

    const branchOptions = [
        { label: 'Төв салбар', value: 'Төв салбар' },
        { label: 'Салбар 1', value: 'Салбар 1' },
        { label: 'Салбар 2', value: 'Салбар 2' },
    ];

    // Helpers
    const maskName = (name: string) => {
        if (!name) return '';
        if (name.length <= 1) return name;
        if (name.length === 2) return name[0] + '*';

        let masked = name[0];
        for (let i = 1; i < name.length - 1; i++) {
            masked += '*';
        }
        masked += name[name.length - 1];
        return masked;
    };

    // Calculated Totals
    const calculations = useMemo(() => {
        // 1. Calculate Per-Method Totals (Gross & Net)
        const methodCalculations = mockCashReportData.paymentMethods.map(pm => {
            const methodCancellations = mockCashReportData.cancellations.filter(c => c.paymentMethod === pm.method);

            const serviceCancelAmount = methodCancellations
                .filter(c => c.type === 'SERVICE')
                .reduce((sum, c) => sum + c.amount, 0);

            const productCancelAmount = methodCancellations
                .filter(c => c.type === 'PRODUCT')
                .reduce((sum, c) => sum + c.amount, 0);

            const netService = pm.serviceTotal - serviceCancelAmount;
            const netProduct = pm.productTotal - productCancelAmount;
            const netTotal = netService + netProduct;

            return {
                method: pm.method,
                grossService: pm.serviceTotal,
                serviceCancel: serviceCancelAmount,
                netService,
                grossProduct: pm.productTotal,
                productCancel: productCancelAmount,
                netProduct,
                netTotal
            };
        });

        // 2. Global Aggregates
        const totalNetService = methodCalculations.reduce((sum, m) => sum + m.netService, 0);
        const totalNetProduct = methodCalculations.reduce((sum, m) => sum + m.netProduct, 0);
        const totalNetRevenue = totalNetService + totalNetProduct;

        // Group cancellations for display (Global)
        const globalServiceCancellations = mockCashReportData.cancellations
            .filter(c => c.type === 'SERVICE')
            .reduce((sum, c) => sum + c.amount, 0);

        const globalProductCancellations = mockCashReportData.cancellations
            .filter(c => c.type === 'PRODUCT')
            .reduce((sum, c) => sum + c.amount, 0);

        return {
            methodCalculations,
            totalNetService,
            totalNetProduct,
            totalNetRevenue,
            globalServiceCancellations,
            globalProductCancellations,
            paymentMethods: mockCashReportData.paymentMethods // Raw detailed data for tree view
        };
    }, []);

    // Verification Logic: Compare actual cash in drawer vs calculated Net Cash
    const actualCashSubmitted = 352300;
    const cashMethodStats = calculations.methodCalculations.find(m => m.method === 'Бэлэн');
    const systemNetCash = cashMethodStats ? cashMethodStats.netTotal : 0;
    const isCashMismatch = actualCashSubmitted !== systemNetCash;

    const handleMethodClick = (method: string) => {
        setExpandedMethod(expandedMethod === method ? null : method);
        setExpandedService(null);
    };

    const handleServiceClick = (e: React.MouseEvent, method: string, serviceKey: string) => {
        e.stopPropagation();
        if (expandedService?.method === method && expandedService?.service === serviceKey) {
            setExpandedService(null);
        } else {
            setExpandedService({ method, service: serviceKey });
        }
    };

    const handleProductMethodClick = (method: string) => {
        setExpandedProductMethod(expandedProductMethod === method ? null : method);
        setExpandedProduct(null);
    };

    const handleProductClick = (e: React.MouseEvent, method: string, productKey: string) => {
        e.stopPropagation();
        if (expandedProduct?.method === method && expandedProduct?.product === productKey) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct({ method, product: productKey });
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

    // Use full window scrolling -> remove h-full/overflow on container props if this is the main screen
    return (
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 w-full bg-gray-50/30">
            {/* Header Summary */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                        <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase">Кассын тайлан</h1>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Өдрийн эцсийн нэгтгэл</p>
                </div>

                <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
                    <div className="min-w-[260px]">
                        <PosDateRangePicker
                            label="Огноо"
                            start={startDate}
                            end={endDate}
                            onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
                        />
                    </div>
                    {isAdmin && (
                        <div className="w-[200px]">
                            <PosDropdown
                                label="Салбар"
                                icon="storefront"
                                options={branchOptions}
                                value={selectedBranch}
                                onChange={setSelectedBranch}
                            />
                        </div>
                    )}
                    {!isAdmin && (
                        <div className="space-y-1 pb-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Салбар</p>
                            <p className="h-[44px] flex items-center px-4 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600">
                                {selectedBranch}
                            </p>
                        </div>
                    )}
                    <div className="space-y-1 pb-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ажилтан</p>
                        <p className="h-[44px] flex items-center px-4 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700">
                            {userName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Summary Card (Global Net Values) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Нийт орлого (Цэвэр)</p>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tighter">{calculations.totalNetRevenue.toLocaleString()} ₮</h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-icons-round text-3xl">account_balance_wallet</span>
                    </div>
                </div>

                <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <span className="material-icons-round text-2xl">category</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Үйлчилгээний орлого</p>
                        <p className="text-lg font-black text-gray-800 tracking-tight">{calculations.totalNetService.toLocaleString()} ₮</p>
                    </div>
                </div>

                <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <span className="material-icons-round text-2xl">shopping_cart</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Барааны борлуулалт</p>
                        <p className="text-lg font-black text-gray-800 tracking-tight">{calculations.totalNetProduct.toLocaleString()} ₮</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Column: Breakdown */}
                <div className="flex-1 space-y-8 w-full">

                    {/* 1. Service Revenue Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between ml-1">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Үйлчилгээ төлбөрийн дэлгэрэнгүй</h3>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Дарж дэлгэрэнгүйг харна уу</span>
                        </div>

                        {calculations.methodCalculations.map((data) => {
                            // Find original payment method data for details
                            const originalData = calculations.paymentMethods.find(p => p.method === data.method);
                            if (!originalData || data.grossService === 0) return null;

                            return (
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
                                                <p className="text-xs font-bold text-gray-400">Төлсөн дүн: {data.grossService.toLocaleString()} ₮</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-black text-gray-900 tracking-tighter">{data.grossService.toLocaleString()} ₮</p>
                                            </div>
                                            <span className={`material-icons-round text-gray-300 transition-transform duration-300 ${expandedMethod === data.method ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    {/* Breakdown (Tier 2) */}
                                    {expandedMethod === data.method && (
                                        <div className="p-4 space-y-2 bg-gray-50/30 animate-in slide-in-from-top-4 duration-300">
                                            {(Object.keys(originalData.serviceCategories) as Array<keyof typeof originalData.serviceCategories>).map((serviceKey) => {
                                                const service = originalData.serviceCategories[serviceKey];
                                                if (!service || service.total === 0) return null;

                                                const isExpanded = expandedService?.method === data.method && expandedService?.service === serviceKey;
                                                const labelMap: Record<string, string> = { Gutal: 'Гутал', Chemical: 'Хими цэвэрлэгээ', Carpet: 'Хивс цэвэрлэгээ' };

                                                return (
                                                    <div key={serviceKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                                        <div
                                                            onClick={(e) => handleServiceClick(e, data.method, serviceKey)}
                                                            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50 border-b border-gray-100' : ''}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                                <span className="font-bold text-gray-700">{labelMap[serviceKey]}</span>
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

                                                        {/* Orders (Tier 3) */}
                                                        {isExpanded && service.orders && (
                                                            <div className="p-3 space-y-1.5 bg-gray-50/50 animate-in slide-in-from-top-2">
                                                                {service.orders.map((order) => (
                                                                    <div key={order.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-[10px] font-black text-gray-400 tracking-tighter group-hover:text-primary transition-colors">{order.id}</span>
                                                                            <span className="text-xs font-bold text-gray-600">{maskName(order.customer)}</span>
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
                            );
                        })}

                        {/* Service Cancellations Summary */}
                        {calculations.globalServiceCancellations > 0 && (
                            <div className="p-4 rounded-3xl border border-red-100 bg-red-50 flex justify-between items-center px-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-red-400">cancel_presentation</span>
                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Буцаалт / Цуцлалт</span>
                                </div>
                                <span className="font-black text-red-500">-{calculations.globalServiceCancellations.toLocaleString()} ₮</span>
                            </div>
                        )}
                    </div>

                    {/* 2. Product Revenue Section (NEW) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between ml-1">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Борлуулалт дэлгэрэнгүй</h3>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Дарж дэлгэрэнгүйг харна уу</span>
                        </div>

                        {calculations.methodCalculations.map((data) => {
                            // Find original payment method data
                            const originalData = calculations.paymentMethods.find(p => p.method === data.method);
                            if (!originalData || data.grossProduct === 0) return null;

                            return (
                                <div key={data.method} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300">
                                    <div
                                        onClick={() => handleProductMethodClick(data.method)}
                                        className={`p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors ${expandedProductMethod === data.method ? 'bg-gray-50/80 border-b border-gray-100' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 text-teal-600">
                                                <span className="material-icons-round">shopping_bag</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-800 uppercase tracking-tight">{data.method}</h4>
                                                <p className="text-xs font-bold text-gray-400">Төлсөн дүн: {data.grossProduct.toLocaleString()} ₮</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-black text-gray-900 tracking-tighter">{data.grossProduct.toLocaleString()} ₮</p>
                                            </div>
                                            <span className={`material-icons-round text-gray-300 transition-transform duration-300 ${expandedProductMethod === data.method ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    {/* Breakdown (Tier 2) */}
                                    {expandedProductMethod === data.method && (
                                        <div className="p-4 space-y-2 bg-gray-50/30 animate-in slide-in-from-top-4 duration-300">
                                            {(Object.keys(originalData.productItems)).map((productKey) => {
                                                const product = originalData.productItems[productKey];
                                                const isExpanded = expandedProduct?.method === data.method && expandedProduct?.product === productKey;

                                                return (
                                                    <div key={productKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                                        <div
                                                            onClick={(e) => handleProductClick(e, data.method, productKey)}
                                                            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50 border-b border-gray-100' : ''}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-teal-400/40" />
                                                                <span className="font-bold text-gray-700">{productKey}</span>
                                                                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">x {product.quantity}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-black text-gray-800 text-sm">{product.total.toLocaleString()} ₮</span>
                                                                {product.orders && product.orders.length > 0 && (
                                                                    <span className={`material-icons-round text-gray-300 text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                                        expand_more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Orders (Tier 3) */}
                                                        {isExpanded && product.orders && (
                                                            <div className="p-3 space-y-1.5 bg-gray-50/50 animate-in slide-in-from-top-2">
                                                                {product.orders.map((order) => (
                                                                    <div key={order.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-[10px] font-black text-gray-400 tracking-tighter group-hover:text-primary transition-colors">{order.id}</span>
                                                                                <span className="text-[9px] font-bold text-gray-300">Ширхэг: {order.quantity}</span>
                                                                            </div>
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
                            );
                        })}

                        {/* Product Checks / Cancellations Summary */}
                        {calculations.globalProductCancellations > 0 && (
                            <div className="p-4 rounded-3xl border border-red-100 bg-red-50 flex justify-between items-center px-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-red-400">cancel_presentation</span>
                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Буцаалт / Цуцлалт (Бараа)</span>
                                </div>
                                <span className="font-black text-red-500">-{calculations.globalProductCancellations.toLocaleString()} ₮</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Summaries & Action */}
                <div className="w-full lg:w-[320px] xl:w-96 flex flex-col gap-6 shrink-0 w-full pb-6">

                    {/* Financial Summary Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden shrink-0">
                        <div className="p-5 bg-primary/5 border-b border-gray-100 flex items-center gap-2">
                            <span className="material-icons-round text-primary text-sm">account_balance</span>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Санхүүгийн нэгтгэл</h4>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3 pb-6 border-b border-gray-50">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-500">Цэвэр үйлчилгээний орлого</span>
                                    <span className="font-black text-gray-800">{calculations.totalNetService.toLocaleString()} ₮</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-500">Цэвэр барааны борлуулалт</span>
                                    <span className="font-black text-gray-800">{calculations.totalNetProduct.toLocaleString()} ₮</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                                <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Нийт орлого</span>
                                <span className="text-2xl font-black text-primary tracking-tighter">{calculations.totalNetRevenue.toLocaleString()} ₮</span>
                            </div>

                            <div className="space-y-4">
                                {calculations.methodCalculations.map((m) => (
                                    <div key={m.method} className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-500">{m.method}</span>
                                        <span className="font-black text-gray-800 tracking-tight">{m.netTotal.toLocaleString()} ₮</span>
                                    </div>
                                ))}
                                <div className="pt-4 mt-2 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Нийт</span>
                                    <span className="text-sm font-black text-gray-800 uppercase tracking-widest">{calculations.totalNetRevenue.toLocaleString()} ₮</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cash Validation */}
                    <div className={`rounded-3xl p-6 border shadow-xl transition-all shrink-0 ${isCashMismatch
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
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-4 mt-auto shrink-0">
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
                        <p className="text-[9px] text-gray-400 text-center leading-relaxed font-bold uppercase tracking-tighter px-2">
                            * МАГАД ХИЙСНИЙ ДАРАА ӨӨРЧЛӨЛТ ОРУУЛАХ БОЛОМЖГҮЙ
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
