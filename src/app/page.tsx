'use client';

import Sidebar from '@/components/Sidebar';
import DiscoveryHub from '@/components/DiscoveryHub';
import LiveMatrix from '@/components/LiveMatrix';
import TravelTools from '@/components/TravelTools';
import { AppProvider } from '@/context/AppContext';

function Dashboard() {
  return (
    <div className="flex h-full bg-[#050505] text-zinc-100">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-0">
        <DiscoveryHub />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0">
              <LiveMatrix />
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-6">
                <TravelTools />
              </div>
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
