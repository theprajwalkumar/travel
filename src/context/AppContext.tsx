'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { TravelExperience } from '@/types';
import { VIBE_OPTIONS, type VibeOption } from '@/lib/constants';

interface AppContextType {
  destination: string;
  setDestination: (d: string) => void;
  currentVibe: VibeOption;
  setCurrentVibe: (v: VibeOption) => void;
  experience: TravelExperience | null;
  setExperience: (e: TravelExperience | null) => void;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  audioPlaying: number | null;
  setAudioPlaying: (n: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [destination, setDestination] = useState('');
  const [currentVibe, setCurrentVibe] = useState<VibeOption>(VIBE_OPTIONS[0]);
  const [experience, setExperience] = useState<TravelExperience | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);

  return (
    <AppContext.Provider
      value={{
        destination,
        setDestination,
        currentVibe,
        setCurrentVibe,
        experience,
        setExperience,
        isLoading,
        setIsLoading,
        audioPlaying,
        setAudioPlaying,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
