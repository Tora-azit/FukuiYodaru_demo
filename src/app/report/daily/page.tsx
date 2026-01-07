'use client';

import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { DayColumn, Order, Route } from '@/data/mockData';

// LocalStorage key (same as DispatchBoard)
const REPORT_STORAGE_KEY = 'dispatch-report-data';

interface ReportData {
  days: DayColumn[];
  generatedAt: string;
}

// Row data for the table
interface TableRow {
  isSubtotal: boolean;
  routeIndex?: number;
  driverName?: string;
  rowSpan?: number;
  time?: string;
  orderNumber?: string;
  customerName?: string;
  destination?: string;
  productName?: string;
  sealType?: string;
  quantity?: number;
  capacity?: number;
  // Subtotal fields
  totalQuantity?: number;
  totalCapacity?: number;
}

export default function DailyReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(REPORT_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as ReportData;
        setReportData(data);
      } catch (e) {
        console.error('Failed to parse report data:', e);
      }
    }
  }, []);

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">レポートデータがありません</p>
          <p className="text-sm text-gray-500">
            配車ボードから「配達日報プレビュー」ボタンを押してください
          </p>
        </div>
      </div>
    );
  }

  const selectedDay = reportData.days[selectedDayIndex];

  // Build table rows with rowspan for drivers
  const buildTableRows = (day: DayColumn): TableRow[] => {
    const rows: TableRow[] = [];
    let routeIndex = 1;

    for (const route of day.routes) {
      if (route.orders.length === 0) continue;

      const orderCount = route.orders.length;

      // Calculate subtotals for this route
      let totalQuantity = 0;
      let totalCapacity = 0;

      route.orders.forEach((order, idx) => {
        totalQuantity += order.quantity || 1;
        totalCapacity += order.capacity || 0;

        rows.push({
          isSubtotal: false,
          routeIndex: idx === 0 ? routeIndex : undefined,
          driverName: idx === 0 ? route.driverName : undefined,
          rowSpan: idx === 0 ? orderCount : undefined,
          time: order.deliveryTime || '',
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          destination: order.destination || '',
          productName: order.productName || '',
          sealType: order.sealType || '',
          quantity: order.quantity || 1,
          capacity: order.capacity || 0,
        });
      });

      // Add subtotal row
      rows.push({
        isSubtotal: true,
        totalQuantity,
        totalCapacity,
      });

      routeIndex++;
    }

    return rows;
  };

  const tableRows = buildTableRows(selectedDay);

  // Format date for display
  const formatReportDate = () => {
    const dateStr = selectedDay.dateLabel;
    // Convert 11月18日 (月) format to 25年11月18日 月曜日
    const match = dateStr.match(/(\d+)月(\d+)日.*\((.)\)/);
    if (match) {
      const [, month, day, weekday] = match;
      const weekdayMap: Record<string, string> = {
        '月': '月曜日', '火': '火曜日', '水': '水曜日',
        '木': '木曜日', '金': '金曜日', '土': '土曜日', '日': '日曜日',
      };
      return `25年${month}月${day}日 ${weekdayMap[weekday] || weekday}`;
    }
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print controls - hidden when printing */}
      <div className="print:hidden bg-slate-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold">配達日報プレビュー</h1>
          <select
            value={selectedDayIndex}
            onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
            className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1"
          >
            {reportData.days.map((day, idx) => (
              <option key={day.id} value={idx}>
                {day.dateLabel}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded"
        >
          <Printer className="w-3.5 h-3.5" />
          印刷
        </button>
      </div>

      {/* Report content */}
      <div className="report-page p-6 max-w-[297mm] mx-auto">
        {/* Report Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-600">発行日: {formatReportDate()}</p>
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-center flex-1">
            配 達 日 報
          </h1>
          <div className="text-right">
            <p className="text-xs text-gray-600">株式会社 福井運送</p>
          </div>
        </div>

        {/* Main Table */}
        <table className="w-full border-collapse text-[11px] report-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-1 py-1 w-8">印</th>
              <th className="border border-black px-1 py-1 w-16">扱者</th>
              <th className="border border-black px-1 py-1 w-12">時間</th>
              <th className="border border-black px-1 py-1 w-16">受注No.</th>
              <th className="border border-black px-1 py-1">得意先</th>
              <th className="border border-black px-1 py-1">納入先</th>
              <th className="border border-black px-1 py-1">品名</th>
              <th className="border border-black px-1 py-1 w-8">封</th>
              <th className="border border-black px-1 py-1 w-10">数量</th>
              <th className="border border-black px-1 py-1 w-16">容量</th>
              <th className="border border-black px-1 py-1 w-8">検</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => {
              if (row.isSubtotal) {
                return (
                  <tr key={`subtotal-${idx}`} className="bg-gray-50 font-bold">
                    <td className="border border-black px-1 py-0.5" colSpan={8} />
                    <td className="border border-black px-1 py-0.5 text-right">
                      {row.totalQuantity?.toLocaleString()}
                    </td>
                    <td className="border border-black px-1 py-0.5 text-right">
                      {row.totalCapacity?.toLocaleString()}
                    </td>
                    <td className="border border-black px-1 py-0.5 text-center">
                      計
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={`row-${idx}`}>
                  {row.routeIndex !== undefined && (
                    <td
                      className="border border-black px-1 py-0.5 text-center align-middle"
                      rowSpan={row.rowSpan}
                    >
                      {row.routeIndex}
                    </td>
                  )}
                  {row.driverName !== undefined && (
                    <td
                      className="border border-black px-1 py-0.5 text-center align-middle font-medium"
                      rowSpan={row.rowSpan}
                    >
                      {row.driverName}
                    </td>
                  )}
                  <td className="border border-black px-1 py-0.5 text-center">
                    {row.time}
                  </td>
                  <td className="border border-black px-1 py-0.5 text-center font-mono">
                    {row.orderNumber}
                  </td>
                  <td className="border border-black px-1 py-0.5">
                    {row.customerName}
                  </td>
                  <td className="border border-black px-1 py-0.5">
                    {row.destination}
                  </td>
                  <td className="border border-black px-1 py-0.5">
                    {row.productName}
                  </td>
                  <td className="border border-black px-1 py-0.5 text-center">
                    {row.sealType}
                  </td>
                  <td className="border border-black px-1 py-0.5 text-right">
                    {row.quantity}
                  </td>
                  <td className="border border-black px-1 py-0.5 text-right">
                    {row.capacity?.toLocaleString()}
                  </td>
                  <td className="border border-black px-1 py-0.5" />
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer notes area */}
        <div className="mt-6 border border-black p-3">
          <p className="text-xs text-gray-600 mb-2">備考:</p>
          <div className="min-h-[60px]" />
        </div>

        {/* Approval stamps area */}
        <div className="mt-4 flex justify-end">
          <table className="border-collapse text-[10px]">
            <thead>
              <tr>
                <th className="border border-black px-4 py-1 w-16">承認</th>
                <th className="border border-black px-4 py-1 w-16">確認</th>
                <th className="border border-black px-4 py-1 w-16">担当</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black h-12" />
                <td className="border border-black h-12" />
                <td className="border border-black h-12" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap');

        .report-page {
          font-family: 'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif;
        }

        .report-table th,
        .report-table td {
          vertical-align: middle;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          .report-page {
            padding: 0;
            max-width: none;
          }

          .report-table {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
