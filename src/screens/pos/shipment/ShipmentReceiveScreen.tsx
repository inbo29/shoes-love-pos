import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../../../shared/components/Popup/Popup';

// Helper functions for masking
const maskNameSmart = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(part => {
        if (part.length <= 2) return part;
        if (part.length <= 4) return `${part[0]}**${part[part.length - 1]}`;
        const mid = Math.floor(part.length / 2);
        return `${part.slice(0, mid - 1)}**${part.slice(mid + 1)}`;
    }).join(' ');
};

const maskPhone = (phone: string) => {
    if (!phone) return '';
    const clean = phone.replace(/-/g, '');
    if (clean.length === 8) {
        return `${clean.slice(0, 2)}**-**${clean.slice(6)}`;
    }
    return phone;
};

// Types
interface ReceiveItem {
    id: string; // Order No (e.g. ORD-2023-1001)
    itemId: string;
    customerName: string;
    phoneNumber: string;
    serviceSummary: string; // e.g. "Гутал 2, Хими 1"
    receivedDate: string;
    status: 'Илгээгдсэн' | 'Хүлээн авсан';
}

const MOCK_SHIPMENT = {
    id: '#SHP-2023-0089',
    fromFactory: 'Үйлдвэр A (Дархан)',
    date: '2023.10.26 10:00',
    driver: 'Б. Бат-Эрдэнэ'
};

const MOCK_ITEMS: ReceiveItem[] = [
    { id: 'ORD-2023-1001', itemId: '1', customerName: 'Б.Болд', phoneNumber: '9911-2233', serviceSummary: 'Гутал 2, Хими 1', receivedDate: '2023.10.25 10:30', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1002', itemId: '2', customerName: 'Д.Дорж', phoneNumber: '8811-4455', serviceSummary: 'Хими 3', receivedDate: '2023.10.25 11:10', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1003', itemId: '3', customerName: 'Г.Ганбаатар', phoneNumber: '9900-1122', serviceSummary: 'Хивс 1', receivedDate: '2023.10.25 12:00', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1004', itemId: '4', customerName: 'О.Оюунбилэг', phoneNumber: '8899-7766', serviceSummary: 'Гутал 1, Хими 2', receivedDate: '2023.10.25 13:40', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1005', itemId: '5', customerName: 'Н.Нарангэрэл', phoneNumber: '9111-2233', serviceSummary: 'Гутал 1', receivedDate: '2023.10.25 14:20', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1006', itemId: '6', customerName: 'П.Пүрэвдорж', phoneNumber: '9222-3344', serviceSummary: 'Хими 2', receivedDate: '2023.10.26 09:10', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1007', itemId: '7', customerName: 'С.Сүхбат', phoneNumber: '9333-4455', serviceSummary: 'Гутал 2', receivedDate: '2023.10.26 10:00', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1008', itemId: '8', customerName: 'Т.Туяа', phoneNumber: '9444-5566', serviceSummary: 'Clean 2', receivedDate: '2023.10.26 10:45', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1009', itemId: '9', customerName: 'Ч.Чинзориг', phoneNumber: '9555-6677', serviceSummary: 'Paint 1', receivedDate: '2023.10.26 11:30', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1010', itemId: '10', customerName: 'Э.Энхтүвшин', phoneNumber: '9666-7788', serviceSummary: 'Repair 2', receivedDate: '2023.10.26 12:20', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1011', itemId: '11', customerName: 'Ж.Жаргал', phoneNumber: '9777-8899', serviceSummary: 'Гутал 1', receivedDate: '2023.10.27 09:00', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1012', itemId: '12', customerName: 'К.Ким', phoneNumber: '9888-9900', serviceSummary: 'Хими 1', receivedDate: '2023.10.27 09:40', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1013', itemId: '13', customerName: 'Л.Лхагва', phoneNumber: '9000-1111', serviceSummary: 'Hemming 1', receivedDate: '2023.10.27 10:10', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1014', itemId: '14', customerName: 'М.Мөнхбат', phoneNumber: '9111-2222', serviceSummary: 'Clean 1', receivedDate: '2023.10.27 10:50', status: 'Илгээгдсэн' },
    { id: 'ORD-2023-1015', itemId: '15', customerName: 'Н.Номин', phoneNumber: '9222-3333', serviceSummary: 'Paint 1', receivedDate: '2023.10.27 11:30', status: 'Илгээгдсэн' },
];

const ShipmentReceiveScreen: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
        new Set(MOCK_ITEMS.map(i => i.itemId)) // Default all selected
    );
    const [popupState, setPopupState] = useState({ isOpen: false, type: 'info' as 'info' | 'success' | 'error', title: '', message: '' });

    // Handlers
    const toggleSelection = (itemId: string) => {
        const newSet = new Set(selectedItemIds);
        if (newSet.has(itemId)) {
            newSet.delete(itemId);
        } else {
            newSet.add(itemId);
        }
        setSelectedItemIds(newSet);
    };

    const toggleAll = () => {
        if (selectedItemIds.size === MOCK_ITEMS.length) {
            setSelectedItemIds(new Set());
        } else {
            setSelectedItemIds(new Set(MOCK_ITEMS.map(i => i.itemId)));
        }
    };

    const handleReceive = () => {
        if (selectedItemIds.size === 0) {
            setPopupState({
                isOpen: true,
                type: 'error',
                title: 'Бараа сонгоогүй',
                message: 'Хүлээн авах бараагаа сонгоно уу!'
            });
            return;
        }

        const receivedCount = selectedItemIds.size;

        setPopupState({
            isOpen: true,
            type: 'success',
            title: 'Амжилттай хүлээн авлаа',
            message: `Нийт ${receivedCount} илгээмж амжилттай хүлээн авлаа.`
        });
    };

    const handlePopupClose = () => {
        setPopupState({ ...popupState, isOpen: false });
        if (popupState.type === 'success') {
            navigate('/pos/shipments');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            {/* Header / Title Section */}
            <div className="shrink-0 px-6 lg:px-8 pt-6 lg:pt-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-[#40C1C7] rounded-full"></div>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Ачилт хүлээн авах – Хүлээн авах</h1>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Сонгогдсон</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#40C1C7]">{selectedItemIds.size}</span>
                        <span className="text-gray-300 font-bold">/</span>
                        <span className="text-lg font-bold text-gray-400">{MOCK_ITEMS.length}</span>
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="shrink-0 px-6 lg:px-8 py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ачилтын мэдээлэл</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ачилтын дугаар</span>
                            <span className="text-base font-black text-[#40C1C7] tracking-wider">{MOCK_SHIPMENT.id}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Илгээгдсэн үйлдвэр</span>
                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                <span className="material-icons-round text-lg text-gray-400">factory</span>
                                {MOCK_SHIPMENT.fromFactory}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Илгээгдсэн огноо</span>
                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                <span className="material-icons-round text-lg text-gray-400">calendar_today</span>
                                {MOCK_SHIPMENT.date}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Жолооч</span>
                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                <span className="material-icons-round text-lg text-gray-400">person</span>
                                {MOCK_SHIPMENT.driver}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 px-6 lg:px-8 pb-24 min-h-0 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#FFD400] rounded-full"></div>
                        <h2 className="text-lg font-bold text-gray-800">Ирсэн илгээмжийн жагсаалт</h2>
                    </div>
                    <span className="px-3 py-1 bg-[#408e91] text-white text-[11px] font-black rounded-full uppercase tracking-tighter">
                        Нийт : {MOCK_ITEMS.length}
                    </span>
                </div>

                {/* Table Card */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
                    {/* Horizontal Scroll Container */}
                    <div className="flex-1 overflow-auto no-scrollbar relative">
                        <div className="min-w-[1000px] min-h-full flex flex-col">

                            {/* Sticky Header */}
                            <div className="shrink-0 bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center text-[10px] font-black text-gray-400 tracking-widest uppercase sticky top-0 z-10">
                                <div className="w-12 flex items-center justify-center shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={selectedItemIds.size === MOCK_ITEMS.length}
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                    />
                                </div>
                                <div className="w-6"></div>
                                <div className="w-[150px] shrink-0">Захиалгын №</div>
                                <div className="w-[180px] shrink-0">Харилцагч</div>
                                <div className="w-[120px] shrink-0">Утас</div>
                                <div className="w-[200px] shrink-0 px-2">Үйлчилгээ (товч)</div>
                                <div className="w-[150px] shrink-0 text-right">Огноо</div>
                                <div className="w-[140px] shrink-0 text-center">Төлөв</div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {MOCK_ITEMS.map((item) => {
                                    const isSelected = selectedItemIds.has(item.itemId);
                                    const currentStatus = isSelected ? 'Хүлээн авсан' : 'Илгээгдсэн';

                                    return (
                                        <div
                                            key={item.itemId}
                                            onClick={() => toggleSelection(item.itemId)}
                                            className={`flex items-center px-6 py-5 border-b border-gray-50 last:border-0 transition-all cursor-pointer group text-[13px]
                                                ${isSelected ? 'bg-primary/5' : 'hover:bg-primary/5'}
                                            `}
                                        >
                                            <div className="w-12 flex items-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelection(item.itemId)}
                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                                />
                                            </div>
                                            <div className="w-6"></div>

                                            <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">
                                                {item.id}
                                            </div>

                                            <div className="w-[180px] shrink-0 font-bold text-gray-800 truncate">
                                                {maskNameSmart(item.customerName)}
                                            </div>

                                            <div className="w-[120px] shrink-0 font-medium text-gray-500">
                                                {maskPhone(item.phoneNumber)}
                                            </div>

                                            <div className="w-[200px] shrink-0 px-2 font-bold text-gray-800 truncate">
                                                {item.serviceSummary}
                                            </div>

                                            <div className="w-[150px] shrink-0 text-right text-gray-500 font-medium whitespace-nowrap">
                                                {item.receivedDate}
                                            </div>

                                            <div className="w-[140px] shrink-0 flex justify-center px-2">
                                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 transition-all
                                                    ${isSelected
                                                        ? 'bg-green-100 text-green-600 border-green-200'
                                                        : 'bg-blue-100 text-blue-600 border-blue-200'}
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                                    {currentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="shrink-0 bg-white border-t border-gray-200 p-4 lg:px-8 py-5 flex items-center justify-between z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                <button
                    onClick={() => navigate(-1)}
                    className="h-[52px] px-8 rounded-xl bg-white border border-gray-200 text-gray-600 font-black uppercase tracking-wide text-xs hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                >
                    <span className="material-icons-round text-lg">arrow_back</span>
                    Буцах
                </button>

                <button
                    onClick={handleReceive}
                    disabled={selectedItemIds.size === 0}
                    className={`h-[52px] px-10 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95
                        ${selectedItemIds.size > 0
                            ? 'bg-[#FFD400] text-gray-900 shadow-orange-100 hover:shadow-orange-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
                    `}
                >
                    <span className="material-icons-round text-lg">check_circle</span>
                    Хүлээн авах
                </button>
            </div>

            {/* Popup */}
            <Popup
                isOpen={popupState.isOpen}
                type={popupState.type}
                title={popupState.title}
                message={popupState.message}
                onClose={handlePopupClose}
            />
        </div>
    );
};

export default ShipmentReceiveScreen;
