'use client';

import { memo, useEffect, useState } from 'react';
import { BookHeart, Quote } from 'lucide-react';

interface Props {
  destination: string;
}

interface HeritageStory {
  title: string;
  community: string;
  summary: string;
}

/** Fetches and displays oral heritage stories from the MCP proxy. */
function HeritagePanel({ destination }: Props) {
  const [stories, setStories] = useState<HeritageStory[]>([]);
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
        server: 'heritage',
        tool: 'search_stories',
        params: { query: destination || 'cultural heritage' },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (abort.signal.aborted) return;
        if (!data.success) {
          setError(data.error || 'Failed to load heritage stories');
          return;
        }
        setStories(data.data?.stories ?? []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('Unable to load heritage stories');
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });

    return () => abort.abort();
  }, [destination]);

  if (loading) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading heritage stories">
        {[0, 1].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-white/[0.03] animate-pulse-soft" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-xs text-zinc-500 text-center py-4" role="alert">{error}</p>;
  if (stories.length === 0) return <p className="text-xs text-zinc-500 text-center py-4">No heritage stories found.</p>;

  return (
    <div className="space-y-2" role="list" aria-label="Heritage stories">
      {stories.map((story, i) => (
        <div
          key={i}
          role="listitem"
          className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
        >
          <div className="flex items-start gap-2">
            <Quote className="w-3.5 h-3.5 text-rose-400/70 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-zinc-200">{story.title}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{story.community}</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{story.summary}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(HeritagePanel);
