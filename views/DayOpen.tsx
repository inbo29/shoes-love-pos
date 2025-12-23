import React from 'react';
import { View } from '../types';

interface DayOpenProps {
  setView: (view: View) => void;
}

const DayOpen: React.FC<DayOpenProps> = ({ setView }) => {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden max-w-[1440px] mx-auto w-full">
      <section className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <span className="material-icons-round text-primary">list_alt</span>
            Өдрийн нээлтийн жагсаалт
          </h2>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Огноо</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Нээсэн цаг</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ажилтны нэр</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">2023.10.27</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">08:45:12</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Б.Болд (Manager)</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Нээлттэй
                  </span>
                </td>
              </tr>
              {/* Previous days */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors opacity-60">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">2023.10.26</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">08:50:30</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Б.Сараа</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    Хаагдсан
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="shrink-0 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-8 items-end">
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 pb-2 border-b border-gray-100 dark:border-gray-700 mb-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-secondary">wb_sunny</span>
                Өдөр нээх
              </h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Огноо
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-sm">calendar_today</span>
                <input className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium cursor-not-allowed focus:ring-0" readOnly type="text" value="2023.10.27"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Нээх цаг
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-sm">schedule</span>
                <input className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium cursor-not-allowed focus:ring-0 font-mono" readOnly type="text" value="14:30:45"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Ажилтан
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-sm">person</span>
                <input className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium cursor-not-allowed focus:ring-0" readOnly type="text" value="Админ"/>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0">
            <button className="w-full h-full min-h-[50px] bg-secondary hover:brightness-95 active:scale-[0.98] text-gray-900 font-bold text-lg rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <span className="material-icons-round">check_circle</span>
              Өдөр нээх
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DayOpen;