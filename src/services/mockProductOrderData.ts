export interface ProductOrderItem {
    productId: string;
    name: string;
    category: string;
    price: number;
    orderedQuantity: number;
    receivedQuantity: number;
    dispatchedQuantity: number;
}

export interface InventoryHistory {
    type: 'DISPATCH' | 'RECEIPT';
    date: string;
    staff: string;
    quantity: number;
    notes?: string;
}

export type ProductOrderStatus =
    | 'Захиалсан'         // Ordered
    | 'Хүлээгдэж байна'   // Waiting (Dispatched but not fully received)
    | 'Хэсэгчлэн авсан'   // Partially Received
    | 'Бүрэн авсан'       // Fully Received
    | 'Цуцалсан';         // Cancelled

export interface ProductOrder {
    id: string;
    date: string;
    staff: string;
    branch: string;
    totalAmount: number;
    totalQuantity: number;
    status: ProductOrderStatus;
    items: ProductOrderItem[];
    history: InventoryHistory[];
}

export const mockProductOrders: ProductOrder[] = [
    {
        id: '#PO-2023-001',
        date: '2023.10.27 14:15',
        staff: 'Админ',
        branch: 'Төв салбар',
        totalQuantity: 7,
        totalAmount: 119300,
        status: 'Захиалсан',
        items: [
            { productId: 'PROD-001', name: 'Runa зөөлрүүлэгчтэй угаалгын шингэн', category: 'Cleaning', price: 29900, orderedQuantity: 2, receivedQuantity: 0, dispatchedQuantity: 0 },
            { productId: 'PROD-006', name: 'Гутлын тос Dubbin', category: 'Care', price: 11900, orderedQuantity: 5, receivedQuantity: 0, dispatchedQuantity: 0 },
        ],
        history: []
    },
    {
        id: '#PO-2023-002',
        date: '2023.10.27 13:45',
        staff: 'Админ',
        branch: 'Салбар 1',
        totalQuantity: 10,
        totalAmount: 269000,
        status: 'Бүрэн авсан',
        items: [
            { productId: 'PROD-002', name: 'Гутал угаах тусгай шингэн', category: 'Cleaning', price: 26900, orderedQuantity: 10, receivedQuantity: 10, dispatchedQuantity: 10 },
        ],
        history: [
            { type: 'DISPATCH', date: '2023.10.27 15:00', staff: 'Админ', quantity: 10 },
            { type: 'RECEIPT', date: '2023.10.27 16:30', staff: 'Салбар 1 менежер', quantity: 10 },
        ]
    },
    {
        id: '#PO-2023-003',
        date: '2023.10.27 12:30',
        staff: 'Админ',
        branch: 'Төв салбар',
        totalQuantity: 15,
        totalAmount: 403500,
        status: 'Хэсэгчлэн авсан',
        items: [
            { productId: 'PROD-001', name: 'Runa зөөлрүүлэгчтэй угаалгын шингэн', category: 'Cleaning', price: 29900, orderedQuantity: 10, receivedQuantity: 5, dispatchedQuantity: 10 },
            { productId: 'PROD-002', name: 'Гутал угаах тусгай шингэн', category: 'Cleaning', price: 26900, orderedQuantity: 5, receivedQuantity: 2, dispatchedQuantity: 5 },
        ],
        history: [
            { type: 'DISPATCH', date: '2023.10.27 13:00', staff: 'Админ', quantity: 15 },
            { type: 'RECEIPT', date: '2023.10.28 09:00', staff: 'Менежер', quantity: 7 },
        ]
    },
    {
        id: '#PO-2023-004',
        date: '2023.10.27 11:20',
        staff: 'Админ',
        branch: 'Салбар 2',
        totalQuantity: 5,
        totalAmount: 59500,
        status: 'Цуцалсан',
        items: [
            { productId: 'PROD-006', name: 'Гутлын тос Dubbin', category: 'Care', price: 11900, orderedQuantity: 5, receivedQuantity: 0, dispatchedQuantity: 0 },
        ],
        history: []
    }
];
