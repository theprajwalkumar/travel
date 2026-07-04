'use client';

import { useState } from 'react';
import { Map, Plane, CloudSun, BookHeart, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import MapsPanel from './tools/MapsPanel';
import FlightsPanel from './tools/FlightsPanel';
import WeatherPanel from './tools/WeatherPanel';
import HeritagePanel from './tools/HeritagePanel';

const TABS = [
  { key: 'maps', label: 'Places', Icon: Map, color: 'text-emerald-400' },
  { key: 'flights', label: 'Flights', Icon: Plane, color: 'text-teal-400' },
  { key: 'weather', label: 'Weather', Icon: CloudSun, color: 'text-amber-400' },
  { key: 'heritage', label: 'Heritage', Icon: BookHeart, color: 'text-rose-400' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function TravelTools() {
  const { destination } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  if (!activeTab) {
    return (
      <div className="glass rounded-2xl p-5 animate-fade-in">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Travel Tools
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TABS.map(({ key, label, Icon, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] glass-hover transition-all"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs font-medium text-zinc-300">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const active = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="glass rounded-2xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <active.Icon className={`w-4 h-4 ${active.color}`} />
          </div>
          <span className="text-sm font-medium text-white">{active.label}</span>
        </div>
        <button
          onClick={() => setActiveTab(null)}
          className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {activeTab === 'maps' && <MapsPanel destination={destination} />}
      {activeTab === 'flights' && <FlightsPanel destination={destination} />}
      {activeTab === 'weather' && <WeatherPanel destination={destination} />}
      {activeTab === 'heritage' && <HeritagePanel destination={destination} />}
    </div>
  );
}
