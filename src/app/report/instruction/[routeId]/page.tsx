'use client';

import { useEffect, useState } from 'react';
import { Printer, Truck, User, MapPin } from 'lucide-react';
import { Route, calculateRouteWeight } from '@/data/mockData';

// LocalStorage key (same as RouteContainer)
const INSTRUCTION_STORAGE_KEY = 'dispatch-instruction-data';

interface InstructionData {
  route: Route;
  dayId: string;
  dateLabel: string;
  generatedAt: string;
}

export default function InstructionPage() {
  const [data, setData] = useState<InstructionData | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(INSTRUCTION_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as InstructionData;
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse instruction data:', e);
      }
    }
  }, []);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">指示書データがありません</p>
          <p className="text-sm text-gray-500">
            配車ボードから指示書アイコンをクリックしてください
          </p>
        </div>
      </div>
    );
  }

  const { route, dateLabel } = data;
  const totalWeight = calculateRouteWeight(route.orders);

  // Format date for display
  const formatDate = () => {
    const match = dateLabel.match(/(\d+)月(\d+)日.*\((.)\)/);
    if (match) {
      const [, month, day, weekday] = match;
      const weekdayMap: Record<string, string> = {
        '月': '月曜日', '火': '火曜日', '水': '水曜日',
        '木': '木曜日', '金': '金曜日', '土': '土曜日', '日': '日曜日',
      };
      return `令和6年${month}月${day}日 (${weekdayMap[weekday] || weekday})`;
    }
    return dateLabel;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print controls - hidden when printing */}
      <div className="print:hidden bg-slate-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold">配送指示書プレビュー</h1>
          <span className="text-xs text-slate-400">
            {route.name} - {route.driverName}
          </span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded"
        >
          <Printer className="w-3.5 h-3.5" />
          印刷
        </button>
      </div>

      {/* Instruction Sheet Content - A4 Portrait */}
      <div className="instruction-page p-8 max-w-[210mm] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-[0.5em] mb-2">配送指示書</h1>
          <p className="text-sm text-gray-600">{formatDate()}</p>
        </div>

        {/* Route Info Box */}
        <div className="border-2 border-black mb-6">
          <div className="grid grid-cols-2 divide-x-2 divide-black">
            {/* Left: Truck & Driver */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5" />
                <span className="text-lg font-bold">{route.name}</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                車両: {route.truckInfo || '未指定'}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <User className="w-4 h-4" />
                <span className="font-medium">{route.driverName || '未指定'}</span>
              </div>
            </div>
            {/* Right: Summary */}
            <div className="p-3">
              <div className="text-sm text-gray-600 mb-1">配送件数</div>
              <div className="text-2xl font-bold mb-2">{route.orders.length} 件</div>
              <div className="text-sm">
                総重量: <span className="font-bold">{totalWeight.toLocaleString()}kg</span>
                <span className="text-gray-500"> / {route.maxCapacity.toLocaleString()}kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery List Table */}
        <table className="w-full border-collapse text-sm mb-6 instruction-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-2 border-black px-2 py-2 w-8">No.</th>
              <th className="border-2 border-black px-2 py-2 w-14">時間</th>
              <th className="border-2 border-black px-2 py-2">得意先</th>
              <th className="border-2 border-black px-2 py-2">納入先</th>
              <th className="border-2 border-black px-2 py-2">品名</th>
              <th className="border-2 border-black px-2 py-2 w-12">数量</th>
              <th className="border-2 border-black px-2 py-2 w-16">重量</th>
              <th className="border-2 border-black px-2 py-2 w-8">済</th>
            </tr>
          </thead>
          <tbody>
            {route.orders.map((order, idx) => (
              <tr key={order.id}>
                <td className="border-2 border-black px-2 py-2 text-center font-bold">
                  {idx + 1}
                </td>
                <td className="border-2 border-black px-2 py-2 text-center">
                  {order.deliveryTime || '-'}
                </td>
                <td className="border-2 border-black px-2 py-2">
                  {order.customerName}
                </td>
                <td className="border-2 border-black px-2 py-2">
                  {order.destination || '-'}
                </td>
                <td className="border-2 border-black px-2 py-2">
                  {order.productName || '-'}
                  {/* Special Note - Highlighted */}
                  {order.specialNote && (
                    <span className="ml-2 px-1 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                      {order.specialNote}
                    </span>
                  )}
                </td>
                <td className="border-2 border-black px-2 py-2 text-center">
                  {order.quantity || 1}
                </td>
                <td className="border-2 border-black px-2 py-2 text-right">
                  {order.weight.toLocaleString()}kg
                </td>
                <td className="border-2 border-black px-2 py-2">
                  {/* Checkbox area for driver */}
                </td>
              </tr>
            ))}
            {/* Empty rows for additional notes */}
            {route.orders.length < 8 && (
              Array.from({ length: 8 - route.orders.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td className="border-2 border-black px-2 py-2 h-10">&nbsp;</td>
                  <td className="border-2 border-black px-2 py-2"></td>
                  <td className="border-2 border-black px-2 py-2"></td>
                  <td className="border-2 border-black px-2 py-2"></td>
                  <td className="border-2 border-black px-2 py-2"></td>
                  <td className="border-2 border-black px-2 py-2"></td>
                  <td className="border-2 border-black px-2 py-2"></td>
                  <td className="border-2 border-black px-2 py-2"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Map / Site Notes Placeholder */}
        <div className="border-2 border-black mb-6">
          <div className="bg-gray-100 px-3 py-1 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-bold text-sm">現場カルテ / 地図</span>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Map Area</p>
              <p className="text-xs">地図・現場メモ記入欄</p>
            </div>
          </div>
        </div>

        {/* Footer: Time & Signature */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border-2 border-black p-3">
            <div className="text-xs text-gray-600 mb-1">出発時刻</div>
            <div className="h-8 border-b border-gray-300"></div>
          </div>
          <div className="border-2 border-black p-3">
            <div className="text-xs text-gray-600 mb-1">帰着時刻</div>
            <div className="h-8 border-b border-gray-300"></div>
          </div>
          <div className="border-2 border-black p-3">
            <div className="text-xs text-gray-600 mb-1">ドライバー確認印</div>
            <div className="h-8"></div>
          </div>
        </div>

        {/* Company Info Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>株式会社 福井運送 TEL: 0120-XXX-XXX</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

        .instruction-page {
          font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif;
        }

        .instruction-table th,
        .instruction-table td {
          vertical-align: middle;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          .instruction-page {
            padding: 0;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
