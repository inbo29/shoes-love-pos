import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from '../flow/StepLayout';
import IssueStep1Select from './issue/ReturnIssueStep1Select';
import IssueStep2Confirm from './issue/ReturnIssueStep2Confirm';
import Popup from '../../../shared/components/Popup/Popup';

const ReturnIssueFlowScreen: React.FC = () => {
    const { step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);
    const totalSteps = 2;

    // State
    const [selectedReturn, setSelectedReturn] = useState<any>(null);
    const [confirmations, setConfirmations] = useState({
        receivedGoods: false,
        acknowledgedReason: false
    });
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Handlers
    const handleSelectReturn = (returnOrder: any) => {
        setSelectedReturn(returnOrder);
    };

    const handleToggleConfirmation = (key: 'receivedGoods' | 'acknowledgedReason') => {
        setConfirmations(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            navigate(`/pos/returns/issue/step/${currentStep + 1}`);
        } else {
            // Final confirmation - issue return to customer
            setShowSuccessPopup(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`/pos/returns/issue/step/${currentStep - 1}`);
        } else {
            navigate('/pos/returns');
        }
    };

    const handleStepClick = (clickedStep: number) => {
        if (clickedStep === 1) navigate(`/pos/returns/issue/step/1`);
        if (clickedStep === 2 && selectedReturn) navigate(`/pos/returns/issue/step/2`);
    };

    const nextDisabled = useMemo(() => {
        if (currentStep === 1) return !selectedReturn;
        if (currentStep === 2) return !confirmations.receivedGoods || !confirmations.acknowledgedReason;
        return false;
    }, [currentStep, selectedReturn, confirmations]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <IssueStep1Select
                        selectedReturnId={selectedReturn?.id}
                        onSelectReturn={handleSelectReturn}
                    />
                );
            case 2:
                return (
                    <IssueStep2Confirm
                        returnOrder={selectedReturn}
                        confirmations={confirmations}
                        onToggleConfirmation={handleToggleConfirmation}
                    />
                );
            default:
                return null;
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        navigate('/pos/returns');
    };

    return (
        <>
            <StepLayout
                steps={totalSteps}
                currentStep={currentStep}
                onBack={handleBack}
                onNext={handleNext}
                nextDisabled={nextDisabled}
                onStepClick={handleStepClick}
                isLastStep={currentStep === totalSteps}
                nextLabel={currentStep === 2 ? 'ХЭРЭГЛЭГЧИД ОЛГОХ' : 'ДАРААГИЙН АЛХАМ'}
            >
                {renderStepContent()}
            </StepLayout>

            <Popup
                isOpen={showSuccessPopup}
                type="success"
                title="БУЦААЛТ АМЖИЛТТАЙ"
                message={`Захиалга амжилттай хүлээлгэн өгөгдлөө.\n\nЗахиалгын №: ${selectedReturn?.id}\nОлгосон огноо: ${new Date().toLocaleString('mn-MN')}`}
                onClose={handlePopupClose}
                confirmLabel="Жагсаалт руу буцах"
                confirmColor="green"
            />
        </>
    );
};

export default ReturnIssueFlowScreen;
