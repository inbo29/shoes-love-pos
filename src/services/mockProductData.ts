// ===============================
// Product Interface
// ===============================
export interface Product {
    id: string;
    category: string;
    name: string;
    shortDescription: string;
    price: number;
    image?: string;
    stock?: number;
}

// ===============================
// Mock Products (120 items)
// ===============================
export const mockProducts: Product[] = [
    // ───────── Угаалгын шингэн ─────────
    { id: 'PROD-001', category: 'Угаалгын шингэн', name: 'Runa зөөлрүүлэгчтэй угаалгын шингэн ph7.5', shortDescription: 'Зөөлрүүлэгчтэй, гутал ба хувцсанд тохиромжтой', price: 29900, stock: 50 },
    { id: 'PROD-002', category: 'Угаалгын шингэн', name: 'Гутал угаах тусгай шингэн 500 мл', shortDescription: 'Арьс гэмтээлгүй гүн цэвэрлэнэ', price: 26900, stock: 35 },
    { id: 'PROD-003', category: 'Угаалгын шингэн', name: 'Гутал угаах шингэн 300 мл', shortDescription: 'Өдөр тутмын хэрэглээнд', price: 18900, stock: 40 },
    { id: 'PROD-004', category: 'Угаалгын шингэн', name: 'Гутал угаах концентрат 250 мл', shortDescription: 'Усанд шингэлж хэрэглэнэ', price: 21900, stock: 30 },
    { id: 'PROD-005', category: 'Угаалгын шингэн', name: 'Гутал угаах зөөлөн шингэн 1 л', shortDescription: 'Бүх төрлийн гуталд', price: 32900, stock: 20 },

    // ───────── Тос ─────────
    { id: 'PROD-006', category: 'Тос', name: 'Гутлын тос Dubbin 100 гр', shortDescription: 'Ус чийгнээс хамгаална', price: 11900, stock: 45 },
    { id: 'PROD-007', category: 'Тос', name: 'Хонины өөхөн гутлын тос хар 100 гр', shortDescription: 'Арьсыг зөөлрүүлж хамгаална', price: 14900, stock: 35 },
    { id: 'PROD-008', category: 'Тос', name: 'Хонины өөхөн гутлын тос саарал 100 гр', shortDescription: 'Өнгийг сэргээнэ', price: 14900, stock: 30 },
    { id: 'PROD-009', category: 'Тос', name: 'Гутлын тос өнгөлөгч хар 50 мл', shortDescription: 'Жижиг савлагаа', price: 10900, stock: 50 },
    { id: 'PROD-010', category: 'Тос', name: 'Гутлын тос өнгөлөгч бор 50 мл', shortDescription: 'Бор өнгийн гуталд', price: 10900, stock: 45 },

    // ───────── Өнгөлөгч ─────────
    { id: 'PROD-011', category: 'Өнгөлөгч', name: 'Гутлын өнгөлөгч хар', shortDescription: 'Гялалзуулж өнгийг сэргээнэ', price: 7900, stock: 60 },
    { id: 'PROD-012', category: 'Өнгөлөгч', name: 'Гутлын өнгөлөгч бор', shortDescription: 'Арьсны өнгийг жигд болгоно', price: 7900, stock: 55 },
    { id: 'PROD-013', category: 'Өнгөлөгч', name: 'Гутлын өнгөлөгч саарал', shortDescription: 'Саарал гуталд зориулсан', price: 7900, stock: 50 },
    { id: 'PROD-014', category: 'Өнгөлөгч', name: 'Гутлын өнгөлөгч төвийг сахисан', shortDescription: 'Бүх өнгийн гуталд', price: 7900, stock: 45 },

    // ───────── Цэвэрлэгч ─────────
    { id: 'PROD-015', category: 'Цэвэрлэгч', name: 'Гутал цэвэрлэгч шингэн 500 мл', shortDescription: 'Бохирдол, толбыг арилгана', price: 26900, stock: 25 },
    { id: 'PROD-016', category: 'Цэвэрлэгч', name: 'Гутал хуурай цэвэрлэгч 300 мл', shortDescription: 'Ус хэрэглэхгүй', price: 18300, stock: 30 },
    { id: 'PROD-017', category: 'Цэвэрлэгч', name: 'Гутал цэвэрлэгч хөөс', shortDescription: 'Арьс гэмтээлгүй', price: 15900, stock: 40 },
    { id: 'PROD-018', category: 'Цэвэрлэгч', name: 'Гутал цэвэрлэгч багц', shortDescription: 'Сойз + шингэн', price: 25900, stock: 20 },

    // ───────── Хамгаалагч ─────────
    { id: 'PROD-019', category: 'Хамгаалагч', name: 'Гутал ус нэвтрэхээс хамгаалагч 100 мл', shortDescription: 'Ус, чийгнээс хамгаална', price: 7900, stock: 60 },
    { id: 'PROD-020', category: 'Хамгаалагч', name: 'Гутал ус нэвтрэхээс хамгаалагч 300 мл', shortDescription: 'Илүү удаан хамгаалалт', price: 18900, stock: 35 },

    // ───────── Бүсчиг (дагалдах хэрэгсэл) ─────────
    { id: 'PROD-021', category: 'Бүсчиг', name: 'Гутлын сойз зөөлөн', shortDescription: 'Өдөр тутмын арчилгаа', price: 5900, stock: 80 },
    { id: 'PROD-022', category: 'Бүсчиг', name: 'Гутлын сойз хатуу', shortDescription: 'Гүн цэвэрлэгээ', price: 6900, stock: 70 },
    { id: 'PROD-023', category: 'Бүсчиг', name: 'Гутал өнгөлөх алчуур', shortDescription: 'Микрофибер материал', price: 4900, stock: 100 },
    { id: 'PROD-024', category: 'Бүсчиг', name: 'Гутлын өнгөлөгч багс', shortDescription: 'Тос түрхэхэд', price: 3900, stock: 90 },

    // ───────── Давтагдсан логикоор 120 хүртэл ─────────
    // (Доорх нь UI тест, pagination, scroll-д зориулагдсан)
    ...Array.from({ length: 96 }).map((_, i) => ({
        id: `PROD-${String(25 + i).padStart(3, '0')}`,
        category: ['Угаалгын шингэн', 'Тос', 'Өнгөлөгч', 'Цэвэрлэгч', 'Хамгаалагч', 'Бүсчиг'][i % 6],
        name: `Гутал арчилгааны бүтээгдэхүүн ${i + 1}`,
        shortDescription: 'Гутал арчилгаанд зориулсан стандарт бүтээгдэхүүн',
        price: 7000 + (i % 5) * 5000,
        stock: 20 + (i % 30),
    })),
];
