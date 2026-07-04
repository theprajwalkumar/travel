'use client';

import { memo } from 'react';
import { Sparkles, Star, MapPin } from 'lucide-react';
import type { HiddenGems } from '@/types';

interface Props {
  data: HiddenGems;
}

function Section({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <section>
      <h4 className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </h4>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </section>
  );
}

/** Card displaying the cultural hook, personal relevance, and local field tip. */
function CardHiddenGems({ data }: Props) {
  return (
    <article
      className="glass rounded-2xl p-6 glass-hover animate-fade-in-up stagger-1 h-full flex flex-col"
      aria-label="Hidden gems and local secrets"
    >
      <header className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-white">Hidden Gems &amp; Local Secrets</h3>
      </header>

      <div className="space-y-5 flex-1">
        <Section
          icon={<Star className="w-3.5 h-3.5 text-amber-400/70" aria-hidden="true" />}
          label="The Cultural Hook"
          text={data.cultural_hook}
        />
        <Section
          icon={<Star className="w-3.5 h-3.5 text-rose-400/70" aria-hidden="true" />}
          label="Why For You"
          text={data.why_for_you}
        />
        <footer className="mt-auto pt-2">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
            <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider mb-1">
                Local Field Tip
              </p>
              <p className="text-xs text-zinc-300 leading-relaxed">{data.local_field_tip}</p>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default memo(CardHiddenGems);
