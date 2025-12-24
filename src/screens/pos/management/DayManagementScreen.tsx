import React, { useState, useEffect, useMemo } from 'react';
import { mockDayManagementData, DayRecord } from '../../../services/mockDayManagementData';
import Popup from '../../../shared/components/Popup/Popup';
import PosExcelButton from '../../../shared/components/PosExcelButton';
import PosPagination from '../../../shared/components/PosPagination';
import PosDateRangePicker from '../../../shared/components/PosDateRangePicker';

const DayManagementScreen: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [records, setRecords] = useState<DayRecord[]>(() => {
        return mockDayManagementData.map(r => ({
            ...r,
            role: r.employeeName.includes('Админ') ? 'Manager' : 'Staff'
        }));
    });
    const [currentPage, setCurrentPage] = useState(1);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const userName = 'Б.Болд';
    const userRoleText = 'Manager';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}.${m}.${d}`;
    };
    const formatTime = (date: Date) => date.toLocaleTimeString('en-GB', { hour12: false });

    const calculateDuration = (open?: string, close?: string) => {
        if (!open || !close) return '—';
        const [h1, m1, s1] = open.split(':').map(Number);
        const [h2, m2, s2] = close.split(':').map(Number);
        const d1 = new Date(2000, 0, 1, h1, m1, s1);
        const d2 = new Date(2000, 0, 1, h2, m2, s2);
        const diffMs = d2.getTime() - d1.getTime();
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        return `${diffHrs}ц ${diffMins}мин`;
    };

    const todayStr = formatDate(currentTime);
    const activeShift = records.find(r => r.date === todayStr && r.employeeName.includes(userName) && r.status === 'Нээлттэй');
    const isClockedIn = !!activeShift;

    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch = r.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
            const recDate = new Date(r.date.replace(/\./g, '-'));
            const matchesDate = (!startDate || recDate >= startDate) && (!endDate || recDate <= endDate);
            return matchesSearch && matchesDate;
        }).sort((a, b) => new Date(b.date.replace(/\./g, '-')).getTime() - new Date(a.date.replace(/\./g, '-')).getTime());
    }, [records, searchTerm, startDate, endDate]);

    const itemsPerPage = 10;
    const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAction = () => setShowConfirmPopup(true);

    const confirmAction = () => {
        setShowConfirmPopup(false);
        const timeStr = formatTime(currentTime);

        if (!isClockedIn) {
            const newRecord: DayRecord = {
                id: Math.random().toString(),
                date: todayStr,
                openTime: timeStr,
                employeeName: `${userName} (${userRoleText})`,
                status: 'Нээлттэй'
            };
            setRecords([newRecord, ...records]);
        } else {
            setRecords(prev => prev.map(r =>
                r.id === activeShift?.id
                    ? { ...r, closeTime: timeStr, status: 'Хаагдсан' }
                    : r
            ));
        }
        setShowSuccessPopup(true);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F1F5F9] overflow-y-auto no-scrollbar overflow-visible">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 pb-20 overflow-visible">

                {/* 1. Header Card - Teal Banner */}
                <div className="bg-[#40C1C7] rounded-[32px] shadow-2xl p-6 flex items-center justify-between text-white shrink-0">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black italic tracking-tighter leading-none">SHOES LOVE</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-1">Attendance Management</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-white/10 px-5 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-3">
                            <span className="material-icons-round text-sm opacity-60">schedule</span>
                            <span className="text-sm font-black tracking-widest whitespace-nowrap">{formatDate(currentTime)} {formatTime(currentTime)}</span>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                            <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Manager</p>
                                <p className="text-sm font-black whitespace-nowrap">{userName}</p>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <span className="material-icons-round text-[#40C1C7] text-2xl">person</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Filter Card (Static Position & Overflow Visible) */}
                <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-8 flex flex-col xl:flex-row items-end justify-between gap-6 relative z-[10] overflow-visible">
                    <div className="flex flex-col sm:flex-row items-end gap-8 flex-nowrap shrink-0 overflow-visible">
                        <PosDateRangePicker
                            label="Шүүх хугацаа"
                            start={startDate}
                            end={endDate}
                            onChange={(s, e) => {
                                setStartDate(s);
                                setEndDate(e);
                                setCurrentPage(1);
                            }}
                        />

                        <div className="flex flex-col gap-1.5 shrink-0 w-full sm:w-[320px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ажилтан хайх</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                                    <span className="material-icons-round text-lg">search</span>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Нэрээр хайх..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="w-full h-[44px] pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all hover:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 h-[44px]">
                        <PosExcelButton />
                    </div>
                </div>

                {/* 3. List Card (Relative Position, Overflow Visible for Popups) */}
                <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 flex flex-col relative z-[1] min-h-[400px] overflow-visible">
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-gray-50/50 sticky top-0 z-10">
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-8 py-5">Огноо</th>
                                    <th className="px-8 py-5">Ажилтны нэр</th>
                                    <th className="px-8 py-5">Ирсэн</th>
                                    <th className="px-8 py-5">Тарсан</th>
                                    <th className="px-8 py-5">Хугацаа</th>
                                    <th className="px-8 py-5 text-center">Төлөв</th>
                                    <th className="px-8 py-5 text-right w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedRecords.length > 0 ? paginatedRecords.map((record) => (
                                    <tr key={record.id} className="group hover:bg-primary/[0.02] transition-colors">
                                        <td className="px-8 py-5 text-[13px] font-bold text-gray-700">{record.date}</td>
                                        <td className="px-8 py-5">
                                            <span className="text-[13px] font-black text-gray-800">{record.employeeName.split(' (')[0]}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons-round text-green-500 text-lg">login</span>
                                                <span className="text-[14px] font-black text-gray-900">{record.openTime?.slice(0, 5) || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`material-icons-round text-lg ${record.closeTime ? 'text-red-500' : 'text-gray-200'}`}>logout</span>
                                                <span className={`text-[14px] font-black ${record.closeTime ? 'text-gray-900' : 'text-gray-300'}`}>
                                                    {record.closeTime?.slice(0, 5) || '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[13px] font-bold text-gray-700 whitespace-nowrap">
                                                {calculateDuration(record.openTime, record.closeTime)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 whitespace-nowrap
                                                    ${record.status === 'Нээлттэй'
                                                        ? 'bg-green-100 text-green-600 border-green-200'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200'
                                                    }
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'Нээлттэй' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                                    {record.status === 'Нээлттэй' ? 'Ажиллаж байна' : 'Хааг드сан'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="material-icons-round text-gray-200 text-lg">lock_outline</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-32 text-center">
                                            <span className="material-icons-round text-7xl opacity-10 text-gray-400 block mb-4">history</span>
                                            <p className="font-black uppercase tracking-widest text-gray-300">Бүртгэл олдсонгүй</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-gray-50 flex justify-center">
                        <PosPagination
                            totalItems={filteredRecords.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                {/* 4. Action Card (Bottom) */}
                <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 p-10 shrink-0">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">ӨДӨР НЭЭХ</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">ATTENDANCE ACTION</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-end gap-10">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Одоогийн огноо</label>
                                <div className="h-[56px] px-6 bg-gray-50 rounded-2xl border border-gray-200 text-[14px] font-bold text-gray-700 flex items-center gap-4">
                                    <span className="material-icons-round text-gray-300">calendar_today</span>
                                    {todayStr}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Систе미йн цаг</label>
                                <div className="h-[56px] px-6 bg-[#40C1C7]/5 rounded-2xl border border-[#40C1C7]/10 text-[20px] font-black text-[#40C1C7] flex items-center gap-4 italic shadow-inner">
                                    <span className="material-icons-round text-[#40C1C7]/30">timer</span>
                                    {formatTime(currentTime)}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ажилтан</label>
                                <div className="h-[56px] px-6 bg-gray-50 rounded-2xl border border-gray-100 text-[14px] font-bold text-gray-700 flex items-center gap-4">
                                    <span className="material-icons-round text-gray-300">person</span>
                                    {userName}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAction}
                            className={`w-full lg:w-[320px] h-[56px] rounded-2xl text-[14px] font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
                                ${isClockedIn
                                    ? 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600'
                                    : 'bg-[#40C1C7] text-white shadow-[#40C1C7]/30 hover:bg-[#39ADB3]'
                                }
                            `}
                        >
                            <span className="material-icons-round">
                                {isClockedIn ? 'stop_circle' : 'play_circle'}
                            </span>
                            {isClockedIn ? 'Тарах цаг бүртгэх' : 'Ирэх цаг бүртгэх'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10 text-center space-y-4">
                            <div className={`w-24 h-24 rounded-[30px] mx-auto flex items-center justify-center mb-6 ${isClockedIn ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                <span className="material-icons-round text-5xl">
                                    {isClockedIn ? 'logout' : 'login'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight italic">
                                {isClockedIn ? 'Өдрийн хаалт' : 'Өдрийн нээлт'}
                            </h3>
                            <p className="text-[13px] text-gray-400 font-bold leading-relaxed px-4">
                                {isClockedIn ? 'Тарах' : 'Ирэх'} цагийг {formatTime(currentTime)} системд бүртгэх үү?
                            </p>
                        </div>
                        <div className="p-8 bg-gray-50/80 flex gap-4">
                            <button
                                onClick={() => setShowConfirmPopup(false)}
                                className="flex-1 h-14 bg-white border border-gray-200 rounded-2xl text-[11px] font-black text-gray-400 hover:bg-gray-100 transition-all uppercase tracking-widest"
                            >
                                Буцах
                            </button>
                            <button
                                onClick={confirmAction}
                                className={`flex-1 h-14 rounded-2xl text-[11px] font-black text-white shadow-lg transition-all active:scale-95 uppercase tracking-widest ${isClockedIn ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600' : 'bg-[#40C1C7] shadow-[#40C1C7]/30 hover:bg-[#39ADB3]'}`}
                            >
                                Тийм
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Popup
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                type="success"
                title="Амжилттай"
                message={`Таны ${isClockedIn ? 'тарах' : 'ирэх'} ца그 амжилттай бүртгэгдлээ.`}
            />
        </div>
    );
};

export default DayManagementScreen;
