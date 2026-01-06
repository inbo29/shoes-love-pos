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
                    <h2 className="text-xl font-black text-[#374151] uppercase tracking-tight">Бараа лавлах</h2>
                </div>

                {/* Search Area */}
                <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                                <span className="material-icons-round">search</span>
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full h-14 pl-14 pr-4 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                                placeholder="Бараа хайх (Нэр, ангилал, үнэ)..."
                            />
                            <button className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-primary transition-colors">
                                <span className="material-icons-round">qr_code_scanner</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Grid - Only viewing prices, no action buttons */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="bg-white rounded-[28px] p-4 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 flex flex-col gap-4 group">
                                    <div className="aspect-square bg-[#F9FAFB] rounded-[24px] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                        <span className="material-icons-round text-6xl text-gray-100">inventory_2</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 px-1">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{p.category}</span>
                                        <h3 className="text-[13px] font-bold text-gray-800 leading-tight h-8 line-clamp-2">{p.name}</h3>
                                        <div className="mt-2 flex flex-col">
                                            {p.originalPrice && p.originalPrice > p.price && (
                                                <span className="text-[10px] text-gray-400 line-through font-bold">{p.originalPrice.toLocaleString()}₮</span>
                                            )}
                                            <span className="text-lg font-black text-gray-900 leading-none">
                                                {p.price.toLocaleString()}<span className="text-[12px] ml-0.5">₮</span>
                                            </span>
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
