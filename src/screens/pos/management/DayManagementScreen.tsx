import React, { useState, useEffect } from 'react';
import { mockDayManagementData, DayRecord } from '../../../services/mockDayManagementData';
import Popup from '../../../shared/components/Popup/Popup';

const DayManagementScreen: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'open' | 'close'>('open');
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [records, setRecords] = useState<DayRecord[]>(mockDayManagementData);

    // Simulated Role
    const userRole: 'ADMIN' | 'STAFF' = 'ADMIN';
    const userName = 'Б.Болд';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB').replace(/\//g, '.');
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-GB', { hour12: false });
    };

    const filteredRecords = records.filter(r => {
        const matchesTab = activeTab === 'open' ? !!r.openTime : !!r.closeTime;
        const matchesSearch = userRole === 'ADMIN' ? r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) : r.employeeName === userName;
        return matchesTab && matchesSearch;
    });

    const handleAction = () => {
        setShowConfirmPopup(true);
    };

    const confirmAction = () => {
        setShowConfirmPopup(false);
        // Simulate adding record
        const newRecord: DayRecord = {
            id: Math.random().toString(),
            date: formatDate(currentTime),
            openTime: activeTab === 'open' ? formatTime(currentTime) : undefined,
            closeTime: activeTab === 'close' ? formatTime(currentTime) : undefined,
            employeeName: userName + (userRole === 'ADMIN' ? ' (Admin)' : ' (Staff)'),
            status: activeTab === 'open' ? 'Нээлттэй' : 'Хаагдсан'
        };
        setRecords([newRecord, ...records]);
        setShowSuccessPopup(true);
    };

    return (
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden h-full bg-gray-50/50">
            {/* Header Area */}
            <div className="bg-[#40C1C7] rounded-2xl shadow-lg p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="material-icons-round text-2xl">wb_sunny</span>
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight italic">Shoes Love</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-black/10 px-4 py-1.5 rounded-lg border border-white/10">
                        <span className="material-icons-round text-sm">schedule</span>
                        <span className="text-sm font-bold tracking-wider">{formatDate(currentTime)} {formatTime(currentTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white text-[#40C1C7] px-4 py-1.5 rounded-lg font-black shadow-sm">
                        <span className="material-icons-round text-sm">person</span>
                        <span className="text-xs uppercase">{userName}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                {/* Tabs & Search */}
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('open')}
                            className={`flex-1 md:w-40 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'open' ? 'bg-white text-green-500 shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span className="material-icons-round text-sm">login</span>
                            Ирсэн (Нээлт)
                        </button>
                        <button
                            onClick={() => setActiveTab('close')}
                            className={`flex-1 md:w-40 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'close' ? 'bg-white text-red-500 shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <span className="material-icons-round text-sm">logout</span>
                            Тарсан (Хаалт)
                        </button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {userRole === 'ADMIN' && (
                            <div className="relative flex-1 md:w-64">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <span className="material-icons-round text-lg">search</span>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Нэрээр хайх..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#40C1C7]/20 transition-all font-bold"
                                />
                            </div>
                        )}
                        <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="material-icons-round text-lg">filter_alt</span>
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-40">Огноо</div>
                    <div className="w-40">{activeTab === 'open' ? 'Нээсэн цаг' : 'Хаасан цаг'}</div>
                    <div className="flex-1">Ажилтны нэр</div>
                    <div className="w-32 text-center">Төлөв</div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="px-8 py-5 border-b border-gray-50 flex items-center hover:bg-gray-50/30 transition-colors group">
                            <div className="w-40 text-sm font-bold text-gray-700">{record.date}</div>
                            <div className="w-40 text-sm font-black text-[#40C1C7] italic">
                                {activeTab === 'open' ? record.openTime : record.closeTime}
                            </div>
                            <div className="flex-1 text-sm font-bold text-gray-600">{record.employeeName}</div>
                            <div className="w-32 flex justify-center">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${record.status === 'Нээлттэй' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-gray-50 text-gray-400'
                                    }`}>
                                    {record.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {filteredRecords.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 opacity-20">
                            <span className="material-icons-round text-6xl">history</span>
                            <p className="mt-2 font-black uppercase tracking-widest">Бичлэг байхгүй</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Area */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xs font-black text-[#40C1C7] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-icons-round text-sm">{activeTab === 'open' ? 'wb_sunny' : 'nightlight_round'}</span>
                    Өдөр {activeTab === 'open' ? 'нээх' : 'хаах'}
                </h3>
                <div className="flex flex-col md:flex-row items-end gap-6">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Огноо</label>
                            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-600 flex items-center gap-3">
                                <span className="material-icons-round text-gray-300 text-lg">calendar_today</span>
                                {formatDate(currentTime)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Цаг (Систем)</label>
                            {/* Read-only time as per user request (Employees cannot edit) */}
                            <div className="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100 text-sm font-black text-orange-600 flex items-center gap-3 italic">
                                <span className="material-icons-round text-orange-300 text-lg">timer</span>
                                {formatTime(currentTime)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ажилтан</label>
                            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-600 flex items-center gap-3">
                                <span className="material-icons-round text-gray-300 text-lg">person_pin</span>
                                {userName}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleAction}
                        className={`w-full md:w-64 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${activeTab === 'open'
                                ? 'bg-yellow-400 text-gray-900 shadow-yellow-400/30 hover:bg-yellow-500'
                                : 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600'
                            }`}
                    >
                        <span className="material-icons-round">
                            {activeTab === 'open' ? 'play_arrow' : 'stop'}
                        </span>
                        Өдөр {activeTab === 'open' ? 'нээх' : 'хаах'}
                    </button>
                </div>
            </div>

            {/* Confirmation Popup */}
            {showConfirmPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 text-center space-y-4">
                            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${activeTab === 'open' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                                }`}>
                                <span className="material-icons-round text-4xl">
                                    {activeTab === 'open' ? 'wb_sunny' : 'nightlight_round'}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-gray-800">
                                {activeTab === 'open' ? 'Өдрийн нээлт' : 'Өдрийн хаалт'}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Та өдрийн {activeTab === 'open' ? 'нээлт хийж цагийг' : 'хаалт хийж цагийг'} бүртгэх үү?
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowConfirmPopup(false)}
                                className="flex-1 py-3.5 bg-white border border-gray-200 rounded-2xl text-xs font-black text-gray-400 hover:bg-gray-100 transition-all uppercase tracking-widest"
                            >
                                Цуцлах
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`flex-1 py-3.5 rounded-2xl text-xs font-black text-white shadow-lg transition-all active:scale-95 uppercase tracking-widest ${activeTab === 'open' ? 'bg-green-500 shadow-green-500/30 hover:bg-green-600' : 'bg-red-500 shadow-red-500/30 hover:bg-red-600'
                                    }`}
                            >
                                Баталгаажуулах
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            <Popup
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                type="success"
                title="Амжилттай"
                message={`Өдрийн ${activeTab === 'open' ? 'нээлт' : 'хаалт'} амжилттай бүртгэгдлээ.`}
            />
        </div>
    );
};

export default DayManagementScreen;
