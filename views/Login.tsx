import React from 'react';
import { View } from '../types';

interface LoginProps {
  setView: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="bg-surface-light dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="pt-10 pb-6 px-8 text-center">
            <div className="w-20 h-20 bg-background-light dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner text-primary">
              <span className="material-icons-round text-4xl">hiking</span>
            </div>
            <h2 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark font-display">Нэвтрэх</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Shoes Love POS системд тавтай морил</p>
          </div>
          <form className="px-8 pb-10 space-y-6" onSubmit={(e) => { e.preventDefault(); setView(View.ROLE_SELECT); }}>
            <div className="group">
              <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2 pl-1">
                Хэрэглэгчийн нэр
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span className="material-icons-round text-xl">person</span>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-4 py-4 text-base bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-text-main-light dark:text-white placeholder-gray-400 transition-shadow outline-none" 
                  placeholder="admin" 
                  defaultValue="admin"
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-text-main-light dark:text-gray-300 mb-2 pl-1">
                Нууц үг
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span className="material-icons-round text-xl">vpn_key</span>
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-10 pr-12 py-4 text-base bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-text-main-light dark:text-white placeholder-gray-400 transition-shadow outline-none" 
                  placeholder="••••••••" 
                  defaultValue="123456"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-secondary hover:bg-yellow-400 text-gray-900 font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
            >
              <span className="material-icons-round">login</span>
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;