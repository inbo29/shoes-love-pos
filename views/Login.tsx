import React, { useState, useEffect } from 'react';
import { View } from '../types';

interface LoginProps {
  setView: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ setView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Update clock in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.getFullYear() + '.' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '.' + 
                        String(now.getDate()).padStart(2, '0') + ' ' + 
                        String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#E5EAEB] dark:bg-background-dark font-display overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Login Header (Specialized for Login Screen) */}
      <header className="bg-primary h-14 flex items-center justify-between px-6 shadow-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 overflow-hidden">
            <div className="w-5 h-5 rounded-full bg-[#3D2B1F]"></div>
          </div>
          <h1 className="text-white font-bold text-sm tracking-widest uppercase">SHOES LOVE</h1>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-base">
          Shoes Love POS систем
        </div>

        <div className="flex items-center text-white/90 text-sm font-medium gap-2">
          <span>{currentTime || '2025.12.15 00:40'}</span>
          <span className="material-icons-round text-base">schedule</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="bg-white dark:bg-surface-dark w-full max-w-[420px] rounded-[24px] shadow-2xl overflow-hidden p-10 flex flex-col items-center">
          {/* Circular Lock Icon Area */}
          <div className="w-16 h-16 bg-[#F2FBFB] dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <span className="material-icons-round text-primary text-2xl">lock</span>
          </div>

          <h2 className="text-2xl font-extrabold text-[#1F2937] dark:text-white mb-2">Нэвтрэх</h2>
          <p className="text-[#6B7280] dark:text-gray-400 text-xs text-center mb-8 leading-relaxed">
            Системд нэвтрэхийн тулд мэдээлэл оруулна уу
          </p>

          <form className="w-full space-y-5" onSubmit={(e) => { e.preventDefault(); setView(View.ROLE_SELECT); }}>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1F2937] dark:text-gray-300 ml-1">
                Хэрэглэгчийн нэр <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <span className="material-icons-round text-xl">person_outline</span>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm outline-none transition-all placeholder:text-gray-300" 
                  placeholder="username@shoeslove.mn" 
                  defaultValue="admin"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1F2937] dark:text-gray-300 ml-1">
                Нууц үг <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <span className="material-icons-round text-xl">key</span>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="block w-full pl-11 pr-11 py-3 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm outline-none transition-all placeholder:text-gray-300" 
                  placeholder="••••••••" 
                  defaultValue="123456"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9CA3AF] hover:text-primary transition-colors"
                >
                  <span className="material-icons-round text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-[11px] font-medium text-primary hover:underline transition-all">
                Нууц үгээ мартсан уу?
              </a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-secondary hover:bg-[#E6C000] text-[#1F2937] font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-secondary/20 transform active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-icons-round text-lg">login</span>
              Нэвтрэх
            </button>
          </form>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="h-16 flex flex-col items-center justify-center pb-4 text-[#6B7280] dark:text-gray-500 text-[10px] tracking-wide relative z-10">
        <p>© 2025 Shoes Love Systems. All rights reserved.</p>
        <button className="mt-1 opacity-50 hover:opacity-100 transition-opacity">Change Themes</button>
      </footer>
    </div>
  );
};

export default Login;