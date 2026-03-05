export interface ProductOrderItem {
    productId: string;
    name: string;
    category: string;
    price: number;
    orderedQuantity: number;
    receivedQuantity: number;
}

export interface ProductReceiptHistory {
    date: string;
    staff: string;
    items: { productId: string; name: string; quantity: number }[];
    remarks?: string;
}

// 3-status flow: Захиалсан → Ирсэн → Авсан
export type ProductOrderStatus =
    | 'Захиалсан'   // Ordered – dispatched to HQ
    | 'Ирсэн'       // Arrived – HQ dispatched, branch can receive
    | 'Авсан';      // Received – branch confirmed receipt

export interface ProductOrder {
    id: string;
    date: string;
    staff: string;
    from: string;       // ordering branch
    to: string;         // always Төв салбар
    totalAmount: number;
    totalQuantity: number;
    status: ProductOrderStatus;
    items: ProductOrderItem[];
    remarks?: string;           // order remarks (step 2)
    receiptRemarks?: string;    // receipt remarks (Орлого авах)
    receiptHistory: ProductReceiptHistory[];
}

let _orders: ProductOrder[] = [
    {
        id: '#PO-2026-001',
        date: '2026.03.05 09:10',
        staff: 'Бат-Эрдэнэ',
        from: 'Салбар 1',
        to: 'Төв салбар',
        totalQuantity: 7,
        totalAmount: 119300,
        status: 'Захиалсан',
        remarks: 'Яаралтай захиалга, аль болох хурдан',
        receiptRemarks: undefined,
        items: [
            { productId: 'PROD-001', name: 'Runa зөөлрүүлэгчтэй угаалгын шингэн ph7.5', category: 'Угаалгын шингэн', price: 29900, orderedQuantity: 2, receivedQuantity: 0 },
            { productId: 'PROD-006', name: 'Гутлын тос Dubbin 100 гр', category: 'Тос', price: 11900, orderedQuantity: 5, receivedQuantity: 0 },
        ],
        receiptHistory: []
    },
    {
        id: '#PO-2026-002',
        date: '2026.03.04 14:30',
        staff: 'Нарантуяа',
        from: 'Салбар 2',
        to: 'Төв салбар',
        totalQuantity: 10,
        totalAmount: 269000,
        status: 'Ирсэн',
        remarks: 'Лавлага: Нарантуяа 99001234',
        receiptRemarks: undefined,
        items: [
            { productId: 'PROD-002', name: 'Гутал угаах тусгай шингэн 500 мл', category: 'Угаалгын шингэн', price: 26900, orderedQuantity: 10, receivedQuantity: 0 },
        ],
        receiptHistory: []
    },
    {
        id: '#PO-2026-003',
        date: '2026.03.03 11:20',
        staff: 'Ганзориг',
        from: 'Салбар 1',
        to: 'Төв салбар',
        totalQuantity: 15,
        totalAmount: 403500,
        status: 'Авсан',
        remarks: '',
        receiptRemarks: 'Бүгдийг хүлээн авлаа',
        items: [
            { productId: 'PROD-001', name: 'Runa зөөлрүүлэгчтэй угаалгын шингэн ph7.5', category: 'Угаалгын шингэн', price: 29900, orderedQuantity: 10, receivedQuantity: 10 },
            { productId: 'PROD-002', name: 'Гутал угаах тусгай шингэн 500 мл', category: 'Угаалгын шингэн', price: 26900, orderedQuantity: 5, receivedQuantity: 5 },
        ],
        receiptHistory: [
            { date: '2026.03.04 09:00', staff: 'Ганзориг', items: [{ productId: 'PROD-001', name: 'Runa угаалгын шингэн', quantity: 10 }, { productId: 'PROD-002', name: 'Гутал угаах шингэн', quantity: 5 }], remarks: 'Бүгдийг хүлээн авлаа' }
        ]
    },
    {
        id: '#PO-2026-004',
        date: '2026.03.02 16:45',
        staff: 'Сарантуяа',
        from: 'Салбар 2',
        to: 'Төв салбар',
        totalQuantity: 8,
        totalAmount: 156000,
        status: 'Ирсэн',
        remarks: 'Шинэ загвар',
        receiptRemarks: undefined,
        items: [
            { productId: 'PROD-011', name: 'Гутлын өнгөлөгч хар', category: 'Өнгөлөгч', price: 7900, orderedQuantity: 5, receivedQuantity: 0 },
            { productId: 'PROD-019', name: 'Гутал ус нэвтрэхээс хамгаалагч 100 мл', category: 'Хамгаалагч', price: 7900, orderedQuantity: 3, receivedQuantity: 0 },
        ],
        receiptHistory: []
    },
    {
        id: '#PO-2026-005',
        date: '2026.03.01 10:00',
        staff: 'Бат-Эрдэнэ',
        from: 'Салбар 1',
        to: 'Төв салбар',
        totalQuantity: 20,
        totalAmount: 498000,
        status: 'Авсан',
        remarks: 'Сарын захиалга',
        receiptRemarks: 'Бүрэн авлаа, 3 ширхэг гэмтэлтэй байсан тул буцаасан',
        items: [
            { productId: 'PROD-015', name: 'Гутал цэвэрлэгч шингэн 500 мл', category: 'Цэвэрлэгч', price: 26900, orderedQuantity: 10, receivedQuantity: 10 },
            { productId: 'PROD-021', name: 'Гутлын сойз зөөлөн', category: 'Бүсчиг', price: 5900, orderedQuantity: 10, receivedQuantity: 10 },
        ],
        receiptHistory: [
            { date: '2026.03.02 08:30', staff: 'Бат-Эрдэнэ', items: [{ productId: 'PROD-015', name: 'Гутал цэвэрлэгч', quantity: 10 }, { productId: 'PROD-021', name: 'Сойз', quantity: 10 }], remarks: 'Бүрэн авлаа, 3 ширхэг гэмтэлтэй байсан тул буцаасан' }
        ]
    },
];

// Mutable getters/setters for runtime state updates
export const getProductOrders = (): ProductOrder[] => _orders;

export const addProductOrder = (order: ProductOrder) => {
    _orders = [order, ..._orders];
};

export const updateProductOrderStatus = (
    id: string,
    status: ProductOrderStatus,
    receiptData?: { receivedQuantities: Record<string, number>; receiptRemarks: string; staff: string }
) => {
    _orders = _orders.map(o => {
        if (o.id !== id) return o;

        const updatedItems = receiptData
            ? o.items.map(item => ({
                ...item,
                receivedQuantity: receiptData.receivedQuantities[item.productId] ?? item.receivedQuantity
            }))
            : o.items;

        const newHistoryEntry: ProductReceiptHistory | null = receiptData
            ? {
                date: new Date().toLocaleString('mn-MN'),
                staff: receiptData.staff,
                items: updatedItems.map(i => ({ productId: i.productId, name: i.name, quantity: receiptData.receivedQuantities[i.productId] ?? 0 })),
                remarks: receiptData.receiptRemarks,
            }
            : null;

        return {
            ...o,
            status,
            items: updatedItems,
            receiptRemarks: receiptData?.receiptRemarks ?? o.receiptRemarks,
            receiptHistory: newHistoryEntry ? [...o.receiptHistory, newHistoryEntry] : o.receiptHistory,
        };
    });
};

// Keep backward compat alias
export const mockProductOrders = _orders;
