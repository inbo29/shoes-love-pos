import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from '../../flow/StepLayout';
import SellStep1ProductSelect from './steps/SellStep1ProductSelect';
import SellStep2Summary from './steps/SellStep2Summary';
import SellStep3Payment from './steps/SellStep3Payment';

export interface SelectedProduct {
    productId: string;
    name: string;
    price: number;
    salePrice?: number;
    quantity: number;
}

const ProductSellFlowScreen: React.FC = () => {
    const { step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);
    const totalSteps = 3;

    // State management
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [pointsUsed, setPointsUsed] = useState(0);
    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Valid, setStep2Valid] = useState(true); // Always valid
    const [step3Valid, setStep3Valid] = useState(false);

    const baseUrl = '/pos/sell';

    const handleNext = () => {
        if (currentStep < totalSteps) {
            navigate(`${baseUrl}/step/${currentStep + 1}`);
        } else {
            // Final submission - navigate to list (placeholder for now)
            navigate('/pos/sell');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`${baseUrl}/step/${currentStep - 1}`);
        } else {
            // Go back to products menu or list
            navigate('/pos/sell');
        }
    };

    const handleStepClick = (clickedStep: number) => {
        if (clickedStep <= totalSteps) {
            navigate(`${baseUrl}/step/${clickedStep}`);
        }
    };

    // Update selected products from Step 1
    const handleProductsChange = (products: SelectedProduct[]) => {
        setSelectedProducts(products);
        setStep1Valid(products.length > 0);

        // Calculate total
        const total = products.reduce((sum, p) => sum + ((p.salePrice ?? p.price) * p.quantity), 0);
        setTotalAmount(total);
    };

    // Update from Step 2
    const handleSummaryChange = (products: SelectedProduct[], points: number, disc: number) => {
        setSelectedProducts(products);
        setPointsUsed(points);
        setDiscount(disc);

        const total = products.reduce((sum, p) => sum + ((p.salePrice ?? p.price) * p.quantity), 0);
        setTotalAmount(total);
    };

    // Render Step Content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <SellStep1ProductSelect
                        selectedProducts={selectedProducts}
                        onProductsChange={handleProductsChange}
                    />
                );
            case 2:
                return (
                    <SellStep2Summary
                        selectedProducts={selectedProducts}
                        totalAmount={totalAmount}
                        discount={discount}
                        pointsUsed={pointsUsed}
                        onSummaryChange={handleSummaryChange}
                    />
                );
            case 3:
                return (
                    <SellStep3Payment
                        selectedProducts={selectedProducts}
                        totalAmount={totalAmount}
                        discount={discount}
                        pointsUsed={pointsUsed}
                        onValidationChange={setStep3Valid}
                    />
                );
            default:
                return (
                    <SellStep1ProductSelect
                        selectedProducts={selectedProducts}
                        onProductsChange={handleProductsChange}
                    />
                );
        }
    };

    // Calculate step statuses
    const stepStatuses: Record<number, 'COMPLETED' | 'ACTIVE' | 'PENDING'> = {
        1: currentStep > 1 ? 'COMPLETED' : currentStep === 1 ? 'ACTIVE' : 'PENDING',
        2: currentStep > 2 ? 'COMPLETED' : currentStep === 2 ? 'ACTIVE' : 'PENDING',
        3: currentStep > 3 ? 'COMPLETED' : currentStep === 3 ? 'ACTIVE' : 'PENDING',
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
                (currentStep === 3 && !step3Valid)
            }
        >
            {renderStepContent()}
        </StepLayout>
    );
};

export default ProductSellFlowScreen;
