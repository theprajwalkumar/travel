export interface HiddenGems {
  cultural_hook: string;
  why_for_you: string;
  local_field_tip: string;
}

export interface SensoryStep {
  title: string;
  description: string;
  duration: string;
}

export interface WholesomePlaybook {
  community_spotlight: string;
  the_wholesome_angle: string;
  connection_micro_action: string;
  supporting_the_soul: string;
  parting_words_of_gratitude: {
    local_phrase: string;
    phonetic: string;
    emotional_intent: string;
  };
}

export interface TravelExperience {
  id: string;
  destination: string;
  vibe: string;
  hidden_gems: HiddenGems;
  sensory_time_machine: SensoryStep[];
  wholesome_playbook: WholesomePlaybook;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  _fallback?: boolean;
}

export interface DiscoverRequestBody {
  userLocation: string;
  userVibe: string;
  currentDateTimeSeason: string;
}

export interface McpRequestBody {
  server: string;
  tool: string;
  params?: Record<string, unknown>;
}

export interface NarratedSegment {
  title: string;
  description: string;
}

export interface FallbackPlacesResult {
  name: string;
  rating: number;
  vicinity: string;
  types: string[];
}

export interface FallbackFlightsResult {
  airline: string;
  price: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
}
