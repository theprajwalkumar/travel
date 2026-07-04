'use client';

import { useState, useCallback } from 'react';
import { Heart, Copy, Check } from 'lucide-react';
import type { WholesomePlaybook } from '@/types';

interface Props {
  data: WholesomePlaybook;
}

export default function CardWholesomePlaybook({ data }: Props) {
  const [copied, setCopied] = useState(false);

  const copyPhrase = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${data.parting_words_of_gratitude.local_phrase} (${data.parting_words_of_gratitude.phonetic})`
      );
    } catch {
      const ta = document.createElement('textarea');
      ta.value = `${data.parting_words_of_gratitude.local_phrase} (${data.parting_words_of_gratitude.phonetic})`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data.parting_words_of_gratitude]);

  return (
    <div className="glass rounded-2xl p-6 glass-hover animate-fade-in-up stagger-3 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
          <Heart className="w-4 h-4 text-rose-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">
          Wholesome Connection Playbook
        </h3>
      </div>

      <div className="space-y-4 flex-1">
        <Section
          label="Community Spotlight"
          text={data.community_spotlight}
        />
        <Section
          label="The Wholesome Angle"
          text={data.the_wholesome_angle}
        />
        <Section
          label="Connection Micro-Action"
          text={data.connection_micro_action}
        />
        <Section
          label="Supporting the Soul"
          text={data.supporting_the_soul}
        />
      </div>

      <div className="mt-4 p-4 rounded-xl bg-[var(--accent-bg-4)] border border-[var(--accent-border-10)]">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-3.5 h-3.5 text-rose-400/70" />
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Parting Words of Gratitude
          </span>
        </div>
        <p className="text-base font-medium text-[var(--accent-light)] leading-snug">
          {data.parting_words_of_gratitude.local_phrase}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-zinc-500 font-mono">
            {data.parting_words_of_gratitude.phonetic}
          </span>
          <button
            onClick={copyPhrase}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] transition-all duration-200"
            title="Copy phrase with phonetic"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[var(--accent)]" />
                <span className="text-[var(--accent)]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed italic">
          {data.parting_words_of_gratitude.emotional_intent}
        </p>
      </div>
    </div>
  );
}

function Section({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}
