// Mock service data with Item-Type-Service hierarchy

export type ItemType = 'SHOES' | 'BAG' | 'CLOTH' | 'FELT' | 'ACCESSORY' | 'VIP' | 'PACKAGE';

export interface ServiceDetail {
    code: string;
    descr: string;
    price: number;
    makeDay: number;
    orderType: 'N' | 'V' | number;
}

export interface ServiceType {
    id: string;
    name: string;
    icon: string;
    details: ServiceDetail[];
}

export interface ItemData {
    itemType: ItemType;
    label: string;
    types: ServiceType[];
}

// SHOES Item
const shoesData: ItemData = {
    itemType: 'SHOES',
    label: 'Гутал',
    types: [
        {
            id: 'wash',
            name: 'Угаах',
            icon: 'water_drop',
            details: [
                { code: 'SH_WASH_SHORT', descr: 'Угаах гутал богино', price: 23900, makeDay: 4, orderType: 'N' },
                { code: 'SH_WASH_MID', descr: 'Угаах гутал дунд', price: 28900, makeDay: 4, orderType: 'N' },
                { code: 'SH_WASH_LONG', descr: 'Угаах гутал урт', price: 33900, makeDay: 5, orderType: 'N' },
                { code: 'SH_WASH_KIDS_SHORT', descr: 'Угаах хүүхдийн гутал богино', price: 18900, makeDay: 3, orderType: 'N' },
                { code: 'SH_WASH_LEATHER', descr: 'Угаах нэхий гутал', price: 35900, makeDay: 5, orderType: 'N' },
                { code: 'SH_WASH_SPORT_FABRIC', descr: 'Угаах спорт пүүз даавуун', price: 19900, makeDay: 3, orderType: 'N' },
                { code: 'SH_WASH_SPORT_LEATHER', descr: 'Угаах спорт пүүз арьс', price: 25900, makeDay: 4, orderType: 'N' },
                { code: 'SH_WASH_UGG', descr: 'UGG нэхий углааш', price: 45900, makeDay: 5, orderType: 'N' },
                { code: 'SH_WASH_FELT', descr: 'Эсгий гутал угаах', price: 29900, makeDay: 4, orderType: 'N' },
                { code: 'SH_WASH_MONGOL', descr: 'Угаах Монгол гутал оймстой', price: 39900, makeDay: 5, orderType: 'N' },
                { code: 'SH_WASH_MOTOR', descr: 'Угаах Мотоциклийн гутал', price: 42900, makeDay: 5, orderType: 'N' },
            ]
        },
        {
            id: 'extra',
            name: 'Нэмэлт',
            icon: 'add_circle',
            details: [
                { code: 'SH_DEEP_CLEAN', descr: 'Гүн хиртэлт ихтэй гутлын нэмэлт', price: 15900, makeDay: 1, orderType: 'N' },
                { code: 'SH_ANTIBAC', descr: 'Бактер устгах', price: 8900, makeDay: 1, orderType: 'N' },
                { code: 'SH_POLISH', descr: 'Гутал тосолгоо богино', price: 12900, makeDay: 1, orderType: 'N' },
            ]
        },
        {
            id: 'repair',
            name: 'Засвар',
            icon: 'handyman',
            details: [
                { code: 'SH_PATCH_SMALL', descr: 'Наах жижиг', price: 15900, makeDay: 2, orderType: 'N' },
                { code: 'SH_PATCH_FULL', descr: 'Наах бүтэн', price: 25900, makeDay: 3, orderType: 'N' },
                { code: 'SH_HEEL_DIRECT', descr: 'Түрий тайрах шууд', price: 18900, makeDay: 2, orderType: 'N' },
                { code: 'SH_HEEL_PADDING', descr: 'Түрий тайрах имжээртэй', price: 22900, makeDay: 2, orderType: 'N' },
                { code: 'SH_HEEL_REMOVE', descr: 'Түрий хасах', price: 12900, makeDay: 1, orderType: 'N' },
                { code: 'SH_INSOLE_ATTACH', descr: 'Өсгий тайрах', price: 16900, makeDay: 2, orderType: 'N' },
                { code: 'SH_INSOLE_FIX', descr: 'Унасан өсгий тогтоох', price: 14900, makeDay: 2, orderType: 'N' },
                { code: 'SH_SOLE_CRACK', descr: 'Хагарсан ул засах', price: 29900, makeDay: 3, orderType: 'N' },
                { code: 'SH_TOE_SPRING', descr: 'Хоншоор тайрах хавар', price: 19900, makeDay: 2, orderType: 'N' },
                { code: 'SH_TOE_WINTER', descr: 'Хоншоор тайрах өвөл', price: 24900, makeDay: 3, orderType: 'N' },
            ]
        },
        {
            id: 'sew',
            name: 'Оёх',
            icon: 'content_cut',
            details: [
                { code: 'SH_SEW_PATCH_SINGLE', descr: 'Нөхөөс өрөөсөн', price: 12900, makeDay: 2, orderType: 'N' },
                { code: 'SH_SEW_PATCH_PAIR', descr: 'Нөхөөс хос', price: 22900, makeDay: 3, orderType: 'N' },
                { code: 'SH_SEW_PATCH_4', descr: 'Нөхөөс 4 тал', price: 39900, makeDay: 4, orderType: 'N' },
                { code: 'SH_SEW_ZIPPER_IN', descr: 'Нөхөөс зуузай дотор', price: 16900, makeDay: 2, orderType: 'N' },
                { code: 'SH_SEW_ZIPPER_OUT', descr: 'Нөхөөс зуузай гадна', price: 18900, makeDay: 2, orderType: 'N' },
                { code: 'SH_SEW_THREAD', descr: 'Оёдлоор оёх', price: 14900, makeDay: 2, orderType: 'N' },
                { code: 'SH_SEW_WRAP', descr: 'Ул тойруулж оёх', price: 24900, makeDay: 3, orderType: 'N' },
            ]
        },
        {
            id: 'sole',
            name: 'Ул / Өсгий',
            icon: 'layers',
            details: [
                { code: 'SH_SOLE_TOPY', descr: 'Өсгий резин topy', price: 35900, makeDay: 3, orderType: 'N' },
                { code: 'SH_SOLE_VIBRAM', descr: 'Өсгий резин vibram', price: 45900, makeDay: 3, orderType: 'N' },
                { code: 'SH_SOLE_KOREA', descr: 'Өсгий резин солонгос', price: 29900, makeDay: 3, orderType: 'N' },
                { code: 'SH_HIGH_TOPY', descr: 'Өлмий резин topy', price: 42900, makeDay: 3, orderType: 'N' },
                { code: 'SH_HIGH_VIBRAM', descr: 'Өлмий резин vibram', price: 52900, makeDay: 4, orderType: 'N' },
                { code: 'SH_SIDE_RUBBER', descr: 'Хажуу резин', price: 18900, makeDay: 2, orderType: 'N' },
                { code: 'SH_FULL_SOLE', descr: 'Бүтэн улалгаа', price: 65900, makeDay: 5, orderType: 'N' },
            ]
        },
        {
            id: 'paint',
            name: 'Будах',
            icon: 'brush',
            details: [
                { code: 'SH_PAINT_SHORT', descr: 'Арьс илгэн гутал будах богино', price: 35900, makeDay: 4, orderType: 'N' },
                { code: 'SH_PAINT_MID', descr: 'Арьс илгэн гутал будах дунд', price: 45900, makeDay: 5, orderType: 'N' },
                { code: 'SH_PAINT_LONG', descr: 'Арьс илгэн гутал будах урт', price: 55900, makeDay: 6, orderType: 'N' },
                { code: 'SH_COLOR_CHANGE', descr: 'Өнгө өөрчилж будах', price: 65900, makeDay: 6, orderType: 'N' },
                { code: 'SH_POLISH_BRUSH', descr: 'Боронзоор будах', price: 29900, makeDay: 3, orderType: 'N' },
                { code: 'SH_LEATHER_RESTORE', descr: 'Илгэн гутал сэргээх', price: 49900, makeDay: 5, orderType: 'N' },
                { code: 'SH_SCRATCH_FIX', descr: 'Шарх нөхөх', price: 19900, makeDay: 2, orderType: 'N' },
            ]
        },
        {
            id: 'vip',
            name: 'VIP',
            icon: 'star',
            details: [
                { code: 'SH_VIP_WASH_SHORT', descr: 'VIP Гутал угаалга богино', price: 69900, makeDay: 3, orderType: 'V' },
                { code: 'SH_VIP_WASH_MID', descr: 'VIP Гутал угаалга дунд', price: 79900, makeDay: 3, orderType: 'V' },
                { code: 'SH_VIP_WASH_LONG', descr: 'VIP Гутал угаалга урт', price: 89900, makeDay: 4, orderType: 'V' },
                { code: 'SH_VIP_WASH_KIDS', descr: 'VIP Гутал угаалга хүүхэд', price: 59900, makeDay: 3, orderType: 'V' },
                { code: 'SH_VIP_PAINT', descr: 'VIP гутал будах', price: 99900, makeDay: 5, orderType: 'V' },
            ]
        },
    ]
};

// BAG Item
const bagData: ItemData = {
    itemType: 'BAG',
    label: 'Цүнх',
    types: [
        {
            id: 'repair',
            name: 'Засвар',
            icon: 'handyman',
            details: [
                { code: 'BAG_ZIPPER', descr: 'Цүнхний цахилгаан солих', price: 22900, makeDay: 3, orderType: 'N' },
                { code: 'BAG_LINING_SINGLE', descr: 'Цүнхний дотор солих дан', price: 35900, makeDay: 4, orderType: 'N' },
                { code: 'BAG_LINING_MULTI', descr: 'Цүнхний дотор солих олон тасалгаатай', price: 49900, makeDay: 5, orderType: 'N' },
                { code: 'BAG_STRAP_LEATHER', descr: 'Цүнхний оосор солих арьсаар', price: 32900, makeDay: 4, orderType: 'N' },
                { code: 'BAG_STRAP_READY', descr: 'Цүнхний оосор солих бэлэн', price: 18900, makeDay: 2, orderType: 'N' },
            ]
        },
        {
            id: 'sew',
            name: 'Оёх',
            icon: 'content_cut',
            details: [
                { code: 'BAG_SEW_1SIDE', descr: 'Арьс барьж оёх 1 тал', price: 15900, makeDay: 2, orderType: 'N' },
                { code: 'BAG_SEW_2SIDE', descr: 'Арьс барьж оёх 2 тал', price: 28900, makeDay: 3, orderType: 'N' },
                { code: 'BAG_SEW_3SIDE', descr: 'Арьс барьж оёх 3 тал', price: 39900, makeDay: 4, orderType: 'N' },
                { code: 'BAG_SEW_4SIDE', descr: 'Арьс барьж оёх 4 тал', price: 49900, makeDay: 5, orderType: 'N' },
                { code: 'BAG_PADDING', descr: 'Нөхөөс оруулга хийх', price: 25900, makeDay: 3, orderType: 'N' },
            ]
        },
        {
            id: 'paint',
            name: 'Будах',
            icon: 'brush',
            details: [
                { code: 'BAG_PAINT_SMALL', descr: 'Цүнх будах жижиг', price: 45900, makeDay: 4, orderType: 'N' },
                { code: 'BAG_PAINT_LARGE', descr: 'Цүнх будах том', price: 65900, makeDay: 5, orderType: 'N' },
                { code: 'BAG_EDGE_1CM', descr: 'Цүнхний хөвөө будах 1см', price: 12900, makeDay: 2, orderType: 'N' },
                { code: 'BAG_EDGE_2_10CM', descr: 'Цүнхний хөвөө будах 2-10см', price: 24900, makeDay: 3, orderType: 'N' },
                { code: 'BAG_LEATHER_RESTORE', descr: 'Илгэн цүнх сэргээх', price: 55900, makeDay: 5, orderType: 'N' },
            ]
        },
        {
            id: 'extra',
            name: 'Нэмэлт',
            icon: 'add_circle',
            details: [
                { code: 'BAG_WASH', descr: 'Цүнх угаах', price: 39900, makeDay: 4, orderType: 'N' },
                { code: 'BAG_CLEAN', descr: 'Цүнх цэвэрлэх', price: 29900, makeDay: 3, orderType: 'N' },
            ]
        },
    ]
};

// CLOTH Item
const clothData: ItemData = {
    itemType: 'CLOTH',
    label: 'Хувцас',
    types: [
        {
            id: 'paint',
            name: 'Будах',
            icon: 'brush',
            details: [
                { code: 'CLOTH_JACKET', descr: 'Савхин өмд будах', price: 45900, makeDay: 5, orderType: 'N' },
                { code: 'CLOTH_FABRIC', descr: 'Даавуун хувцас будах', price: 35900, makeDay: 4, orderType: 'N' },
                { code: 'CLOTH_RESTORE', descr: 'Даавуун хувцасны өнгө сэргээх', price: 29900, makeDay: 3, orderType: 'N' },
            ]
        },
        {
            id: 'repair',
            name: 'Засвар',
            icon: 'handyman',
            details: [
                { code: 'CLOTH_SEW', descr: 'Хувцас оёх', price: 18900, makeDay: 2, orderType: 'N' },
                { code: 'CLOTH_PATCH', descr: 'Хувцас засах', price: 22900, makeDay: 3, orderType: 'N' },
            ]
        },
    ]
};

// Service data grouped by item type
export const serviceDataByItem: Record<ItemType, ItemData> = {
    'SHOES': shoesData,
    'BAG': bagData,
    'CLOTH': clothData,
    'FELT': { itemType: 'FELT', label: 'Эсгий', types: [] },
    'ACCESSORY': { itemType: 'ACCESSORY', label: 'Бусад', types: [] },
    'VIP': { itemType: 'VIP', label: 'VIP', types: [] },
    'PACKAGE': { itemType: 'PACKAGE', label: 'Багц', types: [] },
};

// Helper to map Step 2 category to ItemType
export const mapCategoryToItemType = (category: string): ItemType | null => {
    const mapping: Record<string, ItemType> = {
        'shoe': 'SHOES',
        'bag': 'BAG',
        'chemical': 'CLOTH',
        'carpet': 'FELT',
        'sanitize': 'ACCESSORY',
        'clean': 'PACKAGE',
    };
    return mapping[category] || null;
};
