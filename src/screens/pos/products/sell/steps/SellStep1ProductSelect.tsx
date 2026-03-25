import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { mockProducts, Product } from '../../../../../services/mockProductData';
import type { SelectedProduct } from '../ProductSellFlowScreen';

interface Props {
    selectedProducts: SelectedProduct[];
    onProductsChange: (products: SelectedProduct[]) => void;
}

const SellStep1ProductSelect: React.FC<Props> = ({ selectedProducts, onProductsChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const panelBottomRef = useRef<HTMLDivElement>(null);

    // Build a qty map from selectedProducts for quick lookup
    const qtyMap = useMemo(() => {
        const map: Record<string, number> = {};
        selectedProducts.forEach(sp => { map[sp.productId] = sp.quantity; });
        return map;
    }, [selectedProducts]);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return mockProducts;
        return mockProducts.filter(product =>
            product.category.toLowerCase().includes(query) ||
            product.name.toLowerCase().includes(query) ||
            product.shortDescription.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
    }, [searchQuery]);

    // Helper: produce a new selectedProducts array with delta applied
    const applyDelta = useCallback((product: Product, delta: number) => {
        const existing = selectedProducts.find(sp => sp.productId === product.id);
        let updated: SelectedProduct[];
        if (existing) {
            const newQty = Math.max(0, existing.quantity + delta);
            if (newQty === 0) {
                updated = selectedProducts.filter(sp => sp.productId !== product.id);
            } else {
                updated = selectedProducts.map(sp =>
                    sp.productId === product.id ? { ...sp, quantity: newQty } : sp
                );
            }
        } else if (delta > 0) {
            updated = [...selectedProducts, {
                productId: product.id,
                name: product.name,
                price: product.price,
                salePrice: product.salePrice,
                quantity: delta
            }];
        } else {
            return; // nothing to do
        }
        onProductsChange(updated);
    }, [selectedProducts, onProductsChange]);

    // Card click: +1
    const handleCardClick = useCallback((product: Product) => {
        applyDelta(product, 1);
    }, [applyDelta]);

    // Panel quantity controls
    const handlePanelQtyChange = useCallback((productId: string, delta: number) => {
        const product = mockProducts.find(p => p.id === productId);
        if (product) applyDelta(product, delta);
    }, [applyDelta]);

    // Panel delete
    const handlePanelDelete = useCallback((productId: string) => {
        onProductsChange(selectedProducts.filter(sp => sp.productId !== productId));
    }, [selectedProducts, onProductsChange]);

    // Barcode search
    const handleBarcodeSearch = useCallback((barcode: string) => {
        const found = mockProducts.find(p => p.id.includes(barcode) || p.name.toLowerCase().includes(barcode.toLowerCase()));
        if (found) {
            applyDelta(found, 1);
            setShowBarcodeModal(false);
            setSearchQuery('');
        } else {
            setToastMessage('Бараа олдсонгүй');
            setTimeout(() => setToastMessage(null), 2500);
        }
    }, [applyDelta]);

    // Calculate total
    const totalAmount = useMemo(() => {
        return selectedProducts.reduce((sum, p) => sum + ((p.salePrice ?? p.price) * p.quantity), 0);
    }, [selectedProducts]);

    // Scroll to bottom of panel when items change
    useEffect(() => {
        if (panelBottomRef.current) {
            panelBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedProducts.length]);

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full bg-[#F8F9FA] overflow-hidden gap-0">
            {/* ========== LEFT: Product Grid ========== */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                <div className="flex flex-col p-3 md:p-4 gap-3 flex-1 overflow-hidden">
                    {/* Search Bar */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round text-lg">search</span>
                            </span>
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="block w-full h-[44px] pl-10 pr-4 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm transition-all"
                                placeholder="Бараа хайх (Нэр, ангилал, үнэ...)..."
                                type="text"
                            />
                        </div>
                        <button
                            onClick={() => setShowBarcodeModal(true)}
                            className="h-[44px] w-[44px] bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm group"
                            title="Barcode сканнер"
                        >
                            <span className="material-icons-round text-xl text-gray-600 group-hover:text-primary">qr_code_scanner</span>
                        </button>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5">
                            {filteredProducts.map(product => {
                                const qty = qtyMap[product.id] || 0;
                                const isSelected = qty > 0;

                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => handleCardClick(product)}
                                        className={`bg-white rounded-xl border-2 transition-all overflow-hidden flex flex-col cursor-pointer select-none active:scale-[0.97] ${isSelected
                                            ? 'border-primary shadow-md shadow-primary/15'
                                            : 'border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        {/* Product Image */}
                                        <div className="h-[120px] bg-gray-50 flex items-center justify-center p-2 relative overflow-hidden">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
                                            ) : (
                                                <span className="material-icons-round text-4xl text-gray-300">inventory_2</span>
                                            )}
                                            {/* Quantity badge */}
                                            {isSelected && (
                                                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shadow-lg">
                                                    {qty}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-2.5 flex flex-col gap-1 flex-1">
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider px-1 py-0.5 bg-gray-50 rounded self-start">
                                                {product.category}
                                            </p>
                                            <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight min-h-[28px]">
                                                {product.name}
                                            </h3>
                                            <div className="mt-auto">
                                                {product.salePrice ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[9px] font-bold text-gray-400 line-through">
                                                            {product.price.toLocaleString()}₮
                                                        </span>
                                                        <span className="text-sm font-black text-primary">
                                                            {product.salePrice.toLocaleString()}₮
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-black text-gray-900">
                                                        {product.price.toLocaleString()}₮
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                                <span className="material-icons-round text-6xl mb-3 opacity-20">search_off</span>
                                <p className="font-bold text-base">Бараа олдсонгүй</p>
                                <p className="text-xs">Өөр түлхүүр үгээр хайж үзнэ үү</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========== RIGHT: Selected Items Panel (Sticky) ========== */}
            <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 border-l border-gray-200 bg-white flex flex-col h-full">
                {/* Panel Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-primary text-lg">shopping_cart</span>
                        <h3 className="text-sm font-black text-gray-800">Сонгосон бараа</h3>
                    </div>
                    {selectedProducts.length > 0 && (
                        <span className="text-[10px] font-bold text-white bg-primary rounded-full px-2 py-0.5">
                            {selectedProducts.reduce((s, p) => s + p.quantity, 0)}
                        </span>
                    )}
                </div>

                {/* Panel Items */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {selectedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300 p-6">
                            <span className="material-icons-round text-5xl mb-3 opacity-20">add_shopping_cart</span>
                            <p className="font-bold text-xs text-center">Бараа дарж сонгоно уу</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {selectedProducts.map(item => {
                                const unitPrice = item.salePrice ?? item.price;
                                return (
                                    <div key={item.productId} className="px-3 py-2.5 hover:bg-gray-50/50 transition-colors group grid items-center gap-x-2" style={{ gridTemplateColumns: '1fr auto auto auto' }}>
                                        {/* Col 1: Name + Unit Price */}
                                        <div className="min-w-0 overflow-hidden">
                                            <p className="text-[11px] font-bold text-gray-800 truncate">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                                                {unitPrice.toLocaleString()}₮
                                            </p>
                                        </div>

                                        {/* Col 2: Qty Controls (fixed width) */}
                                        <div className="flex items-center gap-1 w-[90px] justify-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePanelQtyChange(item.productId, -1); }}
                                                className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95"
                                            >
                                                <span className="material-icons-round text-sm">remove</span>
                                            </button>
                                            <span className="text-sm font-black text-primary w-[24px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePanelQtyChange(item.productId, 1); }}
                                                className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                                            >
                                                <span className="material-icons-round text-sm">add</span>
                                            </button>
                                        </div>

                                        {/* Col 3: Subtotal (fixed width) */}
                                        <span className="text-xs font-black text-gray-900 w-[70px] text-right">
                                            {(unitPrice * item.quantity).toLocaleString()}₮
                                        </span>

                                        {/* Col 4: Delete (fixed width) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handlePanelDelete(item.productId); }}
                                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="material-icons-round text-sm">close</span>
                                        </button>
                                    </div>
                                );
                            })}
                            <div ref={panelBottomRef} />
                        </div>
                    )}
                </div>

                {/* Panel Footer: Total */}
                <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 p-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Нийт дүн:</span>
                        <span className="text-lg font-black text-gray-900">{totalAmount.toLocaleString()}₮</span>
                    </div>
                </div>
            </div>

            {/* ========== Toast Notification ========== */}
            {toastMessage && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-2xl animate-bounce-in">
                    {toastMessage}
                </div>
            )}

            {/* ========== Barcode Scanner Modal ========== */}
            {showBarcodeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBarcodeModal(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="material-icons-round text-2xl text-primary">qr_code_scanner</span>
                            <h3 className="text-lg font-bold text-gray-800">Barcode сканнер</h3>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Barcode оруулах..."
                                className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        handleBarcodeSearch((e.target as HTMLInputElement).value);
                                    }
                                }}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowBarcodeModal(false)}
                                    className="flex-1 h-11 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                >
                                    Болих
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Barcode оруулах..."]') as HTMLInputElement;
                                        if (input) handleBarcodeSearch(input.value);
                                    }}
                                    className="flex-1 h-11 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all"
                                >
                                    Хайх
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellStep1ProductSelect;
