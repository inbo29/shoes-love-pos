import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { View } from '../../types';

interface PosLayoutProps {
  children: React.ReactNode;
  currentView?: View | any;
  setView?: (view: View) => void;
  userName: string;
  branchName?: string;
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
      className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] md:min-w-[96px] md:h-[92px] rounded-[20px] md:rounded-[24px] transition-all duration-300 group shrink-0 mx-0.5 border-2 ${active ? activeBtnClass : inactiveBtnClass
        }`}
    >
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-[12px] md:rounded-[14px] flex items-center justify-center mb-1 transition-all ${active ? activeIconClass : inactiveIconClass
        }`}>
        <span className={`material-icons-${active ? 'round' : 'outlined'} text-[20px] md:text-[22px]`}>
          {icon}
        </span>
      </div>
      <span className={`text-[9px] md:text-[9.5px] text-center font-futuris leading-[1.1] break-keep uppercase px-1.5 ${active ? activeTextClass : inactiveTextClass
        }`}>
        {label}
      </span>
    </button>
  );
};

const PosLayout: React.FC<PosLayoutProps> = ({ children, userName, branchName = 'Төв салбар', onLogout }) => {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path: string) => location.pathname === path;
  const isOrdersActive = location.pathname.startsWith('/pos/orders');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F1F3F4]">
      {/* Header */}
      <header className="bg-primary h-14 flex items-center justify-between px-6 shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/pos/dashboard')}>
          <h1 className="text-white font-futuris text-xl tracking-tighter uppercase">SHOES LOVE</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/20 pb-0.5">{branchName}</span>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-bold tracking-wider flex items-center gap-3 border border-white/10 shadow-inner">
              <span className="text-[10px] font-andale opacity-80">{formatDate(time)}</span>
              <span className="opacity-20 text-xs">|</span>
              <span className="text-xs font-andale">{formatTime(time)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/50 font-black uppercase tracking-tighter leading-none mb-1">Ажилтан</span>
              <span className="text-xs text-white font-bold leading-none">{userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center border border-white/10 group active:scale-95 shadow-sm"
            >
              <span className="material-icons-round text-lg group-hover:rotate-12 transition-transform">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation - Horizontal scrolling with standardized compact button styles */}
      <nav className="bg-white border-b border-gray-200 px-4 shrink-0 shadow-sm z-10 overflow-hidden">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 scroll-smooth py-2.5 h-full w-full flex-nowrap">
          <NavButton
            label="Нүүр"
            icon="home"
            active={isActive('/pos/dashboard')}
            onClick={() => navigate('/pos/dashboard')}
          />

          <NavButton
            label="Захиалга авах"
            icon="add"
            active={isOrdersActive}
            onClick={() => navigate('/pos/orders')}
          />

          <NavButton
            label={<>Захиалга<br />хүлээлгэн өгөх</>}
            icon="handshake"
            active={location.pathname.startsWith('/pos/receive')}
            onClick={() => navigate('/pos/receive')}
          />
          {/* <NavButton
            label={<>Буцаалт<br />хийх / олгох</>}
            icon="keyboard_return"
            active={isActive('/pos/returns')}
            onClick={() => navigate('/pos/returns')}
          /> */}

          {/* Products Module - Individual Buttons */}
          <NavButton
            label={<>Бараа<br />зарах</>}
            icon="shopping_cart"
            active={location.pathname.startsWith('/pos/sell')}
            onClick={() => navigate('/pos/sell')}
          />
          <NavButton
            label={<>Бараа<br />удирдах</>}
            icon="add_shopping_cart"
            active={location.pathname.startsWith('/pos/product-order')}
            onClick={() => navigate('/pos/product-order')}
          />
          <NavButton
            label={<>Бараа<br />тооллого</>}
            icon="inventory"
            active={isActive('/pos/inventory')}
            onClick={() => navigate('/pos/inventory')}
          />
          <NavButton
            label={<>Бараа<br />шилжүүлэх</>}
            icon="sync_alt"
            active={isActive('/pos/transfer')}
            onClick={() => navigate('/pos/transfer')}
          />
          <NavButton
            label={<>Бараа<br />буцаалт</>}
            icon="assignment_return"
            active={isActive('/pos/product-return')}
            onClick={() => navigate('/pos/product-return')}
          />

          <NavButton
            label={<>Ачилт<br />хийх / авах</>}
            icon="local_shipping"
            active={location.pathname.startsWith('/pos/shipments')}
            onClick={() => navigate('/pos/shipments')}
          />
          <NavButton
            label={<>Гишүүнчлэл</>}
            icon="credit_card"
            active={isActive('/pos/cards')}
            onClick={() => navigate('/pos/cards')}
          />
          <NavButton
            label={<>Өдрийн<br />нээлт / хаалт</>}
            icon="lock_open"
            active={isActive('/pos/management/day')}
            onClick={() => navigate('/pos/management/day')}
          />
          <NavButton
            label={<>Мөнгө<br />тушаах</>}
            icon="payments"
            active={isActive('/pos/cash-submit')}
            onClick={() => navigate('/pos/cash-submit')}
          />
          <NavButton
            label={<>Кассын<br />тайлан</>}
            icon="assessment"
            // variant="yellow"
            active={isActive('/pos/cash-report')}
            onClick={() => navigate('/pos/cash-report')}
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

export default PosLayout;