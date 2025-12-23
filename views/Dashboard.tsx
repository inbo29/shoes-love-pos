
import React from 'react';
import { View } from '../types';

interface DashboardProps {
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden h-full">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <button 
          onClick={() => setView(View.ORDER_CUSTOMER)}
          className="bg-secondary hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transform active:scale-95 transition-all text-sm md:text-base whitespace-nowrap"
        >
          <span className="material-icons-round">add_circle</span>
          <span>Шинэ захиалга авах</span>
        </button>
        <div className="relative w-full md:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons-round text-gray-400">search</span>
          </div>
          <input 
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm transition-shadow" 
            placeholder="Нэр / утас / захиалга №-р хайх" 
            type="text"
          />
        </div>
        <button className="bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap">
          <span className="material-icons-round text-green-600">table_view</span>
          <span className="font-medium text-sm">Excel татах</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-primary sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Захиалгын №</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Хэрэглэгчийн нэр</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Утас</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Огноо</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Төлөв</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Нийт дүн</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors h-16">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">#ORD-2023-1001</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">Бат-Эрдэнэ Болд</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">9911-2345</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">2023.10.27 14:15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Шинэ
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white text-right font-bold">150,000 ₮</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors h-16">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">#ORD-2023-1002</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">Сүхбаатар Сарнай</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">8800-5566</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">2023.10.27 13:45</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Хүлээгдэж буй
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white text-right font-bold">89,900 ₮</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors h-16">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary">#ORD-2023-1003</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">Доржпүрэв Гантулга</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">9191-3344</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">2023.10.27 12:30</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Бэлэн болсон
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white text-right font-bold">245,000 ₮</td>
              </tr>
              {/* More mock rows... */}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-surface-dark px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              {/* Fixed: Changed 'class' to 'className' below */}
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Нийт <span className="font-medium text-gray-900 dark:text-white">56</span> захиалгаас <span className="font-medium text-gray-900 dark:text-white">1</span>-ээс <span className="font-medium text-gray-900 dark:text-white">6</span>-г харуулж байна
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span className="sr-only">Previous</span>
                  <span className="material-icons-round text-sm">chevron_left</span>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-primary/10 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</a>
                <a href="#" className="bg-white dark:bg-surface-dark border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium">2</a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span className="sr-only">Next</span>
                  <span className="material-icons-round text-sm">chevron_right</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
