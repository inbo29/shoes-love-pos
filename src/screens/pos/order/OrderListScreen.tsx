import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_DATA = [
    { id: '#ORD-2023-1001', info: 'Гутал (Угаалга, Будалт)', customer: 'Бат-Эрдэнэ Болд', phone: '9911-2345', date: '2023.10.27 14:15', status: 'Шинэ', statusColor: 'bg-green-100 text-green-800', amount: '45,000 ₮' },
    { id: '#ORD-2023-1002', info: 'Хими цэвэрлэгээ', customer: 'Сүхбаатар Сарнай', phone: '8800-5566', date: '2023.10.27 13:45', status: 'Хүлээгдэж буй', statusColor: 'bg-yellow-100 text-yellow-800', amount: '89,900 ₮' },
    { id: '#ORD-2023-1003', info: 'Хивс угаалга', customer: 'Доржпүрэв Гантулга', phone: '9191-3344', date: '2023.10.27 12:30', status: 'Бэлэн', statusColor: 'bg-blue-100 text-blue-800', amount: '245,000 ₮' },
    { id: '#ORD-2023-0998', info: 'Цэцэгмаа Энхтуяа', customer: '9988-7766', phone: '9988-7766', date: '2023.10.27 11:20', status: 'Хүргэгдсэн', statusColor: 'bg-gray-100 text-gray-800', amount: '55,000 ₮' },
    { id: '#ORD-2023-0995', info: 'Төмөрбаатар Жаргал', customer: '8080-1212', phone: '8080-1212', date: '2023.10.27 10:05', status: 'Цуцлагдсан', statusColor: 'bg-red-100 text-red-800', amount: '0 ₮' },
    { id: '#ORD-2023-0990', info: 'Алтанхуяг Болор', customer: '9595-6677', phone: '9595-6677', date: '2023.10.26 18:45', status: 'Шинэ', statusColor: 'bg-green-100 text-green-800', amount: '320,000 ₮' },
];

const OrderListScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [data] = useState(INITIAL_DATA);

    const filteredData = data.filter(item =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm)
    );

    return (
        <div className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-hidden h-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <button
                    onClick={() => navigate('/pos/orders/new/step/1')}
                    className="bg-secondary hover:bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all font-bold uppercase tracking-wide active:scale-95"
                >
                    <span className="material-icons-round">add_circle</span>
                    Шинэ захиалга авах
                </button>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:min-w-[400px]">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-lg md:text-xl">search</span>
                        </span>
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm shadow-sm transition-all"
                            placeholder="Нэр / утас / захиалга №-р хайх"
                            type="text"
                        />
                    </div>
                    <button className="bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 px-3 md:px-4 py-2 md:py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-colors">
                        <span className="material-icons-round text-green-600 text-lg md:text-xl">table_view</span>
                        <span className="font-bold text-xs md:text-sm">Excel татах</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                {/* Table Header */}
                <div className="bg-[#40C1C7] text-white px-4 md:px-6 py-3 md:py-4 flex text-[10px] md:text-xs font-black uppercase tracking-wider">
                    <div className="flex-1">Захиалгын №</div>
                    <div className="flex-1">Хэрэглэгчийн нэр</div>
                    <div className="flex-1">Утас</div>
                    <div className="flex-1">Огноо</div>
                    <div className="w-32 text-center">Төлөв</div>
                    <div className="w-32 text-right">Нийт дүн</div>
                </div>

                <div className="overflow-y-auto flex-1 no-scrollbar">
                    {filteredData.length > 0 ? filteredData.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                const pureId = item.id.replace('#', '');
                                navigate(`/pos/orders/${pureId}/edit/step/1`);
                            }}
                            className="flex px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 dark:border-gray-700 hover:bg-primary/5 cursor-pointer transition-colors items-center text-sm"
                        >
                            <div className="flex-1 font-bold text-[#40C1C7]">{item.id}</div>
                            <div className="flex-1 font-bold text-gray-800 dark:text-white">{item.customer}</div>
                            <div className="flex-1 text-gray-500 dark:text-gray-400 font-medium">{item.phone}</div>
                            <div className="flex-1 text-gray-400 dark:text-gray-500 text-xs">{item.date}</div>
                            <div className="w-32 flex justify-center">
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${item.statusColor}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="w-32 text-right font-black text-gray-900 dark:text-white">{item.amount}</div>
                        </div>
                    )) : (
                        <div className="p-10 text-center text-gray-400">Мэдээлэл олдсонгүй</div>
                    )}
                </div>

                <div className="bg-white dark:bg-surface-dark p-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center">
                    {/* <span>Нийт <b>{filteredData.length}</b> захиалгаас 1-ээс {Math.min(filteredData.length, 6)}-г харуулж байна</span> */}
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-gray-400">«</button>
                        <button className="w-8 h-8 flex items-center justify-center border rounded bg-secondary/10 text-secondary font-bold border-secondary">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-gray-600">2</button>
                        <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-gray-600">3</button>
                        <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-gray-400">»</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderListScreen;
