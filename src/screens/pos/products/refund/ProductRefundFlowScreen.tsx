import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StepLayout from '../../flow/StepLayout';
import { findReceiptByNo } from '../../../../services/mockReceiptData';
import type { BankTransferInfo, RefundItem, RefundMethod } from './refundTypes';
import { calcRefundTotal } from './refundTypes';
import RefundStep1ItemSelect from './steps/RefundStep1ItemSelect';
import RefundStep2Method from './steps/RefundStep2Method';
import RefundStep3Complete from './steps/RefundStep3Complete';

const ProductRefundFlowScreen: React.FC = () => {
    const { receiptNo, step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);
    const totalSteps = 3;

    const receipt = useMemo(() => (receiptNo ? findReceiptByNo(receiptNo) : undefined), [receiptNo]);

    const [refundItems, setRefundItems] = useState<RefundItem[]>([]);
    const [refundMethod, setRefundMethod] = useState<RefundMethod>('cash');
    const [bankInfo, setBankInfo] = useState<BankTransferInfo>({ accountNumber: '', phone: '', memo: '' });
    const [refundReference] = useState<string>(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const rnd = Math.floor(Math.random() * 900 + 100);
        return `RFD-${yyyy}${mm}${dd}-${rnd}`;
    });

    useEffect(() => {
        if (!receipt) {
            navigate('/pos/product-refund', { replace: true });
            return;
        }
        if (refundItems.length === 0) {
            setRefundItems(
                receipt.items.map(it => ({
                    productId: it.productId,
                    name: it.name,
                    price: it.price,
                    salePrice: it.salePrice,
                    originalQuantity: it.quantity,
                    refundQuantity: it.quantity,
                    selected: false,
                }))
            );
        }
    }, [receipt, navigate, refundItems.length]);

    if (!receipt) return null;

    const totalRefundAmount = calcRefundTotal(refundItems);

    const step1Valid = refundItems.some(i => i.selected && i.refundQuantity > 0);
    const step2Valid =
        refundMethod === 'cash' ||
        (refundMethod === 'bank_transfer' &&
            bankInfo.accountNumber.trim().length > 0 &&
            bankInfo.phone.trim().length > 0);

    const baseUrl = `/pos/product-refund/${receipt.receiptNo}`;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            navigate(`${baseUrl}/step/${currentStep + 1}`);
        } else {
            navigate('/pos/product-refund');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`${baseUrl}/step/${currentStep - 1}`);
        } else {
            navigate('/pos/product-refund');
        }
    };

    const handleStepClick = (clickedStep: number) => {
        if (clickedStep === currentStep) return;
        if (clickedStep < currentStep) {
            navigate(`${baseUrl}/step/${clickedStep}`);
            return;
        }
        if (clickedStep === 2 && step1Valid) navigate(`${baseUrl}/step/2`);
        if (clickedStep === 3 && step1Valid && step2Valid) navigate(`${baseUrl}/step/3`);
    };

    const stepStatuses: Record<number, 'COMPLETED' | 'ACTIVE' | 'PENDING'> = {
        1: currentStep > 1 ? 'COMPLETED' : currentStep === 1 ? 'ACTIVE' : 'PENDING',
        2: currentStep > 2 ? 'COMPLETED' : currentStep === 2 ? 'ACTIVE' : 'PENDING',
        3: currentStep > 3 ? 'COMPLETED' : currentStep === 3 ? 'ACTIVE' : 'PENDING',
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <RefundStep1ItemSelect
                        receipt={receipt}
                        refundItems={refundItems}
                        onChange={setRefundItems}
                        totalRefundAmount={totalRefundAmount}
                    />
                );
            case 2:
                return (
                    <RefundStep2Method
                        refundItems={refundItems}
                        totalRefundAmount={totalRefundAmount}
                        method={refundMethod}
                        onMethodChange={setRefundMethod}
                        bankInfo={bankInfo}
                        onBankInfoChange={setBankInfo}
                    />
                );
            case 3:
                return (
                    <RefundStep3Complete
                        receipt={receipt}
                        refundItems={refundItems}
                        totalRefundAmount={totalRefundAmount}
                        method={refundMethod}
                        bankInfo={bankInfo}
                        refundReference={refundReference}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <StepLayout
            steps={totalSteps}
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            onBack={handleBack}
            onNext={handleNext}
            onStepClick={handleStepClick}
            isLastStep={currentStep === totalSteps}
            nextDisabled={
                (currentStep === 1 && !step1Valid) ||
                (currentStep === 2 && !step2Valid)
            }
        >
            {renderStepContent()}
        </StepLayout>
    );
};

export default ProductRefundFlowScreen;
