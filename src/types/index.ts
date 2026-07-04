/** Sub-object: hidden gems card data. */
export interface HiddenGems {
  cultural_hook: string;
  why_for_you: string;
  local_field_tip: string;
}

/** Sub-object: a single sensory narration step. */
export interface SensoryStep {
  title: string;
  description: string;
  duration: string;
}

/** Sub-object: parting words of gratitude block. */
export interface PartingWords {
  local_phrase: string;
  phonetic: string;
  emotional_intent: string;
}

/** Sub-object: wholesome connection playbook. */
export interface WholesomePlaybook {
  community_spotlight: string;
  the_wholesome_angle: string;
  connection_micro_action: string;
  supporting_the_soul: string;
  parting_words_of_gratitude: PartingWords;
}

/** Top-level travel experience returned to the UI. */
export interface TravelExperience {
  id: string;
  destination: string;
  vibe: string;
  hidden_gems: HiddenGems;
  sensory_time_machine: SensoryStep[];
  wholesome_playbook: WholesomePlaybook;
}

/** Generic API envelope. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  _fallback?: boolean;
}

/** Discover endpoint request body shape. */
export interface DiscoverRequestBody {
  userLocation: string;
  userVibe: string;
  currentDateTimeSeason: string;
}

/** MCP proxy request body shape. */
export interface McpRequestBody {
  server: string;
  tool: string;
  params?: Record<string, unknown>;
}

/** Loose place result from fallback maps. */
export interface FallbackPlacesResult {
  name: string;
  rating: number;
  vicinity: string;
  types: string[];
}

/** Loose flight result from fallback flights. */
export interface FallbackFlightsResult {
  airline: string;
  price: string;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
}
