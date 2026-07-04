import type { TravelExperience } from '@/types';

/**
 * Static mock TravelExperience used when the UI needs demo data.
 * Contains the full shape the cards expect, all with non-empty strings.
 */
export const mockExperience: TravelExperience = {
  id: 'mock-1',
  destination: 'Ubud Pottery Village, Bali',
  vibe: 'Craft & Heritage',
  hidden_gems: {
    cultural_hook:
      'For seven generations, the clay artisans of Banjar Kaja Sesetan have shaped the island\'s soul with their hands. Each vessel carries the fingerprint of volcanic ash from Mount Batur and the patience of a tradition that predates written history. This is not a souvenir \u2014 it is a fragment of Balinese cosmology baked into form.',
    why_for_you:
      'As a solo traveler craving something real, this is where Bali\'s heartbeat is most tangible. Away from the Instagram temples, you\'ll find a quiet rhythm: the slap of wet clay, the crackle of the kiln, the unhurried smile of an elder who sees you \u2014 not your wallet.',
    local_field_tip:
      'Visit just after 3 PM when the afternoon light casts golden shadows across the kilns, and the village elders gather under the bale to tell stories. Ask about the "candi" offering \u2014 they might show you the secret prayer they whisper before opening the kiln.',
  },
  sensory_time_machine: [
    {
      title: 'The Arrival',
      description:
        'The earthy scent of wet clay mingles with frangipani and clove smoke. Your footsteps echo on cracked stone as a dog stretches in a patch of sun. The air feels heavier here, slower \u2014 as if time itself is made of clay.',
      duration: '2 min',
    },
    {
      title: 'The Hidden Detail',
      description:
        'Notice how each artisan leaves a tiny, intentional imperfection \u2014 a slight asymmetry in the rim, a thumbprint preserved in the glaze. In Balinese philosophy, this is "acintya" \u2014 the divine imperfection that makes something alive.',
      duration: '3 min',
    },
    {
      title: 'The Living Echo',
      description:
        'Close your eyes and let the soundscape wash over you: the rhythmic thud of wooden paddles against clay, the distant chant from the pura, the soft laughter of children learning from their grandmother. This is the sound of a culture choosing to endure.',
      duration: '4 min',
    },
  ],
  wholesome_playbook: {
    community_spotlight:
      'Meet Wayan, a 67-year-old master potter whose hands have the topography of a life well-lived. He learned from his father at age seven, and has since taught three generations of his village. His kiln is the oldest continuously operating one in the regency.',
    the_wholesome_angle:
      'Each pot Wayan makes is a quiet act of resistance against a world that wants him to retire to a souvenir shop. His craft is not about production \u2014 it is about preservation. When you sit with him, you are witnessing a man who has dedicated 60 years to keeping his ancestors\' language alive through mud and fire.',
    connection_micro_action:
      'Ask Wayan how the volcanic ash from Mount Batur affects the final glaze color. Watch his face light up as he explains \u2014 he\'ll grab a piece of raw clay and a finished pot to show you the transformation. Listen with your eyes as much as your ears.',
    supporting_the_soul:
      'Skip the haggling. Instead, ask if you can try the wheel \u2014 the laughter you share will mean more than any discount. If you want to buy something, choose the smallest, simplest cup. It is the one he made that morning, and it carries the most intention.',
    parting_words_of_gratitude: {
      local_phrase: 'Suksma mewali karya becik',
      phonetic: 'SOOK-sma meh-WAH-lee KAR-yuh BEH-chik',
      emotional_intent:
        'In Balinese, "Suksma" carries the weight of a thousand thanks \u2014 it acknowledges not just the gift of the object, but the spirit of the maker. This phrase tells Wayan that you recognize his clay work as an offering to the world, not just a product.',
    },
  },
};
