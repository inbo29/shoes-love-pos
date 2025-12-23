export type OrderStatusCode = '0' | 'A' | 'B';

export interface OrderStatus {
    code: OrderStatusCode;
    value: number;
    label: string;
    colorClass: string;
}

export const ORDER_STATUSES: Record<OrderStatusCode, OrderStatus> = {
    '0': { code: '0', value: 0, label: 'Захиалж байна', colorClass: 'bg-gray-100 text-gray-500' },
    'A': { code: 'A', value: 1, label: 'Захиалсан', colorClass: 'bg-blue-100 text-blue-600' },
    'B': { code: 'B', value: 2, label: 'Хүлээлгэн өгсөн', colorClass: 'bg-green-100 text-green-600' },
};

export type ItemStatusCode = 'OR' | 'LO' | 'RE' | 'CH' | '4' | '5' | '6' | '7' | '8' | 'R' | 'RG' | 'L';

export interface ItemStatus {
    code: ItemStatusCode;
    value: number;
    label: string;
    colorClass: string;
}

export const ITEM_STATUSES: Record<ItemStatusCode, ItemStatus> = {
    'OR': { code: 'OR', value: 0, label: 'Захиалсан', colorClass: 'bg-gray-100 text-gray-400' },
    'LO': { code: 'LO', value: 1, label: 'Ачилт хийсэн', colorClass: 'bg-sky-100 text-sky-500' },
    'RE': { code: 'RE', value: 2, label: 'Хүлээж авсан', colorClass: 'bg-sky-100 text-sky-500' },
    'CH': { code: 'CH', value: 3, label: 'Шалгасан', colorClass: 'bg-blue-100 text-blue-500' },
    '4': { code: '4', value: 4, label: 'Нэгтгэсэн', colorClass: 'bg-blue-100 text-blue-500' },
    '5': { code: '5', value: 5, label: 'Бүрэн ачилт хийсэн', colorClass: 'bg-blue-100 text-blue-500' },
    '6': { code: '6', value: 6, label: 'Бүрэн хүлээн авсан', colorClass: 'bg-blue-100 text-blue-500' },
    '7': { code: '7', value: 7, label: 'Буцаасан', colorClass: 'bg-red-100 text-red-500' },
    '8': { code: '8', value: 8, label: 'Буцаалт хүлээж авсан', colorClass: 'bg-red-100 text-red-500' },
    'R': { code: 'R', value: 9, label: 'Олгосон', colorClass: 'bg-green-100 text-green-500' },
    'RG': { code: 'RG', value: 10, label: 'Буцаалт олгосон', colorClass: 'bg-green-100 text-green-500' },
    'L': { code: 'L', value: 22, label: 'Дутагдал', colorClass: 'bg-red-100 text-red-500' },
};
