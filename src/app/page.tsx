import { DispatchBoard } from '@/components/dispatch';

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <main className="flex-1 overflow-hidden">
        <DispatchBoard />
      </main>
    </div>
  );
}
