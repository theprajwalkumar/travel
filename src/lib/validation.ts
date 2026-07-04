import { VIBE_OPTIONS, SEASON_OPTIONS } from './constants';

const MAX_INPUT_LENGTH = 200;
const MAX_STORY_LENGTH = 5000;

export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') 
    .slice(0, MAX_INPUT_LENGTH);
}

export function validateDestination(dest: unknown): string {
  if (typeof dest !== 'string' || !dest.trim()) {
    throw new Error('Destination is required');
  }
  const sanitized = sanitizeString(dest);
  if (sanitized.length < 2) {
    throw new Error('Destination must be at least 2 characters');
  }
  return sanitized;
}

export function validateVibe(vibe: unknown): string {
  if (typeof vibe !== 'string') {
    return VIBE_OPTIONS[0];
  }
  if (!VIBE_OPTIONS.includes(vibe as never)) {
    return VIBE_OPTIONS[0];
  }
  return vibe;
}

export function validateSeason(season: unknown): string {
  if (typeof season !== 'string') {
    return SEASON_OPTIONS[1];
  }
  if (!SEASON_OPTIONS.includes(season as never)) {
    return SEASON_OPTIONS[1];
  }
  return season;
}

export function validateDiscoverBody(body: Record<string, unknown>): {
  userLocation: string;
  userVibe: string;
  currentDateTimeSeason: string;
} {
  const userLocation = validateDestination(body.userLocation);
  const userVibe = validateVibe(body.userVibe);
  const currentDateTimeSeason = validateSeason(body.currentDateTimeSeason);
  return { userLocation, userVibe, currentDateTimeSeason };
}

export function validateMcpBody(body: Record<string, unknown>): {
  server: string;
  tool: string;
  params: Record<string, unknown>;
} {
  const server = typeof body.server === 'string' && body.server.trim()
    ? body.server.trim().replace(/[^a-z-]/g, '')
    : '';
  const tool = typeof body.tool === 'string' && body.tool.trim()
    ? body.tool.trim().replace(/[^a-z_-]/g, '')
    : '';
  const params = typeof body.params === 'object' && body.params !== null
    ? body.params as Record<string, unknown>
    : {};

  if (!server) throw new Error('Missing or invalid server');
  if (!tool) throw new Error('Missing or invalid tool');

  return { server, tool, params };
}

export function validateStoryLength(text: string): boolean {
  return text.length <= MAX_STORY_LENGTH;
}

export function sanitizeNarration(text: string): string {
  return text
    .replace(/[<>]/g, '')
    .slice(0, MAX_STORY_LENGTH);
}

export function isValidHttpUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
