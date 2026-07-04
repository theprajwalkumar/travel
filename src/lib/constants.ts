export const APP_NAME = 'Bon-Voyage.io';

export const VIBE_OPTIONS = [
  'Craft & Heritage',
  'Architectural History',
  'Local Legends',
  'Culinary Trails',
  'Sacred Rituals',
] as const;

export type VibeOption = (typeof VIBE_OPTIONS)[number];

export const SEASON_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night'] as const;

export type SeasonOption = (typeof SEASON_OPTIONS)[number];

export const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
] as const;

export const SMITHERY_NAMESPACE = 'bon-voyage-io';

export const QUOTES = [
  'Travel is the only thing you buy that makes you richer.',
  'The world is a book, and those who do not travel read only one page.',
  'Not all those who wander are lost.',
  'Adventure is worthwhile in itself.',
  'To travel is to discover that everyone is wrong about other countries.',
  'The gladdest moment in human life is a departure into unknown lands.',
  'Travel makes one modest. You see what a tiny place you occupy in the world.',
  'Life is either a daring adventure or nothing at all.',
  'We travel not to escape life, but for life not to escape us.',
  'A journey of a thousand miles begins with a single step.',
  'Travel brings power and love back into your life.',
  'The journey not the arrival matters.',
] as const;

export const TTS_RATE = 0.85;
export const TTS_PITCH = 1.0;
export const TTS_VOLUME = 1;

export const API_TIMEOUT_MS = 30000;
export const OPENAI_MODEL = 'gpt-4o-mini';
export const OPENAI_TEMPERATURE = 0.8;
export const OPENAI_MAX_TOKENS = 4096;
export const GEMINI_TEMPERATURE = 0.8;
export const GEMINI_TOP_P = 0.95;
