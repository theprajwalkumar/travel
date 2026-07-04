'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { TravelExperience } from '@/types';
import { VIBE_OPTIONS, type VibeOption } from '@/lib/constants';

/** Shape of the global application state. */
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

/** Provides global app state to all children. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [destination, setDestination] = useState('');
  const [currentVibe, setCurrentVibe] = useState<VibeOption>(VIBE_OPTIONS[0]);
  const [experience, setExperience] = useState<TravelExperience | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);

  const value = useMemo<AppContextType>(
    () => ({
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
    }),
    [destination, currentVibe, experience, isLoading, audioPlaying],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Hook to read and write global app state. */
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
