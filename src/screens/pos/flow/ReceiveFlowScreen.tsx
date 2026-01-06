import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from './StepLayout';
import Step1Info from '../receive/receiveSteps/Step1Info';
import Step2Payment from '../receive/receiveSteps/Step2Payment';
import Step3Survey from '../receive/receiveSteps/Step3Survey';
import Step4Complete from '../receive/receiveSteps/Step4Complete';
import Step4Complaint from '../receive/receiveSteps/Step4Complaint';

// TYPES
export interface OrderItem {
    id: number;
    name: string;
    services: string[];
    quantity: number;
    cleanliness: string;
    damage: { hasDamage: boolean; desc?: string };
    photos: string[];
    price: number;
    status: 'COMPLETED' | 'CANCELLED';
}

export interface OrderData {
    id: string;
    finishedDate: string;
    customer: {
        name: string;
        phone: string;
        address: string;
    };
    payment: {
        status: string;
        method: string;
        total: number;
        paid: number;
        remaining: number;
    };
    items: OrderItem[];
}

// MOCK DATA DICTIONARY
const MOCK_ORDERS: Record<string, OrderData> = {
    'ORD-2310-001': {
        id: '#ORD-2310-001',
        finishedDate: '2023.10.27',
        customer: { name: 'Б. Болд', phone: '9911-2345', address: 'УБ, Сүхбаатар дүүрэг' },
        payment: { status: 'Хүлээж авсан', method: 'Бэлэн', total: 45000, paid: 30000, remaining: 15000 },
        items: [
            {
                id: 1, name: 'Гутал (Nike Air Max)', services: ['Гутал цэвэрлэгээ'], quantity: 2,
                cleanliness: 'Дунд', damage: { hasDamage: false }, photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'],
                price: 30000, status: 'COMPLETED'
            },
            {
                id: 2, name: 'Засвар', services: ['Ул солих'], quantity: 1,
                cleanliness: 'Хэвийн', damage: { hasDamage: false }, photos: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200'],
                price: 15000, status: 'COMPLETED'
            }
        ]
    },
    'ORD-2310-002': { // THE MIXED CASE
        id: '#ORD-2310-002',
        finishedDate: '2023.10.27',
        customer: { name: 'Ч. Бат', phone: '9900-1122', address: 'УБ, Баянзүрх дүүрэг' },
        payment: { status: 'Хүлээлгэн өгсөн', method: 'QPay / Банкны апп', total: 55000, paid: 55000, remaining: 0 },
        items: [
            {
                id: 1, name: 'Гутал (Nike Air Max)', services: ['Гутал цэвэрлэгээ'], quantity: 2,
                cleanliness: 'Дунд', damage: { hasDamage: false }, photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'],
                price: 30000, status: 'COMPLETED'
            },
            {
                id: 2, name: 'Гутал (Timberland)', services: ['Илгэн цэвэрлэгээ'], quantity: 1,
                cleanliness: 'Их', damage: { hasDamage: true, desc: 'Тийм (Өсгий)' }, photos: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200'],
                price: 15000, status: 'CANCELLED'
            },
            {
                id: 3, name: 'Хими цэвэрлэгээ', services: ['Хими'], quantity: 1,
                cleanliness: 'Бага', damage: { hasDamage: false }, photos: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200'],
                price: 10000, status: 'CANCELLED'
            }
        ]
    },
    'ORD-2310-022': {
        id: '#ORD-2310-022',
        finishedDate: '2023.10.25',
        customer: { name: 'А. Анар', phone: '9988-7766', address: 'УБ, Хан-Уул дүүрэг' },
        payment: { status: 'Хүлээлгэн өгсөн', method: 'Дансаар', total: 60000, paid: 60000, remaining: 0 },
        items: [
            {
                id: 1, name: 'Ариутгал (Гэр)', services: ['Гэр ариутгал'], quantity: 1,
                cleanliness: 'Бага', damage: { hasDamage: false }, photos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200'],
                price: 60000, status: 'CANCELLED'
            }
        ]
    }
};

const ReceiveFlowScreen: React.FC = () => {
    const { id, step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);

    // Select Order based on ID
    const selectedOrder = useMemo(() => {
        const cleanId = (id || '').toUpperCase();
        return MOCK_ORDERS[cleanId] || MOCK_ORDERS['ORD-2310-002']; // Default to mixed for testing if id not found
    }, [id]);

    // Validation States
    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Complete, setStep2Complete] = useState(false);

    // Stepper Status State
    const [stepStatuses, setStepStatuses] = useState<Record<number, 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'WARNING'>>({
        1: 'ACTIVE',
        2: 'PENDING',
        3: 'PENDING',
        4: 'PENDING'
    });

    // CALCULATIONS
    const calculations = useMemo(() => {
        const originalTotal = selectedOrder.items.reduce((acc, item) => acc + item.price, 0);
        const cancelledTotal = selectedOrder.items
            .filter(item => item.status === 'CANCELLED')
            .reduce((acc, item) => acc + item.price, 0);
        const revisedTotal = originalTotal - cancelledTotal;

        return {
            originalTotal,
            cancelledTotal,
            revisedTotal,
            vat: revisedTotal * 0.1,
            finalTotal: revisedTotal,
            remaining: Math.max(0, revisedTotal - selectedOrder.payment.paid),
            paidAmount: selectedOrder.payment.paid,
            discount: 0,
            pointsUsed: 0
        };
    }, [selectedOrder]);

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
        if (currentStep === 1) {
            if (step1Valid) {
                handleStepComplete(1, 'ACTIVE');
            } else {
                alert('Харилцагчийн мэдээллийг гүйцэд оруулна уу');
            }
            return;
        }

        if (currentStep === 2) {
            handleStepComplete(2, 'ACTIVE');
            return;
        }

        if (currentStep === 3) {
            handleStepComplete(3, 'ACTIVE');
            return;
        }

        if (currentStep === 4) {
            navigate('/pos/receive');
        }
    };

    const [isComplaintMode, setIsComplaintMode] = useState(false);

    const handleComplaint = () => {
        setIsComplaintMode(true);
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
            setStepStatuses(prev => ({
                ...prev,
                [prevStep]: 'ACTIVE',
                [currentStep]: 'PENDING'
            }));

            if (currentStep === 4 && isComplaintMode) {
                setIsComplaintMode(false);
            }
            navigate(`/pos/receive/${id}/step/${prevStep}`);
        } else {
            navigate('/pos/receive');
        }
    };

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
    const [noVatSelected, setNoVatSelected] = useState(false);

    return (
        <StepLayout
            steps={4}
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={currentStep === 4 ? (isComplaintMode ? 'Бүртгэх' : 'ДУУСГАХ') : nextLabel}
            nextDisabled={(currentStep === 1 && !step1Valid) || (currentStep === 2 && !step2Complete)}
            footerLeft={renderFooterLeft()}
            isLastStep={currentStep === 4}
        >
            {currentStep === 1 && <Step1Info
                onValidationChange={setStep1Valid}
                orderData={selectedOrder}
                calculations={calculations}
            />}
            {currentStep === 2 && <Step2Payment
                onPaymentComplete={(isComplete) => {
                    setStep2Complete(isComplete);
                }}
                onNoVatChange={setNoVatSelected}
                orderData={selectedOrder}
                calculations={calculations}
            />}
            {currentStep === 3 && <Step3Survey
                noVat={noVatSelected}
                orderData={selectedOrder}
                calculations={calculations}
            />}
            {currentStep === 4 && (isComplaintMode ? <Step4Complaint /> : <Step4Complete />)}
        </StepLayout>
    );
};

export default ReceiveFlowScreen;
