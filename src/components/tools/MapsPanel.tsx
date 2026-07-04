'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Navigation } from 'lucide-react';
import type { FallbackPlacesResult } from '@/types';

interface Props {
  destination: string;
}

interface PlaceResult {
  name: string;
  rating: number;
  vicinity: string;
  types: string[];
}

export default function MapsPanel({ destination }: Props) {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/mcp/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        server: 'maps',
        tool: 'search_places',
        params: { query: destination || 'cultural places' },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          setError(data.error || 'Failed to load places');
          return;
        }
        const resultData = data.data as { places?: PlaceResult[] };
        setPlaces(resultData.places ?? []);
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load places');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [destination]);

  if (loading) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading places">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-white/[0.03] animate-pulse-soft" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-xs text-zinc-500 text-center py-4" role="alert">{error}</p>
    );
  }

  if (places.length === 0) {
    return (
      <p className="text-xs text-zinc-500 text-center py-4">No places found.</p>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Nearby places">
      {places.map((place, i) => (
        <div
          key={i}
          role="listitem"
          className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
        >
          <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{place.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{place.vicinity}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-3 h-3 text-amber-400/70" aria-hidden="true" />
              <span className="text-[10px] text-zinc-400">{place.rating}</span>
              {place.types?.length > 0 && (
                <span className="text-[10px] text-zinc-500 capitalize">
                  &middot; {place.types.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
          </div>
          <Navigation className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-1" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
