import React, { useState } from 'react';

const DayManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'close'>('open');
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden bg-[#F1F3F4]">
      <div className="flex justify-between items-center shrink-0 px-2">
        <h2 className="text-xl font-black text-gray-500 font-futuris uppercase tracking-tight">Өдрийн удирдлага</h2>
      </div>

      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit shrink-0 ml-2">
        <button 
          onClick={() => setActiveTab('open')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'open' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
        >
          Өдрийн нээлт
        </button>
        <button 
          onClick={() => setActiveTab('close')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'close' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
        >
          Өдрийн хаалт
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-6 mx-2 overflow-y-auto no-scrollbar pb-10">
        <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${activeTab === 'open' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
              <span className="material-icons-round text-3xl">{activeTab === 'open' ? 'wb_sunny' : 'nights_stay'}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                {activeTab === 'open' ? 'Өнөөдрийн нээлт' : 'Өнөөдрийн хаалт'}
              </h3>
              <p className="text-gray-400 text-sm font-artsans uppercase tracking-widest">Системийн төлөв: {activeTab === 'open' ? 'Нээлттэй' : 'Нээлттэй (Хаах боломжтой)'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Огноо</label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                   <span className="material-icons-round text-gray-300">calendar_month</span>
                   <span className="font-andale font-bold text-gray-800">2023.10.27</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Ажилтан</label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 flex items-center gap-4">
                   <span className="material-icons-round text-gray-300">person</span>
                   <span className="font-bold text-gray-800 uppercase tracking-wide">Админ (Manager)</span>
                </div>
              </div>
            </div>

            {activeTab === 'close' ? (
              <div className="bg-[#1A202C] text-white rounded-[24px] p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Өдрийн нийт борлуулалт</h4>
                  <div className="text-4xl font-black font-andale text-secondary">
                    4,500,000 <span className="text-xl">₮</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs mt-4">
                  <span className="material-icons-round text-sm">info</span>
                  <span>Хаалт хийхээс өмнө кассаа тоолсон байх шаардлагатай.</span>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 rounded-[24px] p-8 border border-primary/10 flex items-center justify-center">
                 <div className="text-center">
                   <div className="text-primary font-black text-2xl mb-1 uppercase tracking-tighter">Систем ажиллахад бэлэн</div>
                   <p className="text-gray-400 text-xs uppercase tracking-widest">Өдөр амжилттай нээгдсэн байна</p>
                 </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
             <button 
               disabled={activeTab === 'open'}
               className={`px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-3 ${
                 activeTab === 'open' 
                   ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                   : 'bg-secondary text-gray-900 hover:bg-yellow-400'
               }`}
             >
               <span className="material-icons-round">{activeTab === 'open' ? 'lock' : 'power_settings_new'}</span>
               {activeTab === 'open' ? 'Нээлттэй байна' : 'Өдөр хаах'}
             </button>
          </div>
        </div>

        {/* Recent History Table */}
        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-200">
           <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Сүүлийн 5 хоногийн түүх</h4>
           </div>
           <table className="w-full text-left text-sm">
             <thead className="bg-gray-50/50 text-gray-400">
               <tr>
                 <th className="px-8 py-3 font-bold uppercase tracking-widest text-[10px]">Огноо</th>
                 <th className="px-8 py-3 font-bold uppercase tracking-widest text-[10px]">Нээсэн</th>
                 <th className="px-8 py-3 font-bold uppercase tracking-widest text-[10px]">Хаасан</th>
                 <th className="px-8 py-3 font-bold uppercase tracking-widest text-[10px] text-right">Орлого</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               <tr className="hover:bg-gray-50 transition-colors">
                 <td className="px-8 py-4 font-bold text-gray-700">2023.10.26</td>
                 <td className="px-8 py-4 text-gray-400 font-andale">08:50</td>
                 <td className="px-8 py-4 text-gray-400 font-andale">21:05</td>
                 <td className="px-8 py-4 text-right font-black text-gray-800">3,890,000 ₮</td>
               </tr>
               <tr className="hover:bg-gray-50 transition-colors">
                 <td className="px-8 py-4 font-bold text-gray-700">2023.10.25</td>
                 <td className="px-8 py-4 text-gray-400 font-andale">08:55</td>
                 <td className="px-8 py-4 text-gray-400 font-andale">20:45</td>
                 <td className="px-8 py-4 text-right font-black text-gray-800">4,200,000 ₮</td>
               </tr>
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default DayManagement;