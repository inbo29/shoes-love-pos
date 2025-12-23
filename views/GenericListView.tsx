import React from 'react';
import { View } from '../types';

interface GenericListViewProps {
  title: string;
  data: any[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const GenericListView: React.FC<GenericListViewProps> = ({ title, data, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden h-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white w-full md:w-auto">{title} жагсаалт</h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:min-w-[400px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <span className="material-icons-round">search</span>
            </span>
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm shadow-sm transition-all" 
              placeholder="Хайлт хийх..." 
              type="text"
            />
          </div>
          <button className="bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors">
            <span className="material-icons-round text-green-600">table_view</span>
            <span className="font-bold text-sm">Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1 no-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-[#F9FAFB] dark:bg-gray-800/50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Дугаар</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Мэдээлэл</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Харилцагч</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Огноо</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider text-center">Төлөв</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Үнийн дүн</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.length > 0 ? data.map((item, idx) => (
                <tr key={idx} className="hover:bg-primary/5 cursor-pointer transition-colors h-16">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-primary">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">{item.info}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{item.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-500 text-sm">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white text-right font-black">{item.amount}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">Мэдээлэл олдсонгүй</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GenericListView;