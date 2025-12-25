import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from './StepLayout';
import Step1Info from '../receive/receiveSteps/Step1Info';
import Step2Payment from '../receive/receiveSteps/Step2Payment';
import Step3Survey from '../receive/receiveSteps/Step3Survey';
import Step4Complete from '../receive/receiveSteps/Step4Complete';
import Step4Complaint from '../receive/receiveSteps/Step4Complaint';

const ReceiveFlowScreen: React.FC = () => {
    const { id, step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);

    // Validation States
    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Complete, setStep2Complete] = useState(false);

    // Stepper Status State (User Logic: stepStatus drives the UI)
    const [stepStatuses, setStepStatuses] = useState<Record<number, 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'WARNING'>>({
        1: 'ACTIVE',
        2: 'PENDING',
        3: 'PENDING',
        4: 'PENDING'
    });

    // Helper to update status and navigate
    // This is the "Trigger" the user asked for.
    const handleStepComplete = (step: number, nextStepStatus: 'ACTIVE' | 'WARNING' = 'ACTIVE') => {
        setStepStatuses(prev => ({
            ...prev,
            [step]: 'COMPLETED',
            [step + 1]: nextStepStatus
        }));

        if (step < 4) {
            navigate(`/pos/receive/${id}/step/${step + 1}`);
        } else {
            navigate('/pos/receive');
        }
    };

    const handleNext = () => {
        // Step 1 Validation
        if (currentStep === 1) {
            if (step1Valid) {
                handleStepComplete(1, 'ACTIVE');
            } else {
                // Trigger validation shake or alert? 
                // For now, simple return, but ideally should show error.
                // Step1Info needs to expose validation state or handle its own next.
                // Current logic relies on StepLayout footer button.
                alert('Харилцагчийн мэдээллийг гүйцэд оруулна уу');
            }
            return;
        }

        // Step 2 Logic (If balance 0, can skip/complete?)
        // If "Payment Confirm" was done, Step2Payment should have called something? 
        // But here we are in the Footer Next button.
        // If user clicks "Next" on Step 2, we assume they are done verifying.
        if (currentStep === 2) {
            handleStepComplete(2, 'ACTIVE');
            return;
        }

        // Step 3 (Skip/Finish)
        if (currentStep === 3) {
            handleStepComplete(3, 'ACTIVE'); // Go to Step 4 Complete (Default)
            return;
        }

        // Step 4
        if (currentStep === 4) {
            navigate('/pos/receive');
        }
    };

    // Complaint Logic
    const [isComplaintMode, setIsComplaintMode] = useState(false);

    const handleComplaint = () => {
        setIsComplaintMode(true);
        // Mark Step 3 as Completed, Step 4 as WARNING (Active but Warning color)
        setStepStatuses(prev => ({
            ...prev,
            [3]: 'COMPLETED',
            [4]: 'WARNING'
        }));
        navigate(`/pos/receive/${id}/step/4`);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1;

            // Should we mark current as PENDING/ACTIVE? 
            // User says: "ACTIVE is only 1".
            // So if we go back, previous becomes ACTIVE. Current becomes PENDING? 
            // Or remains COMPLETED if it was completed? 
            // If we go back to edit 2, we are making 2 ACTIVE. 
            // 3 Should probably become PENDING to force re-verification?
            // Or keep 3 as PENDING.

            setStepStatuses(prev => ({
                ...prev,
                [prevStep]: 'ACTIVE',
                [currentStep]: 'PENDING' // Reset current to Pending when going back?
            }));

            if (currentStep === 4 && isComplaintMode) {
                setIsComplaintMode(false);
            }
            navigate(`/pos/receive/${id}/step/${prevStep}`);
        } else {
            navigate('/pos/receive');
        }
    };

    // We can show a custom footer left button for Step 2 (Receipt Preview)
    const renderFooterLeft = () => {
        if (currentStep === 3) {
            return (
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleComplaint}
                        className="px-6 py-3 rounded-2xl border-2 border-yellow-300 bg-yellow-300 text-yellow-900 font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:border-yellow-400 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-icons-round text-sm">report_problem</span>
                        Гомдол
                    </button>
                </div>
            );
        }
        return null;
    };

    // Initialize state on mount/param change if needed? 
    // Ideally state should sync with URL if deep linking. 
    // For now we trust the default state + user interaction.
    // To support refresh: useEffect to set stepStatuses based on 'step' param?
    // User asked to decouple, but we need initial consistency.
    // If I load /step/3 directly, I should probably show 1,2 as COMPLETED?
    React.useEffect(() => {
        if (currentStep > 1) {
            setStepStatuses(prev => {
                const newStatus = { ...prev };
                for (let i = 1; i < currentStep; i++) {
                    newStatus[i] = 'COMPLETED';
                }
                newStatus[currentStep] = isComplaintMode ? 'WARNING' : 'ACTIVE';
                return newStatus;
            });
        }
    }, [currentStep, isComplaintMode]);


    const nextLabel = currentStep === 3 ? 'Дуусгах' : 'Дараах';

    // State to track if No VAT was selected in Step 2
    const [noVatSelected, setNoVatSelected] = useState(false);

    return (
        <StepLayout
            steps={4}
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={currentStep === 4 ? (isComplaintMode ? 'Бүртгэх' : 'ДУУСГАХ') : nextLabel}
            nextDisabled={currentStep === 1 && !step1Valid}
            footerLeft={renderFooterLeft()}
            isLastStep={currentStep === 4}
            hideNext={currentStep === 2}
        >
            {currentStep === 1 && <Step1Info onValidationChange={setStep1Valid} />}
            {currentStep === 2 && <Step2Payment
                onPaymentComplete={(isComplete) => {
                    if (isComplete) handleStepComplete(2, 'ACTIVE');
                    setStep2Complete(isComplete);
                }}
                onNoVatChange={setNoVatSelected}
            />}
            {currentStep === 3 && <Step3Survey noVat={noVatSelected} />}
            {currentStep === 4 && (isComplaintMode ? <Step4Complaint /> : <Step4Complete />)}
        </StepLayout>
    );
};

export default ReceiveFlowScreen;
