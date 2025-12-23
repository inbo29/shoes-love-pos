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
  onClick: () => void;
}> = ({ label, icon, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[100px] py-3 px-1 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-[#E9F7F8] dark:bg-primary/20 text-primary' 
          : 'text-[#40C1C7] hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <span className={`material-icons-outlined text-3xl mb-1 transition-transform group-hover:scale-110`}>
        {icon}
      </span>
      <span className="text-[11px] text-center font-bold leading-tight break-keep">{label}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, toggleTheme, isDark }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F1F3F4] dark:bg-background-dark">
      {/* Header */}
      <header className="bg-primary h-16 flex items-center justify-between px-6 shadow-sm shrink-0 z-20 relative">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(View.DASHBOARD)}>
          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="material-icons-round text-white text-2xl">hiking</span>
          </div>
          <h1 className="text-white font-black text-xl tracking-tight font-display">SHOES LOVE</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white">
            <span className="material-icons-round text-xl">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <div className="flex items-center text-white font-bold bg-white/10 px-4 py-2 rounded-xl border border-white/10 text-sm">
            <span className="material-icons-outlined text-lg mr-2">calendar_today</span>
            <span className="bg-white/20 px-1.5 rounded mr-2">2023.10.27</span>
            <span>14:30</span>
          </div>
          <div className="flex items-center text-white font-bold bg-white/10 px-4 py-2 rounded-xl">
            <span className="material-icons-round mr-2 text-xl">person</span>
            <span>Админ</span>
          </div>
        </div>
      </header>

      {/* Navigation - Exact Match to provided image */}
      <nav className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark py-2 px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between max-w-full overflow-x-auto no-scrollbar gap-1">
          <NavButton 
            label={<>Захиалга<br/>авах</>} 
            icon="add_circle_outline" 
            active={[View.DASHBOARD, View.ORDER_CUSTOMER, View.ORDER_SERVICE, View.ORDER_DETAIL, View.PAYMENT].includes(currentView)}
            onClick={() => setView(View.DASHBOARD)} 
          />
          <NavButton 
            label={<>Захиалга<br/>хүлээлгэн өгөх</>} 
            icon="handshake" 
            active={currentView === View.ORDER_HANDOVER}
            onClick={() => setView(View.ORDER_HANDOVER)} 
          />
          <NavButton 
            label={<>Буцаалт<br/>олгох</>} 
            icon="keyboard_return" 
            active={currentView === View.RETURN_OUT}
            onClick={() => setView(View.RETURN_OUT)} 
          />
          <NavButton 
            label={<>Буцаалт<br/>хүлээж авах</>} 
            icon="file_download" 
            active={currentView === View.RETURN_IN}
            onClick={() => setView(View.RETURN_IN)} 
          />
          <NavButton 
            label={<>А치лт<br/>хийх</>} 
            icon="local_shipping" 
            active={currentView === View.SHIPMENT_OUT}
            onClick={() => setView(View.SHIPMENT_OUT)} 
          />
          <NavButton 
            label={<>Ачилт<br/>хүлээж авах</>} 
            icon="fact_check" 
            active={currentView === View.SHIPMENT_IN}
            onClick={() => setView(View.SHIPMENT_IN)} 
          />
          <NavButton 
            label={<>Картын<br/>хүсэлт</>} 
            icon="credit_card" 
            active={currentView === View.CARD_REQUEST}
            onClick={() => setView(View.CARD_REQUEST)} 
          />
          <NavButton 
            label={<>Өдрийн<br/>нээлт</>} 
            icon="wb_sunny" 
            active={currentView === View.DAY_OPEN}
            onClick={() => setView(View.DAY_OPEN)} 
          />
          <NavButton 
            label={<>Өдрийн<br/>хаал트</>} 
            icon="bedtime" 
            active={currentView === View.DAY_CLOSE}
            onClick={() => setView(View.DAY_CLOSE)} 
          />
          <NavButton 
            label={<>Мөнгө<br/>тушаах</>} 
            icon="payments" 
            active={currentView === View.CASH_SUBMIT}
            onClick={() => setView(View.CASH_SUBMIT)} 
          />
          <NavButton 
            label={<>Хаалт<br/>цуцлах</>} 
            icon="cancel_presentation" 
            active={currentView === View.CANCEL_CLOSE}
            onClick={() => setView(View.CANCEL_CLOSE)} 
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;