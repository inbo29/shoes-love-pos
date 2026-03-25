import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from './StepLayout';
import ReceiveStep1SelectAction from '../receive/receiveSteps/ReceiveStep1SelectAction';
import ReceiveStep2Resolution from '../receive/receiveSteps/ReceiveStep2Resolution';
import ReceiveStep3Payment from '../receive/receiveSteps/ReceiveStep3Payment';
import ReceiveStep4Complete from '../receive/receiveSteps/ReceiveStep4Complete';
import type { ReceiveOrder, ItemDecision } from '../receive/receiveTypes';

// ===== MOCK DATA =====
const MOCK_ORDERS: Record<string, ReceiveOrder> = {
    'ORD-2310-001': {
        id: '#ORD-2310-001',
        finishedDate: '2023.10.27',
        customer: { name: 'Б. Болд-Эрдэнэ', phone: '9911-2345', address: 'ХУД, 11-р хороо, Зайсан 45-2' },
        payment: { status: 'Хүлээж авсан', method: 'Бэлэн', total: 45000, paid: 30000, remaining: 15000 },
        items: [
            {
                id: 1, name: 'Гутал 1', services: ['Гутал цэвэрлэгээ', 'Будах'], quantity: 2,
                cleanliness: 'Дунд', damage: { hasDamage: true, desc: 'Ул хагарсан' },
                photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'],
                price: 30000, status: 'PENDING',
                details: {
                    style: 'Спорт', color: 'Хар', size: '41-42', material: 'Арьс',
                    type: 'Эрэгтэй', brand: 'Nike', condition: 'Дунд зэрэг',
                    buttonType: 'Тос', scuffStatus: 'Хар', stockCondition: 'Хэвийн',
                    additionalNotes: ['Рант хагарсан', 'Ул хэвэрсэн'],
                },
                selectedServices: ['Угаах', 'Намалт', 'Засвар', 'Будах'],
            },
            {
                id: 2, name: 'Гутал 2', services: ['Ул солих', 'Өнгө засах'], quantity: 1,
                cleanliness: 'Хэвийн', damage: { hasDamage: false },
                photos: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200'],
                price: 15000, status: 'PENDING',
                details: {
                    style: 'Албан ёсны', color: 'Хүрэн', size: '43', material: 'Илгэн арьс',
                    type: 'Эрэгтэй', brand: 'Clarks', condition: 'Сайн',
                    buttonType: 'Үгүй', scuffStatus: 'Бага', stockCondition: 'Хэвийн',
                },
                selectedServices: ['Угаах', 'Ул / Өстий'],
            }
        ]
    },
    'ORD-2310-002': {
        id: '#ORD-2310-002',
        finishedDate: '2023.10.27',
        customer: { name: 'Ч. Бат', phone: '9900-1122', address: 'УБ, Баянзүрх дүүрэг, 3-р хороо' },
        payment: { status: 'Хүлээж авсан', method: 'QPay', total: 55000, paid: 55000, remaining: 0 },
        items: [
            {
                id: 1, name: 'Гутал (Nike Air Max)', services: ['Гутал цэвэрлэгээ'], quantity: 2,
                cleanliness: 'Дунд', damage: { hasDamage: false },
                photos: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'],
                price: 30000, status: 'PENDING',
                details: {
                    style: 'Спорт', color: 'Улаан / Хар', size: '40', material: 'Даавуу + Mesh',
                    type: 'Эрэгтэй', brand: 'Nike', condition: 'Дунд зэрэг', stockCondition: 'Хэвийн',
                },
                selectedServices: ['Угаах', 'Намалт'],
            },
            {
                id: 2, name: 'Гутал (Timberland)', services: ['Илгэн цэвэрлэгээ', 'Засвар'], quantity: 1,
                cleanliness: 'Их', damage: { hasDamage: true, desc: 'Өсгий гэмтэлтэй' },
                photos: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200'],
                price: 15000, status: 'PENDING',
                details: {
                    style: 'Өвлийн', color: 'Шаргал', size: '42', material: 'Нубук арьс',
                    type: 'Эрэгтэй', brand: 'Timberland', condition: 'Их элэгдэлтэй',
                    buttonType: 'Оёмолгүй', scuffStatus: 'Их', stockCondition: 'Хэвийн',
                    additionalNotes: ['Өсгий хэв гарсан'],
                },
                selectedServices: ['Угаах', 'Засвар', 'Ул / Өстий'],
            },
            {
                id: 3, name: 'Хими цэвэрлэгээ (Цүнх)', services: ['Хими цэвэрлэгээ'], quantity: 1,
                cleanliness: 'Бага', damage: { hasDamage: false }, photos: [],
                price: 10000, status: 'PENDING',
                details: {
                    style: 'Цүнх', color: 'Хар', material: 'PU арьс',
                    brand: 'Louis Vuitton', condition: 'Сайн', stockCondition: 'Хэвийн',
                },
                selectedServices: ['Угаах', 'VIP'],
            }
        ]
    },
    'ORD-2310-022': {
        id: '#ORD-2310-022',
        finishedDate: '2023.10.25',
        customer: { name: 'А. Анар', phone: '9988-7766', address: 'УБ, Хан-Уул дүүрэг, Зайсан 45-2' },
        payment: { status: 'Хүлээж авсан', method: 'Дансаар', total: 60000, paid: 60000, remaining: 0 },
        items: [
            {
                id: 1, name: 'Ариутгал (Гэр)', services: ['Гэр ариутгал'], quantity: 1,
                cleanliness: 'Бага', damage: { hasDamage: false }, photos: [],
                price: 60000, status: 'PENDING',
                details: {
                    style: 'Гэр', material: 'Даавуу', condition: 'Сайн', stockCondition: 'Хэвийн',
                },
                selectedServices: ['Ариутгал', 'VIP'],
            }
        ]
    },
    // ===== REORDER COMPLETE SCENARIO =====
    // This order was previously processed:
    // - Item 1 (Nike): RECEIVED in first session
    // - Item 2 (Timberland): Had complaint → reordered → now came back (REORDER_DONE)
    // - Item 3 (Засвар): RECEIVED in first session
    // Now the user opens this to receive Item 2 again and complete the order
    'ORD-2310-062': {
        id: '#ORD-2310-062',
        finishedDate: '2023.10.22',
        customer: { name: 'Т. Тэмүүлэн', phone: '9900-8877', address: 'БГД, 24-р хороо, Энх тайван өргөн чөлөө 34-12' },
        payment: { status: 'Хүлээж авсан', method: 'QPay', total: 65000, paid: 50000, remaining: 15000 },
        items: [
            {
                id: 1, name: 'Гутал (Nike Air Force)', services: ['Гутал цэвэрлэгээ'], quantity: 1,
                cleanliness: 'Бага', damage: { hasDamage: false },
                photos: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200'],
                price: 20000, status: 'RECEIVED',
                details: {
                    style: 'Спорт', color: 'Цагаан', size: '42', material: 'Арьс',
                    type: 'Эрэгтэй', brand: 'Nike', condition: 'Сайн', stockCondition: 'Хэвийн',
                },
                selectedServices: ['Угаах', 'Намалт'],
            },
            {
                id: 2, name: 'Гутал (Adidas Ultra Boost)', services: ['Гутал цэвэрлэгээ', 'Будах'], quantity: 1,
                cleanliness: 'Их', damage: { hasDamage: true, desc: 'Будаг хуурсан' },
                photos: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200'],
                price: 25000, status: 'REORDER_DONE',
                details: {
                    style: 'Гүйлтийн', color: 'Хар / Саарал', size: '43', material: 'Mesh + Primeknit',
                    type: 'Эрэгтэй', brand: 'Adidas', condition: 'Дунд зэрэг',
                    scuffStatus: 'Дунд', stockCondition: 'Хэвийн',
                    additionalNotes: ['Будаг хуурсан', 'Дахин гүйцэтгэсэн'],
                },
                selectedServices: ['Угаах', 'Будах', 'VIP'],
                reorderHistory: {
                    originalComplaintId: 'GOMDOL-1698200000',
                    complaintTypes: ['Угаалга муу', 'Гэмтэл гарсан'],
                    complaintReason: 'Будаг муу тавьсан, хуурч унасан. Дахин хийлгэх хэрэгтэй.',
                    reorderDate: '2023.10.24',
                    reorderCompleteDate: '2023.10.28',
                },
            },
            {
                id: 3, name: 'Засвар (Ул солих)', services: ['Ул солих'], quantity: 1,
                cleanliness: 'Хэвийн', damage: { hasDamage: false },
                photos: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200'],
                price: 20000, status: 'RECEIVED',
                details: {
                    style: 'Спорт', color: 'Хар', size: '42', material: 'Даавуу',
                    type: 'Эрэгтэй', brand: 'Adidas', condition: 'Сайн', stockCondition: 'Хэвийн',
                },
                selectedServices: ['Засвар', 'Ул / Өстий'],
            }
        ]
    }
};

const ReceiveFlowScreen: React.FC = () => {
    const { id, step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '1', 10);

    const selectedOrder = useMemo(() => {
        const cleanId = (id || '').toUpperCase();
        return MOCK_ORDERS[cleanId] || MOCK_ORDERS['ORD-2310-002'];
    }, [id]);

    // ===== STATE =====
    const [itemDecisions, setItemDecisions] = useState<ItemDecision[]>([]);
    const [step1Valid, setStep1Valid] = useState(false);
    const [step2Valid, setStep2Valid] = useState(false);
    const [step3Complete, setStep3Complete] = useState(false);

    const [stepStatuses, setStepStatuses] = useState<Record<number, 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'WARNING'>>({
        1: 'ACTIVE', 2: 'PENDING', 3: 'PENDING', 4: 'PENDING'
    });

    // ===== DERIVED =====
    const hasComplaints = itemDecisions.some(d => d.action === 'complaint');
    const hasReorder = itemDecisions.some(d => d.action === 'complaint' && d.resolution === 'reorder');
    const hasRefund = itemDecisions.some(d => d.action === 'complaint' && d.resolution === 'refund');

    const calculations = useMemo(() => {
        const receiveTotal = itemDecisions
            .filter(d => d.action === 'receive')
            .reduce((sum, d) => {
                const item = selectedOrder.items.find(i => i.id === d.itemId);
                return sum + (item?.price || 0);
            }, 0);

        const refundTotal = itemDecisions
            .filter(d => d.action === 'complaint' && d.resolution === 'refund')
            .reduce((sum, d) => {
                const item = selectedOrder.items.find(i => i.id === d.itemId);
                return sum + (item?.price || 0);
            }, 0);

        const reorderTotal = itemDecisions
            .filter(d => d.action === 'complaint' && d.resolution === 'reorder')
            .reduce((sum, d) => {
                const item = selectedOrder.items.find(i => i.id === d.itemId);
                return sum + (item?.price || 0);
            }, 0);

        const currentPayment = Math.max(0, receiveTotal - selectedOrder.payment.paid);

        return { receiveTotal, refundTotal, reorderTotal, currentPayment };
    }, [itemDecisions, selectedOrder]);

    // ===== DETERMINE ACTUAL STEPS =====
    // Steps visible: always [1], [2 if complaints], [3 if no reorder], [4]
    const getActualSteps = useCallback(() => {
        if (!hasComplaints) return [1, 3, 4]; // Skip step 2
        if (hasReorder) return [1, 2]; // Skip payment and survey, go to gomdol
        return [1, 2, 3, 4]; // Full flow with refund
    }, [hasComplaints, hasReorder]);

    // ===== NAVIGATION =====
    const handleNext = () => {
        if (currentStep === 1) {
            if (!step1Valid) return;
            setStepStatuses(prev => ({ ...prev, 1: 'COMPLETED' }));

            if (hasComplaints) {
                setStepStatuses(prev => ({ ...prev, 2: 'ACTIVE' }));
                navigate(`/pos/receive/${id}/step/2`);
            } else {
                // Skip step 2, go to payment
                setStepStatuses(prev => ({ ...prev, 2: 'COMPLETED', 3: 'ACTIVE' }));
                navigate(`/pos/receive/${id}/step/3`);
            }
            return;
        }

        if (currentStep === 2) {
            if (!step2Valid) return;
            setStepStatuses(prev => ({ ...prev, 2: 'COMPLETED' }));

            if (hasReorder) {
                // Go to gomdol reorder
                handleGomdolReorder();
            } else {
                // Go to payment
                setStepStatuses(prev => ({ ...prev, 3: 'ACTIVE' }));
                navigate(`/pos/receive/${id}/step/3`);
            }
            return;
        }

        if (currentStep === 3) {
            setStepStatuses(prev => ({ ...prev, 3: 'COMPLETED', 4: 'ACTIVE' }));
            navigate(`/pos/receive/${id}/step/4`);
            return;
        }

        if (currentStep === 4) {
            navigate('/pos/receive');
        }
    };

    const handleBack = () => {
        if (currentStep === 3 && !hasComplaints) {
            // Go back to step 1 (skip step 2)
            setStepStatuses(prev => ({ ...prev, 1: 'ACTIVE', 3: 'PENDING' }));
            navigate(`/pos/receive/${id}/step/1`);
        } else if (currentStep > 1) {
            setStepStatuses(prev => ({
                ...prev,
                [currentStep - 1]: 'ACTIVE',
                [currentStep]: 'PENDING'
            }));
            navigate(`/pos/receive/${id}/step/${currentStep - 1}`);
        } else {
            navigate('/pos/receive');
        }
    };

    // ===== GOMDOL REORDER =====
    const handleGomdolReorder = () => {
        const reorderDecisions = itemDecisions.filter(d => d.action === 'complaint' && d.resolution === 'reorder');
        const receiveDecisions = itemDecisions.filter(d => d.action === 'receive');
        const refundDecisions = itemDecisions.filter(d => d.action === 'complaint' && d.resolution === 'refund');

        const gomdolData = {
            source: 'gomdol',
            isReOrder: true,
            originalOrderId: selectedOrder.id,
            originalReceiveId: id,
            complaintId: `GOMDOL-${Date.now()}`,
            complaintType: reorderDecisions[0]?.complaintTypes?.[0] || reorderDecisions[0]?.complaintType || 'factory_return',
            complaintDescription: reorderDecisions.map(d => d.complaintReason).join('; '),
            selectedItems: reorderDecisions.map(d => {
                const item = selectedOrder.items.find(i => i.id === d.itemId);
                return {
                    id: d.itemId,
                    name: item?.name || '',
                    services: item?.services || [],
                    quantity: item?.quantity || 1,
                    price: 0
                };
            }),
            // Include received items for the summary view
            receivedItems: receiveDecisions.map(d => {
                const item = selectedOrder.items.find(i => i.id === d.itemId);
                return {
                    id: d.itemId,
                    name: item?.name || '',
                    services: item?.services || [],
                    quantity: item?.quantity || 1,
                    price: item?.price || 0,
                    status: 'RECEIVED'
                };
            }),
            // Include refund items for the summary view
            refundedItems: refundDecisions.map(d => {
                const item = selectedOrder.items.find(i => i.id === d.itemId);
                return {
                    id: d.itemId,
                    name: item?.name || '',
                    services: item?.services || [],
                    quantity: item?.quantity || 1,
                    price: item?.price || 0,
                    status: 'REFUNDED'
                };
            }),
            selectedAction: 'retry',
            price: 0
        };
        sessionStorage.setItem('gomdolOrderData', JSON.stringify(gomdolData));
        navigate('/pos/orders/gomdol/step/5');
    };

    // ===== STEP LABELS =====
    const stepLabels = ['Хүлээн авах', 'Шийдвэр', 'Төлбөр', 'Дуусгах'];

    // ===== NEXT BUTTON CONFIG =====
    const getNextLabel = () => {
        if (currentStep === 2 && hasReorder) return 'Дахин захиалга үүсгэх';
        if (currentStep === 4) return 'Дуусгах';
        return 'Дараах';
    };

    const getNextDisabled = () => {
        if (currentStep === 1) return !step1Valid;
        if (currentStep === 2) return !step2Valid;
        if (currentStep === 3) return !step3Complete;
        return false;
    };

    // Sync step statuses on navigation
    React.useEffect(() => {
        if (currentStep > 1) {
            setStepStatuses(prev => {
                const s = { ...prev };
                for (let i = 1; i < currentStep; i++) s[i] = 'COMPLETED';
                s[currentStep] = 'ACTIVE';
                return s;
            });
        }
    }, [currentStep]);

    return (
        <StepLayout
            steps={4}
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            stepLabels={stepLabels}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={getNextLabel()}
            nextDisabled={getNextDisabled()}
            isLastStep={currentStep === 4}
        >
            {currentStep === 1 && (
                <ReceiveStep1SelectAction
                    orderData={selectedOrder}
                    itemDecisions={itemDecisions}
                    onDecisionsChange={setItemDecisions}
                    onValidationChange={setStep1Valid}
                />
            )}
            {currentStep === 2 && (
                <ReceiveStep2Resolution
                    orderData={selectedOrder}
                    itemDecisions={itemDecisions}
                    onDecisionsChange={setItemDecisions}
                    onValidationChange={setStep2Valid}
                    hasReorder={hasReorder}
                />
            )}
            {currentStep === 3 && (
                <ReceiveStep3Payment
                    orderData={selectedOrder}
                    itemDecisions={itemDecisions}
                    calculations={calculations}
                    onPaymentComplete={setStep3Complete}
                />
            )}
            {currentStep === 4 && (
                <ReceiveStep4Complete
                    orderData={selectedOrder}
                    itemDecisions={itemDecisions}
                    hasReorder={hasReorder}
                    onGomdolReorder={handleGomdolReorder}
                />
            )}
        </StepLayout>
    );
};

export default ReceiveFlowScreen;
