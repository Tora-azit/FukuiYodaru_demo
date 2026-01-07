'use client';

import { Calendar } from 'lucide-react';
import { RouteContainer } from './RouteContainer';
import { DayColumn as DayColumnType } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface DayColumnProps {
  day: DayColumnType;
  isToday?: boolean;
}

export function DayColumn({ day, isToday }: DayColumnProps) {
  // Count total orders for this day
  const totalOrders = day.routes.reduce((sum, route) => sum + route.orders.length, 0);

  return (
    <div
      className={cn(
        'flex flex-col bg-slate-50 border rounded-sm min-w-[240px] w-[240px]',
        isToday ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-300'
      )}
    >
      {/* Day header */}
      <div
        className={cn(
          'px-3 py-2 border-b',
          isToday
            ? 'bg-blue-600 text-white border-blue-500'
            : 'bg-slate-800 text-white border-slate-700'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-bold">{day.dateLabel}</span>
          </div>
          {isToday && (
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              TODAY
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-300 mt-0.5">
          {day.routes.length}便 / {totalOrders}件
        </div>
      </div>

      {/* Routes list */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {day.routes.map((route) => (
          <RouteContainer
            key={route.id}
            route={route}
            dayId={day.id}
            dateLabel={day.dateLabel}
          />
        ))}
      </div>
    </div>
  );
}
