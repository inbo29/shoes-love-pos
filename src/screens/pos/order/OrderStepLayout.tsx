import React from 'react';
import StepIndicator from '../../../shared/components/StepIndicator/StepIndicator';
import StepFooter from '../../../shared/components/StepFooter/StepFooter';

interface OrderStepLayoutProps {
    children: React.ReactNode;
    steps?: number;
    currentStep: number;
    onBack: () => void;
    onTempSave: () => void;
    onNext: () => void;
    onStepClick?: (step: number) => void;
    nextLabel?: string;
    isLastStep?: boolean;
}

const OrderStepLayout: React.FC<OrderStepLayoutProps> = ({
    children,
    steps = 6,
    currentStep,
    onBack,
    onTempSave,
    onNext,
    onStepClick,
    nextLabel,
    isLastStep
}) => {
    return (
        <div className="flex flex-col h-full bg-[#F1F3F4] overflow-hidden">
            {/* 1. Step Indicator (Top Fixed) */}
            <StepIndicator
                totalSteps={steps}
                currentStep={currentStep}
                onStepClick={onStepClick}
            />

            {/* 2. Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24">
                <div className="max-w-5xl mx-auto w-full">
                    {children}
                </div>
            </div>

            {/* 3. Footer (Bottom Fixed) */}
            <StepFooter
                onBack={onBack}
                onTempSave={onTempSave}
                onNext={onNext}
                nextLabel={nextLabel}
                isLastStep={isLastStep}
            />
        </div>
    );
};

export default OrderStepLayout;
