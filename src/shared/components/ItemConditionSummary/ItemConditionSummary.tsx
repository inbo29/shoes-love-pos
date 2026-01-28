import React from 'react';

// 물품 상태 전체 데이터 구조
export interface ItemConditionData {
    zagvar?: string;           // 1. Загвар (스타일)
    ongo?: string;             // 2. Өнгө (색상)
    hemjee?: string;           // 3. Хэмжээ (사이즈)
    material?: string;         // 4. Материал (소재)
    torol?: string;            // 5. Төрөл (종류)
    brand?: string;            // 6. Брэндийн нэр (브랜드)
    elegdel?: string;          // 7. Элэгдэл (마모)
    tolbo?: string;            // 8. Толбо (얼룩)
    gemtel?: string;           // 9. Гэмтэл (손상)
    udo?: string;              // 10. УДӨ (변형 가능성)
    budahOngo?: string;        // 11. Будах өнгө (염색 색상)
    daraaahBaidall?: string;   // 12. Үйлчилгээний дараах байдал (서비스 후 상태)
    nemeltNohtsol?: string[];  // 13. Нэмэлт нөхцөлүүд (추가 조건)
}

interface ItemConditionSummaryProps {
    conditions: ItemConditionData;
    compact?: boolean; // 컴팩트 모드 (Step 5용)
}

const ItemConditionSummary: React.FC<ItemConditionSummaryProps> = ({ conditions, compact = false }) => {
    // 조건부 경고 표시 항목들
    const warningFields = ['gemtel', 'udo', 'daraaahBaidall'];
    
    // 모든 필드 정의
    const fields: { key: keyof ItemConditionData; label: string; icon?: string }[] = [
        { key: 'zagvar', label: 'Загвар' },
        { key: 'ongo', label: 'Өнгө' },
        { key: 'hemjee', label: 'Хэмжээ' },
        { key: 'material', label: 'Материал' },
        { key: 'torol', label: 'Төрөл' },
        { key: 'brand', label: 'Брэндийн нэр' },
        { key: 'elegdel', label: 'Элэгдэл' },
        { key: 'tolbo', label: 'Толбо' },
        { key: 'gemtel', label: 'Гэмтэл', icon: 'warning' },
        { key: 'udo', label: 'УДӨ' },
        { key: 'budahOngo', label: 'Будах өнгө' },
        { key: 'daraaahBaidall', label: 'Үйлч. дараах байдал' },
    ];

    const hasWarning = (key: string, value: string | undefined): boolean => {
        if (!value) return false;
        if (key === 'gemtel' && value !== 'Үгүй' && value !== 'Байхгүй') return true;
        if (key === 'udo' && value === 'Тийм') return true;
        if (key === 'daraaahBaidall' && value === 'Өөрчлөгдөх магадлалтай') return true;
        return false;
    };

    return (
        <div className={`bg-gradient-to-r from-orange-50/50 to-yellow-50/50 rounded-xl border border-orange-100 ${compact ? 'p-3' : 'p-4'}`}>
            <h4 className={`font-black text-orange-600 uppercase tracking-wider flex items-center gap-2 ${compact ? 'text-[9px] mb-2' : 'text-[10px] mb-3'}`}>
                <span className={`material-icons-round ${compact ? 'text-xs' : 'text-sm'}`}>summarize</span>
                Одоогийн байдал
            </h4>
            
            {/* 메인 필드들 */}
            <div className={`grid ${compact ? 'grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3'}`}>
                {fields.map(field => {
                    const value = conditions[field.key];
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    
                    const showWarning = hasWarning(field.key, value as string);
                    
                    return (
                        <div key={field.key} className="flex flex-col">
                            <span className={`font-bold text-gray-400 uppercase ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
                                {field.label}
                            </span>
                            <span className={`font-bold flex items-center gap-1 ${
                                showWarning 
                                    ? 'text-orange-600' 
                                    : 'text-gray-800'
                            } ${compact ? 'text-[10px]' : 'text-xs'}`}>
                                {showWarning && (
                                    <span className={`material-icons-round ${compact ? 'text-[10px]' : 'text-xs'}`}>warning</span>
                                )}
                                {value as string}
                            </span>
                        </div>
                    );
                })}
            </div>
            
            {/* 추가 조건 (Нэмэлт нөхцөлүүд) */}
            {conditions.nemeltNohtsol && conditions.nemeltNohtsol.length > 0 && (
                <div className={`border-t border-orange-100/50 ${compact ? 'mt-2 pt-2' : 'mt-3 pt-3'}`}>
                    <span className={`font-bold text-gray-400 uppercase block ${compact ? 'text-[8px] mb-1' : 'text-[9px] mb-1.5'}`}>
                        Нэмэлт нөхцөлүүд
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {conditions.nemeltNohtsol.map((item, idx) => (
                            <span 
                                key={idx} 
                                className={`px-2 py-0.5 bg-orange-100/50 text-orange-700 rounded font-medium ${compact ? 'text-[9px]' : 'text-[10px]'}`}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemConditionSummary;

// Mock 데이터 - 테스트용
export const mockShoeCondition1: ItemConditionData = {
    zagvar: 'Спорт',
    ongo: 'Хар',
    hemjee: '41-42',
    material: 'Арьс',
    torol: 'Эрэгтэй',
    brand: 'Nike',
    elegdel: 'Дунд зэрэг',
    tolbo: 'Тос',
    gemtel: 'Ул хагарсан',
    udo: 'Үгүй',
    budahOngo: 'Хар',
    daraaahBaidall: 'Хэвийн',
    nemeltNohtsol: ['Рант хагарсан', 'Утас ховорсон']
};

export const mockShoeCondition2: ItemConditionData = {
    zagvar: 'Арьсан',
    ongo: 'Цагаан',
    hemjee: '39-40',
    material: 'Илгэн',
    torol: 'Эмэгтэй',
    brand: 'Adidas',
    elegdel: 'Бага зэрэг',
    tolbo: 'Байхгүй',
    gemtel: 'Үгүй',
    udo: 'Үгүй',
    budahOngo: '-',
    daraaahBaidall: 'Хэвийн',
};

export const mockChemicalCondition: ItemConditionData = {
    zagvar: 'Эр',
    ongo: 'Хөх',
    hemjee: 'Дунд',
    material: 'Даавуу',
    torol: 'Куртка',
    elegdel: '30%',
    tolbo: 'Үнэр',
    gemtel: 'Зипп эвдрэлтэй',
    daraaahBaidall: 'Өөрчлөгдөх магадлалтай',
};
