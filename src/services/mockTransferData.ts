export type TransferStatus = 'Бэлтгэж байна' | 'Шилжүүлсэн' | 'Хүлээн авсан' | 'Цуцалсан';
export type TransferType = 'Хийх' | 'Авах';

export interface TransferItem {
    productId: string;
    productCode: string;
    productName: string;
    sentQty: number;
    receivedQty: number;
}

export interface Transfer {
    id: string;
    date: string;
    fromBranch: string;
    toBranch: string;
    totalQty: number;
    totalItems: number;
    type: TransferType;
    status: TransferStatus;
    staff: string;
    items: TransferItem[];
    notes?: string;
}

export const mockTransfers: Transfer[] = [
    {
        id: 'TR-1001',
        date: '2024-01-05',
        fromBranch: 'Төв салбар',
        toBranch: 'Салбар 1',
        totalQty: 10,
        totalItems: 2,
        type: 'Хийх',
        status: 'Хүлээн авсан',
        staff: 'Админ',
        items: [
            { productId: 'PROD-001', productCode: 'PROD-001', productName: 'Runa зөөлрүүлэгчтэй угаалгын шингэн ph7.5', sentQty: 5, receivedQty: 5 },
            { productId: 'PROD-002', productCode: 'PROD-002', productName: 'Гутал угаах тусгай ши잉эн 500 мл', sentQty: 5, receivedQty: 5 },
        ]
    },
    {
        id: 'TR-1002',
        date: '2024-01-06',
        fromBranch: 'Төв салбар',
        toBranch: 'Салбар 2',
        totalQty: 15,
        totalItems: 3,
        type: 'Хийх',
        status: 'Шилжүүлсэн',
        staff: 'Админ',
        items: [
            { productId: 'PROD-003', productCode: 'PROD-003', productName: 'Гутал угаах шингэн 300 мл', sentQty: 5, receivedQty: 0 },
            { productId: 'PROD-004', productCode: 'PROD-004', productName: 'Гутал угаах концентрат 250 мл', sentQty: 5, receivedQty: 0 },
            { productId: 'PROD-005', productCode: 'PROD-005', productName: 'Гутал угаах зөөлөн шингэн 1 л', sentQty: 5, receivedQty: 0 },
        ]
    },
    {
        id: 'TR-1003',
        date: '2024-01-07',
        fromBranch: 'Салбар 1',
        toBranch: 'Төв салбар',
        totalQty: 5,
        totalItems: 1,
        type: 'Авах',
        status: 'Шилжүүлсэн',
        staff: 'Ажилтан',
        items: [
            { productId: 'PROD-006', productCode: 'PROD-006', productName: 'Гутлын тос Dubbin 100 гр', sentQty: 5, receivedQty: 0 },
        ]
    },
    {
        id: 'TR-1004',
        date: '2024-01-07',
        fromBranch: 'Салбар 2',
        toBranch: 'Төв салбар',
        totalQty: 2,
        totalItems: 1,
        type: 'Авах',
        status: 'Бэлтгэж байна',
        staff: 'Ажилтан',
        items: [
            { productId: 'PROD-007', productCode: 'PROD-007', productName: 'Гутлын багс 01', sentQty: 2, receivedQty: 0 },
        ]
    }
];
