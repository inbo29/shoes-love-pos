import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import Popup from '../../../shared/components/Popup/Popup';

// --- Types & Mock Data ---

interface OrderItem {
    id: string; // Order ID for display
    itemId: string; // Unique item ID
    productName: string;
    productVariant: string; // e.g., "Хар, 42 размер"
    category: 'shoes' | 'bag' | 'boots' | 'skates' | 'other';
    serviceType: 'cleaning' | 'repair' | 'paint' | 'coming' | 'hemming';
    receivedDate: string;
    status: string; // 'Ачихад бэлэн' fixed
    phoneNumber: string;
    customerName: string;
    serviceSummary: string; // e.g. "Гутал 2, Хими 1"
}

const MOCK_ITEMS: OrderItem[] = [
    { id: 'ORD-2023-1001', itemId: 'item-1', productName: 'Өвлийн гутал', productVariant: 'Хар, 42 размер', category: 'boots', serviceType: 'cleaning', receivedDate: '2023.10.25 10:30', status: 'Ачихад бэлэн', phoneNumber: '9911-2233', customerName: 'Б.Болд***', serviceSummary: 'Гутал 2, Хими 1' },
    { id: 'ORD-2023-1002', itemId: 'item-2', productName: 'Уулын гутал', productVariant: 'Бор, 39 размер', category: 'shoes', serviceType: 'repair', receivedDate: '2023.10.25 11:10', status: 'Ачихад бэлэн', phoneNumber: '8811-4455', customerName: 'Д.Дорж***', serviceSummary: 'Хими 3' },
    { id: 'ORD-2023-1003', itemId: 'item-3', productName: 'Спорт гутал', productVariant: 'Цагаан, 40 размер', category: 'shoes', serviceType: 'paint', receivedDate: '2023.10.25 12:00', status: 'Ачихад бэлэн', phoneNumber: '9900-1122', customerName: 'Г.Ганб***', serviceSummary: 'Хивс 1' },
    { id: 'ORD-2023-1004', itemId: 'item-4', productName: 'Тэшүүр', productVariant: 'Мэргэжлийн', category: 'skates', serviceType: 'coming', receivedDate: '2023.10.25 13:40', status: 'Ачихад бэлэн', phoneNumber: '8899-7766', customerName: 'О.Оюун***', serviceSummary: 'Гутал 1, Хими 2' },
    { id: 'ORD-2023-1006', itemId: 'item-6', productName: 'Өвлийн гутал', productVariant: 'Хүрэн, 41 размер', category: 'boots', serviceType: 'cleaning', receivedDate: '2023.10.26 09:10', status: 'Ачихад бэлэн', phoneNumber: '9222-3344', customerName: 'П.Пүрэв***', serviceSummary: 'Гутал 1' },
    { id: 'ORD-2023-1007', itemId: 'item-7', productName: 'Спорт гутал', productVariant: 'Хар, 43 размер', category: 'shoes', serviceType: 'repair', receivedDate: '2023.10.26 10:00', status: 'Ачихад бэлэн', phoneNumber: '9333-4455', customerName: 'С.Сүх***', serviceSummary: 'Repair 1' },
    { id: 'ORD-2023-1008', itemId: 'item-8', productName: 'Цүнх', productVariant: 'Даавуун', category: 'bag', serviceType: 'cleaning', receivedDate: '2023.10.26 10:45', status: 'Ачихад бэлэн', phoneNumber: '9444-5566', customerName: 'Т.Туяа***', serviceSummary: 'Clean 2' },
    { id: 'ORD-2023-1009', itemId: 'item-9', productName: 'Уулын гутал', productVariant: 'Ногоон, 40 размер', category: 'shoes', serviceType: 'paint', receivedDate: '2023.10.26 11:30', status: 'Ачихад бэлэн', phoneNumber: '9555-6677', customerName: 'Ч.Чин***', serviceSummary: 'Paint 1' },
    { id: 'ORD-2023-1010', itemId: 'item-10', productName: 'Тэшүүр', productVariant: 'Хүүхдийн', category: 'skates', serviceType: 'repair', receivedDate: '2023.10.26 12:20', status: 'Ачихад бэлэн', phoneNumber: '9666-7788', customerName: 'Э.Энх***', serviceSummary: 'Repair 2' },
    { id: 'ORD-2023-1011', itemId: 'item-11', productName: 'Өвлийн гутал', productVariant: 'Хар, 44 размер', category: 'boots', serviceType: 'cleaning', receivedDate: '2023.10.27 09:00', status: 'Ачихад бэлэн', phoneNumber: '9777-8899', customerName: 'Ж.Жар***', serviceSummary: 'Гутал 2' },
    { id: 'ORD-2023-1012', itemId: 'item-12', productName: 'Спорт гутал', productVariant: 'Цэнхэр, 41 размер', category: 'shoes', serviceType: 'repair', receivedDate: '2023.10.27 09:40', status: 'Ачихад бэлэн', phoneNumber: '9888-9900', customerName: 'К.Ким***', serviceSummary: 'Repair 1' },
    { id: 'ORD-2023-1013', itemId: 'item-13', productName: 'Цүнх', productVariant: 'Арьсан, хар', category: 'bag', serviceType: 'hemming', receivedDate: '2023.10.27 10:10', status: 'Ачихад бэлэн', phoneNumber: '9000-1111', customerName: 'Л.Лха***', serviceSummary: 'Hemming 1' },
    { id: 'ORD-2023-1014', itemId: 'item-14', productName: 'Уулын гутал', productVariant: 'Саарал, 42 размер', category: 'shoes', serviceType: 'cleaning', receivedDate: '2023.10.27 10:50', status: 'Ачихад бэлэн', phoneNumber: '9111-2222', customerName: 'М.Мөнх***', serviceSummary: 'Clean 1' },
    { id: 'ORD-2023-1016', itemId: 'item-16', productName: 'Өвлийн гутал', productVariant: 'Бор, 43 размер', category: 'boots', serviceType: 'repair', receivedDate: '2023.10.27 12:00', status: 'Ачихад бэлэн', phoneNumber: '9333-4444', customerName: 'О.Отгон***', serviceSummary: 'Repair 2' },
    { id: 'ORD-2023-1017', itemId: 'item-17', productName: 'Спорт гутал', productVariant: 'Улаан, 39 размер', category: 'shoes', serviceType: 'cleaning', receivedDate: '2023.10.27 12:30', status: 'Ачихад бэлэн', phoneNumber: '9444-5555', customerName: 'П.Паг***', serviceSummary: 'Clean 1' },
    { id: 'ORD-2023-1018', itemId: 'item-18', productName: 'Цүнх', productVariant: 'Спорт', category: 'bag', serviceType: 'repair', receivedDate: '2023.10.27 13:00', status: 'Ачихад бэлэн', phoneNumber: '9555-6666', customerName: 'Р.Рен***', serviceSummary: 'Repair 1' },
    { id: 'ORD-2023-1019', itemId: 'item-19', productName: 'Уулын гутал', productVariant: 'Хар, 41 размер', category: 'shoes', serviceType: 'cleaning', receivedDate: '2023.10.27 13:40', status: 'Ачихад бэлэн', phoneNumber: '9666-7777', customerName: 'С.Саран***', serviceSummary: 'Clean 2' },
];


const SERVICE_BADGES = {
    cleaning: { label: 'Цэвэрлэгээ', classes: 'bg-blue-100 text-blue-600 border-blue-200' },
    repair: { label: 'Засвар', classes: 'bg-orange-100 text-orange-600 border-orange-200' },
    paint: { label: 'Будаг', classes: 'bg-green-100 text-green-600 border-green-200' },
    coming: { label: 'Ирэх', classes: 'bg-purple-100 text-purple-600 border-purple-200' },
    hemming: { label: 'Өөдлөх', classes: 'bg-red-100 text-red-600 border-red-200' },
};

const CATEGORY_ICONS = {
    shoes: 'hiking',
    boots: 'severe_cold', // closest for winter boots
    bag: 'shopping_bag',
    skates: 'ice_skating',
    other: 'category'
};

// Helper functions for masking (Matching OrderListScreen)
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

const ShipmentDispatchScreen: React.FC = () => {
    const navigate = useNavigate();

    // Form State
    const [dispatchDate, setDispatchDate] = useState<string>(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [selectedBranch, setSelectedBranch] = useState('main');
    const [selectedFactory, setSelectedFactory] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    const [note, setNote] = useState('');

    // Selection State
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

    // Popups
    const [popupState, setPopupState] = useState({ isOpen: false, type: 'info' as 'info' | 'success' | 'error', title: '', message: '' });

    // Filtered Items (Only show READY items usually, but mock might have others disabled)
    // Only items with status 'Ачихад бэлэн' should be selectable
    const displayItems = useMemo(() => MOCK_ITEMS, []);

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
        const readyItems = displayItems.filter(i => i.status === 'Ачихад бэлэн');
        if (selectedItemIds.size === readyItems.length) {
            setSelectedItemIds(new Set());
        } else {
            setSelectedItemIds(new Set(readyItems.map(i => i.itemId)));
        }
    };

    const isAllSelected = useMemo(() => {
        const readyItems = displayItems.filter(i => i.status === 'Ачихад бэлэн');
        return readyItems.length > 0 && selectedItemIds.size === readyItems.length;
    }, [displayItems, selectedItemIds]);

    const canDispatch = selectedItemIds.size > 0; // Relaxed activation rule

    const handleDispatch = () => {
        if (!selectedFactory || !selectedDriver) {
            setPopupState({
                isOpen: true,
                type: 'error',
                title: 'Мэдээлэл дутуу',
                message: 'Үйлдвэр болон жолоочийг сонгоно уу!'
            });
            return;
        }
        if (!canDispatch) return;

        setPopupState({
            isOpen: true,
            type: 'success',
            title: 'Ачилт үүссэн',
            message: `Нийт ${selectedItemIds.size} захиалга амжилттай ачигдлаа.`
        });
    };

    const handlePopupClose = () => {
        setPopupState({ ...popupState, isOpen: false });
        if (popupState.type === 'success') {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full bg-[#F8F9FA] overflow-hidden">
            {/* Left Panel */}
            <div className="w-full lg:w-[400px] flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 bg-white z-10 shadow-sm relative shrink-0 h-auto lg:h-full max-h-[40%] lg:max-h-full overflow-hidden">
                <div className="p-6 flex flex-col h-full overflow-y-auto no-scrollbar">

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6 lg:mb-8">
                        <div className="w-1.5 h-6 bg-[#40C1C7] rounded-full"></div>
                        <h2 className="text-lg font-bold text-gray-800">Ачилтын ерөнхий мэдээлэл</h2>
                    </div>

                    <div className="flex flex-col gap-4 lg:gap-6">
                        {/* 1. Employee (Read-only) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ачилт бүртгэсэн ажилтан</label>
                            <div className="w-full h-[44px] px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center text-[13px] font-bold text-gray-500">
                                <span className="material-icons-round text-lg mr-2 text-gray-400">badge</span>
                                Админ
                            </div>
                        </div>

                        {/* 2. Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ачилт хийх огноо <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dispatchDate}
                                    onChange={(e) => setDispatchDate(e.target.value)}
                                    className="w-full h-[44px] pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-lg pointer-events-none">calendar_today</span>
                            </div>
                        </div>

                        {/* 3. Branch (Read-only) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Илгээж буй салбар</label>
                            <div className="w-full h-[44px] px-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center text-[13px] font-bold text-gray-500">
                                <span className="material-icons-round text-lg mr-2 text-gray-400">store</span>
                                Салбар 1 - Төв дэлгүүр
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                            {/* 4. Factory */}
                            <PosDropdown
                                label="Хүлээн авах үйлдвэр *"
                                icon="factory"
                                options={[
                                    { value: '', label: 'Үйлдвэр сонгох...' },
                                    { value: 'facA', label: 'Үйлдвэр А' },
                                    { value: 'facB', label: 'Үйлдвэр B' },
                                    { value: 'facC', label: 'Үйлдвэр C' },
                                ]}
                                value={selectedFactory}
                                onChange={setSelectedFactory}
                            />

                            {/* 5. Driver */}
                            <PosDropdown
                                label="Жолооч *"
                                icon="directions_car"
                                options={[
                                    { value: '', label: 'Жолооч сонгох...' },
                                    { value: 'driver1', label: 'Б.Болд' },
                                    { value: 'driver2', label: 'Д.Дорж' },
                                ]}
                                value={selectedDriver}
                                onChange={setSelectedDriver}
                            />
                        </div>

                        <hr className="border-gray-100 my-2" />

                        {/* Note */}
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-center gap-2 mb-2 text-[#40C1C7]">
                                <span className="material-icons-round text-xl">note</span>
                                <h2 className="text-lg font-bold text-gray-800">Нэмэлт мэдээлэл</h2>
                            </div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Тайлбар</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Энд нэмэлт тэмдэглэл бичнэ үү..."
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none h-[80px] lg:h-[120px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Item List */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">

                {/* Header */}
                <div className="px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-[#FFD400] rounded-full"></div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800">Захиалга сонгох</h2>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Нийт: {displayItems.length} захиалга ачигдахад бэлэн байна</p>
                        </div>
                    </div>
                </div>

                {/* Table Wrapper */}
                <div className="flex-1 px-4 lg:px-8 pb-24 min-h-0 flex flex-col overflow-hidden">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">

                        {/* Horizontal Scroll Container */}
                        <div className="flex-1 overflow-auto no-scrollbar relative">
                            <div className="min-w-[1000px] min-h-full flex flex-col">

                                {/* Table Header - Sticky */}
                                <div className="shrink-0 bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center text-[10px] font-black text-gray-400 tracking-widest uppercase sticky top-0 z-10">
                                    <div className="w-12 flex items-center justify-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleAll}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="w-6"></div> {/* Spacer */}
                                    <div className="w-[150px] shrink-0">Захиалгын №</div>
                                    <div className="w-[180px] shrink-0">Харилцагч</div>
                                    <div className="w-[120px] shrink-0">Утас</div>
                                    <div className="w-[200px] shrink-0">Үйлчилгээ (товч)</div>
                                    <div className="w-[150px] shrink-0 text-right">Огноо</div>
                                    <div className="w-[140px] shrink-0 text-center">Төлөв</div>
                                </div>

                                {/* Table Content */}
                                <div className="flex-1">
                                    {displayItems.map((item) => {
                                        const isSelected = selectedItemIds.has(item.itemId);
                                        const isDisabled = item.status !== 'Ачихад бэлэн';

                                        return (
                                            <div
                                                key={item.itemId}
                                                onClick={() => !isDisabled && toggleSelection(item.itemId)}
                                                className={`flex items-center px-6 py-5 border-b border-gray-50 last:border-0 transition-all cursor-pointer group text-[13px]
                                                    ${isDisabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'hover:bg-primary/5'}
                                                    ${isSelected ? 'bg-primary/5' : ''}
                                                `}
                                            >
                                                <div className="w-12 flex items-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => !isDisabled && toggleSelection(item.itemId)}
                                                        disabled={isDisabled}
                                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="w-6"></div>

                                                <div className="w-[150px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">
                                                    {item.id}
                                                </div>

                                                <div className="w-[180px] shrink-0 font-bold text-gray-800 truncate">
                                                    {maskNameSmart(item.customerName)}
                                                </div>

                                                <div className="w-[120px] shrink-0 text-gray-500 font-medium">
                                                    {maskPhone(item.phoneNumber)}
                                                </div>

                                                <div className="w-[200px] shrink-0 font-bold text-gray-500 truncate">
                                                    {item.serviceSummary}
                                                </div>

                                                <div className="w-[150px] shrink-0 text-right text-xs font-medium text-gray-400">
                                                    {item.receivedDate}
                                                </div>

                                                <div className="w-[140px] shrink-0 flex justify-center">
                                                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border flex items-center gap-1.5 whitespace-nowrap 
                                                        ${item.status === 'Ачихад бэлэн' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Ачихад бэлэн' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                        {item.status}
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
                <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-8 flex items-center justify-between z-20 backdrop-blur-sm bg-white/90">
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] font-bold text-gray-500">
                            Сонгогдсон: <span className="text-gray-900 text-lg ml-1">{selectedItemIds.size}</span> захиалга
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-[13px] hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Буцах
                        </button>
                        <button
                            onClick={handleDispatch}
                            disabled={!canDispatch}
                            className={`px-8 py-3.5 rounded-xl font-bold text-[13px] flex items-center gap-2 transition-all shadow-lg
                                ${canDispatch
                                    ? 'bg-[#FFD400] text-gray-900 hover:bg-[#eec600] hover:scale-[1.02] shadow-yellow-400/20 cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'}
                            `}
                        >
                            <span className="material-icons-round text-lg">local_shipping</span>
                            Ачилт хийх
                        </button>
                    </div>
                </div>

                <Popup
                    isOpen={popupState.isOpen}
                    type={popupState.type}
                    title={popupState.title}
                    message={popupState.message}
                    onClose={handlePopupClose}
                />

            </div>
        </div>
    );
};

export default ShipmentDispatchScreen;
