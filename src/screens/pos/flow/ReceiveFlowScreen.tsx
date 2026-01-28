import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from './StepLayout';
import Step1Info from '../receive/receiveSteps/Step1Info';
import Step2Survey from '../receive/receiveSteps/Step3Survey'; // Step 2: 설문조사/클레임 (기존 Step3)
import Step3Payment from '../receive/receiveSteps/Step2Payment'; // Step 3: 결제 (기존 Step2)
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
            [2]: 'COMPLETED',
            [3]: 'COMPLETED',
            [4]: 'WARNING'
        }));
        navigate(`/pos/receive/${id}/step/4`);
    };

    // Gomdol 재주문으로 이동
    const handleGomdolReorder = () => {
        const gomdolData = {
            source: 'gomdol',
            isReOrder: true,
            originalOrderId: selectedOrder.id,
            originalReceiveId: id,
            complaintId: `GOMDOL-${Date.now()}`,
            complaintType: 'factory_return',
            complaintDescription: '공장에서 서비스 안됨',
            selectedItems: selectedOrder.items.filter(item => item.status === 'COMPLETED').map(item => ({
                id: item.id,
                name: item.name,
                services: item.services,
                quantity: item.quantity,
                price: 0
            })),
            selectedAction: 'retry',
            price: 0
        };
        sessionStorage.setItem('gomdolOrderData', JSON.stringify(gomdolData));
        navigate('/pos/orders/gomdol/step/5');
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
        // Step 2 (설문조사)에서 클레임 버튼 표시
        if (currentStep === 2) {
            return (
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleComplaint}
                        className="px-6 py-3 rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-black text-xs uppercase tracking-widest hover:from-orange-500 hover:to-yellow-500 transition-all flex items-center gap-2 shadow-lg shadow-orange-200/50"
                    >
                        <span className="material-icons-round text-sm">report_problem</span>
                        Гомдол бүртгэх
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

    // Step 3 (결제)가 마지막 실질적 단계
    const nextLabel = currentStep === 3 ? 'Дуусгах' : 'Дараах';
    const [noVatSelected, setNoVatSelected] = useState(false);

    // 영수증 인쇄 가능 여부: 결제 금액이 0이거나 모두 결제됨
    const canPrintReceipt = calculations.remaining === 0;

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
            {/* Step 2: 설문조사 (기존 Step3) */}
            {currentStep === 2 && <Step2Survey
                noVat={noVatSelected}
                orderData={selectedOrder}
                calculations={calculations}
                onSurveyComplete={setStep2Complete}
            />}
            {/* Step 3: 결제 (기존 Step2) */}
            {currentStep === 3 && <Step3Payment
                onPaymentComplete={(isComplete) => {
                    // 결제 완료 처리
                }}
                onNoVatChange={setNoVatSelected}
                orderData={selectedOrder}
                calculations={calculations}
            />}
            {currentStep === 4 && (isComplaintMode ? <Step4Complaint onGomdolReorder={handleGomdolReorder} /> : <Step4Complete />)}
        </StepLayout>
    );
};

export default ReceiveFlowScreen;
