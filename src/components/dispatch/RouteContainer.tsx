'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Truck, User, AlertCircle, FileText } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { Route, calculateRouteWeight, calculateLoadRatio } from '@/data/mockData';
import { cn } from '@/lib/utils';

// LocalStorage key for instruction sheet data
const INSTRUCTION_STORAGE_KEY = 'dispatch-instruction-data';

interface RouteContainerProps {
  route: Route;
  dayId: string;
  dateLabel?: string;
}

export function RouteContainer({ route, dayId, dateLabel }: RouteContainerProps) {
  const currentWeight = calculateRouteWeight(route.orders);
  const loadRatio = calculateLoadRatio(route.orders, route.maxCapacity);
  const isOverweight = loadRatio > 100;
  const isNearCapacity = loadRatio > 80 && loadRatio <= 100;

  // Droppable ID combines day and route for unique identification
  const droppableId = `${dayId}::${route.id}`;

  // Open instruction sheet preview
  const handleOpenInstruction = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Save route data to localStorage
    const instructionData = {
      route,
      dayId,
      dateLabel: dateLabel || dayId,
      generatedAt: new Date().toISOString(),
    };
    localStorage.setItem(INSTRUCTION_STORAGE_KEY, JSON.stringify(instructionData));

    // Open instruction page in new tab
    window.open(`/report/instruction/${route.id}`, '_blank');
  };

  return (
    <div
      className={cn(
        'bg-white border rounded-sm overflow-hidden',
        isOverweight ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300'
      )}
    >
      {/* Route Header - Compact */}
      <div
        className={cn(
          'px-2 py-1.5 border-b',
          isOverweight
            ? 'bg-red-50 border-red-200'
            : 'bg-slate-100 border-gray-200'
        )}
      >
        {/* Route name and actions */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Truck
              className={cn(
                'w-3.5 h-3.5 flex-shrink-0',
                isOverweight ? 'text-red-600' : 'text-slate-600'
              )}
            />
            <span className="text-xs font-bold text-slate-800 truncate">
              {route.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isOverweight && (
              <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            )}
            {/* Instruction Sheet Button */}
            <button
              onClick={handleOpenInstruction}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
              title="配送指示書を表示"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />
            </button>
          </div>
        </div>

        {/* Truck info and driver */}
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
          {route.truckInfo && <span>{route.truckInfo}</span>}
          {route.driverName && (
            <span className="flex items-center gap-0.5">
              <User className="w-2.5 h-2.5" />
              {route.driverName}
            </span>
          )}
        </div>

        {/* Load bar */}
        <div className="mt-1.5">
          <div className="flex items-center justify-between text-[10px] mb-0.5">
            <span className="text-slate-500">
              {currentWeight.toLocaleString()}/{route.maxCapacity.toLocaleString()}kg
            </span>
            <span
              className={cn(
                'font-bold',
                isOverweight
                  ? 'text-red-600'
                  : isNearCapacity
                  ? 'text-amber-600'
                  : 'text-slate-600'
              )}
            >
              {loadRatio}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-200 rounded-full',
                isOverweight
                  ? 'bg-red-500'
                  : isNearCapacity
                  ? 'bg-amber-500'
                  : loadRatio > 50
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(loadRatio, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Orders droppable area */}
      <Droppable droppableId={droppableId} type="ORDER">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'p-1.5 min-h-[60px] transition-colors duration-100',
              snapshot.isDraggingOver
                ? isOverweight
                  ? 'bg-red-50'
                  : 'bg-blue-50'
                : 'bg-slate-50/50'
            )}
          >
            {route.orders.length === 0 ? (
              <div className="h-[50px] flex items-center justify-center text-[10px] text-slate-400 border border-dashed border-slate-300 rounded">
                ドロップ
              </div>
            ) : (
              route.orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
