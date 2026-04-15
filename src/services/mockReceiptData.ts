export interface MockReceiptItem {
    productId: string;
    name: string;
    price: number;
    salePrice?: number;
    quantity: number;
}

export type ReceiptPaymentMethod = 'cash' | 'card' | 'qpay';
export type ReceiptStatus = 'completed' | 'refunded' | 'partial_refunded';

export interface MockReceipt {
    receiptNo: string;
    soldAt: string;
    branch: string;
    cashier: string;
    customerPhone?: string;
    items: MockReceiptItem[];
    totalAmount: number;
    paymentMethod: ReceiptPaymentMethod;
    status: ReceiptStatus;
}

const calcTotal = (items: MockReceiptItem[]) =>
    items.reduce((sum, it) => sum + (it.salePrice ?? it.price) * it.quantity, 0);

const build = (r: Omit<MockReceipt, 'totalAmount'>): MockReceipt => ({
    ...r,
    totalAmount: calcTotal(r.items),
});

export const mockReceipts: MockReceipt[] = [
    build({
        receiptNo: 'R20260416-0012',
        soldAt: '2026-04-16T01:12:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '9911-2345',
        items: [
            { productId: 'P-101', name: 'Гутал угаах тусгай шингэн 500 мл', price: 26000, salePrice: 22900, quantity: 1 },
            { productId: 'P-102', name: 'Гутал угаах шингэн 300 мл', price: 18900, salePrice: 15900, quantity: 2 },
            { productId: 'P-201', name: 'Хонины өөхөн гутлын тос хар 100 гр', price: 14900, quantity: 1 },
        ],
        paymentMethod: 'cash',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260416-0011',
        soldAt: '2026-04-16T00:45:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '9900-1122',
        items: [
            { productId: 'P-103', name: 'Гутал угаах концентрат 250 мл', price: 21000, quantity: 1 },
            { productId: 'P-202', name: 'Гутлын тос Dubbin 100 гр', price: 11000, salePrice: 9900, quantity: 2 },
        ],
        paymentMethod: 'card',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260415-0085',
        soldAt: '2026-04-15T18:22:00',
        branch: 'Зайсан салбар',
        cashier: 'Сараа',
        customerPhone: '8800-1234',
        items: [
            { productId: 'P-104', name: 'Гутал угаах зөөлөн шингэн 1 л', price: 32000, salePrice: 27900, quantity: 1 },
        ],
        paymentMethod: 'qpay',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260415-0072',
        soldAt: '2026-04-15T15:10:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '9191-5678',
        items: [
            { productId: 'P-203', name: 'Хонины өөхөн гутлын тос саарал 100 гр', price: 14500, salePrice: 12900, quantity: 1 },
            { productId: 'P-204', name: 'Гутлын тос өнгөлгөө бор 50 мл', price: 10000, quantity: 2 },
        ],
        paymentMethod: 'cash',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260415-0061',
        soldAt: '2026-04-15T12:38:00',
        branch: 'Хүүхдийн 100',
        cashier: 'Анар',
        customerPhone: '9988-7766',
        items: [
            { productId: 'P-101', name: 'Гутал угаах тусгай шингэн 500 мл', price: 26000, salePrice: 22900, quantity: 2 },
        ],
        paymentMethod: 'card',
        status: 'refunded',
    }),
    build({
        receiptNo: 'R20260415-0058',
        soldAt: '2026-04-15T11:55:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '8080-9090',
        items: [
            { productId: 'P-205', name: 'Гутлын тос өнгөлгөө хар 50 мл', price: 10000, salePrice: 8900, quantity: 1 },
            { productId: 'P-202', name: 'Гутлын тос Dubbin 100 гр', price: 11000, salePrice: 9900, quantity: 1 },
        ],
        paymentMethod: 'qpay',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260414-0140',
        soldAt: '2026-04-14T19:00:00',
        branch: 'Зайсан салбар',
        cashier: 'Сараа',
        customerPhone: '9595-4321',
        items: [
            { productId: 'P-102', name: 'Гутал угаах шингэн 300 мл', price: 18900, salePrice: 15900, quantity: 3 },
        ],
        paymentMethod: 'cash',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260414-0122',
        soldAt: '2026-04-14T16:41:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '9900-8877',
        items: [
            { productId: 'P-103', name: 'Гутал угаах концентрат 250 мл', price: 21000, quantity: 1 },
            { productId: 'P-201', name: 'Хонины өөхөн гутлын тос хар 100 гр', price: 14900, quantity: 1 },
            { productId: 'P-204', name: 'Гутлын тос өнгөлгөө бор 50 мл', price: 10000, quantity: 1 },
        ],
        paymentMethod: 'card',
        status: 'partial_refunded',
    }),
    build({
        receiptNo: 'R20260414-0098',
        soldAt: '2026-04-14T13:20:00',
        branch: 'Хүүхдийн 100',
        cashier: 'Анар',
        customerPhone: '8811-2233',
        items: [
            { productId: 'P-104', name: 'Гутал угаах зөөлөн шингэн 1 л', price: 32000, salePrice: 27900, quantity: 2 },
        ],
        paymentMethod: 'qpay',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260413-0210',
        soldAt: '2026-04-13T20:05:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '9494-0000',
        items: [
            { productId: 'P-203', name: 'Хонины өөхөн гутлын тос саарал 100 гр', price: 14500, salePrice: 12900, quantity: 2 },
        ],
        paymentMethod: 'cash',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260413-0185',
        soldAt: '2026-04-13T15:47:00',
        branch: 'Зайсан салбар',
        cashier: 'Сараа',
        customerPhone: '8877-2200',
        items: [
            { productId: 'P-101', name: 'Гутал угаах тусгай шингэн 500 мл', price: 26000, salePrice: 22900, quantity: 1 },
            { productId: 'P-202', name: 'Гутлын тос Dubbin 100 гр', price: 11000, salePrice: 9900, quantity: 1 },
        ],
        paymentMethod: 'card',
        status: 'completed',
    }),
    build({
        receiptNo: 'R20260413-0161',
        soldAt: '2026-04-13T11:12:00',
        branch: 'Төв салбар',
        cashier: 'Админ',
        customerPhone: '9933-4455',
        items: [
            { productId: 'P-205', name: 'Гутлын тос өнгөлгөө хар 50 мл', price: 10000, salePrice: 8900, quantity: 2 },
        ],
        paymentMethod: 'cash',
        status: 'completed',
    }),
];

export const findReceiptByNo = (no: string): MockReceipt | undefined =>
    mockReceipts.find(r => r.receiptNo === no);

export const searchReceipts = (query: string): MockReceipt[] => {
    const q = query.trim().toLowerCase();
    if (!q) return mockReceipts;
    return mockReceipts.filter(r =>
        r.receiptNo.toLowerCase().includes(q) ||
        (r.customerPhone || '').toLowerCase().includes(q) ||
        r.items.some(it => it.name.toLowerCase().includes(q))
    );
};
