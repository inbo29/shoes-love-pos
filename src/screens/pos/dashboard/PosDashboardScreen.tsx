import React from 'react';

const StatCard: React.FC<{
    title: string;
    value: string;
    icon: string;
    colorClass: string;
    iconBg: string;
    isRevenue?: boolean;
}> = ({ title, value, icon, colorClass, iconBg, isRevenue }) => (
    <div className={`bg-white rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-50 flex items-center gap-4 lg:gap-6 h-auto min-h-[120px] lg:h-40 transition-transform hover:scale-[1.02] relative overflow-hidden`}>
        {isRevenue && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FFD400]"></div>}
        <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl ${iconBg} flex items-center justify-center ${colorClass} shadow-inner shrink-0`}>
            <span className="material-icons-round text-2xl lg:text-3xl">{icon}</span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
            <span className="text-gray-400 text-[11px] lg:text-[13px] font-black uppercase tracking-widest mb-1.5 leading-tight">{title}</span>
            <span className="text-2xl lg:text-4xl font-black text-gray-800 tracking-tight break-words">
                {isRevenue && <span className="mr-1 text-gray-400 font-light text-xl lg:text-2xl">₮</span>}
                {value}
            </span>
        </div>
    </div>
);

const PosDashboardScreen: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 gap-6 md:gap-12 overflow-y-auto bg-[#F1F3F4]">
            {/* Stats Grid - Responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                <StatCard
                    title="Өнөөдөр авсан захиалга"
                    value="120"
                    icon="shopping_bag"
                    colorClass="text-[#40C1C7]"
                    iconBg="bg-[#E9F7F8]"
                />
                <StatCard
                    title="Өнөөдрийн орлого"
                    value="4,500,000"
                    icon="currency_rupee"
                    colorClass="text-[#FFD400]"
                    iconBg="bg-[#FFD400]/10"
                    isRevenue
                />
                <StatCard
                    title="Хүлээн өгсөн захиалга"
                    value="95"
                    icon="check_circle"
                    colorClass="text-green-500"
                    iconBg="bg-green-50"
                />
                <StatCard
                    title="Ачигдах бараа"
                    value="45"
                    icon="outbound"
                    colorClass="text-orange-500"
                    iconBg="bg-orange-50"
                />
                <StatCard
                    title="Ирсэн бараа"
                    value="30"
                    icon="move_to_inbox"
                    colorClass="text-blue-500"
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Гишүүнчлэлийн нэмэгдэл"
                    value="12"
                    icon="person_add"
                    colorClass="text-purple-500"
                    iconBg="bg-purple-50"
                />
            </div>
        </div>
    );
};

export default PosDashboardScreen;
