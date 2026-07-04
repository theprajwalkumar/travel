import type { TravelExperience, VibeOption, SeasonOption } from '@/types';
import type { DiscoverApiResponse } from './fallbackData';

export interface DiscoverRequest {
  userLocation: string;
  userVibe: VibeOption;
  currentDateTimeSeason: SeasonOption;
}

function transformResponse(apiData: DiscoverApiResponse): TravelExperience {
  const rec = apiData.recommendations[0];
  return {
    id: `discover-${Date.now()}`,
    destination: apiData.discovery_location,
    vibe: rec?.type ?? '',
    hidden_gems: {
      cultural_hook: rec?.the_cultural_hook ?? '',
      why_for_you: rec?.why_for_you ?? '',
      local_field_tip: rec?.interactive_local_tip ?? '',
    },
    sensory_time_machine: [
      {
        title: apiData.story_segments.arrival.ui_subtitle,
        description: apiData.story_segments.arrival.narration_script,
        duration: '2 min',
      },
      {
        title: apiData.story_segments.hidden_detail.ui_subtitle,
        description: apiData.story_segments.hidden_detail.narration_script,
        duration: '3 min',
      },
      {
        title: apiData.story_segments.living_echo.ui_subtitle,
        description: apiData.story_segments.living_echo.narration_script,
        duration: '4 min',
      },
    ],
    wholesome_playbook: {
      community_spotlight: apiData.wholesome_playbook.community_spotlight,
      the_wholesome_angle: apiData.wholesome_playbook.the_wholesome_angle,
      connection_micro_action: apiData.wholesome_playbook.connection_micro_action,
      supporting_the_soul: apiData.wholesome_playbook.supporting_the_soul,
      parting_words_of_gratitude: {
        local_phrase: apiData.wholesome_playbook.linguistic_bridge.local_phrase,
        phonetic: apiData.wholesome_playbook.linguistic_bridge.phonetic_pronunciation,
        emotional_intent: `${apiData.wholesome_playbook.linguistic_bridge.literal_meaning} ${apiData.wholesome_playbook.linguistic_bridge.perfect_moment_to_use}`,
      },
    },
  };
}

export async function fetchDiscoverExperience(
  request: DiscoverRequest,
): Promise<TravelExperience> {
  const res = await fetch('/api/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();

  if (!json.success || !json.data) {
    throw new Error('Invalid API response structure');
  }

  return transformResponse(json.data as DiscoverApiResponse);
}
