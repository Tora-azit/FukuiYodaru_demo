'use client';

import { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { UnassignedPanel } from './UnassignedPanel';
import { DayColumn } from './DayColumn';
import { Header } from './Header';
import {
  initialData,
  unassignedOrders as initialUnassigned,
  DayColumn as DayColumnType,
  Order,
  UnassignedOrder,
} from '@/data/mockData';

// LocalStorage key for report data
const REPORT_STORAGE_KEY = 'dispatch-report-data';

export function DispatchBoard() {
  const [days, setDays] = useState<DayColumnType[]>(initialData);
  const [unassignedOrders, setUnassignedOrders] = useState<UnassignedOrder[]>(initialUnassigned);

  // Handle drag end - supports moving between routes, days, and unassigned
  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside any droppable
    if (!destination) return;

    // Same position - no change
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Parse source and destination IDs
    // Format: "unassigned" or "dayId::routeId"
    const parseDroppableId = (id: string) => {
      if (id === 'unassigned') {
        return { type: 'unassigned' as const, dayId: null, routeId: null };
      }
      const [dayId, routeId] = id.split('::');
      return { type: 'route' as const, dayId, routeId };
    };

    const sourceParsed = parseDroppableId(source.droppableId);
    const destParsed = parseDroppableId(destination.droppableId);

    // Find and remove the order from source
    let movedOrder: Order | UnassignedOrder | null = null;

    if (sourceParsed.type === 'unassigned') {
      // Remove from unassigned
      const orderIndex = unassignedOrders.findIndex((o) => o.id === draggableId);
      if (orderIndex !== -1) {
        movedOrder = unassignedOrders[orderIndex];
        setUnassignedOrders((prev) => prev.filter((o) => o.id !== draggableId));
      }
    } else {
      // Remove from a route
      setDays((prevDays) => {
        const newDays = prevDays.map((day) => {
          if (day.id !== sourceParsed.dayId) return day;
          return {
            ...day,
            routes: day.routes.map((route) => {
              if (route.id !== sourceParsed.routeId) return route;
              const orderIndex = route.orders.findIndex((o) => o.id === draggableId);
              if (orderIndex !== -1) {
                movedOrder = route.orders[orderIndex];
              }
              return {
                ...route,
                orders: route.orders.filter((o) => o.id !== draggableId),
              };
            }),
          };
        });
        return newDays;
      });
    }

    // Add to destination
    if (destParsed.type === 'unassigned') {
      // Add to unassigned
      setUnassignedOrders((prev) => {
        if (!movedOrder) return prev;
        const newList = [...prev];
        newList.splice(destination.index, 0, movedOrder as UnassignedOrder);
        return newList;
      });
    } else {
      // Add to a route
      setDays((prevDays) => {
        return prevDays.map((day) => {
          if (day.id !== destParsed.dayId) return day;
          return {
            ...day,
            routes: day.routes.map((route) => {
              if (route.id !== destParsed.routeId) return route;
              const newOrders = [...route.orders];
              if (movedOrder) {
                // Convert UnassignedOrder to Order (remove requestedDate)
                const orderToAdd: Order = {
                  id: movedOrder.id,
                  orderNumber: movedOrder.orderNumber,
                  customerName: movedOrder.customerName,
                  destination: movedOrder.destination,
                  productName: movedOrder.productName,
                  weight: movedOrder.weight,
                  quantity: movedOrder.quantity,
                  sealType: movedOrder.sealType,
                  capacity: movedOrder.capacity,
                  deliveryTime: movedOrder.deliveryTime,
                  specialNote: movedOrder.specialNote,
                };
                newOrders.splice(destination.index, 0, orderToAdd);
              }
              return {
                ...route,
                orders: newOrders,
              };
            }),
          };
        });
      });
    }
  }, [unassignedOrders]);

  // Open report preview
  const handleOpenReport = useCallback(() => {
    // Save current state to localStorage
    const reportData = {
      days,
      generatedAt: new Date().toISOString(),
    };
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reportData));

    // Open report in new tab
    window.open('/report/daily', '_blank');
  }, [days]);

  // Calculate statistics
  const totalOrders = days.reduce(
    (sum, day) => sum + day.routes.reduce((s, r) => s + r.orders.length, 0),
    0
  );
  const totalRoutes = days.reduce((sum, day) => sum + day.routes.length, 0);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col">
        {/* Header with report button */}
        <Header onOpenReport={handleOpenReport} />

        {/* Stats bar */}
        <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center gap-6 text-xs text-slate-600 flex-shrink-0">
          <div>
            <span className="text-slate-400">配車済み: </span>
            <span className="font-semibold text-slate-800">{totalOrders}件</span>
          </div>
          <div>
            <span className="text-slate-400">未配車: </span>
            <span className="font-semibold text-slate-800">{unassignedOrders.length}件</span>
          </div>
          <div>
            <span className="text-slate-400">稼働便: </span>
            <span className="font-semibold text-slate-800">{totalRoutes}便</span>
          </div>
          <div>
            <span className="text-slate-400">表示期間: </span>
            <span className="font-semibold text-slate-800">{days.length}日間</span>
          </div>
        </div>

        {/* Main content - horizontal scroll */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Unassigned orders */}
          <div className="w-[240px] flex-shrink-0 border-r border-gray-300 p-2">
            <UnassignedPanel orders={unassignedOrders} />
          </div>

          {/* Main panel: Day columns with horizontal scroll */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-2 p-2 h-full">
              {days.map((day, index) => (
                <DayColumn
                  key={day.id}
                  day={day}
                  isToday={index === 0} // First day is "today" for demo
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
