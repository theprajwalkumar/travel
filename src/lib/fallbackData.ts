export const fallbackDiscoverResponse = {
  discovery_location: 'Ubud Pottery Village, Bali',
  recommendations: [
    {
      title: 'Wayan & Ketut Family Kiln',
      type: 'Artisan Workshop',
      distance_context: 'A 4-minute walk east of the main banyan tree',
      the_cultural_hook:
        'For seven generations, this open-air kiln has been the beating heart of the village. The clay is mixed with volcanic ash from Mount Batur — a recipe passed down through a single family lineage. Every crack and curve tells a story of Balinese cosmology.',
      why_for_you:
        'You are not here to shop — you are here to witness a living archive. Away from the gallery markups, you will see the real process: the pounding, the shaping, the silent prayer before firing. This is where craft meets soul.',
      interactive_local_tip:
        'Arrive around 3 PM when the light slants through the bamboo canopy. The elders gather to tell stories. Ask about the "candi" offering — they might share the secret prayer whispered before opening the kiln.',
    },
    {
      title: 'Pura Desa Temple Courtyard',
      type: 'Sacred Space',
      distance_context: 'Adjacent to the pottery path, 1 min detour',
      the_cultural_hook:
        'This small neighborhood temple doubles as the village\'s spiritual and social anchor. The intricate stone carvings depict the Ramayana, but look closer — the artisans have hidden modern symbols among the ancient reliefs.',
      why_for_you:
        'As a solo traveler seeking cultural depth, this is where you will feel the rhythm of local life. Children play in the courtyard while women prepare offerings. It is not a tourist site — it is a living, breathing community space.',
      interactive_local_tip:
        'If you see a local arranging a canang sari (offering basket), simply nod and smile. Do not photograph. The beauty is in witnessing, not capturing.',
    },
    {
      title: 'Ibu Rini\'s Home Kitchen',
      type: 'Street Food / Home Dining',
      distance_context: 'Three houses past the kiln — look for the blue door',
      the_cultural_hook:
        'Ibu Rini cooks babi guling (spiced roast pork) in a 40-year-old clay pot her mother brought from Java. Her recipe uses turmeric and lemongrass from her backyard. She serves only one batch per day, and when it is gone, it is gone.',
      why_for_you:
        'This is not a restaurant. It is a grandmother feeding her village. Eating here is an act of participation in a daily ritual that has sustained this community for decades.',
      interactive_local_tip:
        'Bring only small bills. When you finish, place your hand on your heart and say "Suksma" — she will know you were truly present.',
    },
  ],
  story_segments: {
    arrival: {
      ui_subtitle: 'The Scent of Wet Clay & Frangipani',
      narration_script:
        'The earthy scent of wet clay mingles with frangipani and clove smoke. Your footsteps echo on cracked stone as a dog stretches in a patch of sun. The air feels heavier here, slower — as if time itself is made of clay. In the distance, the rhythmic thud of a wooden paddle against wet earth marks the village heartbeat.',
    },
    hidden_detail: {
      ui_subtitle: 'The Imperfection That Makes It Alive',
      narration_script:
        'Notice how each artisan leaves a tiny, intentional imperfection — a slight asymmetry in the rim, a thumbprint preserved in the glaze. In Balinese philosophy, this is "acintya" — the divine imperfection that makes something alive. The potters believe a perfect vessel has no soul.',
    },
    living_echo: {
      ui_subtitle: 'The Sound of a Culture Enduring',
      narration_script:
        'Close your eyes and let the soundscape wash over you: the rhythmic thud of wooden paddles against clay, the distant chant from the pura, the soft laughter of children learning from their grandmother. This is the sound of a culture choosing to endure — not as a performance for tourists, but as a quiet, unbroken conversation between generations.',
    },
  },
  wholesome_playbook: {
    community_spotlight:
      'Meet Wayan, a 67-year-old master potter whose hands have the topography of a life well-lived. He learned from his father at age seven, and has since taught three generations of his village. His kiln is the oldest continuously operating one in the regency.',
    the_wholesome_angle:
      'Each pot Wayan makes is a quiet act of resistance against a world that wants him to retire to a souvenir shop. His craft is not about production — it is about preservation. When you sit with him, you are witnessing a man who has dedicated 60 years to keeping his ancestors\' language alive through mud and fire.',
    connection_micro_action:
      'Ask Wayan how the volcanic ash from Mount Batur affects the final glaze color. Watch his face light up as he explains — he will grab a piece of raw clay and a finished pot to show you the transformation. Listen with your eyes as much as your ears.',
    supporting_the_soul:
      'Skip the haggling. Instead, ask if you can try the wheel — the laughter you share will mean more than any discount. If you want to buy something, choose the smallest, simplest cup. It is the one he made that morning, and it carries the most intention.',
    linguistic_bridge: {
      local_phrase: 'Suksma mewali karya becik',
      phonetic_pronunciation: 'SOOK-sma meh-WAH-lee KAR-yuh BEH-chik',
      literal_meaning: 'Thank you for the beautiful work / May your craft be blessed',
      perfect_moment_to_use:
        'After Wayan shows you his kiln and you have shared a moment of silence observing his work. Say it softly, with your hand on your heart. It will resonate deeply — it tells him you see his craft as an offering, not a product.',
    },
  },
};

export type DiscoverApiResponse = typeof fallbackDiscoverResponse;
