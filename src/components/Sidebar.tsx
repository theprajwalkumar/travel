'use client';

import { Compass, User, Heart, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { AppMode } from '@/types';

export default function Sidebar() {
  const { mode, setMode } = useApp();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#050505] border-r border-white/[0.04] z-30">
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center border border-[var(--accent-border-10)]">
            <Compass className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">
              Cultural
            </h1>
            <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
              Horizons
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] flex items-center justify-center border border-white/5">
            <User className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Alex Rivera</p>
            <p className="text-[11px] text-zinc-500">Solo Explorer</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Journey Mode
        </p>
        <div className="relative flex bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
          <div
            className={`absolute inset-y-1 w-1/2 rounded-lg bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] border border-white/[0.06] transition-all duration-400 ease-out ${
              mode === 'adventure' ? 'left-1' : 'left-[calc(50%-2px)]'
            }`}
          />
          <button
            onClick={() => setMode('adventure')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
              mode === 'adventure'
                ? 'text-[var(--accent)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Adventure
          </button>
          <button
            onClick={() => setMode('wholesome')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
              mode === 'wholesome'
                ? 'text-[var(--accent)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Wholesome
          </button>
        </div>
      </div>

      <div className="mt-auto p-5 border-t border-white/[0.04]">
        <p className="text-[10px] text-zinc-700 leading-relaxed italic">
          &ldquo;Travel is the only thing you buy that makes you richer.&rdquo;
        </p>
      </div>
    </aside>
  );
}
