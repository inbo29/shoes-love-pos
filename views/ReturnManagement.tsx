import React, { useState } from 'react';

const ReturnManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'issue' | 'receive'>('issue');
  const [searchTerm, setSearchTerm] = useState('');

  const mockData = activeTab === 'issue' 
    ? [
        { id: '#RET-1001', customer: 'Б.Ариунболд', phone: '99110022', date: '2023.10.27', item: 'Гутал', status: 'Бэлэн', type: 'issue' },
        { id: '#RET-1002', customer: 'Г.Туяа', phone: '88112233', date: '2023.10.27', item: 'Цүнх', status: 'Хүлээгдэж буй', type: 'issue' },
      ]
    : [
        { id: '#RCV-2001', customer: 'С.Баяр', phone: '95115566', date: '2023.10.27', item: 'Хивс', status: 'Хүлээн авсан', type: 'receive' },
      ];

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden bg-[#F1F3F4]">
      <div className="flex justify-between items-center shrink-0 px-2">
        <h2 className="text-xl font-black text-gray-500 font-futuris uppercase tracking-tight">Буцаалт удирдлага</h2>
      </div>

      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit shrink-0 ml-2">
        <button 
          onClick={() => setActiveTab('issue')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'issue' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
        >
          Буцаалт Олгох
        </button>
        <button 
          onClick={() => setActiveTab('receive')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'receive' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
        >
          Буцаалт Авах
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 px-2">
        <button className="bg-secondary hover:bg-yellow-400 text-gray-900 font-black px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm uppercase">
          <span className="material-icons-round text-xl">add_circle</span>
          {activeTab === 'issue' ? 'Буцаалт бүртгэх' : 'Шинэ буцаалт авах'}
        </button>

        <div className="flex-1 max-w-2xl relative">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-20 py-3 rounded-full border border-gray-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Хайлт хийх..."
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-sm">хайлт</button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col mx-2 mb-4">
        <div className="overflow-x-auto flex-1 no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Дугаар</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Харилцагч</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Бараа</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Огноо</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-center">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#F8FDFF] transition-colors h-16">
                  <td className="px-8 py-4 whitespace-nowrap text-primary font-bold">{item.id}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-gray-800 font-bold">{item.customer} <span className="text-gray-400 font-normal text-xs ml-2">({item.phone})</span></td>
                  <td className="px-8 py-4 whitespace-nowrap text-gray-600">{item.item}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-gray-400 text-sm">{item.date}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-center">
                    <span className={`px-4 py-1 text-[10px] font-bold rounded-full ${item.status === 'Бэлэн' || item.status === 'Хүлээн авсан' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReturnManagement;