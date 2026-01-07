'use client';

import { Truck, Calendar, RefreshCw, FileText } from 'lucide-react';

interface HeaderProps {
  onOpenReport?: () => void;
}

export function Header({ onOpenReport }: HeaderProps) {
  // Get current date in Japanese format
  const today = new Date();
  const dateStr = today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const handleReset = () => {
    // Simple page reload to reset state
    window.location.reload();
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-700">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">配車管理システム</h1>
            <p className="text-[11px] text-slate-400">Dispatch Management System</p>
          </div>
        </div>

        {/* Center: Date */}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Calendar className="w-4 h-4" />
          <span>{dateStr}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Report Preview Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            配達日報プレビュー
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            リセット
          </button>
        </div>
      </div>
    </header>
  );
}
