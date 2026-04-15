export type RefundMethod = 'cash' | 'bank_transfer';

export interface RefundItem {
    productId: string;
    name: string;
    price: number;
    salePrice?: number;
    originalQuantity: number;
    refundQuantity: number;
    selected: boolean;
}

export interface BankTransferInfo {
    accountNumber: string;
    phone: string;
    memo?: string;
}

export const unitPrice = (item: { price: number; salePrice?: number }) =>
    item.salePrice ?? item.price;

export const refundLineTotal = (item: RefundItem) =>
    unitPrice(item) * item.refundQuantity;

export const calcRefundTotal = (items: RefundItem[]) =>
    items.filter(i => i.selected).reduce((sum, i) => sum + refundLineTotal(i), 0);
