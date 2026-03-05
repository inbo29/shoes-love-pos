# UI Standardization Plan for List Screens

## 1. Goal
Apply consistent styling to all List screens based on user's feedback:
1. **Button Positioning**: Align action buttons (e.g. Create new, Receive, Excel) with the header text.
2. **Padding and Gaps**: Standardize `gap` and `padding` for filter bars and headers.
3. **Fonts**: Use bold fonts (e.g. `font-bold`, `font-black`) for table data to improve readability.
4. **Column Optimization**: Adjust table column widths to ensure full text visibility where possible, shrinking empty spaces.
5. **Date Format**: Standardize date string format (e.g. `YYYY-MM-DD` or `YYYY.MM.DD`).

## 2. Target Style Reference (`ProductOrderListScreen.tsx`)

### Header Row
```tsx
<div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4 shrink-0">
    <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 bg-[#40C1C7] rounded-sm" />
        <h2 className="text-[18px] font-bold text-[#374151]">Тitle</h2>
    </div>
    <div className="flex items-center gap-3">
        <button className="bg-[#FFD400] text-gray-900 px-5 py-3 rounded-2xl shadow-lg ... font-black uppercase text-[11px]">
             ... Action
        </button>
        <PosExcelButton />
    </div>
</div>
```

### Filter Bar
```tsx
<div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-4 shrink-0">
  // Pickers and Dropdowns 
</div>
```

### Table Container
```tsx
<div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden">
    <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar">
       <div className="min-w-[1100px] flex flex-col">
          // Header
          <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-100 text-gray-400 px-6 py-4 flex text-[10px] font-black tracking-widest items-center uppercase">
              // Columns
          </div>
          // Rows (bold styles applied to text)
```

## 3. Screens to Update
Based on our search `grep "жагсаалт"`, we need to update:
1. `AuditListScreen.tsx`
2. `ProductReceiveScreen.tsx`
3. `TransferListScreen.tsx`
4. `TransferReceiveScreen.tsx` (if any, matching TransferListScreen logic)
5. `CardManagementScreen.tsx`
6. `CashSubmissionScreen.tsx`
7. `ReceiveListScreen.tsx` (Customer receive)
8. `ShipmentListScreen.tsx`
9. `ShipmentReceiveScreen.tsx`

We will go through these one by one and standardize the markup.
