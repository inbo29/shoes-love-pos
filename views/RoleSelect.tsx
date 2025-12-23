import React from 'react';
import { View } from '../types';

interface RoleSelectProps {
  setView: (view: View) => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ setView }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark transition-colors duration-300 relative overflow-hidden">
       {/* Background Decorative Elements */}
       <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
       <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      <header className="absolute top-0 left-0 right-0 h-[72px] bg-primary flex items-center justify-between px-6 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary">
            <span className="material-icons-round text-2xl">hiking</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">Shoes Love</h1>
        </div>
        <div className="flex items-center gap-4 text-white">
           <span>Админ</span>
           <span className="material-icons-round">account_circle</span>
        </div>
      </header>

      <div className="z-10 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-text-main-light dark:text-white uppercase tracking-wide">Үүрэг сонгох</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button 
            onClick={() => setView(View.DASHBOARD)}
            className="group relative flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark h-[320px] rounded-3xl border-[3px] border-primary transition-all duration-300 ease-out hover:-translate-y-2 hover:border-secondary shadow-lg hover:shadow-2xl outline-none"
          >
            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                <span className="material-icons-round text-[64px]">point_of_sale</span>
              </div>
            </div>
            <div className="h-24 w-full flex items-start justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-white group-hover:text-black dark:group-hover:text-secondary tracking-tight">ПОС</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-t-full transition-all duration-300 group-hover:w-24 group-hover:bg-secondary"></div>
          </button>

          <button className="group relative flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark h-[320px] rounded-3xl border-[3px] border-primary transition-all duration-300 ease-out hover:-translate-y-2 hover:border-secondary shadow-lg hover:shadow-2xl outline-none opacity-50 cursor-not-allowed">
            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                <span className="material-icons-round text-[64px]">monitoring</span>
              </div>
            </div>
            <div className="h-24 w-full flex items-start justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-white group-hover:text-black dark:group-hover:text-secondary tracking-tight">ERP</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-t-full transition-all duration-300 group-hover:w-24 group-hover:bg-secondary"></div>
          </button>

          <button className="group relative flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark h-[320px] rounded-3xl border-[3px] border-primary transition-all duration-300 ease-out hover:-translate-y-2 hover:border-secondary shadow-lg hover:shadow-2xl outline-none opacity-50 cursor-not-allowed">
            <div className="flex-1 flex items-center justify-center w-full">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                <span className="material-icons-round text-[64px]">inventory_2</span>
              </div>
            </div>
            <div className="h-24 w-full flex items-start justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-white group-hover:text-black dark:group-hover:text-secondary tracking-tight">RMS</span>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-t-full transition-all duration-300 group-hover:w-24 group-hover:bg-secondary"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;