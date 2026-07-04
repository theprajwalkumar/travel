import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  validateDestination,
  validateVibe,
  validateSeason,
  validateDiscoverBody,
  validateMcpBody,
  sanitizeNarration,
  isValidHttpUrl,
} from '@/lib/validation';

describe('sanitizeString', () => {
  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('removes angle brackets to prevent XSS', () => {
    expect(sanitizeString('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeString(null as unknown as string)).toBe('');
    expect(sanitizeString(undefined as unknown as string)).toBe('');
    expect(sanitizeString(42 as unknown as string)).toBe('');
  });

  it('truncates to max length', () => {
    const long = 'a'.repeat(500);
    expect(sanitizeString(long).length).toBe(200);
  });

  it('preserves valid strings', () => {
    expect(sanitizeString('Paris, France')).toBe('Paris, France');
  });
});

describe('validateDestination', () => {
  it('returns sanitized destination for valid input', () => {
    expect(validateDestination('Paris')).toBe('Paris');
  });

  it('throws for empty string', () => {
    expect(() => validateDestination('')).toThrow('Destination is required');
  });

  it('throws for whitespace-only', () => {
    expect(() => validateDestination('   ')).toThrow('Destination is required');
  });

  it('throws for non-string', () => {
    expect(() => validateDestination(123)).toThrow('Destination is required');
    expect(() => validateDestination(null)).toThrow('Destination is required');
    expect(() => validateDestination(undefined)).toThrow('Destination is required');
  });

  it('throws for too short', () => {
    expect(() => validateDestination('a')).toThrow('at least 2 characters');
  });

  it('sanitizes XSS in destination', () => {
    expect(validateDestination('<script>Paris</script>')).toBe('scriptParis/script');
  });
});

describe('validateVibe', () => {
  it('returns valid vibe as-is', () => {
    expect(validateVibe('Craft & Heritage')).toBe('Craft & Heritage');
    expect(validateVibe('Culinary Trails')).toBe('Culinary Trails');
  });

  it('returns default for invalid vibe', () => {
    expect(validateVibe('Invalid Vibe')).toBe('Craft & Heritage');
  });

  it('returns default for non-string', () => {
    expect(validateVibe(null)).toBe('Craft & Heritage');
    expect(validateVibe(undefined)).toBe('Craft & Heritage');
    expect(validateVibe(42)).toBe('Craft & Heritage');
  });
});

describe('validateSeason', () => {
  it('returns valid season as-is', () => {
    expect(validateSeason('Morning')).toBe('Morning');
    expect(validateSeason('Afternoon')).toBe('Afternoon');
    expect(validateSeason('Evening')).toBe('Evening');
    expect(validateSeason('Night')).toBe('Night');
  });

  it('returns default for invalid season', () => {
    expect(validateSeason('Winter')).toBe('Afternoon');
  });

  it('returns default for non-string', () => {
    expect(validateSeason(null)).toBe('Afternoon');
    expect(validateSeason(undefined)).toBe('Afternoon');
  });
});

describe('validateDiscoverBody', () => {
  it('validates a complete valid body', () => {
    const result = validateDiscoverBody({
      userLocation: 'Paris',
      userVibe: 'Culinary Trails',
      currentDateTimeSeason: 'Morning',
    });
    expect(result.userLocation).toBe('Paris');
    expect(result.userVibe).toBe('Culinary Trails');
    expect(result.currentDateTimeSeason).toBe('Morning');
  });

  it('falls back vibe to default when invalid', () => {
    const result = validateDiscoverBody({
      userLocation: 'Paris',
      userVibe: 'Bad Vibe',
      currentDateTimeSeason: 'Morning',
    });
    expect(result.userVibe).toBe('Craft & Heritage');
  });

  it('falls back season to default when invalid', () => {
    const result = validateDiscoverBody({
      userLocation: 'Paris',
      userVibe: 'Culinary Trails',
      currentDateTimeSeason: 'Monsoon',
    });
    expect(result.currentDateTimeSeason).toBe('Afternoon');
  });

  it('throws when location is missing', () => {
    expect(() =>
      validateDiscoverBody({
        userLocation: '',
        userVibe: 'Culinary Trails',
        currentDateTimeSeason: 'Morning',
      }),
    ).toThrow();
  });
});

describe('validateMcpBody', () => {
  it('validates a complete valid body', () => {
    const result = validateMcpBody({
      server: 'maps',
      tool: 'search_places',
      params: { query: 'ubud' },
    });
    expect(result.server).toBe('maps');
    expect(result.tool).toBe('search_places');
    expect(result.params.query).toBe('ubud');
  });

  it('sanitizes server and tool names', () => {
    const result = validateMcpBody({
      server: '<maps>',
      tool: 'search_places<script>',
      params: {},
    });
    expect(result.server).toBe('maps');
    expect(result.tool).toBe('search_placesscript');
  });

  it('throws when server is missing', () => {
    expect(() =>
      validateMcpBody({ tool: 'search_places', params: {} }),
    ).toThrow('Missing or invalid server');
  });

  it('throws when tool is missing', () => {
    expect(() =>
      validateMcpBody({ server: 'maps', params: {} }),
    ).toThrow('Missing or invalid tool');
  });

  it('defaults params to empty object when missing', () => {
    const result = validateMcpBody({ server: 'maps', tool: 'search_places' });
    expect(result.params).toEqual({});
  });

  it('defaults params to empty object when null', () => {
    const result = validateMcpBody({ server: 'maps', tool: 'search_places', params: null });
    expect(result.params).toEqual({});
  });
});

describe('sanitizeNarration', () => {
  it('removes angle brackets', () => {
    expect(sanitizeNarration('hello <world>')).toBe('hello world');
  });

  it('truncates to max length', () => {
    const long = 'a'.repeat(6000);
    expect(sanitizeNarration(long).length).toBe(5000);
  });
});

describe('isValidHttpUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true);
    expect(isValidHttpUrl('http://example.com/path')).toBe(true);
  });

  it('returns false for invalid URLs', () => {
    expect(isValidHttpUrl('not-a-url')).toBe(false);
    expect(isValidHttpUrl('')).toBe(false);
    expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    expect(isValidHttpUrl(null as unknown as string)).toBe(false);
  });
});
