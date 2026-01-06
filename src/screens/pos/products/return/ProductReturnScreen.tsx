import React from 'react';

const ProductReturnScreen: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#F8F9FA]">
            <div className="w-full flex flex-col p-6 gap-6">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm"></div>
                    <h2 className="text-[18px] font-bold text-[#374151]">
                        Бараа үлдэгдэл
                    </h2>
                </div>
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                    <span className="material-icons-round text-8xl text-gray-200 mb-4 block">
                        assignment_return
                    </span>
                    <p className="text-gray-400 font-bold text-lg">Бараа үлдэгдэл модуль</p>
                    <p className="text-gray-300 text-sm mt-2">Product Return Module - Coming Soon</p>
                </div>
            </div>
        </div>
    );
};

export default ProductReturnScreen;
