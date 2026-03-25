import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StepLayout from '../flow/StepLayout';
import Step5GomdolSummary from './steps/Step5GomdolSummary';
import Step6Payment from './steps/Step6Payment';
import Popup from '../../../shared/components/Popup/Popup';
import type { GomdolOrderData } from '../receive/receiveTypes';

/**
 * GomdolOrderFlowScreen
 * 
 * Gomdol(불만) → 재주문 생성 시 사용하는 특수 주문 흐름
 * - Step 1~4 스킵
 * - Step 5부터 시작
 * - 모든 가격 0원
 * - 아이템/서비스 수정 불가 (읽기 전용)
 */
const GomdolOrderFlowScreen: React.FC = () => {
    const { step } = useParams();
    const navigate = useNavigate();
    const currentStep = parseInt(step || '5', 10);

    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState<'success' | 'error'>('success');
    const [popupMessage, setPopupMessage] = useState('');
    const [step5Valid, setStep5Valid] = useState(true); // Gomdol은 기본 valid
    const [step6Valid, setStep6Valid] = useState(false);

    // Gomdol 데이터 존재 여부 확인
    const [gomdolData, setGomdolData] = useState<GomdolOrderData | null>(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('gomdolOrderData');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData) as GomdolOrderData;
                // source가 gomdol인지 확인
                if (parsed.source !== 'gomdol') {
                    console.error('Invalid gomdol data source');
                    navigate('/pos/receive');
                    return;
                }
                setGomdolData(parsed);
            } catch (e) {
                console.error('Failed to parse gomdol data', e);
                navigate('/pos/receive');
            }
        } else {
            // Gomdol 데이터 없이 접근 시 차단
            navigate('/pos/receive');
        }
    }, [navigate]);

    // Step 범위 검증 (5~6만 허용)
    useEffect(() => {
        if (currentStep < 5 || currentStep > 6) {
            navigate('/pos/orders/gomdol/step/5');
        }
    }, [currentStep, navigate]);

    const handleNext = () => {
        if (currentStep === 5) {
            // Step 5 → Step 6
            navigate('/pos/orders/gomdol/step/6');
        } else if (currentStep === 6) {
            // 최종 완료 처리
            handleSubmitGomdolOrder();
        }
    };

    const handleBack = () => {
        if (currentStep === 5) {
            // Step 5에서 뒤로가기 → Receive로 돌아감
            navigate('/pos/receive');
        } else if (currentStep === 6) {
            navigate('/pos/orders/gomdol/step/5');
        }
    };

    const handleStepClick = (clickedStep: number) => {
        // Gomdol 주문은 Step 5, 6만 클릭 가능
        if (clickedStep >= 5 && clickedStep <= 6) {
            navigate(`/pos/orders/gomdol/step/${clickedStep}`);
        }
    };

    const handleSubmitGomdolOrder = () => {
        // Gomdol 주문 생성 처리
        // 실제로는 API 호출하여 주문 생성

        // Mock: 성공 처리
        setPopupType('success');
        setPopupMessage('Дахин захиалга амжилттай үүсгэлээ!');
        setShowPopup(true);

        // sessionStorage 클리어
        sessionStorage.removeItem('gomdolOrderData');

        // 2초 후 주문 리스트로 이동
        setTimeout(() => {
            navigate('/pos/orders');
        }, 2000);
    };

    // Stepper 상태 설정 (Step 1-4는 회색으로 완료 표시, 5-6만 활성)
    const stepStatuses: Record<number, 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'WARNING'> = {
        1: 'COMPLETED', // 스킵됨 (회색)
        2: 'COMPLETED', // 스킵됨 (회색)
        3: 'COMPLETED', // 스킵됨 (회색)
        4: 'COMPLETED', // 스킵됨 (회색)
        5: currentStep === 5 ? 'WARNING' : 'COMPLETED', // 현재 또는 완료
        6: currentStep === 6 ? 'WARNING' : 'PENDING' // 현재 또는 대기
    };

    // Render Step Content
    const renderStepContent = () => {
        switch (currentStep) {
            case 5:
                return <Step5GomdolSummary onValidationChange={setStep5Valid} />;
            case 6:
                return <Step6Payment onValidationChange={setStep6Valid} isGomdolOrder={true} />;
            default:
                return <Step5GomdolSummary onValidationChange={setStep5Valid} />;
        }
    };

    // 데이터 로딩 중
    if (!gomdolData) {
        return (
            <div className="flex items-center justify-center h-full bg-[#F3F6F9]">
                <div className="text-center">
                    <span className="material-icons-round text-6xl text-gray-300 mb-4 animate-pulse">hourglass_empty</span>
                    <p className="text-gray-500">Уншиж байна...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Gomdol 배지 - 화면 상단 고정 */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 py-2 px-4 flex items-center justify-center gap-3 shadow-md">
                <span className="material-icons-round text-white text-lg">warning</span>
                <span className="text-white font-black text-xs uppercase tracking-widest">
                    Дахн захиалга - Төлбөргүй дахин илгээх
                </span>
                <span className="px-2 py-0.5 bg-white/20 rounded text-white text-[10px] font-bold">
                    #{gomdolData.complaintId}
                </span>
            </div>

            <StepLayout
                steps={6}
                currentStep={currentStep}
                stepStatuses={stepStatuses}
                onBack={handleBack}
                onNext={handleNext}
                onStepClick={handleStepClick}
                isLastStep={currentStep === 6}
                nextDisabled={currentStep === 6 && !step6Valid}
                nextLabel={currentStep === 6 ? 'ЗАХИАЛГА ҮҮСГЭХ' : undefined}
            >
                {renderStepContent()}
            </StepLayout>

            <Popup
                isOpen={showPopup}
                type={popupType}
                title={popupType === 'success' ? 'Амжилттай' : 'Алдаа'}
                message={popupMessage}
                onClose={() => setShowPopup(false)}
            />
        </>
    );
};

export default GomdolOrderFlowScreen;
