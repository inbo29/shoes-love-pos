1. 기본 전제 (Important)
- Front-end only
- No backend, no API
- All data is mock
- PC / Tablet responsive only
- No gradient (solid colors only)
- Mongolian language UI
2. 전체 화면 흐름도 (High-Level Flow)
[ Нэвтрэх (Login) ] 필수
        |
        v
[ Үүрэг сонгох (Task Selection) ] 필수
        |
        v
        메뉴에 따라 다름 
        |                             |
        v                             v
[ Захиалга ]리스트 -> [ step1 ] 고객 조회 | 주문 접수 직원정보 -> [ step2 ] 서비스 선택 (신발, 세탁, 카페트, 소독, 청소) -> [ step3 ] 선택된 갯수 만큼 상세 서비스 항목 선택 (각 서비스 중요도 ) 
        |                             |
        v                             v
[ Захиалгын жагсаалт ]        [ Үйлчилгээний жагсаалт ]
        |
        v
[ Захиалгын дэлгэрэнгүй ]
        |
        +-------------------+
        |                   |
        v                   v
[ Сонгосон үйлчилгээ ]   [ Одоогийн байдал ]
