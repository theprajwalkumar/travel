'use client';

import { useState, useCallback } from 'react';
import { Sun, Cloud, Thermometer, Droplets, Loader2 } from 'lucide-react';

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
}

export default function WeatherPanel({ destination }: { destination: string }) {
  const [weather, setWeather] = useState<{
    current: { temp: number; feelsLike: number; humidity: number; condition: string };
    forecast: ForecastDay[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async () => {
    if (!destination.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/mcp/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server: 'weather',
          tool: 'get_current_weather',
          params: { location: destination },
        }),
      });
      const json = await res.json();

      if (json.data?.[0]?.text) {
        try {
          setWeather(JSON.parse(json.data[0].text));
        } catch {
          /* fall through */
        }
      } else if (json.data?.current) {
        setWeather(json.data);
      }
    } catch {
      /* fallback */
    } finally {
      setLoading(false);
    }
  }, [destination]);

  return (
    <div className="space-y-4">
      <button
        onClick={fetchWeather}
        disabled={loading}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] glass-hover disabled:opacity-40"
      >
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-teal-400" />
          <span className="text-xs text-zinc-400">
            {weather ? 'Refresh weather' : `Check weather in ${destination || 'your destination'}`}
          </span>
        </div>
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400/70" />
        )}
      </button>

      {weather && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-400/5 border border-emerald-500/10">
            <div>
              <p className="text-3xl font-light text-white">{weather.current.temp}°</p>
              <p className="text-xs text-zinc-400 mt-1">{weather.current.condition}</p>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2 justify-end">
                <Thermometer className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-400">Feels {weather.current.feelsLike}°</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Droplets className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-400">{weather.current.humidity}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {weather.forecast.map((day, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center"
              >
                <p className="text-xs font-medium text-white">{day.day}</p>
                <p className="text-xs text-zinc-500 mt-1">{day.condition}</p>
                <p className="text-sm text-zinc-300 mt-1">
                  {day.high}° / {day.low}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
