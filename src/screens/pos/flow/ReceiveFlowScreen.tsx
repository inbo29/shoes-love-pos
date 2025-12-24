import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from './StepLayout';
import Step1Info from '../receive/receiveSteps/Step1Info';
import Step2Payment from '../receive/receiveSteps/Step2Payment';
import Step3Survey from '../receive/receiveSteps/Step3Survey';
import Step4Complete from '../receive/receiveSteps/Step4Complete';

const ReceiveFlowScreen: React.FC = () => {
    const { id, step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);

    // Validation States
    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Complete, setStep2Complete] = useState(false);

    const handleNext = () => {
        if (currentStep === 1 && !step1Valid) return;
        // Step 2 can proceed if user just wants to check history, OR if they made a payment. 
        // User request doesn't explicitly block next on Step 2 unless logic requires 0 balance?
        // Step 2 Action "Confirm Payment" adds payment. 
        // "Right Primary Button" in Prompt says "Payment Confirm" if in step 2? 
        // Actually, Prompt says:
        // ACTION BUTTONS:
        // Left: Receipt Preview
        // Right: Payment Confirm (Active Condition: Amount > 0, Method Selected)

        // BUT, what if there is NO balance to pay? Then user should move to Step 3.
        // The Prompt says: "Loop Step 2 -> Step 2 if partial".
        // So Step 2 acts as a tool.
        // To move to Step 3, maybe we need a separate "Next Step" button, or "Finish Payment" button.
        // The prompt says "Step 1 -> 2 -> 3 -> 4".
        // In Step 2, if Balance > 0, we can Pay.
        // If Balance == 0, we should be able to go to Step 3.

        if (currentStep < 4) {
            navigate(`/pos/receive/${id}/step/${currentStep + 1}`);
        } else {
            navigate('/pos/receive');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`/pos/receive/${id}/step/${currentStep - 1}`);
        } else {
            navigate('/pos/receive');
        }
    };

    // We can show a custom footer left button for Step 2 (Receipt Preview)
    const renderFooterLeft = () => {
        if (currentStep === 2) {
            return (
                <button className="px-6 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 flex items-center gap-2">
                    <span className="material-icons-round text-lg">receipt</span>
                    Баримт харах
                </button>
            )
        }
        return null;
    }

    // Mock Status for logic demonstration
    // In real app, this comes from API: 'CREATED' | 'ACCEPTED' | 'PAID_PARTIAL' | 'PAID_FULL' | 'DELIVERED' | 'COMPLETED'
    const [orderStatus, setOrderStatus] = useState('PAID_PARTIAL'); // Default example

    const getCompletedStep = (status: string) => {
        switch (status) {
            case 'CREATED': return 0;
            case 'ACCEPTED': return 1;
            case 'PAID_PARTIAL': return 1; // Step 2 is in progress? Or if Partial is done, Step 2 is... active?
            // User rule: STEP 2 (Payment) -> status >= PAID_PARTIAL.
            // So if PAID_PARTIAL, Step 2 is technically 'started' or 'done'?
            // User said: STEP 2 Completion Condition status >= PAID_PARTIAL ??
            // Wait, logic table: "STEP 2 ... condition status >= PAID_PARTIAL"
            // Does that mean Step 2 IS DONE if partial?
            // Or Step 2 IS ACTIVE?
            // "Completed Step" usually means previous steps.
            // If status is PAID_PARTIAL, Step 1 is done. Step 2 is Active.
            // So completedStep = 1.
            // If PAID_FULL, Step 2 is done. completedStep = 2.
            case 'PAID_FULL': return 2;
            case 'DELIVERED': return 3; // Step 3 Survey done? Or Handover done? 
            // Step 4 is Handover.
            // "STEP 4 (Handover) -> status >= DELIVERED".
            // If Delivered, Step 4 is Done? Or Active?
            // Usually Delivered means Handover is finished.
            // So completedStep = 4.
            case 'COMPLETED': return 4;
            default: return 0;
        }
    };

    const maxCompletedStep = getCompletedStep(orderStatus);

    // Current Step Logic is mostly Navigation-based, but we constrain it?
    // User wants Stepper to reflect 'history'.

    return (
        <StepLayout
            steps={4}
            currentStep={currentStep}
            maxCompletedStep={maxCompletedStep}
            onBack={handleBack}
            onNext={handleNext}
            footerLeft={renderFooterLeft()}
            // For Step 2, the "Next" button in the Footer might be confusing if there is a "Pay" button content-side. 
            // The prompt says "Right Primary: Confirm Payment".
            // It seems "Confirm Payment" IS the main action of step 2. 
            // But after payment, we might stay in Step 2 (append only).
            // So how do we go to Step 3?
            // "Cycle: Step 1 -> 2 -> 3 -> 4".
            // Maybe if Balance is 0, the button becomes "Next Step"?
            // Or maybe there is a "Skip/Next" if no payment needed?
            // For now, I will keep standard Next button functionality, but maybe disable it if balance > 0 ??
            // User did NOT specify Step 3 transition logic explicitly other than "Satisfy Survey".
            nextLabel={currentStep === 4 ? 'ДУУСГАХ' : 'ДАРААГИЙН АЛХАМ'}
            isLastStep={currentStep === 4}
        >
            {currentStep === 1 && <Step1Info onValidationChange={setStep1Valid} />}
            {currentStep === 2 && <Step2Payment onPaymentComplete={setStep2Complete} />}
            {currentStep === 3 && <Step3Survey />}
            {currentStep === 4 && <Step4Complete />}
        </StepLayout>
    );
};

export default ReceiveFlowScreen;
