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

