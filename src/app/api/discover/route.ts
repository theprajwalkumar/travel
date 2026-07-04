import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { fallbackDiscoverResponse } from '@/lib/fallbackData';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are an elite hyper-local guide with encyclopedic knowledge of hidden alleys, off-menu dishes, overlooked architecture, and the stories that tour buses speed past. You know a place not through Wikipedia but through its sounds, smells, and the people who have lived there for decades.

Your response should feel like a trusted local friend pulling the traveler aside. Prioritize specificity, sensory detail, and actionable intelligence (exact cross streets, best time of day, what to look for, what to skip). You love revealing the kind of detail that makes a traveler feel like they've discovered something genuinely secret.`;

function buildPrompt(location: string, vibe: string, dateTimeSeason: string): string {
  return `Generate a curated cultural discovery experience for a traveler visiting ${location}.

Traveler's interest: ${vibe}
Current time/season context: ${dateTimeSeason}

Return a JSON object with this exact schema:
{
  "discovery_location": "string — the specific location/neighborhood",
  "recommendations": [
    {
      "title": "string — name of place/experience",
      "type": "string — category like artisan, viewpoint, eatery",
      "distance_context": "string — walking distance or proximity description",
      "the_cultural_hook": "string — why this place matters culturally",
      "why_for_you": "string — personal relevance to the traveler",
      "interactive_local_tip": "string — actionable tip only locals know"
    }
  ],
  "story_segments": {
    "arrival": { "ui_subtitle": "string — short subtitle", "narration_script": "string — vivid sensory narration" },
    "hidden_detail": { "ui_subtitle": "string — short subtitle", "narration_script": "string — vivid sensory narration" },
    "living_echo": { "ui_subtitle": "string — short subtitle", "narration_script": "string — vivid sensory narration" }
  },
  "wholesome_playbook": {
    "community_spotlight": "string — who makes this place special",
    "the_wholesome_angle": "string — the beautiful human story",
    "connection_micro_action": "string — small action to connect",
    "supporting_the_soul": "string — non-intrusive way to support",
    "linguistic_bridge": {
      "local_phrase": "string — thank you in local dialect",
      "phonetic_pronunciation": "string — phonetic spelling",
      "literal_meaning": "string — literal translation",
      "perfect_moment_to_use": "string — when to use it"
    }
  }
}

Rules:
- Return ONLY the JSON object, no markdown fences or extra text.
- Every string must be original, vivid, and 100% specific to ${location}.
- Recommendations must feel like genuine local discoveries.
- Story segments must immerse in sensory details (sights, sounds, smells, textures).
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

async function tryOpenAI(location: string, vibe: string, dateTimeSeason: string) {
  if (!openai) throw new Error('OpenAI not configured');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildPrompt(location, vibe, dateTimeSeason) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 4096,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned empty response');

  const parsed = JSON.parse(text);
  return validateApiResponse(parsed);
}

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

async function tryGemini(location: string, vibe: string, dateTimeSeason: string) {
  if (!genAI) throw new Error('Gemini not configured');

  const prompt = buildPrompt(location, vibe, dateTimeSeason);

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return validateApiResponse(parsed);
    } catch (e) {
      console.warn(`Gemini model ${modelName} failed:`, (e as Error).message);
      continue;
    }
  }

  throw new Error('All Gemini models failed');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userLocation = '',
      userVibe = 'Craft & Heritage',
      currentDateTimeSeason = 'Afternoon',
    } = body;

    if (!userLocation.trim()) {
      return Response.json({ success: true, data: fallbackDiscoverResponse });
    }

    let data: unknown = null;

    // Try OpenAI first, then Gemini, then fallback
    if (openai) {
      try {
        data = await tryOpenAI(userLocation, userVibe, currentDateTimeSeason);
        return Response.json({ success: true, data });
      } catch (e) {
        console.warn('OpenAI failed, trying Gemini:', (e as Error).message);
      }
    }

    if (genAI) {
      try {
        data = await tryGemini(userLocation, userVibe, currentDateTimeSeason);
        return Response.json({ success: true, data });
      } catch (e) {
        console.warn('Gemini failed, using fallback:', (e as Error).message);
      }
    }

    console.warn('No AI provider available — returning fallback data');
    return Response.json({ success: true, data: fallbackDiscoverResponse });
  } catch (error) {
    console.error('Discover API error:', error);
    return Response.json({ success: true, data: fallbackDiscoverResponse });
  }
}
