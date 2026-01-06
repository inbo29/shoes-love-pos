import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    colorClass: string;
    iconBg: string;
    isRevenue?: boolean;
    onClick?: () => void;
    tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, iconBg, isRevenue, onClick, tooltip }) => (
    <div
        onClick={onClick}
        title={tooltip}
        className={`bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-6 h-40 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-gray-200/50 relative overflow-hidden group cursor-pointer`}
    >
        {isRevenue && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FFD400]"></div>}
        <div className={`w-16 h-16 rounded-[24px] ${iconBg} flex items-center justify-center ${colorClass} shadow-inner shrink-0 group-hover:scale-110 transition-transform`}>
            <span className="material-icons-round text-3xl">{icon}</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2 leading-tight">{title}</span>
            <span className="text-3xl font-black text-gray-800 tracking-tight break-words flex items-baseline">
                {isRevenue && <span className="mr-1 text-gray-400 font-light text-xl">₮</span>}
                {value}
            </span>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-icons-round text-gray-300">open_in_new</span>
        </div>
    </div>
);

const WidgetHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-icons-round text-lg">{icon}</span>
        </div>
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">{title}</h3>
    </div>
);

const PosDashboardScreen: React.FC<{ userName?: string }> = ({ userName = 'Админ' }) => {
    const navigate = useNavigate();
    const isAdmin = userName === 'Админ';

    // Mock Data for Widgets
    const lowStockItems = [
        { name: 'Nike Air Max 270', stock: 2 },
        { name: 'Adidas Ultraboost', stock: 1 },
        { name: 'Puma RS-X', stock: 5 },
        { name: 'Reebok Classic', stock: 3 },
        { name: 'Jordan 1 Retro', stock: 1 },
    ];

    const newProducts = [
        { name: 'Yeezy Boost 350 V2', date: '2024-01-05' },
        { name: 'New Balance 550', date: '2024-01-04' },
        { name: 'ASICS Gel-Kayano', date: '2024-01-03' },
    ];

    const recentAudits = [
        { date: '2024-01-06', diff: -2, manager: 'Админ' },
        { date: '2024-01-05', diff: 0, manager: 'Салбар-1' },
    ];

    return (
        <div className="flex-1 flex flex-col p-8 gap-10 overflow-y-auto bg-[#F8F9FA] no-scrollbar">

            {/* Section 1: Financial & Primary Stats */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full"></div>
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Санхүү ба Захиалга</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isAdmin && (
                        <StatCard
                            title="Өнөөдрийн орлого"
                            value="4,500,000"
                            icon="payments"
                            colorClass="text-[#FFD400]"
                            iconBg="bg-[#FFD400]/10"
                            isRevenue
                            onClick={() => navigate('/pos/finance/cash-report')}
                        />
                    )}
                    <StatCard
                        title="Өнөөдөр авсан захиалга"
                        value="120"
                        icon="shopping_bag"
                        colorClass="text-[#40C1C7]"
                        iconBg="bg-[#E9F7F8]"
                        onClick={() => navigate('/pos/product-order')}
                    />
                    <StatCard
                        title="Ирсэн захиалга"
                        value="30"
                        icon="move_to_inbox"
                        colorClass="text-blue-500"
                        iconBg="bg-blue-50"
                        onClick={() => navigate('/pos/product-order')}
                    />
                    <StatCard
                        title="Гишүүнчлэлийн нэмэгдэл"
                        value="12"
                        icon="person_add"
                        colorClass="text-purple-500"
                        iconBg="bg-purple-50"
                        onClick={() => navigate('/pos/cards')}
                    />
                </div>
            </div>

            {/* Section 2: Product & Inventory Summary */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-primary rounded-full"></div>
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Бараа тойм</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Нийт бараа"
                        value="1,250"
                        icon="category"
                        colorClass="text-gray-600"
                        iconBg="bg-gray-100"
                        onClick={() => navigate('/pos/product-inquiry')}
                    />
                    <StatCard
                        title="Үлдэгдэлтэй бараа"
                        value="980"
                        icon="inventory_2"
                        colorClass="text-green-600"
                        iconBg="bg-green-50"
                        onClick={() => navigate('/pos/inventory')}
                    />
                    <StatCard
                        title="Дуусах дөхсөн бараа"
                        value="24"
                        icon="warning"
                        colorClass="text-orange-500"
                        iconBg="bg-orange-50"
                        onClick={() => navigate('/pos/inventory')}
                    />
                    <StatCard
                        title="Дууссан бараа"
                        value="15"
                        icon="error_outline"
                        colorClass="text-red-500"
                        iconBg="bg-red-50"
                        onClick={() => navigate('/pos/inventory')}
                    />
                </div>
            </div>

            {/* Section 3: Daily Activity */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full"></div>
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Өнөөдрийн хөдөлгөөн</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer" onClick={() => navigate('/pos/sell')}>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Зарагдсан хэмжээ</p>
                            <h4 className="text-4xl font-black text-gray-800 tracking-tighter group-hover:text-primary transition-colors">320 <span className="text-sm text-gray-400 ml-1">ш</span></h4>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-icons-round">trending_up</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex items-center justify-between group hover:border-blue-300 transition-all cursor-pointer" onClick={() => navigate('/pos/shipments')}>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Орлогод авсан</p>
                            <h4 className="text-4xl font-black text-gray-800 tracking-tighter group-hover:text-blue-500 transition-colors">120 <span className="text-sm text-gray-400 ml-1">ш</span></h4>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <span className="material-icons-round">local_shipping</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex items-center justify-between group hover:border-purple-300 transition-all cursor-pointer" onClick={() => navigate('/pos/transfer')}>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Шилжүүлсэн</p>
                            <h4 className="text-4xl font-black text-gray-800 tracking-tighter group-hover:text-purple-500 transition-colors">45 <span className="text-sm text-gray-400 ml-1">ш</span></h4>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <span className="material-icons-round">sync_alt</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Mini Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Low Stock Widget */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <WidgetHeader title="Дуусах дөхсөн бараа" icon="priority_high" />
                    <div className="space-y-4">
                        {lowStockItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/pos/inventory')}>
                                <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${item.stock <= 2 ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>{item.stock} ш</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recently Added Widget */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <WidgetHeader title="Сүүлд нэмэгдсэн бараа" icon="new_releases" />
                    <div className="space-y-4">
                        {newProducts.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl group hover:border-primary/30 transition-all cursor-pointer" onClick={() => navigate('/pos/product-inquiry')}>
                                <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                                <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Audits Widget */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <WidgetHeader title="Сүүлийн тооллого" icon="fact_check" />
                    <div className="space-y-4">
                        {recentAudits.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-[#111827] rounded-2xl group hover:bg-black transition-all cursor-pointer" onClick={() => navigate('/pos/product-audit')}>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-400 group-hover:text-primary transition-colors">{item.date}</span>
                                    <span className="text-[10px] font-bold text-gray-500">{item.manager}</span>
                                </div>
                                <span className={`font-black text-sm ${item.diff === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.diff > 0 ? '+' : ''}{item.diff} ш
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosDashboardScreen;
