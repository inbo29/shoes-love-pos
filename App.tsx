import React, { useState } from 'react';
import Layout from './components/Layout';
import { View } from './types';
import Login from './views/Login';
import RoleSelect from './views/RoleSelect';
import Dashboard from './views/Dashboard';
import OrderCustomer from './views/OrderCustomer';
import OrderService from './views/OrderService';
import OrderDetail from './views/OrderDetail';
import Payment from './views/Payment';
import GenericListView from './views/GenericListView';

const INITIAL_DATA = [
  { id: '#ORD-2023-1001', info: 'Гутал (Угаалга, Будалт)', customer: 'Бат-Эрдэнэ Болд', phone: '9911-2345', date: '2023.10.27 14:15', status: 'Шинэ', statusColor: 'bg-green-100 text-green-800', amount: '45,000 ₮' },
  { id: '#ORD-2023-1002', info: 'Хими цэвэрлэгээ', customer: 'Сүхбаатар Сарнай', phone: '8800-5566', date: '2023.10.27 13:45', status: 'Хүлээгдэж буй', statusColor: 'bg-yellow-100 text-yellow-800', amount: '89,900 ₮' },
  { id: '#ORD-2023-1003', info: 'Хивс угаалга', customer: 'Доржпүрэв Гантулга', phone: '9191-3344', date: '2023.10.27 12:30', status: 'Бэлэн', statusColor: 'bg-blue-100 text-blue-800', amount: '245,000 ₮' },
];

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.LOGIN);
  const [userName, setUserName] = useState('Админ');
  const [orders, setOrders] = useState(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogin = (id: string, pw: string) => {
    const userId = id.toLowerCase();
    if (userId === 'admin' && pw === '1234') {
      setUserName('Админ');
      setView(View.ROLE_SELECT);
    } else if (userId === 'worker' && pw === '1234') {
      setUserName('Ажилтан');
      setView(View.DASHBOARD);
    } else {
      alert('Буруу мэдээлэл байна! (admin/1234 эсвэл worker/1234)');
    }
  };

  const handleLogout = () => {
    setSearchTerm('');
    setView(View.LOGIN);
  };

  const addNewOrder = (newOrder: any) => {
    setOrders([newOrder, ...orders]);
  };

  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm)
  );

  if (currentView === View.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentView === View.ROLE_SELECT) {
    return <RoleSelect setView={setView} onLogout={handleLogout} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: 
        return <Dashboard setView={setView} />;
      case View.ORDER_CUSTOMER: return <OrderCustomer setView={setView} />;
      case View.ORDER_SERVICE: return <OrderService setView={setView} />;
      case View.ORDER_DETAIL: return <OrderDetail setView={setView} />;
      case View.PAYMENT: 
        return <Payment setView={setView} onComplete={addNewOrder} />;
      
      case View.ORDER_HANDOVER: 
        return <GenericListView title="Захиалга хүлээлгэн өгөх" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case View.RETURN_MANAGEMENT: 
        return <GenericListView title="Буцаалт олгох / авах" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case View.SHIPMENT_MANAGEMENT: 
        return <GenericListView title="Ачилт хийх / авах" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case View.CARD_REQUEST: 
        return <GenericListView title="Картын хүсэлт" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case View.DAY_MANAGEMENT: 
        return <GenericListView title="Өдрийн нээлт / хаалт" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case View.CASH_SUBMIT: 
        return <GenericListView title="Мөнгө тушаах" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case View.CASH_REPORT: 
        return <GenericListView title="Кассын тайлан" data={filteredOrders} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      default: 
        return <Dashboard setView={setView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setView} 
      userName={userName}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;