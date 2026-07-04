import type { TravelExperience } from '@/types';
import type { DiscoverApiResponse } from './fallbackData';
import { sanitizeString, validateDestination, validateVibe } from './validation';

export interface DiscoverRequest {
  userLocation: string;
  userVibe: string;
  currentDateTimeSeason: string;
}

let _idCounter = 0;

/** Generate a monotonically increasing unique ID (avoids Date.now() churn). */
function nextId(): string {
  _idCounter += 1;
  return `discover-${_idCounter}-${Date.now()}`;
}

const STEP_DURATIONS = ['2 min', '3 min', '4 min'] as const;

type StoryKey = 'arrival' | 'hidden_detail' | 'living_echo';

const STORY_KEYS: StoryKey[] = ['arrival', 'hidden_detail', 'living_echo'];

/**
 * Map the raw API shape to the flattened TravelExperience the UI expects.
 * All fields are null-coalesced to empty strings to prevent runtime crashes.
 */
function transformResponse(apiData: DiscoverApiResponse): TravelExperience {
  const rec = apiData.recommendations[0];

  const storySegments = STORY_KEYS.map((key, i) => {
    const seg = apiData.story_segments[key];
    return {
      title: seg?.ui_subtitle ?? '',
      description: sanitizeString(seg?.narration_script ?? ''),
      duration: STEP_DURATIONS[i],
    };
  });

  const lb = apiData.wholesome_playbook?.linguistic_bridge;

  return {
    id: nextId(),
    destination: apiData.discovery_location ?? '',
    vibe: rec?.type ?? '',
    hidden_gems: {
      cultural_hook: rec?.the_cultural_hook ?? '',
      why_for_you: rec?.why_for_you ?? '',
      local_field_tip: rec?.interactive_local_tip ?? '',
    },
    sensory_time_machine: storySegments,
    wholesome_playbook: {
      community_spotlight: apiData.wholesome_playbook?.community_spotlight ?? '',
      the_wholesome_angle: apiData.wholesome_playbook?.the_wholesome_angle ?? '',
      connection_micro_action: apiData.wholesome_playbook?.connection_micro_action ?? '',
      supporting_the_soul: apiData.wholesome_playbook?.supporting_the_soul ?? '',
      parting_words_of_gratitude: {
        local_phrase: lb?.local_phrase ?? '',
        phonetic: lb?.phonetic_pronunciation ?? '',
        emotional_intent: lb
          ? `${lb.literal_meaning} ${lb.perfect_moment_to_use}`
          : '',
      },
    },
  };
}

/**
 * POST to /api/discover and return a typed TravelExperience.
 * Validates and sanitizes the input before sending.
 * @throws on network error, non-ok status, or invalid response shape.
 */
export async function fetchDiscoverExperience(
  request: DiscoverRequest,
): Promise<TravelExperience> {
  const userLocation = validateDestination(request.userLocation);
  const userVibe = validateVibe(request.userVibe);

  const res = await fetch('/api/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userLocation,
      userVibe,
      currentDateTimeSeason: request.currentDateTimeSeason,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json: { success: boolean; data?: DiscoverApiResponse } = await res.json();

  if (!json.success || !json.data) {
    throw new Error('Invalid API response structure');
  }

  return transformResponse(json.data);
}
