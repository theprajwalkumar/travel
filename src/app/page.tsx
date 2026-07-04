'use client';

import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import DiscoveryHub from '@/components/DiscoveryHub';
import LiveMatrix from '@/components/LiveMatrix';
import TravelTools from '@/components/TravelTools';
import { AppProvider } from '@/context/AppContext';

function Dashboard() {
  const { mode } = useApp();
  return (
    <div className="flex h-full bg-[#050505] text-zinc-100" data-mode={mode}>
      {mode === 'wholesome' && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.04),transparent_70%)]" />
      )}
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-0">
        <DiscoveryHub />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3">
              <LiveMatrix />
            </div>
            <div className="lg:col-span-1">
              <TravelTools />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
