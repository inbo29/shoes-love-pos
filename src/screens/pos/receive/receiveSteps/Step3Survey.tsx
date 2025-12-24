import React from 'react';

const Step3Survey: React.FC = () => {
    return (
        <div className="max-w-[1440px] mx-auto p-12 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-xl min-h-[500px]">
            <span className="material-icons-round text-gray-200 text-6xl mb-6">poll</span>
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight">Сэтгэл ханамжийн санал асуулга</h2>
            <p className="text-gray-400 font-bold mb-12">Үйлчилгээ болон гүйцэтгэлд өгөх үнэлгээ</p>
            <div className="w-full max-w-lg bg-gray-50 rounded-2xl p-8 border border-gray-100 italic text-center text-gray-400">
                Судалгааны UI хөгжүүлэгдэж байна...
            </div>
        </div>
    );
};

export default Step3Survey;
