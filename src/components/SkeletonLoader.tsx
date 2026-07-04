'use client';

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
  );
}
