import React from 'react';

interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
    onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ totalSteps, currentStep, onStepClick }) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center py-6 bg-white shrink-0 shadow-sm z-10">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;
                    const isFuture = step > currentStep;

                    return (
                        <React.Fragment key={step}>
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className={`w-12 h-0.5 mx-2 ${step <= currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                            )}

                            {/* Step Circle */}
                            <button
                                disabled={isFuture}
                                onClick={() => onStepClick && onStepClick(step)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm select-none ${isActive
                                    ? 'bg-primary border-primary text-white scale-110 shadow-lg ring-4 ring-primary/20'
                                    : isCompleted
                                        ? 'bg-white border-primary text-primary hover:bg-primary/5 cursor-pointer'
                                        : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isCompleted ? (
                                    <span className="material-icons-round text-lg">check</span>
                                ) : (
                                    step
                                )}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;
