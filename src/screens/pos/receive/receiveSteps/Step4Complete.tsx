import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Step4Complete: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const handlePrintTicket = () => {
        // 영수증/티켓 인쇄 로직
        window.print();
    };
    
    return (
        <div className="max-w-[1440px] mx-auto p-12 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[500px]">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/30">
                <span className="material-icons-round text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Хүлээлгэн өгсөн</h2>
            <p className="text-gray-400 font-bold mb-4">Захиалга амжилттай хүлээлгэн өгөгдлөө</p>
            
            {/* 주문번호 표시 */}
            <div className="mb-8 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Захиалгын дугаар</p>
                <p className="text-2xl font-black text-gray-800 tracking-tight">{id || '#ORD-XXXXX'}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* 영수증/티켓 인쇄 버튼 */}
                <button 
                    onClick={handlePrintTicket}
                    className="flex items-center gap-3 px-8 py-4 bg-[#40C1C7] hover:bg-[#35a8ad] rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#40C1C7]/30"
                >
                    <span className="material-icons-round text-xl">print</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">Падаан хэвлэх</span>
                </button>
                
                {/* 목록으로 돌아가기 */}
                <button 
                    onClick={() => navigate('/pos/receive')} 
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="material-icons-round text-xl">list</span>
                    Жагсаалт руу буцах
                </button>
            </div>
            
            {/* 안내 메시지 */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-md">
                <p className="text-[10px] text-blue-600 font-bold text-center leading-relaxed">
                    <span className="material-icons-round text-sm align-middle mr-1">info</span>
                    Падаан нь захиалгын дугаар болон бусад мэдээллийг агуулсан баримт бичиг юм. Харилцагчид заавал өгнө үү.
                </p>
            </div>
        </div>
    );
};

export default Step4Complete;
