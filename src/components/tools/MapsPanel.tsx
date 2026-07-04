'use client';

import { useState, useCallback } from 'react';
import { MapPin, Star, Navigation, Loader2 } from 'lucide-react';

interface Place {
  name: string;
  rating: number;
  vicinity: string;
  types: string[];
}

export default function MapsPanel({ destination }: { destination: string }) {
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (!destination.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/mcp/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server: 'maps',
          tool: 'search_places',
          params: { query: `cultural sites in ${destination}` },
        }),
      });
      const json = await res.json();

      if (json.data?.[0]?.text) {
        const lines = json.data[0].text.split('\n').filter(Boolean);
        setPlaces(
          lines.map((l: string) => {
            const parts = l.split('|');
            return {
              name: parts[0]?.trim() ?? 'Unknown',
              rating: parseFloat(parts[1]) || 4.5,
              vicinity: parts[2]?.trim() ?? '',
              types: ['cultural'],
            };
          }),
        );
      } else if (json.data?.places) {
        setPlaces(json.data.places);
      }
    } catch {
      /* fallback handled by route */
    } finally {
      setLoading(false);
    }
  }, [destination]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-zinc-400">Local Places</span>
        </div>
        <button
          onClick={search}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Search Area'
          )}
        </button>
      </div>

      {!places && !loading && (
        <p className="text-xs text-zinc-500 text-center py-6">
          Hit &ldquo;Search Area&rdquo; to discover cultural spots near {destination || 'your destination'}
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse-soft" />
          ))}
        </div>
      )}

      {places && !loading && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {places.map((place, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] glass-hover"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {place.name}
                </p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {place.vicinity}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400/70" />
                    <span className="text-xs text-zinc-400">{place.rating}</span>
                  </div>
                  {place.types?.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Navigate"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
