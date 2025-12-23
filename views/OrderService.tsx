import React from 'react';
import { View } from '../src/types';

interface OrderServiceProps {
  setView: (view: View) => void;
}

const ServiceCategory: React.FC<{
  icon: string;
  title: string;
  count: number;
  active?: boolean;
}> = ({ icon, title, count, active }) => (
  <div className={`rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all duration-200 ${active ? 'bg-surface-light dark:bg-surface-dark ring-2 ring-primary relative overflow-hidden' : 'bg-surface-light dark:bg-surface-dark border border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
    {active && <div className="absolute inset-0 bg-primary opacity-[0.03] pointer-events-none"></div>}
    <div className="flex items-center gap-6 relative z-10">
      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-sm ${active ? 'border-primary bg-white dark:bg-gray-800 text-primary' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
        <span className="material-icons-round text-3xl">{icon}</span>
      </div>
      <span className={`text-xl font-bold ${active ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{title}</span>
    </div>
    <div className={`flex items-center gap-4 ${active ? 'bg-gray-50 dark:bg-gray-800/50' : ''} rounded-full px-2 py-1 relative z-10`}>
      <button className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95" disabled={count === 0}>
        <span className="material-icons-round">remove</span>
      </button>
      <span className={`w-12 text-center text-2xl font-bold ${active ? 'text-primary' : 'text-gray-400'}`}>{count}</span>
      <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95">
        <span className="material-icons-round">add</span>
      </button>
    </div>
  </div>
);

const OrderService: React.FC<OrderServiceProps> = ({ setView }) => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full min-h-[500px] p-6">
      <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-6">Үйлчилгээний ангилал</h2>
      <div className="space-y-4 flex-1">
        <ServiceCategory icon="hiking" title="Гутал" count={1} active />
        <ServiceCategory icon="dry_cleaning" title="Хими" count={0} />
        <ServiceCategory icon="layers" title="Хивс" count={0} />
        <ServiceCategory icon="sanitizer" title="Ариутгал" count={0} />
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Сонгосон үйлчилгээний төрөл: <span className="text-primary font-bold text-lg ml-1">1</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => setView(View.ORDER_CUSTOMER)}
            className="h-14 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-[0.98]"
          >
            Буцах
          </button>
          <button
            onClick={() => setView(View.ORDER_DETAIL)}
            className="h-14 rounded-xl bg-primary text-black font-bold text-lg shadow-lg hover:shadow-xl hover:brightness-105 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Үргэлжлүүлэх</span>
            <span className="material-icons-round">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderService;