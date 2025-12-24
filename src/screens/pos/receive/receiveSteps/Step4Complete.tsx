import React from 'react';
import { useNavigate } from 'react-router-dom';

const Step4Complete: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="max-w-[1440px] mx-auto p-12 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[500px]">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-lg shadow-green-500/30">
                <span className="material-icons-round text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-tight">Хүлээлгэн өгсөн</h2>
            <p className="text-gray-400 font-bold mb-12">Захиалга амжилттай хүлээлгэн өгөгдлөө</p>
            <button onClick={() => navigate('/pos/receive')} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                Жагсаалт руу буцах
            </button>
        </div>
    );
};

export default Step4Complete;
