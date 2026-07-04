'use client';

import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { QUOTES } from '@/lib/constants';

export default function SkeletonLoader() {
  const [quote, setQuote] = useState<string>(QUOTES[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div role="status" aria-label="Loading travel experience" aria-live="polite">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="max-w-md text-center px-6 animate-quote-fade">
          <Compass className="w-8 h-8 text-emerald-400/20 mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-zinc-500/60 italic leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 opacity-30" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 space-y-5 overflow-hidden relative"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer-sweep" />
            <div className="flex items-center gap-2.5 relative">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] animate-pulse-soft" />
              <div className="h-4 w-48 rounded-md bg-white/[0.04] animate-pulse-soft" />
            </div>
            {[...Array(i === 1 ? 3 : 2)].map((_, j) => (
              <div key={j} className="space-y-2.5 relative">
                <div className="h-3 w-24 rounded-md bg-white/[0.04] animate-pulse-soft" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full rounded-md bg-white/[0.03] animate-pulse-soft" />
                  <div className="h-2.5 w-5/6 rounded-md bg-white/[0.03] animate-pulse-soft" />
                  <div className="h-2.5 w-4/6 rounded-md bg-white/[0.03] animate-pulse-soft" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <span className="sr-only">Generating your travel experience, please wait</span>
    </div>
  );
}
