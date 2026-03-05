import React, { useState, useMemo } from 'react';
import { mockProducts, Product } from '../../../../../services/mockProductData';
import type { SelectedOrderProduct } from '../ProductOrderListScreen';

interface Props {
    selectedProducts: SelectedOrderProduct[];
    onProductsChange: (products: SelectedOrderProduct[]) => void;
    fromBranch?: string;
}

const OrderStep1ProductSelect: React.FC<Props> = ({
    selectedProducts,
    onProductsChange,
    fromBranch = '현재 판매점',
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [quantities, setQuantities] = useState<Record<string, number>>(() => {
        const init: Record<string, number> = {};
        selectedProducts.forEach(sp => { init[sp.productId] = sp.quantity; });
        return init;
    });

    const filteredProducts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return mockProducts;
        return mockProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.price.toString().includes(query) ||
            (product.id && product.id.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    const handleQuantityChange = (product: Product, delta: number) => {
        const currentQty = quantities[product.id] || 0;
        const newQty = Math.max(0, currentQty + delta);
        const newQuantities = { ...quantities, [product.id]: newQty };
        setQuantities(newQuantities);

        const selected: SelectedOrderProduct[] = [];
        Object.entries(newQuantities).forEach(([productId, qty]: [string, number]) => {
            if (qty > 0) {
                const prod = mockProducts.find(p => p.id === productId);
                if (prod) {
                    selected.push({
                        productId: prod.id,
                        name: prod.name,
                        price: prod.price,
                        category: prod.category,
                        quantity: qty as number,
                        stock: prod.stock,
                    });
                }
            }
        });
        onProductsChange(selected);
    };

    const handleQtyInput = (product: Product, rawValue: string) => {
        const newQty = Math.max(0, parseInt(rawValue) || 0);
        const newQuantities = { ...quantities, [product.id]: newQty };
        setQuantities(newQuantities);
        const selected: SelectedOrderProduct[] = [];
        Object.entries(newQuantities).forEach(([productId, qty]: [string, number]) => {
            if (qty > 0) {
                const prod = mockProducts.find(p => p.id === productId);
                if (prod) {
                    selected.push({ productId: prod.id, name: prod.name, price: prod.price, category: prod.category, quantity: qty as number, stock: prod.stock });
                }
            }
        });
        onProductsChange(selected);
    };

    const totalSelectedItems = (Object.values(quantities) as number[]).filter(q => q > 0).length;
    const totalSelectedQty = (Object.values(quantities) as number[]).reduce((a, b) => a + b, 0);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            {/* From → To fixed banner */}
            <div className="shrink-0 mx-4 mt-4 px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                <span className="material-icons-round text-base text-gray-400">storefront</span>
                <span className="text-gray-700">{fromBranch}</span>
                <span className="material-icons-round text-base text-[#40C1C7]">east</span>
                <span className="text-[#40C1C7]">Төв салбар</span>
                <span className="ml-auto text-[10px] font-bold text-gray-300 normal-case tracking-normal">// Захиалгын чиглэл тогтмол</span>
            </div>

            <div className="w-full flex flex-col p-4 md:p-4 gap-4 flex-1 overflow-hidden">
                {/* Search bar */}
                <div className="relative shrink-0">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <span className="material-icons-round text-xl">search</span>
                    </span>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="block w-full h-[48px] pl-12 pr-4 border border-gray-200 rounded-2xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                        placeholder="Барааны нэр, ангилал, үнэ, баркодоор хайх..."
                        type="text"
                    />
                </div>

                {/* Product grid */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredProducts.map(product => {
                            const qty = quantities[product.id] || 0;
                            const isSelected = qty > 0;
                            const stock = product.stock ?? 0;
                            const lowStock = stock < 5;

                            return (
                                <div
                                    key={product.id}
                                    className={`bg-white rounded-xl border-2 transition-all flex flex-col ${isSelected ? 'border-primary shadow-lg shadow-primary/10' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 rounded-t-lg">
                                        <span className="material-icons-round text-5xl text-gray-200">inventory_2</span>
                                    </div>

                                    <div className="p-3 flex flex-col gap-2 flex-1">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1.5 py-0.5 bg-gray-50 rounded-md inline-block">{product.category}</p>
                                            <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-black text-gray-900">{product.price.toLocaleString()}₮</p>
                                            {/* Stock indicator */}
                                            <p className={`text-[9px] font-bold ${lowStock ? 'text-red-400' : 'text-gray-400'} flex items-center gap-0.5`}>
                                                <span className="material-icons-round text-[10px]">{lowStock ? 'warning' : 'inventory'}</span>
                                                재고 {stock}
                                            </p>
                                        </div>

                                        {/* Qty stepper */}
                                        <div className={`flex items-center justify-between gap-1 rounded-lg p-1 transition-colors ${isSelected ? 'bg-primary/5' : 'bg-gray-50'}`}>
                                            <button
                                                onClick={() => handleQuantityChange(product, -1)}
                                                disabled={qty === 0}
                                                className="w-7 h-7 rounded-md flex items-center justify-center bg-white border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 active:scale-95 shrink-0"
                                            >
                                                <span className="material-icons-round text-base">remove</span>
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={qty === 0 ? '' : qty}
                                                placeholder="0"
                                                onChange={e => handleQtyInput(product, e.target.value)}
                                                className={`font-black text-sm min-w-0 w-full text-center bg-transparent focus:outline-none ${isSelected ? 'text-primary' : 'text-gray-300'}`}
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(product, 1)}
                                                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 active:scale-95 ${isSelected ? 'bg-primary text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <span className="material-icons-round text-base">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center text-gray-300">
                                <span className="material-icons-round text-5xl mb-3">search_off</span>
                                <p className="font-bold text-sm">Хайлтын үр дүн олдсонгүй</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom summary bar */}
                {(totalSelectedItems > 0) && (
                    <div className="shrink-0 mx-0 mt-1 px-5 py-3 bg-primary rounded-2xl text-white flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
                        <span className="material-icons-round text-base">shopping_cart</span>
                        <span>{totalSelectedItems} төрөл</span>
                        <span className="text-primary/50">|</span>
                        <span>{totalSelectedQty} ширхэг</span>
                        <span className="ml-auto text-[10px] font-bold text-white/60 normal-case tracking-normal">Дараагийн алхам руу шилжинэ</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStep1ProductSelect;
