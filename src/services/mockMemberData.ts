export interface MemberCard {
    cardNo: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    birthDate?: string;
    discountRate: number;
    isActive: boolean;
}

export const initialMemberCards: MemberCard[] = [
    {
        cardNo: 'MEM-10023',
        name: 'Бат-Эрдэнэ Болд',
        phone: '9911-2233',
        email: 'bold@example.com',
        birthDate: '1990.05.15',
        discountRate: 5,
        isActive: true,
        address: 'Улаанбаатар, Сүхбаатар дүүрэг...'
    },
    {
        cardNo: 'MEM-10024',
        name: 'Сарангэрэл Туяа',
        phone: '8800-5566',
        email: 'saraa@example.com',
        birthDate: '1995.12.01',
        discountRate: 3,
        isActive: true
    },
    {
        cardNo: 'MEM-10025',
        name: 'Ганзориг Дорж',
        phone: '9191-7788',
        email: 'ganzo@example.com',
        birthDate: '1988.03.22',
        discountRate: 10,
        isActive: false
    },
    {
        cardNo: 'MEM-10026',
        name: 'Алтанцэцэг Баяр',
        phone: '9988-1122',
        email: 'alta@example.com',
        birthDate: '1992.08.10',
        discountRate: 5,
        isActive: true
    }
];
