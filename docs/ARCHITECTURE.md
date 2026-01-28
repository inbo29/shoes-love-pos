# Shoes Love POS - 프로젝트 아키텍처 문서

> 최종 업데이트: 2026-01-28  
> 목적: 신규 인력 온보딩, AI 코드 분석 기준, 개발자 공통 룰 문서

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [모듈별 상세 역할](#4-모듈별-상세-역할)
5. [프론트엔드 개발 규칙](#5-프론트엔드-개발-규칙)
6. [공통 코딩 컨벤션](#6-공통-코딩-컨벤션)
7. [협업 규칙](#7-협업-규칙)
8. [위험 요소 및 개선 제안](#8-위험-요소-및-개선-제안)

---

## 1. 프로젝트 개요

### 1.1 시스템 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Shoes Love POS |
| 시스템 유형 | POS (Point of Sale) 시스템 |
| 비즈니스 도메인 | 신발 케어 서비스 (세탁, 소독, 수선 등) |
| 타겟 국가 | 몽골 |
| UI 언어 | 몽골어 (Mongolian) |
| 타겟 디바이스 | PC / Tablet (모바일 미지원) |

### 1.2 시스템 특성

```
✅ Frontend-only: 백엔드 없음, Mock 데이터 사용
✅ SPA (Single Page Application)
✅ 업무 흐름 기반 STEP 화면 구조
✅ 멀티 시스템 지원 준비 (POS / ERP / RMS)
```

### 1.3 주요 업무 흐름

```
로그인 → 역할 선택 → POS 대시보드
                ├── 주문 접수 (Order) - 6 STEP
                ├── 수령 처리 (Receive) - 4 STEP
                ├── 반품 처리 (Return) - 3 STEP
                ├── 출고 처리 (Shipment)
                ├── 상품 판매 (Sell) - 3 STEP
                ├── 재고 관리 (Inventory)
                ├── 멤버십 관리 (Cards)
                └── 일마감/정산 (Closing)
```

---

## 2. 기술 스택

### 2.1 Core

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.3 | UI 프레임워크 |
| TypeScript | 5.8.2 | 타입 시스템 |
| Vite | 6.2.0 | 빌드 도구 |
| React Router DOM | 6.29.0 | 라우팅 |

### 2.2 Styling

| 기술 | 용도 |
|------|------|
| Tailwind CSS | 유틸리티 기반 스타일링 |
| Material Icons | 아이콘 시스템 |

### 2.3 개발 환경

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

```bash
# 개발 서버 실행
npm run dev  # http://localhost:3000

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 3. 프로젝트 구조

### 3.1 디렉토리 구조

```
shoes-love-pos/
├── .cursor/
│   └── rules/              # Cursor AI 규칙 파일
│       ├── project-architecture.mdc
│       ├── development-standards.mdc
│       ├── collaboration-rules.mdc
│       ├── react-tsx-patterns.mdc
│       ├── mock-services.mdc
│       └── ui-ux-rules.mdc
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages 배포
│
├── docs/
│   └── ARCHITECTURE.md     # 본 문서
│
├── src/
│   ├── app/
│   │   └── App.tsx         # 앱 진입점
│   │
│   ├── routes/
│   │   └── pos.routes.tsx  # POS 라우팅
│   │
│   ├── screens/            # 화면 컴포넌트
│   │   ├── auth/           # 인증
│   │   └── pos/            # POS 업무 화면
│   │
│   ├── services/           # Mock 데이터 서비스
│   │
│   ├── shared/             # 공통 컴포넌트
│   │   ├── components/
│   │   └── layout/
│   │
│   └── types/              # 타입 정의
│
├── index.html
├── index.tsx               # 진입점
├── package.json
├── tsconfig.json
├── vite.config.ts
├── rule.md                 # UX 규칙 문서
├── screenflow.md           # 화면 흐름 문서
└── README.md
```

### 3.2 파일 네이밍 규칙

| 유형 | 패턴 | 예시 |
|------|------|------|
| Screen | `[Domain]Screen.tsx` | `OrderListScreen.tsx` |
| Flow Screen | `[Domain]FlowScreen.tsx` | `OrderFlowScreen.tsx` |
| Step | `Step[N][Name].tsx` | `Step1Info.tsx` |
| Layout | `[Domain]Layout.tsx` | `PosLayout.tsx` |
| Service | `mock[Domain]Data.ts` | `mockCustomerService.ts` |

---

## 4. 모듈별 상세 역할

### 4.1 app/ - 애플리케이션 코어

| 파일 | 역할 | 포함 내용 |
|------|------|----------|
| App.tsx | 앱 진입점 | 라우터 설정, 전역 상태, 레이아웃 래퍼 |

**책임 범위:**
- 최상위 라우팅 구성
- 인증 상태 관리 (userName, selectedBranch)
- 전역 에러 모달 관리

**포함되면 안 되는 것:**
- 개별 화면 로직
- 비즈니스 로직

### 4.2 routes/ - 라우팅 모듈

| 파일 | 역할 |
|------|------|
| pos.routes.tsx | POS 모듈 전체 라우팅 |
| (계획) erp.routes.tsx | ERP 모듈 라우팅 |
| (계획) rms.routes.tsx | RMS 모듈 라우팅 |

**라우팅 구조:**
```tsx
/pos                    → Navigate to /pos/dashboard
/pos/dashboard          → PosDashboardScreen
/pos/orders             → OrderListScreen
/pos/orders/new/step/:step      → OrderFlowScreen (신규)
/pos/orders/:id/edit/step/:step → OrderFlowScreen (수정)
/pos/receive            → ReceiveListScreen
/pos/receive/:id/step/:step     → ReceiveFlowScreen
/pos/returns            → ReturnListScreen
/pos/shipments          → ShipmentListScreen
/pos/sell/step/:step    → ProductSellFlowScreen
/pos/inventory          → InventoryListScreen
/pos/cards              → CardManagementScreen
/pos/management/day     → DayManagementScreen
/pos/cash-submit        → CashSubmissionScreen
/pos/cash-report        → CashReportScreen
```

### 4.3 screens/ - 화면 컴포넌트

#### 4.3.1 screens/auth/ - 인증

| 파일 | 역할 |
|------|------|
| LoginScreen.tsx | 로그인 화면 |
| RoleSelectScreen.tsx | 역할(시스템) 선택 화면 |

#### 4.3.2 screens/pos/ - POS 업무 화면

| 디렉토리 | 역할 | 화면 수 |
|----------|------|--------|
| dashboard/ | 대시보드 | 1 |
| order/ | 주문 접수 | 리스트 + 6 STEP |
| receive/ | 수령 처리 | 리스트 + 4 STEP |
| return/ | 반품 처리 | 리스트 + 3 STEP |
| shipment/ | 출고 관리 | 3 |
| products/ | 상품 관리 | 10+ |
| cards/ | 멤버십 | 1 |
| management/ | 일마감 | 1 |
| finance/ | 정산 | 2 |
| flow/ | 공통 레이아웃 | 1 |

### 4.4 services/ - Mock 데이터 서비스

| 파일 | 데이터 |
|------|--------|
| mockCustomerService.ts | 고객 정보 조회 |
| mockProductData.ts | 상품 데이터 |
| mockInventoryData.ts | 재고 데이터 |
| mockOrderData.ts | 주문 데이터 |
| mockMemberData.ts | 멤버십 데이터 |
| mockServiceData.ts | 서비스 항목 데이터 |

**서비스 함수 패턴:**
```typescript
export const lookupCustomerByPhone = (phone: string): Customer | null => {
  return mockCustomers.find(c => c.phone === phone) || null;
};
```

### 4.5 shared/ - 공통 컴포넌트

#### 4.5.1 shared/components/

| 컴포넌트 | 역할 | 사용처 |
|----------|------|--------|
| StepIndicator/ | STEP 진행 표시 | 모든 Flow 화면 |
| StepFooter/ | STEP 하단 버튼 | 모든 Flow 화면 |
| ErrorModal/ | 에러 모달 | 전역 |
| Popup/ | 알림 팝업 | 전역 |
| PosDropdown.tsx | 드롭다운 | 리스트 화면 |
| PosPagination.tsx | 페이지네이션 | 리스트 화면 |

#### 4.5.2 shared/layout/

| 파일 | 역할 |
|------|------|
| PosLayout.tsx | POS 공통 레이아웃 (헤더, 네비게이션) |

### 4.6 types/ - 타입 정의

| 파일 | 내용 |
|------|------|
| index.ts | 공통 View enum, User interface |
| orderStatus.types.ts | 주문 상태 타입 |

---

## 5. 프론트엔드 개발 규칙

### 5.1 컴포넌트 설계 원칙

#### Screen 컴포넌트
```
책임: 전체 페이지 렌더링, 상태 관리, 라우팅 처리
구조: 단일 파일, export default
Props: userName, initialBranch 등 전역 상태만 수신
```

#### Step 컴포넌트
```
책임: STEP별 입력/표시 UI, validation
구조: 단일 파일, export default
Props: onValidationChange 콜백 필수
```

#### 공통 컴포넌트
```
책임: 재사용 가능한 UI 요소
구조: 디렉토리 + index 또는 단일 파일
Props: 인터페이스 명시적 정의 필수
```

### 5.2 상태 관리

#### 로컬 상태
```typescript
// useState로 컴포넌트 로컬 상태 관리
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### STEP 상태 관리
```typescript
// STEP 상태는 URL이 아닌 상태값 기준으로 관리
type StepStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'WARNING';

// 완료 처리
const completeStep = () => {
  updateStepStatus(currentStep, 'COMPLETED');
  updateStepStatus(currentStep + 1, 'ACTIVE');
  navigate(`${baseUrl}/step/${currentStep + 1}`);
};
```

### 5.3 Validation

```typescript
// 모든 Step 컴포넌트는 validation을 부모에게 전달
interface StepProps {
  onValidationChange?: (isValid: boolean) => void;
}

// useEffect로 validation 상태 관리
useEffect(() => {
  const isPhoneValid = phone.trim().length > 0;
  const isNameValid = customerName.trim().length > 0;
  const isValid = isPhoneValid && isNameValid;
  
  onValidationChange?.(isValid);
}, [phone, customerName, onValidationChange]);
```

### 5.4 레이아웃 규칙

#### STEP 화면 레이아웃 (필수)
```
┌──────────────────────────────────────────────────┐
│                   Header (고정)                   │
├──────────────────────────────────────────────────┤
│              StepIndicator (고정)                 │
├─────────────────────────┬────────────────────────┤
│   좌측 메인 콘텐츠      │   우측 요약 패널        │
│   (스크롤 가능)         │   (position: sticky)   │
├─────────────────────────┴────────────────────────┤
│                StepFooter (고정)                  │
└──────────────────────────────────────────────────┘
```

**절대 금지:**
- 우측 패널 STEP에 따라 숨김/표시 변경
- 좌/우 컬럼 너비 STEP마다 변경
- 가로 폭 축소

### 5.5 API 호출 레이어 (Mock 기준)

```typescript
// 1. Service 파일에서 데이터 조회 함수 정의
// services/mockCustomerService.ts
export const lookupCustomerByPhone = (phone: string): Customer | null => { ... };

// 2. Screen/Step에서 import하여 사용
import { lookupCustomerByPhone } from '../../../../services/mockCustomerService';

const customer = lookupCustomerByPhone(phone);
```

---

## 6. 공통 코딩 컨벤션

### 6.1 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `OrderListScreen` |
| 함수 | camelCase + handle 접두사 | `handleSubmit` |
| 상수 | UPPER_SNAKE_CASE | `MAX_STEPS` |
| 타입 | PascalCase | `StepStatus` |
| 파일명 | PascalCase.tsx | `OrderListScreen.tsx` |

### 6.2 Import 순서

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. 라우터
import { useNavigate, useParams } from 'react-router-dom';

// 3. 공통 컴포넌트
import StepLayout from '../flow/StepLayout';

// 4. 로컬 컴포넌트
import Step1Info from './steps/Step1Info';

// 5. 서비스
import { lookupCustomerByPhone } from '../../../../services/mockCustomerService';

// 6. 타입
import { StepStatus } from '../../../shared/components/StepIndicator/StepIndicator';
```

### 6.3 주석 규칙

```typescript
// ✅ 필수 주석: 복잡한 비즈니스 로직
/**
 * STEP 완료 조건 체크
 * - 필수 체크 2개 모두 체크
 * - ХҮЛЭЭЛГЭН ӨГӨХ 버튼 클릭 성공
 */
const checkStepCompletion = () => { ... };

// ✅ 필수 주석: Mock 데이터 함수
/**
 * 전화번호로 고객 조회
 * @param phone 고객 전화번호
 * @returns 고객 정보 또는 null (미등록 고객)
 */
export const lookupCustomerByPhone = (phone: string): Customer | null => { ... };

// ❌ 불필요한 주석: 명확한 코드
const [loading, setLoading] = useState(false); // loading 상태
```

### 6.4 TypeScript 규칙

```typescript
// ✅ 명시적 타입 정의
interface Props {
  userName: string;
  onSubmit: (data: FormData) => void;
  children?: React.ReactNode;
}

// ✅ Union 타입 활용
type StepStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';
type MembershipType = 'Энгийн' | 'VIP' | 'Байгууллага';

// ❌ any 사용 금지
const data: any = fetchData();

// ❌ 타입 단언 남용 금지
const element = document.getElementById('root') as HTMLDivElement;
```

---

## 7. 협업 규칙

### 7.1 Git 브랜치 전략

```
main (production)
  └── develop
       ├── feature/[담당자]-[기능명]
       ├── fix/[담당자]-[버그설명]
       └── refactor/[담당자]-[대상]
```

### 7.2 Commit 메시지

```
feat: 새로운 기능 추가
fix: 버그 수정
style: 스타일 변경 (로직 변경 없음)
refactor: 리팩토링 (기능 변경 없음)
docs: 문서 수정

예시:
feat: 주문 STEP3 서비스 상세 선택 화면 추가
fix: 수령 STEP1 validation 오류 수정
```

### 7.3 PR 체크리스트

```
□ STEP 화면 좌우 레이아웃 구조 유지 확인
□ 몽골어 텍스트 오타/누락 확인
□ validation 로직 포함 여부
□ 공통 컴포넌트 import 경로 확인
□ 콘솔 에러/warning 없음 확인
□ 기존 화면 동작 영향 확인
```

### 7.4 AI 도구 사용 주의사항

**금지:**
```
❌ AI 제안 "더 나은 구조" 무분별 적용
❌ AI 자동완성의 다른 언어 텍스트 적용
❌ AI가 삭제 제안하는 코드 확인 없이 삭제
❌ AI 생성 새 패턴 검토 없이 적용
```

**권장:**
```
✅ AI 코드 생성 후 기존 패턴과 비교 검토
✅ AI가 수정한 import 경로 확인
✅ AI 생성 코드의 몽골어 텍스트 정확성 확인
```

---

## 8. 위험 요소 및 개선 제안

### 8.1 현재 기술적 리스크

| 리스크 | 설명 | 영향도 |
|--------|------|--------|
| 백엔드 없음 | Mock 데이터만 사용, 실제 API 연동 시 대규모 수정 필요 | 높음 |
| 전역 상태 관리 미비 | Redux/Zustand 없이 props drilling | 중간 |
| 타입 정의 분산 | types/ 외 개별 파일에도 타입 정의 존재 | 낮음 |
| 테스트 코드 없음 | 단위 테스트, E2E 테스트 미작성 | 중간 |

### 8.2 유지보수 관점 문제점

| 문제 | 설명 |
|------|------|
| Mock 데이터 하드코딩 | 데이터 변경 시 여러 파일 수정 필요 |
| 공통 컴포넌트 문서화 부족 | Props 설명, 사용 예시 미비 |
| 에러 처리 미표준화 | 화면별 다른 에러 처리 방식 |

### 8.3 AI 분석 시 주의점

```
⚠️ 몽골어 텍스트를 영어/한국어로 번역 제안 거부
⚠️ STEP 레이아웃 단순화 제안 거부
⚠️ Mock 서비스 → 실제 API로 변경 제안은 별도 논의 필요
⚠️ 타입 자동 추론으로 인한 any 사용 방지
```

### 8.4 리팩토링 우선순위

| 우선순위 | 대상 | 예상 효과 |
|----------|------|----------|
| 1 | 전역 상태 관리 도입 (Zustand) | 코드 간소화, props drilling 해소 |
| 2 | API 레이어 추상화 | 백엔드 연동 준비 |
| 3 | 타입 정의 중앙화 | 타입 일관성 |
| 4 | 단위 테스트 추가 | 품질 보장 |
| 5 | Storybook 도입 | 컴포넌트 문서화 |

---

## 부록: 화면별 STEP 정의

### 주문 접수 (Order) - 6 STEP

| STEP | 이름 | 완료 조건 |
|------|------|----------|
| 1 | 고객 정보 | 전화번호 + 이름 입력 |
| 2 | 서비스 선택 | 1개 이상 서비스 선택 |
| 3 | 상세 서비스 | 선택된 서비스별 상세 입력 |
| 4 | 물품 상태 | 상태 확인 체크 |
| 5 | 주문 요약 | 확인 (읽기 전용) |
| 6 | 결제 | 결제 완료 |

### 수령 처리 (Receive) - 4 STEP

| STEP | 이름 | 완료 조건 |
|------|------|----------|
| 1 | 주문 확인 | 필수 체크 + 버튼 클릭 |
| 2 | 결제/정산 | 결제 확정 |
| 3 | 설문 | 설문 제출 또는 Skip |
| 4 | 완료/클레임 | 최종 완료 또는 클레임 등록 |

### 상품 판매 (Sell) - 3 STEP

| STEP | 이름 | 완료 조건 |
|------|------|----------|
| 1 | 상품 선택 | 1개 이상 상품 선택 |
| 2 | 요약 | 확인 |
| 3 | 결제 | 결제 완료 |

---

*본 문서는 프로젝트 구조 변경 시 반드시 업데이트해야 합니다.*
