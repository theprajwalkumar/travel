'use client';

import { Compass, X } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#050505] border-r border-white/[0.04] z-50
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <a
            href="/"
            className="flex items-center gap-3 group"
            aria-label={`${APP_NAME} — home`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-400/15 flex items-center justify-center border border-emerald-500/10 group-focus-visible:ring-2 group-focus-visible:ring-emerald-400/40">
              <Compass className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Bon-Voyage
              </h1>
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                .io
              </p>
            </div>
          </a>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 p-5">
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            Discover hidden cultural experiences wherever you go — powered by AI.
          </p>
        </div>

        <div className="p-5 border-t border-white/[0.04]">
          <p className="text-[10px] text-zinc-700 leading-relaxed italic">
            &ldquo;Travel is the only thing you buy that makes you richer.&rdquo;
          </p>
        </div>
      </aside>
    </>
  );
}
