import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from '../flow/StepLayout';
import Step1Info from './steps/Step1Info';
import Step2ServiceSelection from './steps/Step2ServiceSelection';
import Step3ServiceDetails from './steps/Step3ServiceDetails';
import Step4ItemCondition from './steps/Step4ItemCondition';
import Step5OrderSummary from './steps/Step5OrderSummary';
import Step6Payment from './steps/Step6Payment';
import Popup from '../../../shared/components/Popup/Popup';

const OrderFlowScreen: React.FC = () => {
    const { step, id } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);
    const totalSteps = 6;
    const [showPopup, setShowPopup] = useState(false);
    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Valid, setStep2Valid] = useState(false);
    const [step3Valid, setStep3Valid] = useState(false);
    const [step4Valid, setStep4Valid] = useState(false);
    const [step6Valid, setStep6Valid] = useState(false);

    // Decide if New or Edit mode based on ID
    const isEditMode = !!id;
    const baseUrl = isEditMode ? `/pos/orders/${id}/edit` : '/pos/orders/new';

    const handleNext = () => {
        if (currentStep < totalSteps) {
            navigate(`${baseUrl}/step/${currentStep + 1}`);
        } else {
            // Final submission logic handled in Step 6
            navigate('/pos/orders');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`${baseUrl}/step/${currentStep - 1}`);
        } else {
            // Go back to list if at step 1
            navigate('/pos/orders');
        }
    };

    const handleTempSave = () => {
        setShowPopup(true);
    };

    const handleStepClick = (clickedStep: number) => {
        // Only allow navigating to previous steps (or logic can be added for future steps if valid)
        // For now, allow any click for flexibility as requested in rules (completed steps)
        if (clickedStep <= totalSteps) { // allow all steps in dev
            navigate(`${baseUrl}/step/${clickedStep}`);
        }
    };

    // Render Step Content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <Step1Info onValidationChange={setStep1Valid} />;
            case 2: return <Step2ServiceSelection onValidationChange={setStep2Valid} />;
            case 3: return <Step3ServiceDetails onValidationChange={setStep3Valid} />;
            case 4: return <Step4ItemCondition onValidationChange={setStep4Valid} />;
            case 5: return <Step5OrderSummary />;
            case 6: return <Step6Payment onValidationChange={setStep6Valid} />;
            default: return <Step1Info />;
        }
    };

    return (
        <>
            <StepLayout
                steps={totalSteps}
                currentStep={currentStep}
                onBack={handleBack}
                onNext={handleNext}
                onTempSave={handleTempSave}
                onStepClick={handleStepClick}
                isLastStep={currentStep === totalSteps}
                nextDisabled={
                    (currentStep === 1 && !step1Valid) ||
                    (currentStep === 2 && !step2Valid) ||
                    (currentStep === 3 && !step3Valid) ||
                    (currentStep === 4 && !step4Valid) ||
                    (currentStep === 6 && !step6Valid)
                }
            >
                {renderStepContent()}
            </StepLayout>

            <Popup
                isOpen={showPopup}
                type="success"
                title="Амжилттай"
                message="Түр хадгаллаа"
                onClose={() => setShowPopup(false)}
            />
        </>
    );
};

export default OrderFlowScreen;
