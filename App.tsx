import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { View } from './types';
import Login from './views/Login';
import RoleSelect from './views/RoleSelect';
import Dashboard from './views/Dashboard';
import OrderCustomer from './views/OrderCustomer';
import OrderService from './views/OrderService';
import OrderDetail from './views/OrderDetail';
import Payment from './views/Payment';
import DayOpen from './views/DayOpen';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.LOGIN);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from system preference or local storage (mocked here)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Views that don't use the standard Layout
  if (currentView === View.LOGIN) {
    return <Login setView={setView} />;
  }

  if (currentView === View.ROLE_SELECT) {
    return <RoleSelect setView={setView} />;
  }

  // Views wrapped in Layout
  return (
    <Layout currentView={currentView} setView={setView} toggleTheme={toggleTheme} isDark={isDark}>
      {currentView === View.DASHBOARD && <Dashboard setView={setView} />}
      {currentView === View.ORDER_CUSTOMER && <OrderCustomer setView={setView} />}
      {currentView === View.ORDER_SERVICE && <OrderService setView={setView} />}
      {currentView === View.ORDER_DETAIL && <OrderDetail setView={setView} />}
      {currentView === View.PAYMENT && <Payment setView={setView} />}
      {currentView === View.DAY_OPEN && <DayOpen setView={setView} />}
      {/* Placeholder for other views if added */}
      {currentView === View.DAY_CLOSE && <div className="flex items-center justify-center h-full text-gray-500">Day Close View Implementation Pending</div>}
    </Layout>
  );
};

export default App;