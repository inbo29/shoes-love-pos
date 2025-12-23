export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: 'Ирсэн' | 'Тарсан' | 'Бүртгэгдээгүй';
}

export const mockAttendanceData: AttendanceRecord[] = [
    {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'Б.Болд',
        date: '2023.10.27',
        checkInTime: '09:02:15',
        checkOutTime: '18:01:22',
        status: 'Тарсан'
    },
    {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Б.Сараа',
        date: '2023.10.27',
        checkInTime: '09:05:30',
        status: 'Ирсэн'
    },
    {
        id: '3',
        employeeId: 'EMP001',
        employeeName: 'Б.Болд',
        date: '2023.10.26',
        checkInTime: '08:50:10',
        checkOutTime: '18:05:00',
        status: 'Тарсан'
    },
    {
        id: '4',
        employeeId: 'EMP002',
        employeeName: 'Б.Сараа',
        date: '2023.10.26',
        checkInTime: '08:55:00',
        checkOutTime: '18:00:05',
        status: 'Тарсан'
    }
];
