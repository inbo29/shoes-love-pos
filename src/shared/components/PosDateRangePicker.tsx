import React, { useState, useRef, useEffect } from 'react';

interface PosDateRangePickerProps {
    start: Date | null;
    end: Date | null;
    onChange: (start: Date | null, end: Date | null) => void;
    label?: string;
}

// Helper to format date as YYYY.MM.DD
const formatDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
};

const PosDateRangePicker: React.FC<PosDateRangePickerProps> = ({
    start,
    end,
    onChange,
    label = "Захиалсан хугацаа"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(start || new Date()));
    const [tempStart, setTempStart] = useState<Date | null>(start);
    const [tempEnd, setTempEnd] = useState<Date | null>(end);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleDateClick = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (!tempStart || (tempStart && tempEnd)) {
            setTempStart(selected);
            setTempEnd(null);
        } else {
            if (selected < tempStart) {
                setTempEnd(tempStart);
                setTempStart(selected);
            } else {
                setTempEnd(selected);
            }
        }
    };

    const isSelected = (day: number) => {
        const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (tempStart && tempEnd) {
            return current.toDateString() === tempStart.toDateString() ||
                current.toDateString() === tempEnd.toDateString() ||
                (current >= tempStart && current <= tempEnd);
        }
        return tempStart && current.toDateString() === tempStart.toDateString();
    };

    const isRangeMid = (day: number) => {
        const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return tempStart && tempEnd && current > tempStart && current < tempEnd;
    };

    const presets: { label: string; get: () => [Date | null, Date | null] }[] = [
        {
            label: 'Өнөөдөр',
            get: () => {
                const now = new Date();
                const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                const e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                return [s, e];
            }
        },
        {
            label: '7 хоног', get: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                return [start, end];
            }
        },
        {
            label: 'Сар', get: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0);
                const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                return [start, end];
            }
        },
        {
            label: 'Бүх хугацаа',
            get: () => [null, null]
        }
    ];

    return (
        <div className="flex flex-col gap-1.5" ref={pickerRef}>
            {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-3 bg-white border ${isOpen ? 'border-primary shadow-[0_0_0_4px_rgba(64,193,199,0.1)]' : 'border-gray-200'} rounded-xl px-4 h-[44px] cursor-pointer transition-all hover:border-primary/50 min-w-[260px]`}
                >
                    <span className="material-icons-round text-primary text-[20px]">calendar_today</span>
                    <span className="text-[13px] font-bold text-gray-700">
                        {start && end ? `${formatDateStr(start)} — ${formatDateStr(end)}` : 'Бүх хугацаа'}
                    </span>
                    <span className={`material-icons-round text-gray-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-[9999] w-[320px] animate-in fade-in slide-in-from-top-2 duration-200 no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                                <span className="material-icons-round">chevron_left</span>
                            </button>
                            <h4 className="font-black text-gray-800 text-sm">
                                {viewDate.toLocaleString('mn', { month: 'long', year: 'numeric' })}
                            </h4>
                            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                                <span className="material-icons-round">chevron_right</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'].map(d => (
                                <div key={d} className="text-[10px] font-black text-gray-400 text-center py-1 uppercase">{d}</div>
                            ))}
                            {Array.from({ length: (firstDayOfMonth(viewDate) + 6) % 7 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth(viewDate) }).map((_, i) => {
                                const d = i + 1;
                                const rangeMid = isRangeMid(d);
                                const selected = isSelected(d);
                                return (
                                    <button
                                        key={d}
                                        onClick={() => handleDateClick(d)}
                                        className={`h-9 w-full flex items-center justify-center text-xs font-bold rounded-lg transition-all relative
                                            ${selected ? 'bg-primary text-white shadow-md z-10' : 'hover:bg-gray-100 text-gray-600'}
                                            ${rangeMid ? 'bg-primary/10 text-primary rounded-none' : ''}
                                        `}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50 mb-4">
                            {presets.map(p => (
                                <button
                                    key={p.label}
                                    onClick={() => {
                                        const [s, e] = p.get();
                                        onChange(s, e);
                                        setTempStart(s);
                                        setTempEnd(e);
                                        setIsOpen(false);
                                    }}
                                    className="px-3 py-1.5 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-500 rounded-lg text-[10px] font-bold transition-all"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all"
                            >
                                Цуцлах
                            </button>
                            <button
                                onClick={() => {
                                    onChange(tempStart, tempEnd);
                                    setIsOpen(false);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Сонгох
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PosDateRangePicker;
