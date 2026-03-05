import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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

const MOCK_SHIPMENT = {
    id: '#SH-2023-0089',
    fromFactory: 'Үйлдвэр A (Дархан)',
    toBranch: 'Төв салбар', // Fixed current branch receiving
    date: '2023.10.26 10:00',
    driver: 'Б. Бат-Эрдэнэ',
    dispatchRemark: 'Яаралтай хүргэлт',
};

// Filtered to 'Ачилт хийсэн' (DISPATCHED)
const MOCK_ITEMS: DetailedShipmentItem[] = [
    { id: 'ORD-2023-1001', itemId: 'item-1', productId: 'p1', barcode: '865201', productCode: 'AJ1', model: 'Air Jordan 1', color: 'Улаан/Хар', material: 'Арьс', type: 'Пүүз', size: '42', brand: 'Nike', quantity: 2, status: 'Ачилт хийсэн', customerName: 'Б.Болд***', phoneNumber: '9911-2233', receivedDate: '2023.10.25 10:30' },
    { id: 'ORD-2023-1002', itemId: 'item-2', productId: 'p2', barcode: '865202', productCode: 'AF1', model: 'Air Force 1', color: 'Цагаан', material: 'Арьс', type: 'Пүүз', size: '40', brand: 'Nike', quantity: 1, status: 'Ачилт хийсэн', customerName: 'Д.Дорж***', phoneNumber: '8811-4455', receivedDate: '2023.10.25 11:10' },
    { id: 'ORD-2023-1003', itemId: 'item-3', productId: 'p3', barcode: '865203', productCode: 'NB574', model: '574 Core', color: 'Саарал', material: 'Илгэ', type: 'Кет', size: '39', brand: 'New Balance', quantity: 3, status: 'Ачилт хийсэн', customerName: 'Г.Ганб***', phoneNumber: '9900-1122', receivedDate: '2023.10.25 12:00' },
    { id: 'ORD-2023-1004', itemId: 'item-4', productId: 'p4', barcode: '865204', productCode: 'CM87', model: 'Chuck 70', color: 'Хар', material: 'Даавуу', type: 'Кет', size: '41', brand: 'Converse', quantity: 1, status: 'Ачилт хийсэн', customerName: 'О.Оюун***', phoneNumber: '8899-7766', receivedDate: '2023.10.25 13:40' },
];

const ShipmentReceiveScreen: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
        new Set(MOCK_ITEMS.map(i => i.itemId)) // Default all selected
    );
    const [receiveRemark, setReceiveRemark] = useState('');
    const [popupState, setPopupState] = useState({ isOpen: false, type: 'info' as 'info' | 'success' | 'error', title: '', message: '' });

    // Show only shipped items
    const displayItems = useMemo(() => MOCK_ITEMS.filter(i => i.status === 'Ачилт хийсэн'), []);

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
        if (selectedItemIds.size === displayItems.length) {
            setSelectedItemIds(new Set());
        } else {
            setSelectedItemIds(new Set(displayItems.map(i => i.itemId)));
        }
    };

    const isAllSelected = useMemo(() => {
        return displayItems.length > 0 && selectedItemIds.size === displayItems.length;
    }, [displayItems, selectedItemIds]);

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
            message: `Нийт ${receivedCount} илгээмж амжилттай хүлээн авлаа (RECEIVED).`
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
                    <h1 className="text-xl font-bold text-[#374151] uppercase tracking-tight">Ачилт хүлээн авах</h1>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Сонгогдсон</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-[#40C1C7]">{selectedItemIds.size}</span>
                        <span className="text-gray-300 font-bold">/</span>
                        <span className="text-lg font-bold text-gray-400">{displayItems.length}</span>
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="shrink-0 px-6 lg:px-8 py-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Ачилтын мэдээлэл</h3>
                        {MOCK_SHIPMENT.dispatchRemark && (
                            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full text-blue-600">
                                <span className="material-icons-round text-[14px]">info</span>
                                <span className="text-[10px] font-bold uppercase tracking-wide">Ачилтын тайлбар: {MOCK_SHIPMENT.dispatchRemark}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ачилтын дугаар</span>
                            <span className="text-base font-black text-[#40C1C7] tracking-wider">{MOCK_SHIPMENT.id}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Илгээгдсэн (Хаанаас)</span>
                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                <span className="material-icons-round text-lg text-gray-400">store</span>
                                {MOCK_SHIPMENT.fromFactory}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Хүлээн авах (Хаашаа)</span>
                            <div className="flex items-center gap-2 font-bold text-[#40C1C7]">
                                <span className="material-icons-round text-lg">home</span>
                                {MOCK_SHIPMENT.toBranch} (Одоогийн)
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Жолооч</span>
                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                <span className="material-icons-round text-lg text-gray-400">directions_car</span>
                                {MOCK_SHIPMENT.driver}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="flex-1 px-6 lg:px-8 pb-32 min-h-0 flex flex-col overflow-hidden">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-auto no-scrollbar relative">
                        <div className="min-w-[1100px] min-h-full flex flex-col">
                            {/* Table Header */}
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

                            {/* Table Content */}
                            <div className="flex-1 bg-white">
                                {displayItems.map((item) => {
                                    const isSelected = selectedItemIds.has(item.itemId);

                                    return (
                                        <div
                                            key={item.itemId}
                                            onClick={() => toggleSelection(item.itemId)}
                                            className={`flex items-center px-6 py-5 border-b border-gray-50 transition-all cursor-pointer group text-[13px] ${isSelected ? 'bg-primary/5' : 'hover:bg-primary/5'}`}
                                        >
                                            <div className="w-12 flex items-center justify-center shrink-0" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelection(item.itemId)}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#40C1C7] focus:ring-[#40C1C7]/20 transition-all cursor-pointer"
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
                                                    bg-blue-100 text-blue-600 border-blue-200`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-blue-500`}></span>
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
            <div className="absolute bottom-0 left-0 right-0 py-4 px-8 bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between z-20">
                <div className="flex items-center gap-6">
                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                        Сонгогдсон: <span className="text-gray-900 font-black text-xl ml-2">{selectedItemIds.size}</span>
                    </span>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Тэмдэглэл (Сонголттой)</span>
                        <input
                            type="text"
                            value={receiveRemark}
                            onChange={(e) => setReceiveRemark(e.target.value)}
                            placeholder="Хүлээн авах үеийн тайлбар..."
                            className="w-[250px] h-[40px] px-4 bg-gray-50 border border-gray-200 rounded-xl text-[12px] font-medium focus:border-[#40C1C7] focus:ring-4 focus:ring-[#40C1C7]/10 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 h-[48px] rounded-xl border border-gray-200 text-gray-600 font-black text-[12px] uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        Буцах
                    </button>
                    <button
                        onClick={handleReceive}
                        disabled={selectedItemIds.size === 0}
                        className={`px-8 h-[48px] rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg
                            ${selectedItemIds.size > 0
                                ? 'bg-[#FFD400] text-gray-900 hover:bg-[#eec600] border border-[#f5cc00] hover:scale-[1.02] shadow-yellow-400/20 active:scale-95'
                                : 'bg-gray-100 text-gray-400 border border-transparent shadow-none cursor-not-allowed'}
                        `}
                    >
                        <span className="material-icons-round text-lg">check_circle</span>
                        Хүлээн авах
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
    );
};

export default ShipmentReceiveScreen;
