'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { VibeOption, SeasonOption, TravelExperience } from '@/types';

interface AppContextType {
  destination: string;
  setDestination: (d: string) => void;
  currentVibe: VibeOption;
  setCurrentVibe: (v: VibeOption) => void;
  season: SeasonOption;
  setSeason: (s: SeasonOption) => void;
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
  const [currentVibe, setCurrentVibe] = useState<VibeOption>('Craft & Heritage');
  const [season, setSeason] = useState<SeasonOption>('Afternoon');
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
        season,
        setSeason,
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
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
