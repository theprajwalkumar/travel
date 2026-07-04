import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  VIBE_OPTIONS,
  SEASON_OPTIONS,
  GEMINI_MODELS,
  QUOTES,
  TTS_RATE,
} from '@/lib/constants';

describe('constants', () => {
  it('APP_NAME is Bon-Voyage', () => {
    expect(APP_NAME).toBe('Bon-Voyage');
  });

  it('VIBE_OPTIONS has correct values', () => {
    expect(VIBE_OPTIONS).toContain('Craft & Heritage');
    expect(VIBE_OPTIONS).toContain('Architectural History');
    expect(VIBE_OPTIONS).toContain('Local Legends');
    expect(VIBE_OPTIONS).toContain('Culinary Trails');
    expect(VIBE_OPTIONS).toContain('Sacred Rituals');
    expect(VIBE_OPTIONS.length).toBe(5);
  });

  it('SEASON_OPTIONS has correct values', () => {
    expect(SEASON_OPTIONS).toEqual(['Morning', 'Afternoon', 'Evening', 'Night']);
  });

  it('GEMINI_MODELS has expected models', () => {
    expect(GEMINI_MODELS).toContain('gemini-2.5-flash');
    expect(GEMINI_MODELS).toContain('gemini-2.0-flash');
  });

  it('QUOTES has multiple travel quotes', () => {
    expect(QUOTES.length).toBeGreaterThanOrEqual(10);
    expect(QUOTES[0]).toContain('Travel');
  });

  it('TTS_RATE is a reasonable value', () => {
    expect(TTS_RATE).toBeGreaterThan(0);
    expect(TTS_RATE).toBeLessThan(2);
  });
});
