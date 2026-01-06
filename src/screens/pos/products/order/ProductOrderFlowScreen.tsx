import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from '../../flow/StepLayout';
import OrderStep1ProductSelect from './steps/OrderStep1ProductSelect';
import OrderStep2Confirmation from './steps/OrderStep2Confirmation';
import OrderStep3Success from './steps/OrderStep3Success';

export interface SelectedOrderProduct {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    image?: string;
}

const ProductOrderFlowScreen: React.FC = () => {
    const { step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);
    const totalSteps = 3;

    const [selectedProducts, setSelectedProducts] = useState<SelectedOrderProduct[]>(() => {
        if (currentStep > 1) {
            const saved = sessionStorage.getItem('pos_product_order_data');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [step1Valid, setStep1Valid] = useState(selectedProducts.length > 0);
    const [step2Valid, setStep2Valid] = useState(false);

    // Persist session logic
    React.useEffect(() => {
        if (currentStep === 1) {
            sessionStorage.removeItem('pos_product_order_data');
        } else {
            sessionStorage.setItem('pos_product_order_data', JSON.stringify(selectedProducts));
        }
    }, [currentStep, selectedProducts]);

    React.useEffect(() => {
        setStep1Valid(selectedProducts.length > 0);
    }, [selectedProducts]);

    const baseUrl = '/pos/product-order/new';

    const handleNext = () => {
        if (currentStep < totalSteps) {
            navigate(`${baseUrl}/step/${currentStep + 1}`);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            navigate(`${baseUrl}/step/${currentStep - 1}`);
        } else {
            navigate('/pos/product-order');
        }
    };

    const handleStepClick = (clickedStep: number) => {
        if (clickedStep < currentStep) {
            navigate(`${baseUrl}/step/${clickedStep}`);
        }
    };

    const handleProductsChange = (products: SelectedOrderProduct[]) => {
        setSelectedProducts(products);
        setStep1Valid(products.length > 0);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <OrderStep1ProductSelect
                        selectedProducts={selectedProducts}
                        onProductsChange={handleProductsChange}
                    />
                );
            case 2:
                return (
                    <OrderStep2Confirmation
                        selectedProducts={selectedProducts}
                        onValidationChange={setStep2Valid}
                    />
                );
            case 3:
                return <OrderStep3Success />;
            default:
                return null;
        }
    };

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
            isLastStep={currentStep === 3}
            nextDisabled={
                (currentStep === 1 && !step1Valid) ||
                (currentStep === 2 && !step2Valid)
            }
        >
            {renderStepContent()}
        </StepLayout>
    );
};

export default ProductOrderFlowScreen;
