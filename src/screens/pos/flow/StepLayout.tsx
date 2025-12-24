import React from 'react';
import StepIndicator from '../../../shared/components/StepIndicator/StepIndicator';
import StepFooter from '../../../shared/components/StepFooter/StepFooter';

interface StepLayoutProps {
    children: React.ReactNode;
    steps?: number;
    currentStep: number;
    maxCompletedStep?: number;
    onBack: () => void;
    onTempSave?: () => void;
    onNext: () => void;
    onStepClick?: (step: number) => void;
    nextLabel?: string;
    isLastStep?: boolean;
    headerLeft?: React.ReactNode;
    footerLeft?: React.ReactNode;
}

const StepLayout: React.FC<StepLayoutProps> = ({
    children,
    steps = 4,
    currentStep,
    maxCompletedStep,
    onBack,
    onTempSave,
    onNext,
    onStepClick,
    nextLabel,
    isLastStep,
    headerLeft,
    footerLeft
}) => {
    return (
        <div className="flex flex-col h-full bg-[#F3F6F9] overflow-hidden">
            {/* 1. Step Indicator (Top Fixed) */}
            {/* We might want to pass custom header content eventually, but for now we stick to Stepper */}
            <div className="bg-white border-b border-gray-100 flex flex-col items-center shrink-0 relative">
                {headerLeft && (
                    <div className="absolute left-8 top-1/2 -translate-y-1/2">
                        {headerLeft}
                    </div>
                )}
                <StepIndicator
                    totalSteps={steps}
                    currentStep={currentStep}
                    maxCompletedStep={maxCompletedStep}
                    onStepClick={onStepClick}
                />
            </div>

            {/* 2. Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="max-w-[1280px] mx-auto p-6 md:p-8 h-full">
                    {children}
                </div>
            </div>

            {/* 3. Footer (Bottom Fixed) */}
            <div className="bg-white border-t border-gray-100 p-4 md:px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-[20] shrink-0">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6">
                    <button
                        onClick={onBack}
                        className="px-6 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-icons-round text-lg">west</span>
                        БУЦАХ
                    </button>

                    {onTempSave && (
                        <button
                            onClick={onTempSave}
                            className="hidden md:flex px-8 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 items-center gap-2"
                        >
                            <span className="material-icons-round text-lg">folder_open</span>
                            ТҮР ХАДГАЛАХ
                        </button>
                    )}

                    {footerLeft && (
                        <div>{footerLeft}</div>
                    )}

                    {/* If onTempSave is not provided, we just don't show it? 
                         The shared StepFooter shows it hardcoded. 
                         I am implementing a INLINE footer here to match the User's "Common Layout Logic" request 
                         which said "StepFooter (Bottom Fixed Action Bar) Left: Print, Right: Confirm". 
                         So I will NOT use the shared StepFooter component if it's too rigid.
                         Actually, the ReceiveDetailScreen had its own footer.
                         I'll stick to a custom footer implementation here inside StepLayout that mimics the shared one but is more flexible, 
                         OR I'll update the shared StepFooter. 
                         Let's update the shared StepFooter later if needed, for now I'll inline the footer logic to be flexible as per plan.
                     */}

                    <button
                        onClick={onNext}
                        className={`px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-yellow-200/50 ${isLastStep
                            ? 'bg-green-500 text-white shadow-green-200'
                            : 'bg-[#FFD400] text-gray-900 hover:bg-[#FFC400]'
                            }`}
                    >
                        {isLastStep ? 'ДУУСГАХ' : (nextLabel || 'ДАРААГИЙН АЛХАМ')}
                        <span className="material-icons-round text-lg">
                            {isLastStep ? 'check_circle' : 'east'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepLayout;
