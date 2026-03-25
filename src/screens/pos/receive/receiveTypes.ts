// ========== RECEIVE FLOW TYPES ==========

export type ItemAction = 'receive' | 'complaint';
export type ComplaintType = 'wash_defect' | 'damage' | 'smell' | 'customer_complaint' | 'factory_return' | 'other';
export type ComplaintResolution = 'reorder' | 'refund';

export interface ItemDecision {
    itemId: number;
    action: ItemAction;
    // Complaint details (only if action === 'complaint')
    complaintReason?: string;
    complaintType?: ComplaintType;
    complaintTypes?: ComplaintType[]; // Multi-select support
    complaintPhotos?: string[];
    resolution?: ComplaintResolution;
}

export interface ReceiveOrderItem {
    id: number;
    name: string;
    services: string[];
    quantity: number;
    cleanliness: string;
    damage: { hasDamage: boolean; desc?: string };
    photos: string[];
    price: number;
    status: 'PENDING' | 'RECEIVED' | 'REFUNDED' | 'REORDER' | 'REORDER_DONE';
    // Detailed product attributes
    details?: {
        style?: string;        // загвар (Sport, Casual, etc.)
        color?: string;        // өнгө
        size?: string;         // размер
        material?: string;     // материал (Арьс, Даавуу, etc.)
        type?: string;         // төрөл (Эрэгтэй, Эмэгтэй, etc.)
        brand?: string;        // брэндийн нэр
        condition?: string;    // бэлдэл (Дунд зэрэг, Шинэ, etc.)
        buttonType?: string;   // товч
        scuffStatus?: string;  // хурц дээвэр
        stockCondition?: string; // нөөц дараах байдал (Хэвийн, etc.)
        additionalNotes?: string[];  // нөмөлт нөшөлгүүд
    };
    selectedServices?: string[]; // Сонгосон үйлчилгээнүүд (Угаах, Намалт, Засвар, etc.)
    // Reorder history (only for REORDER_DONE items)
    reorderHistory?: {
        originalComplaintId: string;
        complaintTypes: string[];
        complaintReason: string;
        reorderDate: string;
        reorderCompleteDate: string;
    };
}

export interface ReceiveOrder {
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
    items: ReceiveOrderItem[];
}

export const COMPLAINT_TYPES: { value: ComplaintType; label: string }[] = [
    { value: 'wash_defect', label: 'Угаалга муу' },
    { value: 'damage', label: 'Гэмтэл гарсан' },
    { value: 'smell', label: 'Үнэр арилаагүй' },
    { value: 'customer_complaint', label: 'Хэрэглэгчийн гомдол' },
    { value: 'factory_return', label: 'Үйлдвэрт буцаах' },
    { value: 'other', label: 'Бусад' },
];

// Calculate order-level status from item decisions
export type OrderStatus =
    | 'Хүлээн авахад бэлэн'
    | 'Хэсэгчлэн хүлээлгэн өгсөн'
    | 'Буцаалттай'
    | 'Дахин захиалгатай'
    | 'Дахин хүлээн авах'  // Reorder items ready for 2nd receive
    | 'Бүрэн хүлээлгэн өгсөн';

export function calcOrderStatus(items: ReceiveOrderItem[]): OrderStatus {
    const allFullyDone = items.every(i => i.status === 'RECEIVED' || i.status === 'REFUNDED');
    const hasReorderDone = items.some(i => i.status === 'REORDER_DONE');
    const hasReorder = items.some(i => i.status === 'REORDER');
    const hasRefund = items.some(i => i.status === 'REFUNDED');
    const allPending = items.every(i => i.status === 'PENDING');
    const someReceived = items.some(i => i.status === 'RECEIVED');

    if (allFullyDone) return 'Бүрэн хүлээлгэн өгсөн';
    if (hasReorderDone) return 'Дахин хүлээн авах'; // Reorder came back, needs 2nd receive
    if (hasReorder) return 'Дахин захиалгатай';
    if (hasRefund) return 'Буцаалттай';
    if (allPending) return 'Хүлээн авахад бэлэн';
    if (someReceived) return 'Хэсэгчлэн хүлээлгэн өгсөн';
    return 'Хүлээн авахад бэлэн';
}

export function getOrderStatusStyles(status: OrderStatus): string {
    switch (status) {
        case 'Хүлээн авахад бэлэн': return 'bg-green-100 text-green-600 border-green-200';
        case 'Хэсэгчлэн хүлээлгэн өгсөн': return 'bg-blue-100 text-blue-600 border-blue-200';
        case 'Буцаалттай': return 'bg-red-100 text-red-500 border-red-200';
        case 'Дахин захиалгатай': return 'bg-orange-100 text-orange-600 border-orange-200';
        case 'Дахин хүлээн авах': return 'bg-purple-100 text-purple-600 border-purple-200';
        case 'Бүрэн хүлээлгэн өгсөн': return 'bg-gray-100 text-gray-500 border-gray-200';
        default: return 'bg-gray-100 text-gray-400 border-gray-200';
    }
}

export function getItemStatusLabel(status: ReceiveOrderItem['status']): string {
    switch (status) {
        case 'PENDING': return 'Хүлээгдэж буй';
        case 'RECEIVED': return 'Болсон';
        case 'REFUNDED': return 'Буцаагдсан';
        case 'REORDER': return 'Дахин захиалга';
        case 'REORDER_DONE': return 'Дахин захиалга (дууссан)';
        default: return '';
    }
}

export function getItemStatusStyles(status: ReceiveOrderItem['status']): string {
    switch (status) {
        case 'PENDING': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        case 'RECEIVED': return 'bg-green-50 text-green-600 border-green-100';
        case 'REFUNDED': return 'bg-red-50 text-red-500 border-red-100';
        case 'REORDER': return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'REORDER_DONE': return 'bg-blue-50 text-blue-600 border-blue-100';
        default: return 'bg-gray-50 text-gray-400 border-gray-100';
    }
}

// ===== Gomdol (Reorder) Types =====
export interface GomdolSelectedItem {
    id: number;
    name: string;
    model?: string;
    services: string[];
    quantity: number;
    price: number;
}

export interface GomdolOrderData {
    source: 'gomdol';
    isReOrder: true;
    originalOrderId: string;
    originalReceiveId?: string;
    complaintId: string;
    complaintType: string;
    complaintDescription: string;
    selectedItems: GomdolSelectedItem[];
    selectedAction: string;
    price: 0;
}
