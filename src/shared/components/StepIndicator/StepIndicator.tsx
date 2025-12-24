import React from 'react';

// User defined status types
export type StepStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'WARNING';
// Added WARNING for Complaint step as requested in previous turn, integrated into this model.

interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
    maxCompletedStep?: number; // Legacy support
    stepStatuses?: Record<number, StepStatus>; // New granular support
    onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    totalSteps,
    currentStep,
    maxCompletedStep = 0,
    stepStatuses,
    onStepClick
}) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center py-6 bg-white shrink-0 shadow-sm z-10 w-full">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    let status: StepStatus = 'PENDING';

                    if (stepStatuses) {
                        // Use explicit status if provided
                        status = stepStatuses[step] || 'PENDING';
                    } else {
                        // Legacy Fallback
                        const effectiveCompleted = maxCompletedStep > 0 ? maxCompletedStep : (currentStep - 1);
                        if (step === currentStep) status = 'ACTIVE';
                        else if (step <= effectiveCompleted) status = 'COMPLETED';
                        else status = 'PENDING';
                    }

                    // Visual States based on Status
                    const isActive = status === 'ACTIVE';
                    const isCompleted = status === 'COMPLETED';
                    const isWarning = status === 'WARNING'; // For Complaint Step
                    const isPending = status === 'PENDING';

                    // Connector coloring: Colored if the current step is completed OR if the next step is active/completed
                    // Basically, if step 1 is COMPLETED, line 1-2 is colored? 
                    // Usually line connects completed steps.
                    // If stepStatuses is used: Join 1-2 if 1 is COMPLETED or 2 is ACTIVE/COMPLETED?
                    // Let's stick to "Current Step" index for line progress if explicit logic is complex, 
                    // OR use the status of the 'next' step to color the line leading to it.
                    // If step+1 is ACTIVE or COMPLETED or WARNING, then line step->step+1 is colored.

                    const nextStepStatus = stepStatuses ? stepStatuses[step + 1] : null;
                    const isNextActiveOrDone = nextStepStatus === 'ACTIVE' || nextStepStatus === 'COMPLETED' || nextStepStatus === 'WARNING';

                    // Fallback line logic
                    const effectiveCompleted = maxCompletedStep > 0 ? maxCompletedStep : (currentStep - 1);
                    const isLineActiveLegacy = step <= Math.max(currentStep, effectiveCompleted + 1);

                    const showLine = stepStatuses ? isNextActiveOrDone : (index < steps.length - 1 && step <= currentStep);
                    // Note: Line logic is tricky. Let's simplify: 
                    // If we are past this step index, fill line.
                    // If we use stepStatuses, we can check if I am COMPLETED.
                    // If I am COMPLETED, line to next is filled.
                    const isLineColored = stepStatuses ? (status === 'COMPLETED' || status === 'WARNING') : (step < currentStep || step <= effectiveCompleted);

                    return (
                        <React.Fragment key={step}>
                            {/* Connector Line */}
                            {index > 0 && (
                                <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                                    // Make line colored if PREVIOUS step was colored-ready
                                    // We are at step 'step'. Line is before me.
                                    // Check 'step-1' status.
                                    (stepStatuses ? (stepStatuses[step - 1] === 'COMPLETED' || stepStatuses[step - 1] === 'WARNING') : (step <= currentStep || step <= effectiveCompleted + 1))
                                        ? 'bg-primary'
                                        : 'bg-gray-200'
                                    }`} />
                            )}

                            {/* Step Circle */}
                            <button
                                disabled={isPending && !onStepClick}
                                onClick={() => onStepClick && onStepClick(step)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm select-none ${isActive
                                        ? 'bg-primary border-primary text-white scale-110 shadow-lg ring-4 ring-primary/20'
                                        : isCompleted
                                            ? 'bg-white border-primary text-primary hover:bg-primary/5 cursor-pointer'
                                            : isWarning
                                                ? 'bg-yellow-400 border-yellow-400 text-yellow-900 scale-110 shadow-lg ring-4 ring-yellow-400/20' // Warning Style
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
