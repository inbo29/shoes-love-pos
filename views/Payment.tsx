import React, { useState } from 'react';
import { View } from '../types';

interface PaymentProps {
  setView: (view: View) => void;
  onComplete: (order: any) => void;
}

const Payment: React.FC<PaymentProps> = ({ setView, onComplete }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFinish = () => {
    // Simulate adding to the list
    const newOrder = {
      id: `#ORD-2023-${Math.floor(Math.random() * 9000) + 1000}`,
      info: 'Гутал (Угаалга)',
      customer: 'Б. Болд-Эрдэнэ',
      phone: '9911-2345',
      date: '2023.10.27 14:35',
      status: 'Шинэ',
      statusColor: 'bg-green-100 text-green-800',
      amount: '45,000 ₮'
    };
    onComplete(newOrder);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setView(View.DASHBOARD);
    }, 2000);
  };

  return (
    <div className="h-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto relative">
      <div className="lg:col-span-7 flex flex-col gap-5 pb-20 lg:pb-0">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide flex items-center">
          <span className="w-1 h-6 bg-primary mr-3 rounded-full"></span>
          Захиалгын хураангуй
        </h2>
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-border-light">
          <h3 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Хэрэглэгчийн мэдээлэл</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><span className="block text-gray-500 text-xs mb-1">Нэр</span><div className="font-medium">Б. Болд-Эрдэнэ</div></div>
            <div><span className="block text-gray-500 text-xs mb-1">Утас</span><div className="font-medium font-mono">9911-2345</div></div>
            <div><span className="block text-gray-500 text-xs mb-1">Хаяг</span><div className="font-medium truncate">ХУД, 11-р хороо</div></div>
          </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-border-light">
          <h3 className="text-sm font-semibold text-primary uppercase mb-4">Захиалга</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-primary border border-gray-200"><span className="material-icons-round">hiking</span></div>
              <div><div className="font-bold">Гутал 1</div><div className="text-xs text-gray-500">Угаалга, Будалт</div></div>
            </div>
            <span className="font-bold">45,000 ₮</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-5 h-full">
        <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide flex items-center">
          <span className="w-1 h-6 bg-secondary mr-3 rounded-full"></span>Төлбөр
        </h2>
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light overflow-hidden">
          <div className="p-5 space-y-3 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between text-gray-600 text-sm"><span>Үйлчилгээний дүн</span><span className="font-medium">45,000 ₮</span></div>
          </div>
          <div className="p-6 bg-primary/5">
            <div className="flex justify-between items-end">
              <span className="text-gray-600 font-bold text-lg">НИЙТ ТӨЛӨХ</span>
              <span className="text-3xl font-extrabold text-primary">45,000 ₮</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light flex-1 flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner border mb-4 flex items-center justify-center">
            <span className="material-icons-round text-9xl text-gray-800">qr_code_2</span>
          </div>
          <p className="text-primary font-medium animate-pulse text-sm">QR уншуулна уу...</p>
        </div>

        <button 
          onClick={handleFinish}
          className="w-full py-5 bg-secondary hover:bg-yellow-400 text-gray-900 rounded-2xl font-bold text-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <span className="material-icons-round">check_circle</span>
          Төлбөр дуусгах
        </button>
      </div>

      {/* Success Popup Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 transform animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500">
              <span className="material-icons-round text-5xl">check_circle</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Амжилттай баталгаажлаа</h3>
              <p className="text-gray-500 mt-2">Захиалга бүртгэгдсэн тул жагсаалтад орлоо.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;