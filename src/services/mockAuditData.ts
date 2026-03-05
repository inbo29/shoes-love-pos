export type AuditStatus = 'Процесс' | 'Түр хадгалсан' | 'Дууссан';
export type AuditType = 'Үлдэгдэлтэй бараа' | 'Бүх бараа';

export interface AuditItem {
    productId: string;
    productCode: string;
    barcode?: string;
    productName: string;
    unit: string;
    systemQty: number;
    actualQty: number;
    diffQty: number;
    price: number;
    diffAmount: number;
    expiryDate?: string;
    highlight?: 'scan' | 'manual' | null;
}

export interface Audit {
    id: string;
    date: string;
    branchName: string;
    type: AuditType;
    totalProducts: number;
    totalDiffQty: number;
    totalDiffAmount: number;
    status: AuditStatus;
    manager: string;
    staff?: string;
    items?: AuditItem[];
    notes?: string;
    doneAt?: string;
    doneBy?: string;
    diffSummary?: {
        systemQtyTotal: number;
        countedQtyTotal: number;
        diffQtyTotal: number;
        diffAmountTotal: number;
    };
}

export const mockAudits: Audit[] = [
    {
        id: 'AD-202401-001',
        date: '2024-01-02',
        branchName: 'Төв салбар',
        type: 'Бүх бараа',
        totalProducts: 125,
        totalDiffQty: -3,
        totalDiffAmount: -45000,
        status: 'Дууссан',
        manager: 'Админ',
        doneAt: '2024-01-02T15:30:00Z',
        doneBy: 'Админ',
        diffSummary: {
            systemQtyTotal: 128,
            countedQtyTotal: 125,
            diffQtyTotal: -3,
            diffAmountTotal: -45000
        },
        items: []
    },
    {
        id: 'AD-202401-002',
        date: '2024-01-05',
        branchName: 'Салбар 1',
        type: 'Үлдэгдэлтэй бараа',
        totalProducts: 45,
        totalDiffQty: 1,
        totalDiffAmount: 12900,
        status: 'Түр хадгалсан',
        manager: 'Ажилтан 1',
        items: [
            {
                productId: 'PROD-001',
                productCode: 'PROD-001',
                productName: 'Runa зөөлрүүлэгчтэй угаалгын шингэн ph7.5',
                unit: 'ш',
                systemQty: 10,
                actualQty: 11,
                diffQty: 1,
                price: 12900,
                diffAmount: 12900
            }
        ]
    },
    {
        id: 'AD-202401-003',
        date: '2024-01-07',
        branchName: 'Төв салбар',
        type: 'Бүх бараа',
        totalProducts: 8,
        totalDiffQty: 0,
        totalDiffAmount: 0,
        status: 'Процесс',
        manager: 'Админ',
        items: []
    }
];
