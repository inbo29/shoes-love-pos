import React, { useState, useMemo } from 'react';
import { mockProducts, Product } from '../../../../../services/mockProductData';
import type { SelectedOrderProduct } from '../ProductOrderListScreen';

interface Props {
    selectedProducts: SelectedOrderProduct[];
    onProductsChange: (products: SelectedOrderProduct[]) => void;
}

const OrderStep1ProductSelect: React.FC<Props> = ({ selectedProducts, onProductsChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    React.useEffect(() => {
        const initialQuantities: Record<string, number> = {};
        selectedProducts.forEach(sp => {
            initialQuantities[sp.productId] = sp.quantity;
        });
        setQuantities(initialQuantities);
    }, []);

    const filteredProducts = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query) return mockProducts;

        return mockProducts.filter(product =>
            product.category.toLowerCase().includes(query) ||
            product.name.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
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
                        quantity: qty as number
                    });
                }
            }
        });
        onProductsChange(selected);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 flex-1 overflow-hidden">
                <div className="relative shrink-0">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <span className="material-icons-round text-xl">search</span>
                    </span>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="block w-full h-[52px] pl-12 pr-4 border border-gray-200 rounded-2xl bg-white text-sm"
                        placeholder="Бараа хайх..."
                        type="text"
                    />
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map(product => {
                            const qty = quantities[product.id] || 0;
                            const isSelected = qty > 0;

                            return (
                                <div
                                    key={product.id}
                                    className={`bg-white rounded-xl border-2 transition-all flex flex-col ${isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                        <span className="material-icons-round text-6xl text-gray-300">inventory_2</span>
                                    </div>

                                    <div className="p-3 flex flex-col gap-2 flex-1">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1.5 py-0.5 bg-gray-50 rounded-md inline-block">{product.category}</p>
                                            <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                                        </div>

                                        <p className="text-sm font-black text-gray-900">{product.price.toLocaleString()}₮</p>

                                        <div className={`flex items-center justify-between gap-1 rounded-lg p-1 transition-colors ${isSelected ? 'bg-primary/5' : 'bg-gray-50'}`}>
                                            <button onClick={() => handleQuantityChange(product, -1)} className="w-7 h-7 rounded-md flex items-center justify-center bg-white border border-gray-200 text-gray-600 disabled:opacity-30" disabled={qty === 0}>
                                                <span className="material-icons-round text-base">remove</span>
                                            </button>
                                            <span className={`font-black text-sm min-w-[20px] text-center ${isSelected ? 'text-primary' : 'text-gray-300'}`}>{qty}</span>
                                            <button onClick={() => handleQuantityChange(product, 1)} className={`w-7 h-7 rounded-md flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                                                <span className="material-icons-round text-base">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStep1ProductSelect;
