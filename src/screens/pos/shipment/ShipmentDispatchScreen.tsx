import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PosDropdown from '../../../shared/components/PosDropdown';
import Popup from '../../../shared/components/Popup/Popup';

// --- Types & Mock Data ---

interface DetailedShipmentItem {
    id: string; // Order ID
    itemId: string;
    productId: string;
    barcode: string;
    productCode: string;
    model: string;
    color: string;
    material: string;
    type: string;
    size: string;
    brand: string;
    quantity: number;
    status: string;
    customerName: string;
    phoneNumber: string;
    receivedDate: string;
}

const MOCK_ITEMS: DetailedShipmentItem[] = [
    { id: 'ORD-2023-1001', itemId: 'item-1', productId: 'p1', barcode: '865201', productCode: 'AJ1', model: 'Air Jordan 1', color: 'Улаан/Хар', material: 'Арьс', type: 'Пүүз', size: '42', brand: 'Nike', quantity: 2, status: 'Ачихад бэлэн', customerName: 'Б.Болд***', phoneNumber: '9911-2233', receivedDate: '2023.10.25 10:30' },
    { id: 'ORD-2023-1002', itemId: 'item-2', productId: 'p2', barcode: '865202', productCode: 'AF1', model: 'Air Force 1', color: 'Цагаан', material: 'Арьс', type: 'Пүүз', size: '40', brand: 'Nike', quantity: 1, status: 'Ачихад бэлэн', customerName: 'Д.Дорж***', phoneNumber: '8811-4455', receivedDate: '2023.10.25 11:10' },
    { id: 'ORD-2023-1003', itemId: 'item-3', productId: 'p3', barcode: '865203', productCode: 'NB574', model: '574 Core', color: 'Саарал', material: 'Илгэ', type: 'Кет', size: '39', brand: 'New Balance', quantity: 3, status: 'Ачихад бэлэн', customerName: 'Г.Ганб***', phoneNumber: '9900-1122', receivedDate: '2023.10.25 12:00' },
    { id: 'ORD-2023-1004', itemId: 'item-4', productId: 'p4', barcode: '865204', productCode: 'CM87', model: 'Chuck 70', color: 'Хар', material: 'Даавуу', type: 'Кет', size: '41', brand: 'Converse', quantity: 1, status: 'Ачилт хийсэн', customerName: 'О.Оюун***', phoneNumber: '8899-7766', receivedDate: '2023.10.25 13:40' },
    { id: 'ORD-2023-1006', itemId: 'item-6', productId: 'p5', barcode: '865205', productCode: 'STAN', model: 'Stan Smith', color: 'Цагаан/Ногоон', material: 'Арьс', type: 'Пүүз', size: '38', brand: 'Adidas', quantity: 2, status: 'Ачихад бэлэн', customerName: 'П.Пүрэв***', phoneNumber: '9222-3344', receivedDate: '2023.10.26 09:10' },
];

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
    const [dispatchDate, setDispatchDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedFactory, setSelectedFactory] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    const [dispatchRemark, setDispatchRemark] = useState('');

    // Selection State
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

    // Popups
    const [popupState, setPopupState] = useState({ isOpen: false, type: 'info' as 'info' | 'success' | 'error', title: '', message: '' });

    // Only items with status 'Ачихад бэлэн'
    const displayItems = useMemo(() => MOCK_ITEMS, []);
    const readyItemsCount = displayItems.filter(i => i.status === 'Ачихад бэлэн').length;

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

    const canDispatch = selectedItemIds.size > 0;

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
            message: `Нийт ${selectedItemIds.size} захиалга амжилттай ачигдлаа (DISPATCHED).`
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
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ачилт бүртгэсэн ажилтан</label>
                            <div className="w-full h-[44px] px-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center text-[13px] font-bold text-gray-500">
                                <span className="material-icons-round text-lg mr-2 text-gray-400">badge</span>
                                Админ
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ачилт хийх огноо <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dispatchDate}
                                    onChange={(e) => setDispatchDate(e.target.value)}
                                    className="w-full h-[44px] pl-11 pr-4 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:border-[#40C1C7] focus:ring-4 focus:ring-[#40C1C7]/10 outline-none transition-all"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-lg pointer-events-none">calendar_today</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Илгээж буй салбар (Хаанаас)</label>
                            <div className="w-full h-[44px] px-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center text-[13px] font-bold text-gray-500 cursor-not-allowed">
                                <span className="material-icons-round text-lg mr-2 text-gray-400">store</span>
                                Төв салбар
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                            <PosDropdown
                                label="Хүлээн авах салбар (Хаашаа) *"
                                icon="business"
                                options={[
                                    { value: '', label: 'Сонгох...' },
                                    { value: 'facA', label: 'Үйлдвэр А' },
                                    { value: '3rd', label: '3-р хороолол' },
                                    { value: 'zaisan', label: 'Зайсан' },
                                ]}
                                value={selectedFactory}
                                onChange={setSelectedFactory}
                            />

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

                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="flex items-center gap-2 mb-2 text-[#40C1C7]">
                                <span className="material-icons-round text-xl">note</span>
                                <h2 className="text-lg font-bold text-gray-800">Ачилтын тайлбар</h2>
                            </div>
                            <textarea
                                value={dispatchRemark}
                                onChange={(e) => setDispatchRemark(e.target.value)}
                                placeholder="Энд ачилтын тэмдэглэл бичнэ үү..."
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 focus:border-[#40C1C7] focus:ring-4 focus:ring-[#40C1C7]/10 outline-none transition-all resize-none h-[80px] lg:h-[120px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Item List */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">

                <div className="px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-[#FFD400] rounded-full"></div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Захиалга сонгох</h2>
                            <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Нийт: {readyItemsCount} захиалга бэлэн</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-4 lg:px-8 pb-24 min-h-0 flex flex-col overflow-hidden">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">

                        <div className="flex-1 overflow-auto no-scrollbar relative">
                            <div className="min-w-[1100px] min-h-full flex flex-col">

                                <div className="shrink-0 bg-gray-50/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center text-[10px] font-black text-gray-400 tracking-widest uppercase sticky top-0 z-10">
                                    <div className="w-12 flex items-center justify-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleAll}
                                            className="w-4 h-4 rounded border-gray-300 text-[#40C1C7] focus:ring-[#40C1C7]/20 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <div className="w-6"></div>
                                    <div className="w-[120px] shrink-0">Захиалгын №</div>
                                    <div className="w-[180px] shrink-0">Загвар</div>
                                    <div className="w-[100px] shrink-0">Брэнд</div>
                                    <div className="w-[80px] shrink-0">Өнгө</div>
                                    <div className="w-[80px] shrink-0">Материал</div>
                                    <div className="w-[80px] shrink-0 text-center">Төрөл</div>
                                    <div className="w-[80px] shrink-0 text-center">Хэмжээ</div>
                                    <div className="w-[80px] shrink-0 text-right">Тоо</div>
                                    <div className="flex-1 shrink-0 text-center">Төлөв</div>
                                </div>

                                <div className="flex-1">
                                    {displayItems.map((item) => {
                                        const isSelected = selectedItemIds.has(item.itemId);
                                        const isDisabled = item.status !== 'Ачихад бэлэн';

                                        return (
                                            <div
                                                key={item.itemId}
                                                onClick={() => !isDisabled && toggleSelection(item.itemId)}
                                                className={`flex items-center px-6 py-5 border-b border-gray-50 last:border-0 transition-all cursor-pointer group text-[13px]
                                                    ${isDisabled ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'hover:bg-[#f0fbfa]'}
                                                    ${isSelected ? 'bg-[#f0fbfa]' : ''}
                                                `}
                                            >
                                                <div className="w-12 flex items-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => !isDisabled && toggleSelection(item.itemId)}
                                                        disabled={isDisabled}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#40C1C7] focus:ring-[#40C1C7]/20 transition-all cursor-pointer disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div className="w-6"></div>

                                                <div className="w-[120px] shrink-0 font-extrabold text-[#40C1C7] group-hover:underline">
                                                    {item.id}
                                                </div>

                                                <div className="w-[180px] shrink-0 font-black text-gray-800 truncate">
                                                    {item.model}
                                                    <span className="text-[10px] text-gray-400 font-bold ml-1">({item.productCode})</span>
                                                </div>

                                                <div className="w-[100px] shrink-0 font-bold text-gray-700">
                                                    {item.brand}
                                                </div>

                                                <div className="w-[80px] shrink-0 text-gray-600 font-medium">
                                                    {item.color}
                                                </div>

                                                <div className="w-[80px] shrink-0 text-gray-600 font-medium">
                                                    {item.material}
                                                </div>

                                                <div className="w-[80px] shrink-0 text-center">
                                                    <span className="px-2 py-1 bg-gray-100 rounded-lg text-gray-600 font-bold text-[10px]">{item.type}</span>
                                                </div>

                                                <div className="w-[80px] shrink-0 text-center font-black text-gray-800">
                                                    {item.size}
                                                </div>

                                                <div className="w-[80px] shrink-0 text-right font-black text-[#40C1C7] text-base">
                                                    {item.quantity}
                                                </div>

                                                <div className="flex-1 shrink-0 flex justify-center">
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
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                            Сонгогдсон: <span className="text-gray-900 font-black text-xl ml-2">{selectedItemIds.size}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 h-[48px] rounded-xl border border-gray-200 text-gray-600 font-black text-[12px] uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            Буцах
                        </button>
                        <button
                            onClick={handleDispatch}
                            disabled={!canDispatch}
                            className={`px-8 h-[48px] rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg
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
