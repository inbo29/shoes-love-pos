import React from 'react';

interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
    maxCompletedStep?: number;
    onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ totalSteps, currentStep, maxCompletedStep = 0, onStepClick }) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center py-6 bg-white shrink-0 shadow-sm z-10 w-full">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    // Logic:
                    // 1. Checkmark if: step <= maxCompletedStep OR step < currentStep (legacy fallback)
                    //    User Rule: step < completedStep -> Checked.
                    //    Actually user said: "step < completedStepByStatus" -> Checked.
                    //    And "step === currentStep" -> Active.

                    // Let's refine based on "maxCompletedStep" logic.
                    // If maxCompletedStep is provided, use it. Else fallback to currentStep-1.

                    const effectiveCompleted = maxCompletedStep > 0 ? maxCompletedStep : (currentStep - 1);

                    const isActive = step === currentStep;
                    const isCompleted = step <= effectiveCompleted && !isActive;
                    // Note: If I am on Step 1 (Active), but Step 1 is "Completed" by status... 
                    // UI Guidelines usually say "Active" overrides "Checked" visual for the current circle, 
                    // BUT the user might want a checkmark INSIDE the active circle? 
                    // No, usually Active is a Number or Dot.
                    // User Table: "step < completedStep" -> Checked. "step === currentStep" -> Active.
                    // So if step == currentStep, it is Active (Blue), NOT Checked.

                    const isFuture = step > currentStep && step > effectiveCompleted;

                    // Connector coloring: If I am on Step 3, line 1-2 is colored.
                    // Line follows completion.
                    const isLineActive = step <= Math.max(currentStep, effectiveCompleted + 1);

                    return (
                        <React.Fragment key={step}>
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className={`w-12 h-0.5 mx-2 ${step <= currentStep || step <= effectiveCompleted + 1 ? 'bg-primary' : 'bg-gray-200'}`} />
                            )}

                            {/* Step Circle */}
                            <button
                                disabled={isFuture && !onStepClick}
                                // Allow clicking if it's completed or current, or if onStepClick provided
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
