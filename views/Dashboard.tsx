import React from 'react';
import { View } from '../src/types';

interface DashboardProps {
  setView: (view: View) => void;
}

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  colorClass: string;
  iconBg: string;
  isRevenue?: boolean;
}> = ({ title, value, icon, colorClass, iconBg, isRevenue }) => (
  <div className={`bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-transparent flex items-center gap-4 md:gap-6 h-auto min-h-[100px] md:h-36 transition-transform hover:scale-[1.02] ${isRevenue ? 'border-l-[8px] border-[#FFD400]' : 'border border-gray-50'}`}>
    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl ${iconBg} flex items-center justify-center ${colorClass} shadow-inner shrink-0`}>
      <span className="material-icons-round text-2xl md:text-3xl">{icon}</span>
    </div>
    <div className="flex flex-col overflow-hidden">
      <span className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 truncate">{title}</span>
      <span className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight truncate">
        {isRevenue && <span className="mr-1 text-gray-500 font-light">₮</span>}
        {value}
      </span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 gap-6 md:gap-12 overflow-y-auto bg-[#F1F3F4]">
      {/* Stats Grid - Responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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

export default Dashboard;