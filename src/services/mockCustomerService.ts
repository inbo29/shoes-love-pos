export interface Customer {
    phone: string;
    name: string;
    address: string;
    membershipType: 'Энгийн' | 'VIP' | 'Байгууллага';
}

// Mock customer database
const mockCustomers: Customer[] = [
    {
        phone: '99119911',
        name: 'Батбаяр',
        address: 'Баянзүрх дүүрэг, 12-р хороо',
        membershipType: 'VIP'
    },
    {
        phone: '88888888',
        name: 'Сарангэрэл',
        address: 'Сүхбаатар дүүрэг, 1-р хороо',
        membershipType: 'Энгийн'
    },
    {
        phone: '77777777',
        name: 'Төгөлдөр ХХК',
        address: 'Хан-Уул дүүрэг, 5-р хороо',
        membershipType: 'Байгууллага'
    }
];

/**
 * Lookup customer by phone number
 * Returns customer if found, null if not found (non-member)
 */
export const lookupCustomerByPhone = (phone: string): Customer | null => {
    // Remove any formatting characters
    const cleanPhone = phone.replace(/[-\s]/g, '');

    const customer = mockCustomers.find(c => c.phone === cleanPhone);
    return customer || null;
};
