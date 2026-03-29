import React, { useState, useMemo } from 'react';
import { mockProducts } from '../../../../services/mockProductData';

const ProductInquiryScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return mockProducts;
        const lowerQuery = searchQuery.toLowerCase();
        return mockProducts.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.id.toLowerCase().includes(lowerQuery) ||
            p.price.toString().includes(lowerQuery)
        );
    }, [searchQuery]);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
            <div className="w-full h-full flex flex-col p-4 md:p-6 gap-6 relative overflow-hidden">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="h-8 w-1.5 bg-primary rounded-sm"></div>
                    <h2 className="text-xl font-bold text-[#374151] uppercase tracking-tight">Бараа лавлах</h2>
                </div>

                {/* Search Area */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round text-sm">search</span>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full h-[44px] pl-9 pr-12 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all"
                                placeholder="Бараа хайх (Нэр, ангилал, үнэ)..."
                            />
                            <button className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors">
                                <span className="material-icons-round text-lg">qr_code_scanner</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Grid - Only viewing prices, no action buttons */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="bg-white rounded-xl border-2 border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-200 flex flex-col overflow-hidden cursor-pointer active:scale-[0.97]">
                                    {/* Product Image */}
                                    <div className="h-[120px] bg-gray-50 flex items-center justify-center p-2 relative overflow-hidden">
                                        <span className="material-icons-round text-4xl text-gray-200">inventory_2</span>
                                    </div>
                                    {/* Product Info */}
                                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                                        <p className="text-[8px] font-bold text-primary uppercase tracking-wider px-1 py-0.5 bg-primary/5 rounded self-start">
                                            {p.category}
                                        </p>
                                        <h3 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight min-h-[28px]">
                                            {p.name}
                                        </h3>
                                        <div className="mt-auto">
                                            {p.salePrice ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[10px] font-black text-red-500 bg-red-50 px-1 py-0.5 rounded leading-none">
                                                            -{Math.round(((p.price - p.salePrice) / p.price) * 100)}%
                                                        </span>
                                                        <span className="text-[9px] text-gray-400 line-through font-bold">
                                                            {p.price.toLocaleString()}₮
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900 leading-none block mt-1">
                                                        {p.salePrice.toLocaleString()}<span className="text-[10px] ml-0.5">₮</span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-black text-gray-900 leading-none block">
                                                    {p.price.toLocaleString()}<span className="text-[10px] ml-0.5">₮</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-200 py-20">
                            <span className="material-icons-round text-8xl mb-4 opacity-10 font-thin">search_off</span>
                            <p className="font-black text-xl text-gray-300 uppercase tracking-widest">Бараа олдсонгүй</p>
                            <p className="text-gray-400 font-bold mt-2">Хайлтын утгаа шалгана уу</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductInquiryScreen;
