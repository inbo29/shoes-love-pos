import { mockProducts } from './mockProductData';

export interface InventoryItem {
    branchId: string;
    branchName: string;
    productCode: string;
    productName: string;
    barcode: string;
    unit: string;
    productType: string;
    onHandQty: number;
    availableQty: number;
    reserveQty: number;
    orderableQty: number;
    cost: number;
}

const branches = [
    { id: 'BR-001', name: 'Төв салбар' },
    { id: 'BR-002', name: 'Салбар 1' },
    { id: 'BR-003', name: 'Салбар 2' },
];

const units = ['ш', 'кг', 'л', 'м'];
const types = ['Бараа', 'Хангамж'];

export const mockInventoryData: InventoryItem[] = [];

branches.forEach(branch => {
    mockProducts.forEach(product => {
        const onHand = Math.floor(Math.random() * 100) - 5; // Some negative for testing
        const reserve = Math.floor(Math.random() * 10);
        const available = onHand - reserve;
        const orderable = Math.max(0, available);

        mockInventoryData.push({
            branchId: branch.id,
            branchName: branch.name,
            productCode: product.id,
            productName: product.name,
            barcode: `865${Math.floor(100000000 + Math.random() * 900000000)}`,
            unit: units[Math.floor(Math.random() * units.length)],
            productType: types[Math.floor(Math.random() * types.length)],
            onHandQty: onHand,
            availableQty: available,
            reserveQty: reserve,
            orderableQty: orderable,
            cost: product.price * onHand
        });
    });
});
