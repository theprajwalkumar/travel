'use client';

import { memo, useEffect, useState } from 'react';
import { CloudSun, Thermometer, Droplets } from 'lucide-react';

interface Props {
  destination: string;
}

interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  condition: string;
}

interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
}

/** Fetches and displays current weather + forecast from the MCP proxy. */
function WeatherPanel({ destination }: Props) {
  const [weather, setWeather] = useState<{
    current?: WeatherCurrent;
    forecast?: WeatherForecast[];
  } | null>(null);
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
        server: 'weather',
        tool: 'get_current_weather',
        params: { location: destination || 'ubud' },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (abort.signal.aborted) return;
        if (!data.success) {
          setError(data.error || 'Failed to load weather');
          return;
        }
        setWeather(data.data ?? null);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Unable to load weather');
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });

    return () => abort.abort();
  }, [destination]);

  if (loading) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading weather">
        <div className="h-16 rounded-lg bg-white/[0.03] animate-pulse-soft" />
        <div className="h-12 rounded-lg bg-white/[0.03] animate-pulse-soft" />
      </div>
    );
  }

  if (error) return <p className="text-xs text-zinc-500 text-center py-4" role="alert">{error}</p>;
  if (!weather) return <p className="text-xs text-zinc-500 text-center py-4">No weather data.</p>;

  return (
    <div>
      {weather.current && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold text-white">{weather.current.temp}°</p>
              <p className="text-[10px] text-zinc-500">{weather.current.condition}</p>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Thermometer className="w-3 h-3" aria-hidden="true" />
              Feels like {weather.current.feelsLike}°
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Droplets className="w-3 h-3" aria-hidden="true" />
              {weather.current.humidity}%
            </div>
          </div>
        </div>
      )}

      {weather.forecast && weather.forecast.length > 0 && (
        <div className="space-y-1" role="list" aria-label="Weather forecast">
          {weather.forecast.map((day, i) => (
            <div
              key={i}
              role="listitem"
              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
            >
              <span className="text-xs text-zinc-300">{day.day}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">{day.condition}</span>
                <span className="text-xs text-zinc-400">
                  {day.low}° / {day.high}°
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(WeatherPanel);
