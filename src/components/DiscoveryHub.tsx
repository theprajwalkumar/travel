'use client';

import { useState, useCallback } from 'react';
import { MapPin, Sparkles, Menu } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { fetchDiscoverExperience } from '@/lib/api';
import { VIBE_OPTIONS, APP_NAME } from '@/lib/constants';
import type { VibeOption } from '@/lib/constants';

interface Props {
  onMenuClick: () => void;
}

export default function DiscoveryHub({ onMenuClick }: Props) {
  const {
    setDestination,
    currentVibe,
    setCurrentVibe,
    setIsLoading,
    setExperience,
  } = useApp();

  const [localDest, setLocalDest] = useState('');

  const generate = useCallback(async () => {
    const trimmed = localDest.trim();
    if (!trimmed) return;
    setDestination(trimmed);
    setIsLoading(true);
    setExperience(null);
    try {
      const experience = await fetchDiscoverExperience({
        userLocation: trimmed,
        userVibe: currentVibe,
        currentDateTimeSeason: 'Afternoon',
      });
      setExperience(experience);
    } catch {
      const { mockExperience } = await import('@/lib/mockData');
      setExperience(mockExperience);
    } finally {
      setIsLoading(false);
    }
  }, [localDest, currentVibe, setDestination, setIsLoading, setExperience]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.repeat) {
      generate();
    }
  };

  return (
    <header
      role="banner"
      aria-label={`${APP_NAME} search and discovery controls`}
      className="sticky top-0 z-20 border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="relative flex-1 min-w-0">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            placeholder="Where are you heading?"
            value={localDest}
            onChange={(e) => setLocalDest(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Travel destination"
            autoComplete="off"
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:border-emerald-400/30 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.15)] focus-visible:outline-none"
          />
        </div>

        <div className="relative hidden sm:block">
          <label htmlFor="vibe-select" className="sr-only">Select travel vibe</label>
          <select
            id="vibe-select"
            value={currentVibe}
            onChange={(e) => setCurrentVibe(e.target.value as VibeOption)}
            className="appearance-none bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 pr-10 text-sm text-zinc-300 cursor-pointer transition-all duration-200 min-w-[140px] focus:border-emerald-400/30 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.15)] focus-visible:outline-none"
          >
            {VIBE_OPTIONS.map((vibe) => (
              <option key={vibe} value={vibe} className="bg-[#0a0a0a]">
                {vibe}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500" aria-hidden="true">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!localDest.trim()}
          aria-label="Generate travel experience"
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-400/15 border border-emerald-500/20 text-emerald-300 text-sm font-medium transition-all duration-200 hover:from-emerald-500/25 hover:to-teal-400/25 hover:border-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Generate</span>
        </button>
      </div>

      <nav className="sm:hidden px-4 pb-3 flex gap-2 overflow-x-auto" aria-label="Vibe selection">
        {VIBE_OPTIONS.map((vibe) => (
          <button
            key={vibe}
            onClick={() => setCurrentVibe(vibe)}
            aria-pressed={currentVibe === vibe}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 ${
              currentVibe === vibe
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:bg-white/[0.06]'
            }`}
          >
            {vibe}
          </button>
        ))}
      </nav>
    </header>
  );
}
