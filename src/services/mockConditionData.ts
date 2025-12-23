// Mock condition data for Step 4 item condition recording

export interface ConditionOption {
    id: number;
    label: string;
    color?: string; // for color options
}

export interface ItemConditionGroup {
    category: 'Гутал' | 'Хими' | 'Хивс';
    groupCode: number;
    groupName: string;
    multiSelect: boolean;
    fieldType: 'chip' | 'color' | 'button' | 'dropdown' | 'checkbox';
    options: ConditionOption[];
    warning?: boolean; // for УДӨ/Гарах өөрчлөлт
}

// Гутал (Shoes) Condition Groups
export const gutalConditionGroups: ItemConditionGroup[] = [
    {
        category: 'Гутал',
        groupCode: 1,
        groupName: 'Загвар',
        multiSelect: false,
        fieldType: 'chip',
        options: [
            { id: 1, label: 'Спорт' },
            { id: 2, label: 'Арьсан' },
            { id: 3, label: 'Илгэн' },
            { id: 4, label: 'Даавуун' },
            { id: 5, label: 'Гутлын түрий' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 2,
        groupName: 'Өнгө',
        multiSelect: false,
        fieldType: 'color',
        options: [
            { id: 1, label: 'Хар', color: '#000000' },
            { id: 2, label: 'Цагаан', color: '#FFFFFF' },
            { id: 3, label: 'Саарал', color: '#6B7280' },
            { id: 4, label: 'Улаан', color: '#EF4444' },
            { id: 5, label: 'Цэнхэр', color: '#3B82F6' },
            { id: 6, label: 'Шар', color: '#FACC15' },
            { id: 7, label: 'Ногоон', color: '#22C55E' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 3,
        groupName: 'Хэмжээ',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: '35-36' },
            { id: 2, label: '37-38' },
            { id: 3, label: '39-40' },
            { id: 4, label: '41-42' },
            { id: 5, label: '43-44' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 4,
        groupName: 'Материал',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Арьс' },
            { id: 2, label: 'Илгэн' },
            { id: 3, label: 'Даавуу' },
            { id: 4, label: 'Нийлэг' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 5,
        groupName: 'Төрөл',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Эмэгтэй' },
            { id: 2, label: 'Эрэгтэй' },
            { id: 3, label: 'Хүүхдийн' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 6,
        groupName: 'Брэндийн нэр',
        multiSelect: false,
        fieldType: 'dropdown', // Simplified for now, in UI it's an input
        options: []
    },
    {
        category: 'Гутал',
        groupCode: 7,
        groupName: 'Элэгдэл',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Шинэ' },
            { id: 2, label: 'Бага зэрэг' },
            { id: 3, label: 'Дунд зэрэг' },
            { id: 4, label: 'Их' },
            { id: 5, label: 'Маш их' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 8,
        groupName: 'Толбо',
        multiSelect: true,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Байхгүй' },
            { id: 2, label: 'Тос' },
            { id: 3, label: 'Цус' },
            { id: 4, label: 'Бэх' },
            { id: 5, label: 'Бусад' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 9,
        groupName: 'Гэмтэл',
        multiSelect: true,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Ул ханзарсан' },
            { id: 2, label: 'Оёдол задарсан' },
            { id: 3, label: 'Дотор урагдсан' },
            { id: 4, label: 'Үдээс тасарсан' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 10,
        groupName: 'УДӨ',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Тийм' },
            { id: 2, label: 'Үгүй' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 11,
        groupName: 'Будах өнгө',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Хар' },
            { id: 2, label: 'Хүрэн' },
            { id: 3, label: 'Цэнхэр' },
            { id: 4, label: 'Эх өнгөөр' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 12,
        groupName: 'Үйлчилгээний дараах байдал',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Хэвийн' },
            { id: 2, label: 'Өөрчлөгдөх магадлалтай' },
        ]
    },
    {
        category: 'Гутал',
        groupCode: 13,
        groupName: 'Нэмэлт нөхцөлүүд',
        multiSelect: true,
        fieldType: 'checkbox',
        options: [
            { id: 1, label: 'Рант хагарсан' },
            { id: 2, label: 'Утас ховорсон' },
            { id: 3, label: 'Улны резин сэтэрсэн' },
            { id: 4, label: 'Зүсэгдсэн' },
        ]
    }
];

// Хими (Chemical) Condition Groups
export const himiConditionGroups: ItemConditionGroup[] = [
    {
        category: 'Хими',
        groupCode: 1,
        groupName: 'Загвар',
        multiSelect: false,
        fieldType: 'chip',
        options: [
            { id: 1, label: 'Эр' },
            { id: 2, label: 'Эм' },
            { id: 3, label: 'Хүүхэд' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 2,
        groupName: 'Өнгө',
        multiSelect: false,
        fieldType: 'color',
        options: [
            { id: 1, label: 'Хар', color: '#000000' },
            { id: 2, label: 'Цагаан', color: '#FFFFFF' },
            { id: 3, label: 'Саарал', color: '#808080' },
            { id: 4, label: 'Улаан', color: '#FF0000' },
            { id: 5, label: 'Хөх', color: '#0000FF' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 3,
        groupName: 'Хэмжээ',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Жижиг' },
            { id: 2, label: 'Дунд' },
            { id: 3, label: 'Том' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 4,
        groupName: 'Материал',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Даавуу' },
            { id: 2, label: 'Арьс' },
            { id: 3, label: 'Холимог' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 5,
        groupName: 'Төрөл',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Цүнх' },
            { id: 2, label: 'Куртка' },
            { id: 3, label: 'Пальто' },
            { id: 4, label: 'Өмд' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 6,
        groupName: 'Элэгдэл',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: '10%' },
            { id: 2, label: '30%' },
            { id: 3, label: '50%' },
            { id: 4, label: '70%' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 7,
        groupName: 'Толбо',
        multiSelect: true,
        fieldType: 'checkbox',
        options: [
            { id: 1, label: 'Рок согдоох' },
            { id: 2, label: 'Үнэр' },
            { id: 3, label: 'Өөөс' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 8,
        groupName: 'Гэмтэл',
        multiSelect: true,
        fieldType: 'checkbox',
        options: [
            { id: 1, label: 'Урагдсан' },
            { id: 2, label: 'Товч алга' },
            { id: 3, label: 'Зипп эвдрэлтэй' },
        ]
    },
    {
        category: 'Хими',
        groupCode: 9,
        groupName: 'Гарах өөрчлөлт',
        multiSelect: true,
        fieldType: 'checkbox',
        warning: true,
        options: [
            { id: 1, label: 'Өнгө баллах' },
            { id: 2, label: 'Агшилт' },
        ]
    },
];

// Хивс (Carpet) Condition Groups
export const hivsConditionGroups: ItemConditionGroup[] = [
    {
        category: 'Хивс',
        groupCode: 1,
        groupName: 'Өнгө',
        multiSelect: false,
        fieldType: 'color',
        options: [
            { id: 1, label: 'Улаан', color: '#FF0000' },
            { id: 2, label: 'Хөх', color: '#0000FF' },
            { id: 3, label: 'Ногоон', color: '#00FF00' },
            { id: 4, label: 'Саарал', color: '#808080' },
        ]
    },
    {
        category: 'Хивс',
        groupCode: 2,
        groupName: 'Материал',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Ноос' },
            { id: 2, label: 'Синтетик' },
            { id: 3, label: 'Холимог' },
        ]
    },
    {
        category: 'Хивс',
        groupCode: 3,
        groupName: 'Ялгарах шинж',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: 'Хээтэй' },
            { id: 2, label: 'Хээгүй' },
        ]
    },
    {
        category: 'Хивс',
        groupCode: 4,
        groupName: 'Элэгдэл',
        multiSelect: false,
        fieldType: 'button',
        options: [
            { id: 1, label: '20%' },
            { id: 2, label: '40%' },
            { id: 3, label: '60%' },
            { id: 4, label: '80%' },
        ]
    },
    {
        category: 'Хивс',
        groupCode: 5,
        groupName: 'Толбо',
        multiSelect: true,
        fieldType: 'checkbox',
        options: [
            { id: 1, label: 'Шороо' },
            { id: 2, label: 'Үнэр' },
            { id: 3, label: 'Өвс' },
        ]
    },
    {
        category: 'Хивс',
        groupCode: 6,
        groupName: 'Гэмтэл',
        multiSelect: true,
        fieldType: 'checkbox',
        options: [
            { id: 1, label: 'Урагдсан' },
            { id: 2, label: 'Зүсэгдсэн' },
        ]
    },
    {
        category: 'Хивс',
        groupCode: 7,
        groupName: 'Гарах өөрчлөлт',
        multiSelect: true,
        fieldType: 'checkbox',
        warning: true,
        options: [
            { id: 1, label: 'Өнгө баллах' },
        ]
    },
];

export const conditionGroupsByCategory: Record<string, ItemConditionGroup[]> = {
    'Гутал': gutalConditionGroups,
    'Хими': himiConditionGroups,
    'Хивс': hivsConditionGroups,
};
