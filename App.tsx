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
import GenericListView from './views/GenericListView';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.LOGIN);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  if (currentView === View.LOGIN) {
    return <Login setView={setView} />;
  }

  if (currentView === View.ROLE_SELECT) {
    return <RoleSelect setView={setView} />;
  }

  const mockData = [
    { id: '#2023-1001', info: 'Гутал засвар', customer: 'Бат-Эрдэнэ', date: '2023.10.27 14:15', status: 'Шинэ', statusColor: 'bg-green-100 text-green-800', amount: '45,000 ₮' },
    { id: '#2023-1002', info: 'Хими цэвэрлэгээ', customer: 'Сарнай', date: '2023.10.27 13:45', status: 'Хийгдэж буй', statusColor: 'bg-blue-100 text-blue-800', amount: '120,000 ₮' },
    { id: '#2023-1003', info: 'Хивс угаалга', customer: 'Гантулга', date: '2023.10.27 12:30', status: 'Бэлэн', statusColor: 'bg-yellow-100 text-yellow-800', amount: '89,000 ₮' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard setView={setView} />;
      case View.ORDER_CUSTOMER: return <OrderCustomer setView={setView} />;
      case View.ORDER_SERVICE: return <OrderService setView={setView} />;
      case View.ORDER_DETAIL: return <OrderDetail setView={setView} />;
      case View.PAYMENT: return <Payment setView={setView} />;
      case View.DAY_OPEN: return <DayOpen setView={setView} />;
      
      case View.ORDER_HANDOVER: 
        return <GenericListView title="Захиалга хүлээлгэн өгөх жагсаалт" data={mockData} />;
      case View.RETURN_OUT: 
        return <GenericListView title="Буцаалт олгох жаг사алт" data={mockData} />;
      case View.RETURN_IN: 
        return <GenericListView title="Буцаалт хүлээж авах жаг사алт" data={mockData} />;
      case View.SHIPMENT_OUT: 
        return <GenericListView title="А치лт хийх жаг사алт" data={mockData} />;
      case View.SHIPMENT_IN: 
        return <GenericListView title="Ачилт хүлээж авах жа그사алт" data={mockData} />;
      case View.CARD_REQUEST: 
        return <GenericListView title="Картын хүсэлтүүд" data={mockData} />;
      case View.DAY_CLOSE: 
        return <GenericListView title="Өдрийн хаалтын жаг사алт" data={mockData} />;
      case View.CASH_SUBMIT: 
        return <GenericListView title="Мөнгө тушаах бүртгэл" data={mockData} />;
      case View.CANCEL_CLOSE: 
        return <GenericListView title="Хаалт цуцлах хүсэлт" data={mockData} />;
      default: return <Dashboard setView={setView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView} toggleTheme={toggleTheme} isDark={isDark}>
      {renderContent()}
    </Layout>
  );
};

export default App;