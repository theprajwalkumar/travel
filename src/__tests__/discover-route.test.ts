import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateDiscoverBody, sanitizeString } from '@/lib/validation';
import { VIBE_OPTIONS } from '@/lib/constants';

const validBody = {
  userLocation: 'Paris',
  userVibe: 'Craft & Heritage',
  currentDateTimeSeason: 'Afternoon',
};

describe('Discover API route validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('validates a complete request body', () => {
    const result = validateDiscoverBody(validBody);
    expect(result.userLocation).toBe('Paris');
    expect(result.userVibe).toBe('Craft & Heritage');
    expect(result.currentDateTimeSeason).toBe('Afternoon');
  });

  it('sanitizes user location for XSS', () => {
    const result = validateDiscoverBody({
      ...validBody,
      userLocation: '<script>alert("xss")</script>',
    });
    expect(result.userLocation).not.toContain('<');
    expect(result.userLocation).not.toContain('>');
  });

  it('rejects empty location', () => {
    expect(() =>
      validateDiscoverBody({ ...validBody, userLocation: '' }),
    ).toThrow('Destination is required');
  });

  it('rejects whitespace-only location', () => {
    expect(() =>
      validateDiscoverBody({ ...validBody, userLocation: '   ' }),
    ).toThrow('Destination is required');
  });

  it('defaults invalid vibe to first available', () => {
    const result = validateDiscoverBody({
      ...validBody,
      userVibe: 'nonexistent-vibe',
    });
    expect(result.userVibe).toBe(VIBE_OPTIONS[0]);
  });

  it('defaults invalid season to Afternoon', () => {
    const result = validateDiscoverBody({
      ...validBody,
      currentDateTimeSeason: 'Winter',
    });
    expect(result.currentDateTimeSeason).toBe('Afternoon');
  });

  it('handles missing vibe gracefully', () => {
    const result = validateDiscoverBody({
      userLocation: 'Paris',
      userVibe: undefined,
      currentDateTimeSeason: 'Afternoon',
    });
    expect(result.userVibe).toBe(VIBE_OPTIONS[0]);
  });

  it('handles location with special characters', () => {
    const sanitized = sanitizeString('Paris, France & Café');
    expect(sanitized).toBe('Paris, France & Café');
  });
});

describe('Discover route error handling paths', () => {
  it('handles malformed JSON body', () => {
    const body = 'not json';
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(body);
    } catch {
      /* expected */
    }
    expect(parsed).toBeNull();
  });

  it('handles body with missing fields', () => {
    const result = validateDiscoverBody({ userLocation: 'Tokyo' } as Record<string, unknown>);
    expect(result.userVibe).toBe(VIBE_OPTIONS[0]);
    expect(result.currentDateTimeSeason).toBe('Afternoon');
  });
});
