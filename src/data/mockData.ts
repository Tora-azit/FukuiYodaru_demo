// Mock data for the multi-day dispatch system prototype
// Nested structure: DayColumn > Route > Order

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  destination?: string;
  productName?: string;
  weight: number;
  quantity?: number;
  sealType?: string;
  capacity?: number;
  deliveryTime?: string;
  specialNote?: string;
};

export type Route = {
  id: string;
  name: string;
  truckInfo?: string;
  driverName?: string;
  maxCapacity: number;
  orders: Order[];
};

export type DayColumn = {
  id: string;
  dateLabel: string;
  routes: Route[];
};

export type UnassignedOrder = Order & {
  requestedDate?: string;
};

export function calculateRouteWeight(orders: Order[]): number {
  return orders.reduce((sum, order) => sum + order.weight * (order.quantity || 1), 0);
}

export function calculateLoadRatio(orders: Order[], maxCapacity: number): number {
  const totalWeight = calculateRouteWeight(orders);
  return Math.round((totalWeight / maxCapacity) * 100);
}

// Initial data - only 2 routes are overweight
export const initialData: DayColumn[] = [
  {
    id: '2024-11-18',
    dateLabel: '11月18日 (月)',
    routes: [
      {
        id: 'route-03-1118',
        name: '便 03 (昇竜)',
        truckInfo: '4t車',
        driverName: '田中',
        maxCapacity: 4000,
        orders: [
          // Total: 800 + 600 + 400 = 1800kg (45%)
          { id: 'ord-001', orderNumber: '303686', customerName: '大内須賀川', destination: '須賀川市内', productName: 'ドラム缶', weight: 800, quantity: 1, sealType: 'X', capacity: 2500, deliveryTime: '09:00', specialNote: '朝積' },
          { id: 'ord-002', orderNumber: '303687', customerName: '福島商事', destination: '福島市内', productName: '一斗缶', weight: 600, quantity: 1, sealType: 'Y', capacity: 3200, deliveryTime: '10:30' },
          { id: 'ord-003', orderNumber: '303688', customerName: '郡山物流', destination: '郡山市中央', productName: 'パレット貨物', weight: 400, quantity: 1, sealType: 'B', capacity: 1800, deliveryTime: '11:00' },
        ],
      },
      {
        id: 'route-05-1118',
        name: '便 05 (東北急送)',
        truckInfo: '10t車',
        driverName: '佐藤',
        maxCapacity: 10000,
        orders: [
          // Total: 3500 + 2800 = 6300kg (63%)
          { id: 'ord-004', orderNumber: '303689', customerName: '仙台中央倉庫', destination: '仙台市宮城野区', productName: '建材', weight: 3500, quantity: 1, sealType: 'X', capacity: 6400, deliveryTime: '13:00' },
          { id: 'ord-005', orderNumber: '303690', customerName: '東北製紙', destination: '仙台市青葉区', productName: 'ロール紙', weight: 2800, quantity: 1, sealType: 'Y', capacity: 4800, deliveryTime: '14:30' },
        ],
      },
      {
        id: 'route-07-1118',
        name: '便 07 (関東便)',
        truckInfo: '4t車',
        driverName: '鈴木',
        maxCapacity: 4000,
        orders: [
          // OVERWEIGHT: 1500 + 1800 + 1200 = 4500kg (112%) - 過積載1
          { id: 'ord-006', orderNumber: '303691', customerName: '宇都宮化学', destination: '宇都宮市', productName: '化学薬品', weight: 1500, quantity: 1, sealType: 'X', capacity: 2800, deliveryTime: '15:00' },
          { id: 'ord-007', orderNumber: '303692', customerName: '栃木建材', destination: '栃木市', productName: 'セメント', weight: 1800, quantity: 1, sealType: 'B', capacity: 2200, deliveryTime: '16:30' },
          { id: 'ord-050', orderNumber: '303750', customerName: '小山商事', destination: '小山市', productName: '鋼材', weight: 1200, quantity: 1, sealType: 'X', capacity: 2000, deliveryTime: '17:00', specialNote: '重量注意' },
        ],
      },
    ],
  },
  {
    id: '2024-11-19',
    dateLabel: '11月19日 (火)',
    routes: [
      {
        id: 'route-03-1119',
        name: '便 03 (昇竜)',
        truckInfo: '4t車',
        driverName: '田中',
        maxCapacity: 4000,
        orders: [
          // Total: 1100 + 750 = 1850kg (46%)
          { id: 'ord-008', orderNumber: '303693', customerName: '会津若松運輸', destination: '会津若松市', productName: '機械部品', weight: 1100, quantity: 1, sealType: 'Y', capacity: 2400, deliveryTime: '09:30', specialNote: '要確認' },
          { id: 'ord-009', orderNumber: '303694', customerName: '白河商会', destination: '白河市', productName: '食品材料', weight: 750, quantity: 1, sealType: 'X', capacity: 1600, deliveryTime: '11:00' },
        ],
      },
      {
        id: 'route-05-1119',
        name: '便 05 (東北急送)',
        truckInfo: '10t車',
        driverName: '佐藤',
        maxCapacity: 10000,
        orders: [
          // Total: 4200 + 2100 + 1800 = 8100kg (81%)
          { id: 'ord-010', orderNumber: '303695', customerName: '山形食品', destination: '山形市', productName: '冷凍食品', weight: 4200, quantity: 1, sealType: 'X', capacity: 7200, deliveryTime: '10:00' },
          { id: 'ord-011', orderNumber: '303696', customerName: '米沢工業', destination: '米沢市', productName: '工業製品', weight: 2100, quantity: 1, sealType: 'B', capacity: 3800, deliveryTime: '12:00' },
          { id: 'ord-012', orderNumber: '303697', customerName: '天童物産', destination: '天童市', productName: '雑貨', weight: 1800, quantity: 1, sealType: 'Y', capacity: 3200, deliveryTime: '14:00' },
        ],
      },
      {
        id: 'route-08-1119',
        name: '便 08 (北関東)',
        truckInfo: '4t車',
        driverName: '高橋',
        maxCapacity: 4000,
        orders: [
          // Total: 2200kg (55%)
          { id: 'ord-013', orderNumber: '303698', customerName: '前橋機械', destination: '前橋市', productName: '産業機械', weight: 2200, quantity: 1, sealType: 'X', capacity: 4500, deliveryTime: '13:30' },
        ],
      },
    ],
  },
  {
    id: '2024-11-20',
    dateLabel: '11月20日 (水)',
    routes: [
      {
        id: 'route-03-1120',
        name: '便 03 (昇竜)',
        truckInfo: '4t車',
        driverName: '田中',
        maxCapacity: 4000,
        orders: [
          // Total: 1400 + 850 = 2250kg (56%)
          { id: 'ord-014', orderNumber: '303699', customerName: '須賀川製作所', destination: '須賀川市', productName: '金属部品', weight: 1400, quantity: 1, sealType: 'Y', capacity: 2600, deliveryTime: '09:00' },
          { id: 'ord-015', orderNumber: '303700', customerName: '本宮商事', destination: '本宮市', productName: '建築資材', weight: 850, quantity: 1, sealType: 'B', capacity: 1900, deliveryTime: '10:30' },
        ],
      },
      {
        id: 'route-05-1120',
        name: '便 05 (東北急送)',
        truckInfo: '10t車',
        driverName: '佐藤',
        maxCapacity: 10000,
        orders: [
          // Total: 5500 + 2300 = 7800kg (78%)
          { id: 'ord-016', orderNumber: '303701', customerName: '盛岡物流センター', destination: '盛岡市', productName: '混載貨物', weight: 5500, quantity: 1, sealType: 'X', capacity: 8500, deliveryTime: '11:00' },
          { id: 'ord-017', orderNumber: '303702', customerName: '花巻工場', destination: '花巻市', productName: '原材料', weight: 2300, quantity: 1, sealType: 'Y', capacity: 4200, deliveryTime: '14:00' },
        ],
      },
      {
        id: 'route-09-1120',
        name: '便 09 (県内)',
        truckInfo: '2t車',
        driverName: '渡辺',
        maxCapacity: 2000,
        orders: [
          // OVERWEIGHT: 900 + 800 + 600 = 2300kg (115%) - 過積載2
          { id: 'ord-018', orderNumber: '303703', customerName: '福島駅前店', destination: '福島市駅前', productName: '小口配送', weight: 900, quantity: 1, sealType: 'B', capacity: 800, deliveryTime: '09:30' },
          { id: 'ord-019', orderNumber: '303704', customerName: '伊達営業所', destination: '伊達市', productName: '事務用品', weight: 800, quantity: 1, sealType: 'Y', capacity: 600, deliveryTime: '11:00' },
          { id: 'ord-051', orderNumber: '303751', customerName: '二本松支店', destination: '二本松市', productName: '備品', weight: 600, quantity: 1, sealType: 'B', capacity: 500, deliveryTime: '13:00', specialNote: '確認済' },
        ],
      },
    ],
  },
  {
    id: '2024-11-21',
    dateLabel: '11月21日 (木)',
    routes: [
      {
        id: 'route-03-1121',
        name: '便 03 (昇竜)',
        truckInfo: '4t車',
        driverName: '田中',
        maxCapacity: 4000,
        orders: [
          // Total: 600kg (15%)
          { id: 'ord-020', orderNumber: '303705', customerName: '二本松商店', destination: '二本松市', productName: '食料品', weight: 600, quantity: 1, sealType: 'X', capacity: 1200, deliveryTime: '10:00' },
        ],
      },
      {
        id: 'route-05-1121',
        name: '便 05 (東北急送)',
        truckInfo: '10t車',
        driverName: '佐藤',
        maxCapacity: 10000,
        orders: [
          // Total: 3800 + 2500 = 6300kg (63%)
          { id: 'ord-021', orderNumber: '303706', customerName: '秋田運送', destination: '秋田市', productName: '転送貨物', weight: 3800, quantity: 1, sealType: 'Y', capacity: 6800, deliveryTime: '12:00', specialNote: '積替' },
          { id: 'ord-022', orderNumber: '303707', customerName: '横手物産', destination: '横手市', productName: '農産物', weight: 2500, quantity: 1, sealType: 'B', capacity: 4400, deliveryTime: '15:00' },
        ],
      },
      {
        id: 'route-10-1121',
        name: '便 10 (新潟方面)',
        truckInfo: '10t車',
        driverName: '伊藤',
        maxCapacity: 10000,
        orders: [
          // Total: 4500 + 3200 = 7700kg (77%)
          { id: 'ord-023', orderNumber: '303708', customerName: '新潟港倉庫', destination: '新潟市中央区', productName: '輸出貨物', weight: 4500, quantity: 1, sealType: 'X', capacity: 7800, deliveryTime: '11:00' },
          { id: 'ord-024', orderNumber: '303709', customerName: '長岡工業', destination: '長岡市', productName: '機械設備', weight: 3200, quantity: 1, sealType: 'X', capacity: 5600, deliveryTime: '14:30', specialNote: '要連絡' },
        ],
      },
    ],
  },
  {
    id: '2024-11-22',
    dateLabel: '11月22日 (金)',
    routes: [
      {
        id: 'route-03-1122',
        name: '便 03 (昇竜)',
        truckInfo: '4t車',
        driverName: '田中',
        maxCapacity: 4000,
        orders: [],
      },
      {
        id: 'route-05-1122',
        name: '便 05 (東北急送)',
        truckInfo: '10t車',
        driverName: '佐藤',
        maxCapacity: 10000,
        orders: [
          // Total: 2800kg (28%)
          { id: 'ord-025', orderNumber: '303710', customerName: '青森中央市場', destination: '青森市', productName: '生鮮食品', weight: 2800, quantity: 1, sealType: 'Y', capacity: 5200, deliveryTime: '08:00' },
        ],
      },
    ],
  },
];

// Unassigned orders
export const unassignedOrders: UnassignedOrder[] = [
  { id: 'unassigned-001', orderNumber: '303711', customerName: '相馬港運', destination: '相馬市', productName: '港湾貨物', weight: 1800, quantity: 1, sealType: 'X', capacity: 3200, requestedDate: '11月18日〜20日' },
  { id: 'unassigned-002', orderNumber: '303712', customerName: '南相馬工場', destination: '南相馬市', productName: '工場資材', weight: 1200, quantity: 1, sealType: 'Y', capacity: 4200, specialNote: '急ぎ' },
  { id: 'unassigned-003', orderNumber: '303713', customerName: 'いわき商事', destination: 'いわき市', productName: '一般貨物', weight: 950, quantity: 1, sealType: 'B', capacity: 1800, requestedDate: '11月19日希望' },
  { id: 'unassigned-004', orderNumber: '303714', customerName: '喜多方食品', destination: '喜多方市', productName: '冷蔵品', weight: 800, quantity: 1, sealType: 'X', capacity: 2800, specialNote: '冷蔵' },
  { id: 'unassigned-005', orderNumber: '303715', customerName: '猪苗代観光', destination: '猪苗代町', productName: '観光物資', weight: 450, quantity: 1, sealType: 'Y', capacity: 900 },
];
