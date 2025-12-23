import React, { useState, useEffect } from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  userName: string;
  onLogout: () => void;
}

const NavButton: React.FC<{
  label: React.ReactNode;
  icon: string;
  active?: boolean;
  onClick: () => void;
  variant?: 'yellow' | 'default';
}> = ({ label, icon, active, onClick, variant = 'default' }) => {
  const isYellow = variant === 'yellow';
  
  // Refined size constants for better density
  const activeBtnClass = isYellow 
    ? 'bg-secondary border-secondary shadow-md z-10' 
    : 'bg-primary border-primary shadow-md z-10';
    
  const activeIconClass = isYellow 
    ? 'bg-[#111827] text-white' 
    : 'bg-white text-primary';
    
  const activeTextClass = isYellow 
    ? 'text-[#111827]' 
    : 'text-white';

  const inactiveBtnClass = 'bg-transparent border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm';
  const inactiveIconClass = 'bg-gray-50 border border-gray-100 text-gray-400 group-hover:text-primary group-hover:bg-white';
  const inactiveTextClass = 'text-gray-500';

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[96px] h-[92px] rounded-[24px] transition-all duration-300 group shrink-0 mx-0.5 border-2 ${
        active ? activeBtnClass : inactiveBtnClass
      }`}
    >
      <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-1 transition-all ${
        active ? activeIconClass : inactiveIconClass
      }`}>
        <span className={`material-icons-${active ? 'round' : 'outlined'} text-[22px]`}>
          {icon}
        </span>
      </div>
      <span className={`text-[9.5px] text-center font-futuris leading-[1.1] break-keep uppercase px-1.5 ${
        active ? activeTextClass : inactiveTextClass
      }`}>
        {label}
      </span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, userName, onLogout }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F1F3F4]">
      {/* Header */}
      <header className="bg-primary h-14 flex items-center justify-between px-6 shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(View.DASHBOARD)}>
          <h1 className="text-white font-futuris text-xl tracking-tighter uppercase">SHOES LOVE</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-xs font-artsans uppercase tracking-widest">Өнөөдөр</span>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-white font-bold tracking-wider flex items-center gap-3 border border-white/20">
              <span className="text-xs font-andale">{formatDate(time)}</span>
              <span className="opacity-40">|</span>
              <span className="text-sm font-andale">{formatTime(time)}</span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all flex items-center justify-center border border-white/20 group active:scale-95"
          >
            <span className="material-icons-round text-lg group-hover:rotate-12 transition-transform">logout</span>
          </button>
        </div>
      </header>

      {/* Navigation - Horizontal scrolling with standardized compact button styles */}
      <nav className="bg-white border-b border-gray-200 px-4 shrink-0 shadow-sm z-10 overflow-hidden">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 scroll-smooth py-2.5 h-full w-full flex-nowrap">
          <NavButton 
            label="Нүүр" 
            icon="home" 
            variant="yellow"
            active={currentView === View.DASHBOARD} 
            onClick={() => setView(View.DASHBOARD)} 
          />
          
          <NavButton 
            label="Захиалга авах" 
            icon="add" 
            variant="yellow"
            active={[View.ORDER_CUSTOMER, View.ORDER_SERVICE, View.ORDER_DETAIL, View.PAYMENT].includes(currentView)} 
            onClick={() => setView(View.ORDER_CUSTOMER)} 
          />
          
          <NavButton 
            label={<>Захиалга<br/>хүлээлгэн өгөх</>} 
            icon="handshake" 
            variant="yellow"
            active={currentView === View.ORDER_HANDOVER} 
            onClick={() => setView(View.ORDER_HANDOVER)} 
          />
          <NavButton 
            label={<>Буцаалт<br/>олгох / авах</>} 
            icon="keyboard_return" 
            variant="yellow"
            active={currentView === View.RETURN_MANAGEMENT} 
            onClick={() => setView(View.RETURN_MANAGEMENT)} 
          />
          <NavButton 
            label={<>Ачилт<br/>хийх / авах</>} 
            icon="local_shipping" 
            variant="yellow"
            active={currentView === View.SHIPMENT_MANAGEMENT} 
            onClick={() => setView(View.SHIPMENT_MANAGEMENT)} 
          />
          <NavButton 
            label={<>Картын<br/>хүсэлт</>} 
            icon="credit_card" 
            variant="yellow"
            active={currentView === View.CARD_REQUEST} 
            onClick={() => setView(View.CARD_REQUEST)} 
          />
          <NavButton 
            label={<>Өдрийн<br/>нээлт / хаалт</>} 
            icon="lock_open" 
            variant="yellow"
            active={currentView === View.DAY_MANAGEMENT} 
            onClick={() => setView(View.DAY_MANAGEMENT)} 
          />
          <NavButton 
            label={<>Мөнгө<br/>тушаах</>} 
            icon="payments" 
            variant="yellow"
            active={currentView === View.CASH_SUBMIT} 
            onClick={() => setView(View.CASH_SUBMIT)} 
          />
          <NavButton 
            label={<>Кассын<br/>тайлан</>} 
            icon="cancel_presentation" 
            variant="yellow"
            active={currentView === View.CASH_REPORT} 
            onClick={() => setView(View.CASH_REPORT)} 
          />
          <div className="min-w-[16px] h-full shrink-0"></div>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;