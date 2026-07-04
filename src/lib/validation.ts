import { VIBE_OPTIONS, SEASON_OPTIONS, MAX_INPUT_LENGTH, MAX_STORY_LENGTH } from './constants';

/**
 * Strip angle brackets and trim to max length.
 * Prevents reflected XSS in user-supplied strings.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').slice(0, MAX_INPUT_LENGTH);
}

/**
 * Validate and sanitize a destination string.
 * @throws if missing, whitespace-only, or shorter than 2 characters.
 */
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

/**
 * Validate a vibe enum, falling back to the first valid option.
 */
export function validateVibe(vibe: unknown): string {
  if (typeof vibe !== 'string') return VIBE_OPTIONS[0];
  return VIBE_OPTIONS.includes(vibe as never) ? vibe : VIBE_OPTIONS[0];
}

/**
 * Validate a season enum, falling back to "Afternoon".
 */
export function validateSeason(season: unknown): string {
  if (typeof season !== 'string') return SEASON_OPTIONS[1];
  return SEASON_OPTIONS.includes(season as never) ? season : SEASON_OPTIONS[1];
}

/**
 * Validate and coerce the full discover endpoint request body.
 * Returns a safe, sanitized triple of (location, vibe, season).
 * @throws if location is invalid.
 */
export function validateDiscoverBody(body: Record<string, unknown>): {
  userLocation: string;
  userVibe: string;
  currentDateTimeSeason: string;
} {
  return {
    userLocation: validateDestination(body.userLocation),
    userVibe: validateVibe(body.userVibe),
    currentDateTimeSeason: validateSeason(body.currentDateTimeSeason),
  };
}

/**
 * Validate and sanitize an MCP proxy request body.
 * Server and tool names are stripped to alphanumeric + hyphens/underscores.
 * @throws if server or tool is missing or empty.
 */
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
  const params =
    typeof body.params === 'object' && body.params !== null
      ? (body.params as Record<string, unknown>)
      : {};

  if (!server) throw new Error('Missing or invalid server');
  if (!tool) throw new Error('Missing or invalid tool');
  return { server, tool, params };
}

/**
 * Sanitize a narration script for safe rendering.
 */
export function sanitizeNarration(text: string): string {
  return text.replace(/[<>]/g, '').slice(0, MAX_STORY_LENGTH);
}

/**
 * Check whether a string is a valid http/https URL.
 */
export function isValidHttpUrl(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
