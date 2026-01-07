'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Inbox, Clock } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { UnassignedOrder } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface UnassignedPanelProps {
  orders: UnassignedOrder[];
}

export function UnassignedPanel({ orders }: UnassignedPanelProps) {
  // Calculate total weight
  const totalWeight = orders.reduce((sum, order) => sum + order.weight, 0);

  return (
    <div className="bg-white border border-gray-300 rounded-sm h-full flex flex-col min-w-[220px]">
      {/* Header */}
      <div className="px-3 py-2 bg-slate-800 text-white border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Inbox className="w-4 h-4" />
          <h2 className="text-sm font-bold">未配車</h2>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5">
          <span>{orders.length}件</span>
          <span>{totalWeight.toLocaleString()}kg</span>
        </div>
      </div>

      {/* Droppable area */}
      <Droppable droppableId="unassigned" type="ORDER">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 p-2 overflow-y-auto transition-colors duration-100',
              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-slate-50'
            )}
          >
            {orders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
                <Inbox className="w-8 h-8 mb-2 opacity-40" />
                <span className="text-xs">全て配車済み</span>
              </div>
            ) : (
              orders.map((order, index) => (
                <div key={order.id} className="mb-1">
                  <OrderCard order={order} index={index} />
                  {/* Show requested date if present */}
                  {order.requestedDate && (
                    <div className="flex items-center gap-1 px-2 -mt-0.5 mb-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      <span className="text-[9px] text-slate-400">
                        {order.requestedDate}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
