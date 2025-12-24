본 문서는 POS / ERP / RMS 공통 시스템 개발 시
구조, UX, 컴포넌트, 소스 위치 사용에 대한 필수 규칙을 정의한다.
본 규칙은 모든 개발 단계에서 반드시 준수해야 한다.

공통

Login

Role Select (POS / ERP / RMS)

🟢 POS
대시보드

POS Dashboard

주문 (접수)

주문 리스트

주문 접수 STEP 1 ~ STEP 6 (신규)

주문 접수 STEP 1 ~ STEP 6 (편집)

수령

수령 리스트

수령 상세 / 처리

반품

반품 리스트

반품 처리 STEP 화면들

출고 (Ачилт)

출고 리스트

출고 처리 STEP 화면들

출고 완료 내역 (Ачилт хийсэн баримт)

카드

카드 요청 리스트

카드 상세 / 처리

일마감

일일 마감 리스트

일일 마감 처리

마감 취소 / 재확인

📁 ✅ 최종 ROOT 구조 (확정)

이 구조가 네 프로젝트의 “뼈대”

POS 기준으로 기능 단위가 아니라 “업무 흐름 단위”로 분리

src/
├─ app/
│  ├─ App.tsx
│  └─ Router.tsx
│
├─ routes/
│  ├─ auth.routes.tsx
│  ├─ pos.routes.tsx
│  ├─ erp.routes.tsx
│  └─ rms.routes.tsx
│
├─ shared/
│  ├─ components/
│  │  ├─ StepIndicator/
│  │  ├─ StepFooter/
│  │  ├─ ErrorModal/
│  │  ├─ ConfirmModal/
│  │  ├─ LoadingOverlay/
│  │  └─ Table/
│  │
│  ├─ layout/
│  │  ├─ AppLayout.tsx
│  │  ├─ PosLayout.tsx
│  │  └─ Header.tsx
│  │
│  └─ types/
│     ├─ step.ts
│     └─ status.ts
│
├─ screens/
│  ├─ auth/
│  │  ├─ LoginScreen.tsx
│  │  └─ RoleSelectScreen.tsx
│  │
│  ├─ pos/
│  │  ├─ dashboard/
│  │  │  └─ PosDashboardScreen.tsx
│  │  │
│  │  ├─ order/                ← Захиалга авах
│  │  │  ├─ OrderListScreen.tsx
│  │  │  ├─ OrderStepLayout.tsx
│  │  │  └─ steps/
│  │  │     ├─ Step1_Info.tsx
│  │  │     ├─ Step2_Customer.tsx
│  │  │     ├─ Step3_Items.tsx
│  │  │     ├─ Step4_Status.tsx
│  │  │     ├─ Step5_Receive.tsx
│  │  │     └─ Step6_Confirm.tsx
│  │  │
│  │  ├─ receive/              ← Хүлээлгэн өгөх
│  │  │  ├─ ReceiveListScreen.tsx
│  │  │  └─ ReceiveDetailScreen.tsx
│  │  │
│  │  ├─ return/               ← Буцаалт
│  │  │  ├─ ReturnListScreen.tsx
│  │  │  ├─ ReturnStepLayout.tsx
│  │  │  └─ steps/
│  │  │     ├─ Step1_Select.tsx
│  │  │     ├─ Step2_Check.tsx
│  │  │     └─ Step3_Confirm.tsx
│  │  │
│  │  ├─ shipment/             ← Ачилт
│  │  │  ├─ ShipmentListScreen.tsx
│  │  │  ├─ ShipmentStepLayout.tsx
│  │  │  ├─ steps/
│  │  │  │  ├─ Step1_Select.tsx
│  │  │  │  ├─ Step2_Pack.tsx
│  │  │  │  └─ Step3_Confirm.tsx
│  │  │  └─ ShipmentDoneScreen.tsx
│  │  │
│  │  ├─ card/                 ← Картын хүсэлт
│  │  │  ├─ CardRequestListScreen.tsx
│  │  │  └─ CardRequestDetailScreen.tsx
│  │  │
│  │  ├─ closing/              ← Өдрийн хаалт
│  │  │  ├─ DailyCloseListScreen.tsx
│  │  │  ├─ DailyCloseProcessScreen.tsx
│  │  │  └─ DailyCloseCancelScreen.tsx
│  │  │
│  │  └─ index.ts
│  │
│  ├─ erp/
│  └─ rms/
│
├─ styles/
│  └─ theme.ts
│
├─ types/
│  ├─ order.ts
│  ├─ shipment.ts
│  ├─ return.ts
│  └─ closing.ts
│
└─ utils/

🧭 POS Router (최종 확정)
<Route path="/pos" element={<PosLayout />}>
  <Route index element={<Navigate to="dashboard" />} />

  <Route path="dashboard" element={<PosDashboardScreen />} />

  {/* 주문 */}
  <Route path="orders">
    <Route index element={<OrderListScreen />} />
    <Route path="new/step/:step" element={<OrderStepLayout mode="create" />} />
    <Route path=":id/edit/step/:step" element={<OrderStepLayout mode="edit" />} />
  </Route>

  {/* 수령 */}
  <Route path="receive">
    <Route index element={<ReceiveListScreen />} />
    <Route path=":id" element={<ReceiveDetailScreen />} />
  </Route>

  {/* 반품 */}
  <Route path="returns">
    <Route index element={<ReturnListScreen />} />
    <Route path=":id/step/:step" element={<ReturnStepLayout />} />
  </Route>

  {/* 출고 */}
  <Route path="shipments">
    <Route index element={<ShipmentListScreen />} />
    <Route path=":id/step/:step" element={<ShipmentStepLayout />} />
    <Route path="done/:id" element={<ShipmentDoneScreen />} />
  </Route>

  {/* 카드 */}
  <Route path="cards">
    <Route index element={<CardRequestListScreen />} />
    <Route path=":id" element={<CardRequestDetailScreen />} />
  </Route>

  {/* 일마감 */}
  <Route path="closing">
    <Route index element={<DailyCloseListScreen />} />
    <Route path="process" element={<DailyCloseProcessScreen />} />
    <Route path="cancel/:id" element={<DailyCloseCancelScreen />} />
  </Route>
</Route>

🔒 전 시스템 공통 UX 규칙 (이제 고정)
✅ STEP 화면

상단: StepIndicator

하단: [뒤로가기 | 임시저장 | 다음]

신규 / 편집 동일 구조

✅ 리스트

행 클릭 = 편집 or 처리 모드 진입

상세보기 전용 화면 없음

✅ 모든 업무 흐름

리스트 → 처리(STEP) → 완료 화면

POS 주문 · 고객 전달 STEP 공통 UI RULE 프롬프트
📌 적용 범위

주문 접수 (Order)

물건 인도 / 고객 전달 (Receive)

STEP 1 ~ STEP 6 전 구간

🧭 STEP 구조 기본 원칙 (고정)
1️⃣ 상단 공통 헤더 (항상 표시)

브랜드: Shoes Love

현재 날짜 / 시간

로그인 사용자 (Admin / Staff)

POS 메인 메뉴 아이콘 라인

현재 활성 메뉴 강조 유지

❗ STEP 화면에서도 절대 숨기지 않음

2️⃣ 상단 Stepper 영역 (STEP 화면 전용)

STEP 1 ~ STEP N (최대 6)

완료 STEP: ✔ 체크 아이콘

현재 STEP: 강조 컬러

미래 STEP: 비활성

✔ STEP 화면에서만 표시
✔ 스크롤해도 상단 영역 유지 (고정 아님, 항상 첫 영역)

📐 메인 레이아웃 RULE (핵심)
전체 레이아웃은 항상 2 Column 구조
[좌측 메인 콘텐츠 영역]   [우측 요약 / 결제 패널]

🟦 좌측 메인 콘텐츠 영역 (스크롤 영역)
역할

STEP별 주요 작업 영역

입력 / 확인 / 선택 / 결과 표시

특징

페이지 스크롤 대상

콘텐츠 길이에 따라 자연스럽게 늘어남

카드 기반 레이아웃 유지

포함 예

STEP 1: 주문 정보 확인

STEP 2: 결제 수단 선택

STEP 3: 설문

STEP 4: 인도 확인

STEP 5: 서비스 결과 요약

STEP 6: 완료 화면

🟨 우측 요약 / 결제 패널 (🔥 중요 RULE)
✅ 무조건 Sticky 유지

이 패널은 모든 STEP에서 동일한 규칙 적용

position: sticky;
top: 헤더 + 스텝퍼 높이;

행동 규칙

페이지 스크롤 시 항상 화면에 고정

좌측 콘텐츠만 스크롤됨

화면 하단까지 자연스럽게 따라옴

특정 STEP에서 사라지지 않음 ❌

📦 우측 패널 포함 정보 (STEP별 동적)

주문 요약

결제 금액

할인 / 포인트 / 잔액

현재 STEP에서 가능한 액션 버튼

예:

STEP 2: “Төлбөр баталгаажуулах”

STEP 5: 정보 표시만 (버튼 비활성)

🚫 절대 금지 사항 (이번에 문제 났던 부분)

❌ STEP에 따라 우측 패널 사라지게 하지 말 것
❌ 어떤 화면에서는 sticky, 어떤 화면에서는 static 처리 금지
❌ 좌/우 컬럼 너비를 STEP마다 다르게 하지 말 것
❌ PC 화면에서 전체 레이아웃 폭 줄이기 금지

📏 PC 화면 레이아웃 고정 규칙

전체 콘텐츠 최대 너비 동일

다른 리스트 화면과 가로 폭 100% 동일

가운데 정렬 (centered container)

max-width: 기존 POS 리스트 화면과 동일
margin: 0 auto

🧩 STEP 5 (접수 완료 / 요약 STEP) 특별 규칙

좌측:

Үйлчилгээний хураангуй (신발별 결과 카드)

우측:

결제 요약 카드 sticky 유지

수정 불가, 읽기 전용

❗ STEP 5에서도 우측 패널은 반드시 유지

✅ 한 줄 요약 (RULE 선언)

POS의 모든 STEP 화면은
좌측 콘텐츠 스크롤 + 우측 요약 패널 sticky
구조를 절대적으로 유지한다.