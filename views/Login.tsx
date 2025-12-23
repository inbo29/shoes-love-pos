import React, { useState, useEffect } from 'react';
import { View } from '../types';

interface LoginProps {
  onLogin: (id: string, pw: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('admin');
  const [pw, setPw] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#E5EAEB] dark:bg-background-dark overflow-hidden relative">
      <header className="bg-primary h-16 flex items-center justify-between px-6 shadow-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-futuris text-2xl tracking-tighter uppercase">SHOES LOVE</h1>
        </div>
        <div className="flex items-center text-white/90 text-sm font-andale gap-2">
          <span>{currentTime || '2023.10.27 14:30'}</span>
          <span className="material-icons-round text-base">schedule</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="bg-white dark:bg-surface-dark w-full max-w-[420px] rounded-[32px] shadow-2xl overflow-hidden p-10 flex flex-col items-center border border-white/50">
          <div className="w-20 h-20 bg-[#F2FBFB] dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <span className="material-icons-round text-primary text-3xl">lock</span>
          </div>
          <h2 className="text-3xl font-futuris text-[#1F2937] dark:text-white mb-2 uppercase tracking-tight">Нэвтрэх</h2>
          <p className="text-[#6B7280] dark:text-gray-400 text-xs font-artsans text-center mb-8 leading-relaxed tracking-wide">Системд нэвтрэхийн тулд мэдээлэл оруулна уу</p>

          <form className="w-full space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(id, pw); }}>
            <div className="space-y-2">
              <label className="block text-[10px] font-futuris text-gray-500 dark:text-gray-300 ml-1 uppercase tracking-widest">Хэрэглэгчийн нэр</label>
              <input value={id} onChange={e => setId(e.target.value)} type="text" className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-sm font-artsans outline-none transition-all" placeholder="ID (admin or worker)" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-futuris text-gray-500 dark:text-gray-300 ml-1 uppercase tracking-widest">Нууц үг</label>
              <div className="relative">
                <input value={pw} onChange={e => setPw(e.target.value)} type={showPassword ? "text" : "password"} className="block w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-sm font-artsans outline-none transition-all" placeholder="Password (1234)" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-primary transition-colors">
                  <span className="material-icons-round text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-secondary hover:bg-[#E6C000] text-[#1F2937] font-futuris py-4 px-6 rounded-2xl shadow-lg transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 mt-4 active:scale-95">
              <span className="material-icons-round text-xl">login</span>Нэвтрэх
            </button>
          </form>
          <p className="mt-8 text-[9px] text-gray-400 font-andale text-center uppercase tracking-tighter">Admin: admin / 1234 | Worker: worker / 1234</p>
        </div>
      </main>
      <footer className="h-16 flex flex-col items-center justify-center pb-6 text-[#6B7280] font-andale text-[9px] tracking-[0.2em]">
        <p>© 2025 SHOES LOVE SYSTEMS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

export default Login;