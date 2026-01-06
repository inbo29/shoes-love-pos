import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderStep3Success: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] p-6">
            <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-sm w-full animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <span className="material-icons-round text-6xl text-green-500 animate-in fade-in zoom-in-50 duration-700 delay-200">check_circle</span>
                </div>

                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-4">
                    Захиалга амжилттай
                </h3>

                <p className="text-sm font-bold text-gray-400 leading-relaxed mb-10 px-4">
                    Захиалга амжилттай бүртгэгдлээ. Төв салбар руу мэдээлэл илгээгдсэн.
                </p>

                <button
                    onClick={() => navigate('/pos/product-order')}
                    className="w-full py-5 bg-[#FFD400] text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-yellow-200 hover:bg-[#FFC400] transition-all active:scale-95"
                >
                    Жагсаалт руу буцах
                </button>
            </div>
        </div>
    );
};

export default OrderStep3Success;
