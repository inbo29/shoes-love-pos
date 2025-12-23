import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const NavButton: React.FC<{
  label: React.ReactNode;
  icon: string;
  active?: boolean;
  special?: boolean;
  onClick: () => void;
}> = ({ label, icon, active, special, onClick }) => {
  if (special) {
    return (
      <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center min-w-[100px] h-20 p-2 rounded-xl bg-secondary text-gray-900 shadow-md transform hover:scale-105 transition-transform"
      >
        <span className="material-icons-round text-3xl mb-1 text-gray-900">{icon}</span>
        <span className="text-[10px] text-center font-bold leading-tight uppercase">{label}</span>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[90px] h-20 p-2 rounded-lg transition group ${
        active 
          ? 'bg-primary/10 text-primary dark:text-primary' 
          : 'text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <span className={`material-icons-round text-3xl mb-1 transition-transform group-hover:scale-110 ${active ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className="text-[10px] text-center font-medium leading-tight">{label}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, toggleTheme, isDark }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-primary h-14 flex items-center justify-between px-6 shadow-md shrink-0 z-20 relative">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(View.DASHBOARD)}>
          <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
            <span className="material-icons-round text-white text-xl">hiking</span>
          </div>
          <h1 className="text-white font-bold text-lg tracking-wide uppercase font-display hidden sm:block">SHOES LOVE</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white">
            <span className="material-icons-round text-lg">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="flex items-center text-white/90 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="material-icons-round text-base mr-2">calendar_today</span>
            <span>2023.10.27 14:30</span>
          </div>
          <div className="flex items-center text-white font-medium bg-white/10 px-3 py-1.5 rounded-lg">
            <span className="material-icons-round mr-2 text-base">person</span>
            <span>Админ</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark py-2 shrink-0 shadow-sm z-10">
        <div className="flex overflow-x-auto no-scrollbar px-2 space-x-1 w-full">
          <NavButton 
            label={<>Захиалга<br/>авах</>} 
            icon="add_circle_outline" 
            active={[View.ORDER_CUSTOMER, View.ORDER_SERVICE, View.ORDER_DETAIL].includes(currentView)}
            onClick={() => setView(View.ORDER_CUSTOMER)} 
          />
          <NavButton 
            label={<>Захиалга<br/>хүлээлгэн өгөх</>} 
            icon="handshake" 
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Буцаалт<br/>олгох</>} 
            icon="keyboard_return" 
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Буцаалт<br/>хүлээж авах</>} 
            icon="download" 
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Ачилт<br/>хийх</>} 
            icon="local_shipping" 
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Ачилт<br/>хүлээж авах</>} 
            icon="inventory" 
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Картын<br/>хүсэлт</>} 
            icon="credit_card" 
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Өдрийн<br/>нээлт</>} 
            icon="wb_sunny" 
            active={currentView === View.DAY_OPEN}
            onClick={() => setView(View.DAY_OPEN)} 
          />
          <NavButton 
            label={<>Өдрийн<br/>хаалт</>} 
            icon="bedtime" 
            active={currentView === View.DAY_CLOSE}
            onClick={() => setView(View.DAY_CLOSE)} 
          />
          <NavButton 
            label={<>Мөнгө<br/>тушаах</>} 
            icon="payments" 
            special={currentView === View.PAYMENT} // Just highlighting for visual cue
            onClick={() => {}} 
          />
          <NavButton 
            label={<>Хаалт<br/>цуцлах</>} 
            icon="cancel_presentation" 
            onClick={() => {}} 
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-background-light dark:bg-background-dark transition-colors duration-200">
        {children}
      </main>
    </div>
  );
};

export default Layout;