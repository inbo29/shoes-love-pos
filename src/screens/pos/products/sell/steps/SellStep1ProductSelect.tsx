import React, { useState, useMemo } from 'react'; // Verified Import Fix
import { mockProducts, Product } from '../../../../../services/mockProductData';
import type { SelectedProduct } from '../ProductSellFlowScreen';

interface Props {
    selectedProducts: SelectedProduct[];
    onProductsChange: (products: SelectedProduct[]) => void;
}

const SellStep1ProductSelect: React.FC<Props> = ({ selectedProducts, onProductsChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    // Initialize quantities from selected products
    React.useEffect(() => {
        const initialQuantities: Record<string, number> = {};
        selectedProducts.forEach(sp => {
            initialQuantities[sp.productId] = sp.quantity;
        });
        setQuantities(initialQuantities);
    }, []);

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

    const handleQuantityChange = (product: Product, delta: number) => {
        const currentQty = quantities[product.id] || 0;
        const newQty = Math.max(0, currentQty + delta);

        const newQuantities = { ...quantities, [product.id]: newQty };
        setQuantities(newQuantities);

        // Update parent with selected products
        const selected: SelectedProduct[] = [];
        Object.entries(newQuantities).forEach(([productId, qty]: [string, number]) => {
            if (qty > 0) {
                const prod = mockProducts.find(p => p.id === productId);
                if (prod) {
                    selected.push({
                        productId: prod.id,
                        name: prod.name,
                        price: prod.price,
                        salePrice: prod.salePrice,
                        quantity: qty as number
                    });
                }
            }
        });
        onProductsChange(selected);
    };

    const handleBarcodeSearch = (barcode: string) => {
        // Simulate barcode search - filter to first matching product
        const found = mockProducts.find(p => p.id.includes(barcode));
        if (found) {
            setSearchQuery(found.name);
            setShowBarcodeModal(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            <div className="w-full flex flex-col p-4 md:p-6 gap-6 flex-1 overflow-hidden">
                {/* Search Bar */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <span className="material-icons-round text-xl">search</span>
                        </span>
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="block w-full h-[52px] pl-12 pr-4 border border-gray-200 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm shadow-sm transition-all"
                            placeholder="Бараа хайх (Нэр, ангилал, үнэ...)..."
                            type="text"
                        />
                    </div>
                    <button
                        onClick={() => setShowBarcodeModal(true)}
                        className="h-[52px] w-[52px] bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm group"
                        title="Barcode сканнер"
                    >
                        <span className="material-icons-round text-2xl text-gray-600 group-hover:text-primary">qr_code_scanner</span>
                    </button>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map(product => {
                            const qty = quantities[product.id] || 0;
                            const isSelected = qty > 0;

                            return (
                                <div
                                    key={product.id}
                                    className={`bg-white rounded-xl border-2 transition-all overflow-hidden flex flex-col ${isSelected
                                        ? 'border-primary shadow-lg shadow-primary/20'
                                        : 'border-gray-100 hover:border-gray-200 shadow-sm'
                                        }`}
                                >
                                    {/* Product Image */}
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="material-icons-round text-6xl text-gray-300">inventory_2</span>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-3 flex flex-col gap-2 flex-1">
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1.5 py-0.5 bg-gray-50 rounded-md self-start inline-block">
                                                {product.category}
                                            </p>
                                            <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 min-h-[32px] leading-tight">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col mb-1">
                                            {product.salePrice ? (
                                                <>
                                                    <p className="text-[10px] font-bold text-gray-400 line-through decoration-red-400 decoration-2">
                                                        {product.price.toLocaleString()}₮
                                                    </p>
                                                    <p className="text-sm font-black text-primary">
                                                        {product.salePrice.toLocaleString()}₮
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-black text-gray-900">
                                                    {product.price.toLocaleString()}₮
                                                </p>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className={`flex items-center justify-between gap-1 rounded-lg p-1 transition-colors ${isSelected ? 'bg-primary/5' : 'bg-gray-50'}`}>
                                            <button
                                                onClick={() => handleQuantityChange(product, -1)}
                                                disabled={qty === 0}
                                                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all active:scale-95 ${qty === 0
                                                    ? 'bg-transparent text-gray-300 cursor-not-allowed'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                                                    }`}
                                            >
                                                <span className="material-icons-round text-base">remove</span>
                                            </button>

                                            <div className="flex-1 flex justify-center">
                                                <span className={`font-black text-sm min-w-[20px] text-center ${isSelected ? 'text-primary' : 'text-gray-300'}`}>
                                                    {qty > 0 ? qty : '0'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleQuantityChange(product, 1)}
                                                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all active:scale-95 ${isSelected
                                                    ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary'
                                                    }`}
                                            >
                                                <span className="material-icons-round text-base">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                            <span className="material-icons-round text-8xl mb-4 opacity-20">search_off</span>
                            <p className="font-bold text-lg">Бараа олдсонгүй</p>
                            <p className="text-sm">Өөр түлхүүр үгээр хайж үзнэ үү</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Barcode Scanner Modal */}
            {showBarcodeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBarcodeModal(false)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-icons-round text-3xl text-primary">qr_code_scanner</span>
                            <h3 className="text-xl font-bold text-gray-800">Barcode сканнер</h3>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Barcode оруулах..."
                                className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        handleBarcodeSearch((e.target as HTMLInputElement).value);
                                    }
                                }}
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowBarcodeModal(false)}
                                    className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Болих
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.querySelector('input[placeholder="Barcode оруулах..."]') as HTMLInputElement;
                                        if (input) handleBarcodeSearch(input.value);
                                    }}
                                    className="flex-1 h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
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
