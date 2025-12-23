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
    nextLabel = "Дараагийн алхам",
    isLastStep = false
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white shrink-0 mt-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition active:scale-95 text-sm uppercase tracking-wide flex items-center gap-2"
            >
                <span className="material-icons-round text-base">arrow_back</span>
                Буцах
            </button>

            {/* Center Group (Temp Save) */}
            <button
                onClick={onTempSave}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition active:scale-95 text-sm uppercase tracking-wide flex items-center gap-2"
            >
                <span className="material-icons-round text-base">save</span>
                Түр хадгалах
            </button>

            {/* Next Button */}
            <button
                onClick={onNext}
                className={`px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition active:scale-95 text-sm uppercase tracking-wide flex items-center gap-2 ${isLastStep
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-secondary text-gray-900 hover:bg-yellow-400'
                    }`}
            >
                {isLastStep ? 'Дуусгах' : nextLabel}
                <span className="material-icons-round text-base">
                    {isLastStep ? 'check_circle' : 'arrow_forward'}
                </span>
            </button>
        </div>
    );
};

export default StepFooter;
