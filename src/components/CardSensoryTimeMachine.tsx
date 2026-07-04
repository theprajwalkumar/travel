'use client';

import { Headphones, Play, Pause } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { SensoryStep } from '@/types';

interface Props {
  steps: SensoryStep[];
}

export default function CardSensoryTimeMachine({ steps }: Props) {
  const { audioPlaying, setAudioPlaying } = useApp();

  const toggle = (index: number) => {
    setAudioPlaying(audioPlaying === index ? null : index);
  };

  return (
    <div className="glass rounded-2xl p-6 glass-hover animate-fade-in-up stagger-2 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[var(--secondary-bg)] flex items-center justify-center">
          <Headphones className="w-4 h-4 text-[var(--secondary)]" />
        </div>
        <h3 className="text-sm font-semibold text-white">
          The Sensory Time Machine
        </h3>
      </div>

      <div className="space-y-3 flex-1">
        {steps.map((step, i) => {
          const isPlaying = audioPlaying === i;
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                isPlaying
                  ? 'bg-[var(--accent-bg)] border-[var(--accent-border)] shadow-[var(--active-glow)]'
                  : 'bg-white/[0.02] border-white/[0.04]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                  isPlaying
                    ? 'bg-[var(--accent-bg)] ring-1 ring-[var(--accent-border)]'
                    : 'bg-white/[0.04]'
                }`}
              >
                <span
                  className={`text-xs font-bold ${
                    isPlaying ? 'text-[var(--accent)]' : 'text-zinc-500'
                  }`}
                >
                  {i + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium text-white">
                    {step.title}
                  </h4>
                  <span className="text-[10px] text-zinc-600 flex-shrink-0">
                    {step.duration}
                  </span>
                </div>
                <p
                  className={`text-xs mt-1 leading-relaxed transition-colors duration-300 ${
                    isPlaying ? 'text-zinc-200' : 'text-zinc-400'
                  }`}
                >
                  {step.description}
                </p>
              </div>

              <button
                onClick={() => toggle(i)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isPlaying
                    ? 'bg-[var(--accent-bg)] text-[var(--accent)]'
                    : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200'
                }`}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {audioPlaying !== null && (
        <div className="mt-4 flex items-center gap-2 text-[10px] text-[var(--accent)]/60 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          Immersing in &ldquo;{steps[audioPlaying]?.title}&rdquo;
        </div>
      )}
    </div>
  );
}
