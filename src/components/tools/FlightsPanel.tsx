'use client';

import { useState, useCallback } from 'react';
import { Plane, Clock, ArrowRight, CircleDot, Loader2 } from 'lucide-react';

interface Flight {
  airline: string;
  price: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
}

export default function FlightsPanel({ destination }: { destination: string }) {
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/mcp/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server: 'flights',
          tool: 'search_flights',
          params: { origin, destination, date: new Date().toISOString().split('T')[0] },
        }),
      });
      const json = await res.json();

      if (json.data?.[0]?.text) {
        const lines = json.data[0].text.split('\n').filter(Boolean);
        setFlights(
          lines.map((l: string) => {
            const parts = l.split('|');
            return {
              airline: parts[0]?.trim() ?? 'Unknown',
              price: parts[1]?.trim() ?? '--',
              duration: parts[2]?.trim() ?? '--',
              stops: parseInt(parts[3]) || 0,
              departure: parts[4]?.trim() ?? '--',
              arrival: parts[5]?.trim() ?? '--',
            };
          }),
        );
      } else if (json.data?.flights) {
        setFlights(json.data.flights);
      }
    } catch {
      /* fallback */
    } finally {
      setLoading(false);
    }
  }, [origin, destination]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="From (city)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600"
          />
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
        <div className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs text-zinc-400 truncate block">
            {destination || 'Destination'}
          </span>
        </div>
        <button
          onClick={search}
          disabled={loading || !origin.trim()}
          className="text-xs px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </div>

      {!flights && !loading && (
        <p className="text-xs text-zinc-500 text-center py-6">
          Enter your departure city and search for flights
        </p>
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse-soft" />
          ))}
        </div>
      )}

      {flights && !loading && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {flights.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] glass-hover"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <Plane className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{f.airline}</span>
                  <span className="text-sm font-semibold text-emerald-300">{f.price}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {f.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <CircleDot className="w-3 h-3" />
                    {f.stops === 0 ? 'Nonstop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
                  </span>
                  <span>
                    {f.departure} &ndash; {f.arrival}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
