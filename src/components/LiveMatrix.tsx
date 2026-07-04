'use client';

import { useApp } from '@/context/AppContext';
import { Compass } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';
import CardHiddenGems from './CardHiddenGems';
import CardSensoryTimeMachine from './CardSensoryTimeMachine';
import CardWholesomePlaybook from './CardWholesomePlaybook';

export default function LiveMatrix() {
  const { experience, isLoading } = useApp();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!experience) {
    return <EmptyState />;
  }

  return (
    <section aria-label="Travel experience results">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <CardHiddenGems data={experience.hidden_gems} />
        <CardSensoryTimeMachine steps={experience.sensory_time_machine} />
        <CardWholesomePlaybook data={experience.wholesome_playbook} />
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 text-center"
      role="status"
      aria-label="No travel experience loaded"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-5">
        <Compass className="w-7 h-7 text-zinc-600" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-zinc-400 mb-2">
        Discover Something Real
      </h2>
      <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
        Tell us where you&apos;re headed, pick a vibe, and let Bon-Voyage.io
        uncover the hidden stories, sensory landscapes, and human connections
        waiting for you.
      </p>
    </div>
  );
}
