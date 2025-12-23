import React from 'react';
import { View } from '../types';

interface PaymentProps {
  setView: (view: View) => void;
}

const Payment: React.FC<PaymentProps> = ({ setView }) => {
  return (
    <div className="h-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
      <div className="lg:col-span-7 flex flex-col gap-5 pb-20 lg:pb-0">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide flex items-center">
          <span className="w-1 h-6 bg-primary mr-3 rounded-full"></span>
          Захиалгын хураангуй
        </h2>
        
        {/* Customer Info Card */}
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">Хэрэглэгчийн мэдээлэл</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Нэр</span>
              <div className="font-medium text-gray-900 dark:text-white">Б. Болд-Эрдэнэ</div>
            </div>
            <div>
              <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Утас</span>
              <div className="font-medium font-mono text-gray-900 dark:text-white">9911-2345</div>
            </div>
            <div>
              <span className="block text-gray-500 dark:text-gray-400 text-xs mb-1">Хаяг</span>
              <div className="font-medium truncate text-gray-900 dark:text-white">ХУД, 11-р хороо, Зайсан 45-2</div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Захиалга</h3>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-primary border border-gray-200 dark:border-gray-600">
                      <span className="material-icons-round">hiking</span>
                   </div>
                   <div>
                      <div className="font-bold text-gray-900 dark:text-white">Гутал 1</div>
                      <div className="text-xs text-gray-500">Угаалга, Будалт</div>
                   </div>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">45,000 ₮</span>
             </div>
             {/* More Items could go here */}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-5 h-full">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide flex items-center">
          <span className="w-1 h-6 bg-secondary mr-3 rounded-full"></span>
          Төлбөр
        </h2>
        
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden">
          <div className="p-5 space-y-3 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <span>Үйлчилгээний дүн</span>
              <span className="font-medium">45,000 ₮</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
              <span>Хөнгөлөлт (0%)</span>
              <span className="font-medium">-0 ₮</span>
            </div>
          </div>
          <div className="p-6 bg-primary/5 dark:bg-primary/10">
            <div className="flex justify-between items-end">
              <span className="text-gray-600 dark:text-gray-300 font-bold text-lg">НИЙТ ТӨЛӨХ ДҮН</span>
              <span className="text-3xl font-extrabold text-primary">45,000 ₮</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark flex-1 flex flex-col">
          <div className="grid grid-cols-4 p-2 gap-1 border-b border-border-light dark:border-border-dark">
            <button className="relative py-3 rounded-lg flex flex-col items-center justify-center bg-primary text-white shadow-sm transition-all">
              <span className="material-icons-round text-xl mb-1">qr_code_scanner</span>
              <span className="text-[10px] font-bold">QR</span>
            </button>
            <button className="py-3 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-all">
              <span className="material-icons-round text-xl mb-1">payments</span>
              <span className="text-[10px] font-bold">БЭЛЭН</span>
            </button>
            <button className="py-3 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-all">
              <span className="material-icons-round text-xl mb-1">confirmation_number</span>
              <span className="text-[10px] font-bold">ВАУЧЕР</span>
            </button>
            <button className="py-3 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-all">
              <span className="material-icons-round text-xl mb-1">credit_card</span>
              <span className="text-[10px] font-bold">КАРТ</span>
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner border border-gray-200 mb-4 flex items-center justify-center">
               <span className="material-icons-round text-9xl text-gray-800">qr_code_2</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium animate-pulse">
              <span className="material-icons-round text-sm">hourglass_empty</span>
              <span>Төлбөр баталгаажихыг хүлээж байна...</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setView(View.DASHBOARD)} // In real flow, usually goes to success/feedback
          className="w-full py-5 bg-secondary hover:bg-yellow-400 text-gray-900 rounded-2xl font-bold text-xl shadow-lg shadow-yellow-400/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <span className="material-icons-round">check_circle</span>
          Төлбөр дуусгах
        </button>
      </div>
    </div>
  );
};

export default Payment;