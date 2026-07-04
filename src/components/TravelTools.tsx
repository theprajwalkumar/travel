'use client';

import { useState } from 'react';
import { Map, Plane, CloudSun, BookHeart, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MapsPanel from './tools/MapsPanel';
import FlightsPanel from './tools/FlightsPanel';
import WeatherPanel from './tools/WeatherPanel';
import HeritagePanel from './tools/HeritagePanel';

const TABS = [
  { key: 'maps', label: 'Places', Icon: Map, color: 'text-emerald-400', description: 'Discover local places and points of interest' },
  { key: 'flights', label: 'Flights', Icon: Plane, color: 'text-teal-400', description: 'Search for flights to your destination' },
  { key: 'weather', label: 'Weather', Icon: CloudSun, color: 'text-amber-400', description: 'Check current weather and forecast' },
  { key: 'heritage', label: 'Heritage', Icon: BookHeart, color: 'text-rose-400', description: 'Explore cultural heritage stories' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function TravelTools() {
  const { destination } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  if (!activeTab) {
    return (
      <section
        className="glass rounded-2xl p-5 animate-fade-in"
        aria-label="Travel tools"
      >
        <h2 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Travel Tools
        </h2>
        <div className="grid grid-cols-2 gap-2" role="list" aria-label="Available tools">
          {TABS.map(({ key, label, Icon, color, description }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              role="listitem"
              aria-label={`Open ${label} tool: ${description}`}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] glass-hover transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
            >
              <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
              <span className="text-xs font-medium text-zinc-300">{label}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  const active = TABS.find((t) => t.key === activeTab)!;

  return (
    <section
      className="glass rounded-2xl p-5 animate-fade-in"
      aria-label={`Travel tool: ${active.label}`}
    >
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <active.Icon className={`w-4 h-4 ${active.color}`} aria-hidden="true" />
          </div>
          <h2 className="text-sm font-medium text-white">{active.label}</h2>
        </div>
        <button
          onClick={() => setActiveTab(null)}
          className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          aria-label={`Close ${active.label} tool`}
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </header>

      {activeTab === 'maps' && <MapsPanel destination={destination} />}
      {activeTab === 'flights' && <FlightsPanel destination={destination} />}
      {activeTab === 'weather' && <WeatherPanel destination={destination} />}
      {activeTab === 'heritage' && <HeritagePanel destination={destination} />}
    </section>
  );
}
