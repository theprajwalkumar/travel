'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DiscoveryHub from '@/components/DiscoveryHub';
import LiveMatrix from '@/components/LiveMatrix';
import TravelTools from '@/components/TravelTools';
import { AppProvider } from '@/context/AppContext';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-[#050505] text-zinc-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-h-0 lg:ml-64" role="main">
        <DiscoveryHub onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col xl:flex-row gap-5">
            <div className="flex-1 min-w-0">
              <LiveMatrix />
            </div>
            <aside className="w-full xl:w-80 flex-shrink-0" aria-label="Travel tools sidebar">
              <div className="xl:sticky xl:top-6">
                <TravelTools />
              </div>
            </aside>
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
