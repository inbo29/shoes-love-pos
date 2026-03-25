import React, { useState, useEffect } from 'react';
import type { SelectedProduct } from '../ProductSellFlowScreen';

interface Props {
    selectedProducts: SelectedProduct[];
    totalAmount: number;
    discount: number;
    pointsUsed: number;
    onSummaryChange: (products: SelectedProduct[], points: number, discount: number) => void;
}

const SellStep2Summary: React.FC<Props> = ({
    selectedProducts: initialProducts,
    totalAmount: initialTotal,
    discount: initialDiscount,
    pointsUsed: initialPoints,
    onSummaryChange
}) => {
    const [products, setProducts] = useState<SelectedProduct[]>(initialProducts);

    // Point Redemption State
    const [usePoints, setUsePoints] = useState(initialPoints > 0);
    const [showPointPopup, setShowPointPopup] = useState(false);
    const [pointsInput, setPointsInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [appliedPoints, setAppliedPoints] = useState(initialPoints);

    // Phone / Points
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSearchingPoints, setIsSearchingPoints] = useState(false);
    const [availablePoints, setAvailablePoints] = useState<number | null>(null);

    // Sync state with props when entering the step
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    // Calculate totals
    const subtotal = products.reduce((sum, p) => sum + ((p.salePrice ?? p.price) * p.quantity), 0);
    const maxRedeemable = subtotal;
    const finalAmount = Math.max(0, subtotal - initialDiscount - appliedPoints);

    // Notify parent of changes
    useEffect(() => {
        onSummaryChange(products, appliedPoints, initialDiscount);
    }, [products, appliedPoints, initialDiscount, onSummaryChange]);

    const handleQuantityChange = (productId: string, delta: number) => {
        setProducts(prev => {
            const updated = prev.map(p => {
                if (p.productId === productId) {
                    const newQty = Math.max(0, p.quantity + delta);
                    return { ...p, quantity: newQty };
                }
                return p;
            }).filter(p => p.quantity > 0);
            return updated;
        });
    };

    const handleDelete = (productId: string) => {
        setProducts(prev => prev.filter(p => p.productId !== productId));
    };

    const handleSearchPoints = () => {
        if (!phoneNumber) return;
        setIsSearchingPoints(true);
        setTimeout(() => {
            setAvailablePoints(50000);
            setIsSearchingPoints(false);
        }, 800);
    };

    const handleUsePoints = () => {
        if (availablePoints !== null) {
            setShowPointPopup(true);
            setPointsInput(appliedPoints > 0 ? appliedPoints.toString() : '');
        }
    };

    const handleConfirmPoints = () => {
        const points = parseInt(pointsInput);
        if (!isNaN(points) && points > 0) {
            const validPoints = Math.min(points, maxRedeemable, availablePoints ?? 0);
            setAppliedPoints(validPoints);
            setUsePoints(true);
            setShowPointPopup(false);
            setPasswordInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] gap-0 overflow-hidden">
            {/* ========== LEFT: Selected Products List ========== */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 p-3 md:p-4">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="h-7 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h2 className="text-[16px] font-bold text-[#374151]">Сонгосон бараа</h2>
                    {products.length > 0 && (
                        <span className="text-[10px] font-bold text-white bg-primary rounded-full px-2 py-0.5 ml-1">
                            {products.reduce((s, p) => s + p.quantity, 0)}
                        </span>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-4 py-3 flex text-[9px] font-black tracking-widest uppercase shrink-0">
                        <div className="flex-1 px-1">Барааны нэр</div>
                        <div className="w-[80px] px-1 text-center hidden sm:block">Үнэ</div>
                        <div className="w-[120px] px-1 text-center">Тоо ширхэг</div>
                        <div className="w-[80px] px-1 text-right">Дүн</div>
                        <div className="w-[32px]"></div>
                    </div>

                    {/* Items */}
                    <div className="overflow-y-auto flex-1 no-scrollbar">
                        <div className="divide-y divide-gray-50">
                            {products.map(product => {
                                const unitPrice = product.salePrice ?? product.price;
                                return (
                                    <div key={product.productId} className="flex px-4 py-3 items-center hover:bg-gray-50/50 transition-colors group">
                                        <div className="flex-1 px-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-800 line-clamp-1">
                                                {product.name}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block w-[80px] px-1 text-center">
                                            <div className="flex flex-col items-center">
                                                {product.salePrice && (
                                                    <span className="text-[9px] font-bold text-gray-400 line-through">
                                                        {product.price.toLocaleString()}₮
                                                    </span>
                                                )}
                                                <span className={`text-xs font-black ${product.salePrice ? 'text-primary' : 'text-gray-600'}`}>
                                                    {unitPrice.toLocaleString()}₮
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-[120px] px-1 flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => handleQuantityChange(product.productId, -1)}
                                                className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">remove</span>
                                            </button>
                                            <span className="font-black text-sm text-primary min-w-[24px] text-center">
                                                {product.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(product.productId, 1)}
                                                className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">add</span>
                                            </button>
                                        </div>
                                        <div className="w-[80px] px-1 text-right">
                                            <span className="text-sm font-black text-gray-900">
                                                {(unitPrice * product.quantity).toLocaleString()}₮
                                            </span>
                                        </div>
                                        <div className="w-[32px] flex justify-center">
                                            <button
                                                onClick={() => handleDelete(product.productId)}
                                                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-icons-round text-sm">close</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {products.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                                <span className="material-icons-round text-6xl mb-3 opacity-20">shopping_cart</span>
                                <p className="font-bold text-base">Сонгосон бараа байхгүй</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========== RIGHT: Payment Summary ========== */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                <div className="p-4 overflow-y-auto flex-1 no-scrollbar">
                    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                        <div className="h-7 w-1.5 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[14px] font-bold text-[#374151] uppercase tracking-tight">
                            Төлбөрийн тооцоо
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Үнийн дүн:</span>
                            <span className="text-base font-black text-gray-900">
                                {subtotal.toLocaleString()}₮
                            </span>
                        </div>

                        {/* VAT */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">НӨАТ (10%):</span>
                            <span className="text-base font-black text-gray-600">
                                {Math.floor(subtotal * 0.1).toLocaleString()}₮
                            </span>
                        </div>

                        {/* Points Display */}
                        {appliedPoints > 0 && (
                            <div className="flex justify-between items-center text-blue-500">
                                <span className="text-xs font-bold uppercase tracking-wide">Пойнт ашиглалт:</span>
                                <span className="text-base font-black">
                                    - {appliedPoints.toLocaleString()}₮
                                </span>
                            </div>
                        )}

                        <div className="border-t-2 border-dashed border-gray-200 my-3"></div>

                        {/* Phone Number / Points Search */}
                        <div className="space-y-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Утасны дугаар (Пойнт)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="8888****"
                                        className="flex-1 h-9 px-3 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:outline-none focus:border-primary transition-all"
                                    />
                                    <button
                                        onClick={handleSearchPoints}
                                        disabled={isSearchingPoints || !phoneNumber}
                                        className="px-3 h-9 bg-gray-100 text-gray-600 rounded-lg font-bold text-[10px] hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center min-w-[60px]"
                                    >
                                        {isSearchingPoints ? (
                                            <span className="material-icons-round animate-spin text-base">sync</span>
                                        ) : (
                                            'Хайх'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {availablePoints !== null && appliedPoints === 0 && (
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-blue-400 uppercase">Боломжит пойнт</span>
                                        <span className="text-sm font-black text-blue-600">₮ {availablePoints.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={handleUsePoints}
                                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md font-bold text-[10px] hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                                    >
                                        Ашиглах
                                    </button>
                                </div>
                            )}

                            {appliedPoints > 0 && (
                                <div className="text-[9px] text-teal-600 font-bold bg-teal-50 px-3 py-2 rounded-lg border border-teal-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-icons-round text-xs">task_alt</span>
                                        <span>Ашигласан: {appliedPoints.toLocaleString()}₮</span>
                                    </div>
                                    <button onClick={() => setAppliedPoints(0)} className="text-teal-400 hover:text-teal-600">
                                        <span className="material-icons-round text-xs">close</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 my-3"></div>

                        {/* Final Amount */}
                        <div className="bg-primary/5 rounded-xl p-3 border-2 border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-gray-600 uppercase tracking-wider">Төлөх дүн:</span>
                                <span className="text-xl font-black text-primary">
                                    {finalAmount.toLocaleString()}₮
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 mt-3">
                            <p className="text-[10px] text-yellow-800 font-bold flex items-start gap-1.5">
                                <span className="material-icons-round text-xs mt-0.5">info</span>
                                <span>Дараагийн алхамд төлбөр төлөх</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Point Usage Popup (Modal) */}
            {showPointPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => !appliedPoints && setShowPointPopup(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800">Пойнт ашиглах</h3>
                            <button onClick={() => setShowPointPopup(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Ашиглах пойнт</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={pointsInput}
                                    onChange={(e) => setPointsInput(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    autoFocus
                                />
                                <div className="mt-1.5 flex justify-between text-[8px] font-medium">
                                    <span className="text-gray-400">Боломжит: <span className="text-teal-600">₮ 50,000</span></span>
                                    <button
                                        onClick={() => setPointsInput(Math.min(50000, subtotal).toString())}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Бүгдийг ашиглах
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-bold text-gray-400 uppercase mb-1 block">Пин код</label>
                                <input
                                    type="password"
                                    placeholder="****"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="p-5 bg-gray-50 flex gap-2">
                            <button
                                onClick={() => setShowPointPopup(false)}
                                className="flex-1 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Буцах
                            </button>
                            <button
                                onClick={handleConfirmPoints}
                                className="flex-1 py-2.5 bg-primary rounded-lg text-xs font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                            >
                                Баталгаажуулах
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellStep2Summary;
