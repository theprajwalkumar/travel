'use client';

import { Compass, User } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#050505] border-r border-white/[0.04] z-30">
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-400/15 flex items-center justify-center border border-emerald-500/10">
            <Compass className="w-5 h-5 text-emerald-400" />
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-400/10 flex items-center justify-center border border-white/5">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Alex Rivera</p>
            <p className="text-[11px] text-zinc-500">Solo Explorer</p>
          </div>
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
