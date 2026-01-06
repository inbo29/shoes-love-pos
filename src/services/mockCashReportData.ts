export interface ServiceOrder {
    id: string;
    customer: string;
    amount: number;
}

export interface ProductOrder {
    id: string;
    name: string;
    quantity: number;
    amount: number;
    customer: string;
}

export interface ServiceCategory {
    total: number;
    orders: ServiceOrder[];
}

export interface ProductItem {
    total: number;
    quantity: number;
    orders: ProductOrder[];
}

export interface PaymentMethodData {
    method: 'Бэлэн' | 'Карт' | 'QR / QPay';
    total: number;
    serviceTotal: number;
    productTotal: number;

    // Service Tree Data
    serviceCategories: {
        Gutal: ServiceCategory;
        Chemical: ServiceCategory;
        Carpet: ServiceCategory;
    };

    // Product Tree Data
    productItems: {
        [productName: string]: ProductItem;
    };
}

export interface CancellationData {
    id: string;
    description: string;
    amount: number;
    type: 'SERVICE' | 'PRODUCT';
    paymentMethod: 'Бэлэн' | 'Карт' | 'QR / QPay';
}

export interface CashReportResponse {
    paymentMethods: PaymentMethodData[];
    cancellations: CancellationData[];
}

export const mockCashReportData: CashReportResponse = {
    paymentMethods: [
        {
            method: 'Бэлэн',
            total: 352300,
            serviceTotal: 352300,
            productTotal: 0,
            serviceCategories: {
                Gutal: {
                    total: 352300,
                    orders: [
                        { id: 'ORD-2025-0012', amount: 23900, customer: 'Бат' },
                        { id: 'ORD-2025-0018', amount: 43900, customer: 'Гэрэл' },
                        { id: 'ORD-2025-0021', amount: 69900, customer: 'Болд' },
                        { id: 'ORD-2025-0025', amount: 214600, customer: 'Ану' },
                    ]
                },
                Chemical: { total: 0, orders: [] },
                Carpet: { total: 0, orders: [] },
            },
            productItems: {}
        },
        {
            method: 'Карт',
            total: 1440000,
            serviceTotal: 1120000,
            productTotal: 320000,
            serviceCategories: {
                Gutal: {
                    total: 850000,
                    orders: [
                        { id: 'ORD-2025-0030', amount: 450000, customer: 'Дулмаа' },
                        { id: 'ORD-2025-0035', amount: 400000, customer: 'Төмөр' },
                    ]
                },
                Chemical: {
                    total: 270000,
                    orders: [
                        { id: 'ORD-2025-0040', amount: 270000, customer: 'Сараа' }
                    ]
                },
                Carpet: { total: 0, orders: [] },
            },
            productItems: {
                'Гутал цэвэрлэгээний шингэн': {
                    total: 120000,
                    quantity: 4,
                    orders: [
                        { id: 'SALE-001', name: 'Гутал цэвэрлэгээний шингэн', quantity: 2, amount: 60000, customer: 'Guest' },
                        { id: 'SALE-003', name: 'Гутал цэвэрлэгээний шингэн', quantity: 2, amount: 60000, customer: 'Guest' },
                    ]
                },
                'Үнэр дарагч': {
                    total: 200000,
                    quantity: 10,
                    orders: [
                        { id: 'SALE-002', name: 'Үнэр дарагч', quantity: 5, amount: 100000, customer: 'Guest' },
                        { id: 'SALE-004', name: 'Үнэр дарагч', quantity: 5, amount: 100000, customer: 'Guest' },
                    ]
                }
            }
        },
        {
            method: 'QR / QPay',
            total: 580000,
            serviceTotal: 580000,
            productTotal: 0,
            serviceCategories: {
                Gutal: { total: 0, orders: [] },
                Chemical: { total: 0, orders: [] },
                Carpet: {
                    total: 580000,
                    orders: [
                        { id: 'ORD-2025-0050', amount: 580000, customer: 'Энхээ' }
                    ]
                }
            },
            productItems: {}
        }
    ],
    cancellations: [
        { id: 'CNL-001', description: 'Үйлчилгээ цуцлагдсан', amount: 150000, type: 'SERVICE', paymentMethod: 'Карт' },
        { id: 'CNL-002', description: 'Бараа буцаасан', amount: 20000, type: 'PRODUCT', paymentMethod: 'Карт' }
    ]
};
