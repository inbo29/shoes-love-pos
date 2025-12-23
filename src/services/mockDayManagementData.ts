export interface DayRecord {
    id: string;
    date: string;
    openTime?: string;
    closeTime?: string;
    employeeName: string;
    status: 'Нээлттэй' | 'Хаагдсан';
}

export const mockDayManagementData: DayRecord[] = [
    {
        id: '1',
        date: '2023.10.27',
        openTime: '08:45:12',
        employeeName: 'Б.Болд (Manager)',
        status: 'Нээлттэй'
    },
    {
        id: '2',
        date: '2023.10.26',
        openTime: '08:50:30',
        closeTime: '18:10:05',
        employeeName: 'Б.Сараа (Cashier)',
        status: 'Хаагдсан'
    },
    {
        id: '3',
        date: '2023.10.25',
        openTime: '08:55:00',
        closeTime: '18:05:00',
        employeeName: 'Б.Болд (Manager)',
        status: 'Хаагдсан'
    },
    {
        id: '4',
        date: '2023.10.24',
        openTime: '08:42:15',
        closeTime: '18:00:00',
        employeeName: 'А.Туяа (Cashier)',
        status: 'Хаагдсан'
    }
];
