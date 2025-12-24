import React from 'react';

interface StepFooterProps {
    onBack: () => void;
    onTempSave: () => void;
    onNext: () => void;
    nextLabel?: string;
    isLastStep?: boolean;
}

const StepFooter: React.FC<StepFooterProps> = ({
    onBack,
    onTempSave,
    onNext,
    nextLabel = "ДАРААГИЙН АЛХАМ",
    isLastStep = false
}) => {
    return (
        <div className="flex items-center justify-between p-4 md:px-8 bg-white border-t border-gray-100 shrink-0 mt-auto z-20">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="px-6 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <span className="material-icons-round text-lg">west</span>
                БУЦАХ
            </button>

            {/* Center Group (Temp Save) */}
            <button
                onClick={onTempSave}
                className="px-8 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2"
            >
                <span className="material-icons-round text-lg">folder_open</span>
                ТҮР ХАДГАЛАХ
            </button>

            {/* Next Button */}
            <button
                onClick={onNext}
                className={`px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-yellow-200/50 ${isLastStep
                        ? 'bg-green-500 text-white shadow-green-200'
                        : 'bg-[#FFD400] text-gray-900 hover:bg-[#FFC400]'
                    }`}
            >
                {isLastStep ? 'ДУУСГАХ' : nextLabel}
                <span className="material-icons-round text-lg">
                    {isLastStep ? 'check_circle' : 'east'}
                </span>
            </button>
        </div>
    );
};

export default StepFooter;
