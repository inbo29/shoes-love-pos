import React from 'react';
import { View } from '../types';

interface OrderCustomerProps {
  setView: (view: View) => void;
}

const OrderCustomer: React.FC<OrderCustomerProps> = ({ setView }) => {
  return (
    <div className="max-w-7xl mx-auto w-full h-full flex flex-col p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left: Input Form */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
              Захиалгын мэдээлэл
            </h2>
          </div>
          <div className="space-y-5 flex-1">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Хэрэглэгчийн нэр <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons-round text-gray-400 text-xl">person</span>
                </div>
                <input className="block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3" placeholder="Нэр оруулах" type="text"/>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Утасны дугаар <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons-round text-gray-400 text-xl">phone</span>
                </div>
                <input className="block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3" placeholder="9999-9999" type="tel"/>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Хаяг
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons-round text-gray-400 text-xl">location_on</span>
                </div>
                <input className="block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3" placeholder="Дүүрэг, хороо..." type="text"/>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Гишүүнчлэлийн төрөл
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons-round text-gray-400 text-xl">card_membership</span>
                </div>
                <select className="block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm py-3 appearance-none">
                  <option>Энгийн</option>
                  <option>VIP</option>
                  <option>Байгууллага</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="material-icons-round text-gray-400">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Receipt Info */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col relative">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Хүлээн авалтын мэдээлэл
            </h2>
          </div>
          <div className="space-y-5 flex-1">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Хүлээн авсан огноо <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons-round text-gray-400 text-xl">event</span>
                </div>
                <input className="bg-gray-50 dark:bg-gray-800 block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 text-gray-500 dark:text-gray-400 sm:text-sm py-3 cursor-not-allowed" readOnly value="2023.10.27" type="text"/>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">
                Хүлээн авсан ажилтан <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-icons-round text-gray-400 text-xl">badge</span>
                </div>
                <input className="bg-gray-50 dark:bg-gray-800 block w-full rounded-lg border-gray-300 dark:border-gray-600 pl-10 text-gray-500 dark:text-gray-400 sm:text-sm py-3 cursor-not-allowed" readOnly value="Админ" type="text"/>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 mt-2">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-primary text-xl">verified</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Утас баталгаажсан эсэх</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          <div className="mt-8 pt-4 flex gap-4 justify-end border-t border-gray-100 dark:border-gray-700">
            <button className="px-8 py-3.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 dark:hover:bg-primary/10 transition active:scale-95 text-sm uppercase tracking-wide">
              Хадгалах
            </button>
            <button 
              onClick={() => setView(View.ORDER_SERVICE)}
              className="px-8 py-3.5 rounded-xl bg-secondary text-gray-900 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition active:scale-95 text-sm uppercase tracking-wide flex items-center gap-2"
            >
              Үргэлжлүүлэх
              <span className="material-icons-round text-base">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderCustomer;