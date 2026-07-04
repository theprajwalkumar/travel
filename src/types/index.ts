export type AppMode = 'adventure' | 'wholesome';

export type VibeOption =
  | 'Craft & Heritage'
  | 'Architectural History'
  | 'Local Legends'
  | 'Culinary Trails'
  | 'Sacred Rituals';

export type SeasonOption = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

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
