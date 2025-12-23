import React from 'react';
import { View } from '../types';

interface OrderDetailProps {
  setView: (view: View) => void;
}

const ServiceOption: React.FC<{ 
  icon: string; 
  title: string; 
  selected?: boolean;
}> = ({ icon, title, selected }) => (
  <button className={`group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm relative h-28
    ${selected 
      ? 'border-primary bg-blue-50 dark:bg-slate-800 dark:border-primary' 
      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-surface-dark hover:border-primary dark:hover:border-primary hover:shadow-md'
    }`}
  >
    {selected && <span className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full"></span>}
    <span className={`material-icons-round text-3xl mb-2 ${selected ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>{icon}</span>
    <span className={`text-[11px] font-bold text-center leading-tight ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>{title}</span>
  </button>
);

const OrderDetail: React.FC<OrderDetailProps> = ({ setView }) => {
  return (
    <div className="max-w-7xl mx-auto pb-24 p-6 overflow-y-auto"> 
      <div className="mb-8 border-b border-gray-200 dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-gray-900 text-sm font-bold">3</span>
          Сонгосон үйлчилгээний дэлгэрэнгүй
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1 ml-11 text-sm">Бараа тус бүрд хийгдэх үйлчилгээг сонгоно уу.</p>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary dark:text-primary flex items-center gap-2">
            <span className="material-icons-round text-xl">hiking</span>
            Гутал 1 <span className="text-sm font-normal text-gray-500 dark:text-slate-400">(Эрэгтэй, арьс)</span>
          </h3>
          <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 dark:bg-slate-800 text-primary border border-blue-100 dark:border-slate-700">Сонгогдсон: 2</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
          <ServiceOption icon="local_laundry_service" title="Угаалга" selected />
          <ServiceOption icon="format_color_fill" title="Будалт" selected />
          <ServiceOption icon="build" title="Өсгий" />
          <ServiceOption icon="content_cut" title="Оёдол" />
          <ServiceOption icon="healing" title="Наалт" />
          <ServiceOption icon="straighten" title="Сунгах" />
          <ServiceOption icon="sanitizer" title="Ариутгал" />
          <ServiceOption icon="published_with_changes" title="Ул солих" />
          <ServiceOption icon="style" title="Дотор" />
          <ServiceOption icon="inventory_2" title="Хайрцаг" />
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between md:justify-end gap-4">
        <button 
          onClick={() => setView(View.ORDER_SERVICE)}
          className="px-8 py-3 rounded-lg border-2 border-primary text-primary dark:text-primary dark:border-primary font-bold text-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors w-full md:w-auto"
        >
          Буцах
        </button>
        <button 
          onClick={() => setView(View.PAYMENT)}
          className="px-8 py-3 rounded-lg bg-secondary text-gray-900 font-bold text-lg hover:bg-[#E6C000] shadow-md transition-colors w-full md:w-auto flex items-center justify-center gap-2"
        >
          <span>Төлбөр төлөх</span>
          <span className="material-icons-round">payments</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;