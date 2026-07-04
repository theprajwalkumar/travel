'use client';

import { useState, useCallback } from 'react';
import { Book, Loader2, ChevronRight } from 'lucide-react';

interface Story {
  title: string;
  community: string;
  summary: string;
}

export default function HeritagePanel({ destination }: { destination: string }) {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (!destination.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/mcp/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server: 'heritage',
          tool: 'search_stories',
          params: { query: destination },
        }),
      });
      const json = await res.json();

      if (json.data?.[0]?.text) {
        const lines = json.data[0].text.split('\n').filter(Boolean);
        setStories(
          lines.map((l: string) => {
            const parts = l.split('|');
            return {
              title: parts[0]?.trim() ?? 'Untitled Story',
              community: parts[1]?.trim() ?? 'Local Community',
              summary: parts[2]?.trim() ?? '',
            };
          }),
        );
      } else if (json.data?.stories) {
        setStories(json.data.stories);
      }
    } catch {
      /* fallback */
    } finally {
      setLoading(false);
    }
  }, [destination]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4 text-rose-400" />
          <span className="text-xs text-zinc-400">Oral Traditions</span>
        </div>
        <button
          onClick={search}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            'Discover Stories'
          )}
        </button>
      </div>

      {!stories && !loading && (
        <p className="text-xs text-zinc-500 text-center py-6">
          Uncover oral heritage stories from {destination || 'your destination'}
        </p>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse-soft" />
          ))}
        </div>
      )}

      {stories && !loading && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {stories.map((story, i) => (
            <div
              key={i}
              className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] glass-hover cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <Book className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white group-hover:text-rose-300 transition-colors">
                    {story.title}
                  </p>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-rose-400 transition-colors flex-shrink-0" />
                </div>
                <p className="text-[11px] text-rose-400/60 mt-0.5">{story.community}</p>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                  {story.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
