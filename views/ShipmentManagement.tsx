import React, { useState } from 'react';

const ShipmentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'make' | 'receive'>('make');
  const [searchTerm, setSearchTerm] = useState('');

  const mockData = activeTab === 'make'
    ? [
        { id: '#SHP-7001', destination: 'Төв үйлдвэр', count: 12, date: '2023.10.27', status: 'Ачигдсан' },
        { id: '#SHP-7002', destination: 'Салбар 2', count: 5, date: '2023.10.27', status: 'Бэлтгэж буй' },
      ]
    : [
        { id: '#RCV-8001', from: 'Төв агуулах', count: 24, date: '2023.10.27', status: 'Ирсэн' },
      ];

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden bg-[#F1F3F4]">
      <div className="flex justify-between items-center shrink-0 px-2">
        <h2 className="text-xl font-black text-gray-500 font-futuris uppercase tracking-tight">Ачилт удирдлага</h2>
      </div>

      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit shrink-0 ml-2">
        <button 
          onClick={() => setActiveTab('make')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'make' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
        >
          Ачилт Хийх
        </button>
        <button 
          onClick={() => setActiveTab('receive')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'receive' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
        >
          Бараа Хүлээн Авах
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 px-2">
        <button className="bg-secondary hover:bg-yellow-400 text-gray-900 font-black px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm uppercase">
          <span className="material-icons-round text-xl">local_shipping</span>
          {activeTab === 'make' ? 'Ачилт бүртгэх' : 'Орлого авах'}
        </button>

        <div className="flex-1 max-w-2xl relative">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-20 py-3 rounded-full border border-gray-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Ачилтын № хайх..."
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col mx-2 mb-4">
        <div className="overflow-x-auto flex-1 no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Ачилтын №</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">{activeTab === 'make' ? 'Хүрэх цэг' : 'Илгээгч'}</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Тоо хэмжээ</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-r border-white/10">Огноо</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-center">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((item: any, idx) => (
                <tr key={idx} className="hover:bg-[#F8FDFF] transition-colors h-16">
                  <td className="px-8 py-4 whitespace-nowrap text-primary font-bold">{item.id}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-gray-800 font-bold">{activeTab === 'make' ? item.destination : item.from}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-gray-600 font-andale font-bold">{item.count} ширхэг</td>
                  <td className="px-8 py-4 whitespace-nowrap text-gray-400 text-sm">{item.date}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-center">
                    <span className={`px-4 py-1 text-[10px] font-bold rounded-full ${item.status === 'Ачигдсан' || item.status === 'Ирсэн' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
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

export default ShipmentManagement;