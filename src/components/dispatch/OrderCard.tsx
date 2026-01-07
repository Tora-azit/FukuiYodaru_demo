'use client';

import { Draggable } from '@hello-pangea/dnd';
import { AlertTriangle } from 'lucide-react';
import { Order } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  index: number;
}

export function OrderCard({ order, index }: OrderCardProps) {
  return (
    <Draggable draggableId={order.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'bg-white border border-gray-300 rounded-sm px-2 py-1.5 mb-1 cursor-grab',
            'hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-100',
            'active:cursor-grabbing',
            snapshot.isDragging && 'shadow-lg border-blue-500 ring-2 ring-blue-200 rotate-1'
          )}
        >
          {/* Customer name and weight on same line */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-800 truncate flex-1">
              {order.customerName}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
              {order.weight.toLocaleString()}kg
            </span>
          </div>

          {/* Special note if present */}
          {order.specialNote && (
            <div className="flex items-center gap-1 mt-0.5">
              <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-amber-700 truncate">
                {order.specialNote}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
