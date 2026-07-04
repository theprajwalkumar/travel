'use client';

import { Sparkles, Star, MapPin } from 'lucide-react';
import type { HiddenGems } from '@/types';

interface Props {
  data: HiddenGems;
}

export default function CardHiddenGems({ data }: Props) {
  return (
    <div className="glass rounded-2xl p-6 glass-hover animate-fade-in-up stagger-1 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg)] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
        </div>
        <h3 className="text-sm font-semibold text-white">
          Hidden Gems &amp; Local Secrets
        </h3>
      </div>

      <div className="space-y-5 flex-1">
        <Section
          icon={<Star className="w-3.5 h-3.5 text-amber-400/70" />}
          label="The Cultural Hook"
          text={data.cultural_hook}
        />
        <Section
          icon={<Star className="w-3.5 h-3.5 text-rose-400/70" />}
          label="Why For You"
          text={data.why_for_you}
        />
        <div className="mt-auto pt-2">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--accent-bg-4)] border border-[var(--accent-border-10)]">
            <MapPin className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-[var(--accent)]/80 uppercase tracking-wider mb-1">
                Local Field Tip
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {data.local_field_tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}
