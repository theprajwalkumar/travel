'use client';

import { memo, useEffect, useState } from 'react';
import { Plane, Clock, ArrowRight } from 'lucide-react';

interface Props {
  destination: string;
}

interface FlightResult {
  airline: string;
  price: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
}

/** Fetches and displays available flights from the MCP proxy. */
function FlightsPanel({ destination }: Props) {
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    setError(null);

    fetch('/api/mcp/proxy', {
      signal: abort.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        server: 'flights',
        tool: 'search_flights',
        params: { destination: destination || 'ubud' },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (abort.signal.aborted) return;
        if (!data.success) {
          setError(data.error || 'Failed to load flights');
          return;
        }
        setFlights(data.data?.flights ?? []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Unable to load flights');
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });

    return () => abort.abort();
  }, [destination]);

  if (loading) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading flights">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-white/[0.03] animate-pulse-soft" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-xs text-zinc-500 text-center py-4" role="alert">{error}</p>;
  if (flights.length === 0) return <p className="text-xs text-zinc-500 text-center py-4">No flights found.</p>;

  return (
    <div className="space-y-2" role="list" aria-label="Available flights">
      {flights.map((f, i) => (
        <div
          key={i}
          role="listitem"
          className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
        >
          <Plane className="w-4 h-4 text-teal-400 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-200">{f.airline}</p>
              <span className="text-xs font-semibold text-emerald-300">{f.price}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-zinc-500">{f.departure}</span>
              <ArrowRight className="w-2.5 h-2.5 text-zinc-600" aria-hidden="true" />
              <span className="text-[10px] text-zinc-500">{f.arrival}</span>
              <Clock className="w-2.5 h-2.5 text-zinc-600 ml-1" aria-hidden="true" />
              <span className="text-[10px] text-zinc-500">{f.duration}</span>
              <span className="text-[10px] text-zinc-600">
                &middot; {f.stops === 0 ? 'Direct' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(FlightsPanel);
