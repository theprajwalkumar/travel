'use client';

import { useCallback } from 'react';
import { Headphones, Play, Pause, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { TTS_RATE, TTS_PITCH, TTS_VOLUME } from '@/lib/constants';
import type { SensoryStep } from '@/types';

interface Props {
  steps: SensoryStep[];
}

export default function CardSensoryTimeMachine({ steps }: Props) {
  const { audioPlaying, setAudioPlaying } = useApp();

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = TTS_RATE;
      utterance.pitch = TTS_PITCH;
      utterance.volume = TTS_VOLUME;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const toggle = (index: number) => {
    if (audioPlaying === index) {
      stop();
      setAudioPlaying(null);
    } else {
      stop();
      setAudioPlaying(index);
      speak(steps[index].description);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(index);
    }
  };

  return (
    <article
      className="glass rounded-2xl p-6 glass-hover animate-fade-in-up stagger-2 h-full flex flex-col"
      aria-label="Sensory time machine with audio narration"
    >
      <header className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
          <Headphones className="w-4 h-4 text-teal-400" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-white">
          The Sensory Time Machine
        </h3>
      </header>

      <div className="space-y-3 flex-1" role="list" aria-label="Narration steps">
        {steps.map((step, i) => {
          const isPlaying = audioPlaying === i;
          return (
            <div
              key={i}
              role="listitem"
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                isPlaying
                  ? 'bg-emerald-500/[0.06] border-emerald-500/20 shadow-[0_0_16px_-4px_rgba(52,211,153,0.3)]'
                  : 'bg-white/[0.02] border-white/[0.04]'
              }`}
              aria-current={isPlaying ? 'step' : undefined}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                  isPlaying
                    ? 'bg-emerald-500/20 ring-1 ring-emerald-500/30'
                    : 'bg-white/[0.04]'
                }`}
                aria-hidden="true"
              >
                <span className={`text-xs font-bold ${isPlaying ? 'text-emerald-300' : 'text-zinc-500'}`}>
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
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 ${
                  isPlaying
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200'
                }`}
                aria-label={isPlaying ? `Pause narration: ${step.title}` : `Play narration: ${step.title}`}
                aria-pressed={isPlaying}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Play className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {audioPlaying !== null && (
        <div
          className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400/60 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <Volume2 className="w-3 h-3 animate-pulse" aria-hidden="true" />
          Narrating &ldquo;{steps[audioPlaying]?.title}&rdquo;
        </div>
      )}
    </article>
  );
}
