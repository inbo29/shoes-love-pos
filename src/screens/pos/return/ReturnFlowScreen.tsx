import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from '../flow/StepLayout';
import Step1SelectOrder from './steps/ReturnStep1SelectOrder';
import Step2Detail from './steps/ReturnStep2Detail';
import Step3Confirm from './steps/ReturnStep3Confirm';
import Popup from '../../../shared/components/Popup/Popup';

const ReturnFlowScreen: React.FC = () => {
    const { step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);
    const totalSteps = 3;

    // State
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
    const [reason, setReason] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Handlers
    const handleSelectOrder = (order: any) => {
        setSelectedOrder(order);
        setSelectedItemIds(new Set());
        setSelectedServiceIds(new Set());
    };

    const toggleItem = (itemId: string) => {
        const newSet = new Set(selectedItemIds);
        if (newSet.has(itemId)) {
            newSet.delete(itemId);
        } else {
            newSet.add(itemId);
            const newServiceSet = new Set(selectedServiceIds);
            const item = selectedOrder.items.find((i: any) => i.id === itemId);
            item.services?.forEach((s: any) => newServiceSet.delete(s.id));
            setSelectedServiceIds(newServiceSet);
        }
        setSelectedItemIds(newSet);
    };

    const toggleService = (serviceId: string) => {
        const newSet = new Set(selectedServiceIds);
        if (newSet.has(serviceId)) {
            newSet.delete(serviceId);
        } else {
            newSet.add(serviceId);
        }
        setSelectedServiceIds(newSet);
    };

    const toggleAll = (checked: boolean) => {
        if (checked && selectedOrder) {
            setSelectedItemIds(new Set(selectedOrder.items.map((i: any) => i.id)));
            setSelectedServiceIds(new Set());
        } else {
            setSelectedItemIds(new Set());
            setSelectedServiceIds(new Set());
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            navigate(`/pos/returns/new/step/${currentStep + 1}`);
        } else {
            // Final Confirm Step 3
            setShowSuccessPopup(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`/pos/returns/new/step/${currentStep - 1}`);
        } else {
            navigate('/pos/returns');
        }
    };

    const handleStepClick = (clickedStep: number) => {
        // Navigation logic for stepper clicks
        if (clickedStep === 1) navigate(`/pos/returns/new/step/1`);
        if (clickedStep === 2 && selectedOrder) navigate(`/pos/returns/new/step/2`);
        if (clickedStep === 3 && selectedOrder && (selectedItemIds.size > 0 || selectedServiceIds.size > 0)) navigate(`/pos/returns/new/step/3`);
    };

    const nextDisabled = useMemo(() => {
        if (currentStep === 1) return !selectedOrder;
        if (currentStep === 2) return selectedItemIds.size === 0 && selectedServiceIds.size === 0;
        if (currentStep === 3) return !reason.trim();
        return false;
    }, [currentStep, selectedOrder, selectedItemIds, selectedServiceIds, reason]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1SelectOrder
                        selectedOrderId={selectedOrder?.id}
                        onSelectOrder={handleSelectOrder}
                    />
                );
            case 2:
                return (
                    <Step2Detail
                        order={selectedOrder}
                        selectedItemIds={selectedItemIds}
                        selectedServiceIds={selectedServiceIds}
                        onToggleItem={toggleItem}
                        onToggleService={toggleService}
                        onToggleAll={toggleAll}
                    />
                );
            case 3:
                return (
                    <Step3Confirm
                        order={selectedOrder}
                        selectedItemIds={selectedItemIds}
                        selectedServiceIds={selectedServiceIds}
                        reason={reason}
                        onReasonChange={setReason}
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
                nextLabel={currentStep === 3 ? 'БУЦААЛТ БАТАЛГААЖУУЛАХ' : 'ДАРААГИЙН АЛХАМ'}
            >
                {renderStepContent()}
            </StepLayout>

            <Popup
                isOpen={showSuccessPopup}
                type="success"
                title="БУЦААЛТ АМЖИЛТТАЙ"
                message="Захиалга амжилттай цуцлагдлаа."
                onClose={handlePopupClose}
                confirmLabel="Жагсаалт руу буцах"
                confirmColor="green"
            />
        </>
    );
};

export default ReturnFlowScreen;
