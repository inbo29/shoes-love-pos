export interface OrderDetail {
    id: string;
    amount: number;
    customer: string;
}

export interface ServiceBreakdown {
    name: string;
    total: number;
    orders?: OrderDetail[];
}

export interface PaymentBreakdown {
    method: 'Бэлэн' | 'Карт' | 'QR / QPay';
    count: number;
    total: number;
    services: {
        Gutal: ServiceBreakdown;
        Chemical: ServiceBreakdown;
        Carpet: ServiceBreakdown;
    };
}

export const mockCashReportData: PaymentBreakdown[] = [
    {
        method: 'Бэлэн',
        count: 12,
        total: 352300,
        services: {
            Gutal: {
                name: 'Гутал',
                total: 352300,
                orders: [
                    { id: 'ORD-2025-0012', amount: 23900, customer: 'Бат' },
                    { id: 'ORD-2025-0018', amount: 43900, customer: 'Гэрэл' },
                    { id: 'ORD-2025-0021', amount: 69900, customer: 'Болд' },
                    { id: 'ORD-2025-0025', amount: 214600, customer: 'Ану' },
                ]
            },
            Chemical: { name: 'Хими цэвэрлэгээ', total: 0 },
            Carpet: { name: 'Хивс цэвэрлэгээ', total: 0 },
        }
    },
    {
        method: 'Карт',
        count: 8,
        total: 1120000,
        services: {
            Gutal: {
                name: 'Гутал',
                total: 850000,
                orders: [
                    { id: 'ORD-2025-0030', amount: 450000, customer: 'Дулмаа' },
                    { id: 'ORD-2025-0035', amount: 400000, customer: 'Төмөр' },
                ]
            },
            Chemical: {
                name: 'Хими цэвэрлэгээ',
                total: 270000,
                orders: [
                    { id: 'ORD-2025-0040', amount: 270000, customer: 'Сараа' },
                ]
            },
            Carpet: { name: 'Хивс цэвэрлэгээ', total: 0 },
        }
    },
    {
        method: 'QR / QPay',
        count: 5,
        total: 580000,
        services: {
            Gutal: { name: 'Гутал', total: 0 },
            Chemical: { name: 'Хими цэвэрлэгээ', total: 0 },
            Carpet: {
                name: 'Хивс цэвэрлэгээ',
                total: 580000,
                orders: [
                    { id: 'ORD-2025-0050', amount: 580000, customer: 'Энхээ' },
                ]
            },
        }
    }
];
