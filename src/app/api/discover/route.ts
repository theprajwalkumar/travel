import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { fallbackDiscoverResponse } from '@/lib/fallbackData';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

const responseSchema = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: SchemaType.OBJECT as any,
  description: 'A curated cultural travel experience for the user',
  properties: {
    discovery_location: {
      type: SchemaType.STRING,
      description: 'The specific location or neighborhood discovered',
    },
    recommendations: {
      type: SchemaType.ARRAY,
      description: 'List of curated recommendations',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING, description: 'Name of the place/experience' },
          type: { type: SchemaType.STRING, description: 'Category e.g. artisan, viewpoint, eatery' },
          distance_context: { type: SchemaType.STRING, description: 'Walking distance or proximity description' },
          the_cultural_hook: { type: SchemaType.STRING, description: 'Why this place matters culturally' },
          why_for_you: { type: SchemaType.STRING, description: 'Personal relevance to the traveler' },
          interactive_local_tip: { type: SchemaType.STRING, description: 'An actionable tip only locals know' },
        },
        required: ['title', 'type', 'distance_context', 'the_cultural_hook', 'why_for_you', 'interactive_local_tip'],
      },
    },
    story_segments: {
      type: SchemaType.OBJECT,
      description: 'Three sensory narrative steps',
      properties: {
        arrival: {
          type: SchemaType.OBJECT,
          properties: {
            ui_subtitle: { type: SchemaType.STRING, description: 'Short subtitle for UI display' },
            narration_script: { type: SchemaType.STRING, description: 'Vivid sensory narration' },
          },
          required: ['ui_subtitle', 'narration_script'],
        },
        hidden_detail: {
          type: SchemaType.OBJECT,
          properties: {
            ui_subtitle: { type: SchemaType.STRING, description: 'Short subtitle for UI display' },
            narration_script: { type: SchemaType.STRING, description: 'Vivid sensory narration' },
          },
          required: ['ui_subtitle', 'narration_script'],
        },
        living_echo: {
          type: SchemaType.OBJECT,
          properties: {
            ui_subtitle: { type: SchemaType.STRING, description: 'Short subtitle for UI display' },
            narration_script: { type: SchemaType.STRING, description: 'Vivid sensory narration' },
          },
          required: ['ui_subtitle', 'narration_script'],
        },
      },
      required: ['arrival', 'hidden_detail', 'living_echo'],
    },
    wholesome_playbook: {
      type: SchemaType.OBJECT,
      description: 'Wholesome connection guidance',
      properties: {
        community_spotlight: { type: SchemaType.STRING, description: 'Who makes this place special' },
        the_wholesome_angle: { type: SchemaType.STRING, description: 'The beautiful human story behind the craft' },
        connection_micro_action: { type: SchemaType.STRING, description: 'A small polite action to connect' },
        supporting_the_soul: { type: SchemaType.STRING, description: 'Non-intrusive way to support them' },
        linguistic_bridge: {
          type: SchemaType.OBJECT,
          properties: {
            local_phrase: { type: SchemaType.STRING, description: 'Thank you / beautiful work in local dialect' },
            phonetic_pronunciation: { type: SchemaType.STRING, description: 'Phonetic spelling' },
            literal_meaning: { type: SchemaType.STRING, description: 'Literal translation' },
            perfect_moment_to_use: { type: SchemaType.STRING, description: 'When to use this phrase' },
          },
          required: ['local_phrase', 'phonetic_pronunciation', 'literal_meaning', 'perfect_moment_to_use'],
        },
      },
      required: ['community_spotlight', 'the_wholesome_angle', 'connection_micro_action', 'supporting_the_soul', 'linguistic_bridge'],
    },
  },
  required: ['discovery_location', 'recommendations', 'story_segments', 'wholesome_playbook'],
};

function buildSystemInstruction(isWholesomeMode: boolean): string {
  if (isWholesomeMode) {
    return `You are a warm, deeply empathetic cultural anthropologist. Your purpose is to foster heartfelt, respectful, and wholesome connections between travelers and local community keepers (artisans, elderly shopkeepers, street-food chefs, traditional craftspeople). You focus on mutual respect, gratitude, and sustainable human connection.

Your response must avoid anything transactional. Instead, guide the traveler to see the soul of a place — the generational knowledge, the quiet rituals, the human stories embedded in everyday life. You prioritize emotional warmth over sightseeing efficiency, and always suggest small, meaningful ways to brighten a local creator's day.`;
  }

  return `You are an elite hyper-local guide with encyclopedic knowledge of hidden alleys, off-menu dishes, overlooked architecture, and the stories that tour buses speed past. You know a place not through Wikipedia but through its sounds, smells, and the people who have lived there for decades.

Your response should feel like a trusted local friend pulling the traveler aside. Prioritize specificity, sensory detail, and actionable intelligence (exact cross streets, best time of day, what to look for, what to skip). You love revealing the kind of detail that makes a traveler feel like they've discovered something genuinely secret.`;
}

function buildPrompt(
  location: string,
  vibe: string,
  dateTimeSeason: string,
): string {
  return `Generate a curated cultural discovery experience for a traveler visiting ${location}.

Traveler's interest: ${vibe}
Current time/season context: ${dateTimeSeason}

Return ONLY valid JSON matching the provided schema. Every string must be original, vivid, and 100% specific to ${location} — never generic. The recommendations must feel like genuine local discoveries, not tourist brochure items. The story segments should immerse the reader in sensory details (sights, sounds, smells, textures). The wholesome playbook must root the traveler in human connection.

Rules:
- Do NOT include markdown fences or extra text — only the JSON object.
- Every field must be populated with rich, location-specific content.
- Distance contexts should be realistic (walking minutes, landmarks).
- The linguistic bridge must use a real local language/dialect appropriate to ${location}.`;
}

function validateApiResponse(data: unknown) {
  if (!data || typeof data !== 'object') throw new Error('Response is not an object');
  const d = data as Record<string, unknown>;
  if (!d.discovery_location || !d.recommendations || !d.story_segments || !d.wholesome_playbook) {
    throw new Error('Missing top-level fields');
  }
  if (!Array.isArray(d.recommendations) || d.recommendations.length === 0) {
    throw new Error('Missing recommendations');
  }
  const segs = d.story_segments as Record<string, unknown>;
  if (!segs.arrival || !segs.hidden_detail || !segs.living_echo) {
    throw new Error('Missing story segments');
  }
  return data as typeof fallbackDiscoverResponse;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userLocation = '',
      userVibe = 'Craft & Heritage',
      currentDateTimeSeason = 'Afternoon',
      isWholesomeMode = true,
    } = body;

    if (!userLocation.trim()) {
      return Response.json({ success: true, data: fallbackDiscoverResponse });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set — returning fallback data');
      return Response.json({ success: true, data: fallbackDiscoverResponse });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: buildSystemInstruction(isWholesomeMode),
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const prompt = buildPrompt(userLocation, userVibe, currentDateTimeSeason);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const validated = validateApiResponse(parsed);
    return Response.json({ success: true, data: validated });
  } catch (error) {
    console.error('Discover API error:', error);
    return Response.json({ success: true, data: fallbackDiscoverResponse });
  }
}
