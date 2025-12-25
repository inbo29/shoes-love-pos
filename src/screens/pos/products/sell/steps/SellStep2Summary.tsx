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

    // Sync state with props when entering the step
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    // Calculate totals
    const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    // Max points user can use is capped by subtotal (cannot pay more than total with points - logically)
    // In real app, also capped by user's available points.
    const maxRedeemable = subtotal;

    const finalAmount = Math.max(0, subtotal - initialDiscount - appliedPoints);

    // Notify parent of changes whenever products or points change
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

    // Point Handlers
    const handlePointCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setShowPointPopup(true);
            setPointsInput(appliedPoints > 0 ? appliedPoints.toString() : '');
        } else {
            setAppliedPoints(0);
            setUsePoints(false);
        }
    };

    const handleConfirmPoints = () => {
        const points = parseInt(pointsInput);
        if (!isNaN(points) && points > 0) {
            // Validate against max bill amount
            const validPoints = Math.min(points, maxRedeemable);
            setAppliedPoints(validPoints);
            setUsePoints(true);
            setShowPointPopup(false);
            // Optionally clear password
            setPasswordInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col xl:flex-row h-full bg-[#F8F9FA] gap-6 overflow-hidden p-4 md:p-6">
            {/* Left: Product List */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h2 className="text-[18px] font-bold text-[#374151]">
                        Сонгосон бараа
                    </h2>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-y-auto flex-1 no-scrollbar">
                        <div className="min-w-[600px]">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest uppercase">
                                <div className="flex-1 px-2">Барааны нэр</div>
                                <div className="w-[120px] px-2 text-center">Үнэ</div>
                                <div className="w-[140px] px-2 text-center">Тоо ширхэг</div>
                                <div className="w-[120px] px-2 text-right">Дүн</div>
                            </div>

                            {/* Products */}
                            <div className="divide-y divide-gray-50">
                                {products.map(product => (
                                    <div key={product.productId} className="flex px-6 py-5 items-center hover:bg-gray-50 transition-colors">
                                        <div className="flex-1 px-2">
                                            <p className="text-sm font-bold text-gray-800 line-clamp-2">
                                                {product.name}
                                            </p>
                                        </div>
                                        <div className="w-[120px] px-2 text-center">
                                            <span className="text-sm font-black text-gray-600">
                                                {product.price.toLocaleString()}₮
                                            </span>
                                        </div>
                                        <div className="w-[140px] px-2 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(product.productId, -1)}
                                                className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">remove</span>
                                            </button>
                                            <span className="font-black text-base text-primary min-w-[32px] text-center">
                                                {product.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(product.productId, 1)}
                                                className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">add</span>
                                            </button>
                                        </div>
                                        <div className="w-[120px] px-2 text-right">
                                            <span className="text-base font-black text-gray-900">
                                                {(product.price * product.quantity).toLocaleString()}₮
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {products.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                                    <span className="material-icons-round text-8xl mb-4 opacity-20">shopping_cart</span>
                                    <p className="font-bold text-lg">Сонгосон бараа байхгүй</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Payment Summary Card */}
            <div className="w-full xl:w-[380px] shrink-0">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="h-8 w-1.5 bg-[#FFD400] rounded-sm"></div>
                        <h3 className="text-[16px] font-bold text-[#374151] uppercase tracking-tight">
                            Төлбөрийн тоо<span className="lowercase">ц</span>оо
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Үнийн дүн:</span>
                            <span className="text-lg font-black text-gray-900">
                                {subtotal.toLocaleString()}₮
                            </span>
                        </div>

                        {/* VAT */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">НӨАТ (10%):</span>
                            <span className="text-lg font-black text-gray-600">
                                {Math.floor(subtotal * 0.1).toLocaleString()}₮
                            </span>
                        </div>

                        {/* Points Display */}
                        {appliedPoints > 0 && (
                            <div className="flex justify-between items-center text-blue-500">
                                <span className="text-sm font-bold uppercase tracking-wide">Пойнт ашиглалт:</span>
                                <span className="text-lg font-black">
                                    - {appliedPoints.toLocaleString()}₮
                                </span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

                        {/* Point Usage Checkbox & Trigger */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={usePoints || appliedPoints > 0}
                                        onChange={handlePointCheckbox}
                                        className="sr-only"
                                    />
                                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${(usePoints || appliedPoints > 0) ? 'bg-primary border-primary shadow-lg shadow-primary/30' : 'border-gray-200 bg-gray-50 group-hover:border-primary/50'
                                        }`}>
                                        {(usePoints || appliedPoints > 0) && <span className="material-icons-round text-white text-sm">check</span>}
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide group-hover:text-primary transition-colors">Пойнт ашиглах</span>
                            </label>

                            {appliedPoints > 0 && (
                                <div className="text-[10px] text-blue-600 font-bold bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 flex items-center justify-between group cursor-pointer" onClick={() => setShowPointPopup(true)}>
                                    <span>Ашигласан: {appliedPoints.toLocaleString()}₮</span>
                                    <span className="material-icons-round text-blue-400 text-sm group-hover:translate-x-1 transition-transform">edit</span>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

                        {/* Final Amount */}
                        <div className="bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-gray-600 uppercase tracking-wider">Төлөх дүн:</span>
                                <span className="text-2xl font-black text-primary">
                                    {finalAmount.toLocaleString()}₮
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-4">
                            <p className="text-xs text-yellow-800 font-bold flex items-start gap-2">
                                <span className="material-icons-round text-sm mt-0.5">info</span>
                                <span>Дараагийн алхамд төлбөр төлөх</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Point Usage Popup (Modal) */}
            {showPointPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => !appliedPoints && setShowPointPopup(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800">Пойнт ашиглах</h3>
                            <button onClick={() => setShowPointPopup(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Ашиглах пойнт</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={pointsInput}
                                    onChange={(e) => setPointsInput(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    autoFocus
                                />
                                <div className="mt-2 flex justify-between text-[9px] font-medium">
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
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Пин код</label>
                                <input
                                    type="password"
                                    placeholder="****"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowPointPopup(false)}
                                className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Буцах
                            </button>
                            <button
                                onClick={handleConfirmPoints}
                                className="flex-1 py-3 bg-primary rounded-xl text-xs font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
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
