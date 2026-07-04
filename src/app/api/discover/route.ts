import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { fallbackDiscoverResponse } from '@/lib/fallbackData';
import { validateDiscoverBody } from '@/lib/validation';
import {
  GEMINI_MODELS,
  OPENAI_MODEL,
  OPENAI_TEMPERATURE,
  OPENAI_MAX_TOKENS,
  GEMINI_TEMPERATURE,
  GEMINI_TOP_P,
} from '@/lib/constants';

/* ------------------------------------------------------------------ */
/*  AI client initialisation                                           */
/* ------------------------------------------------------------------ */

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/* ------------------------------------------------------------------ */
/*  Prompt templates                                                    */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT =
  'You are an elite hyper-local guide with encyclopedic knowledge of hidden alleys, off-menu dishes, overlooked architecture, and the stories that tour buses speed past. You know a place not through Wikipedia but through its sounds, smells, and the people who have lived there for decades.\n' +
  '\n' +
  'Your response should feel like a trusted local friend pulling the traveler aside. Prioritize specificity, sensory detail, and actionable intelligence (exact cross streets, best time of day, what to look for, what to skip). You love revealing the kind of detail that makes a traveler feel like they\'ve discovered something genuinely secret.';

const JSON_SCHEMA = `{
  "discovery_location": "string — the specific location/neighborhood",
  "recommendations": [
    {
      "title": "string",
      "type": "string",
      "distance_context": "string",
      "the_cultural_hook": "string",
      "why_for_you": "string",
      "interactive_local_tip": "string"
    }
  ],
  "story_segments": {
    "arrival": { "ui_subtitle": "string", "narration_script": "string" },
    "hidden_detail": { "ui_subtitle": "string", "narration_script": "string" },
    "living_echo": { "ui_subtitle": "string", "narration_script": "string" }
  },
  "wholesome_playbook": {
    "community_spotlight": "string",
    "the_wholesome_angle": "string",
    "connection_micro_action": "string",
    "supporting_the_soul": "string",
    "linguistic_bridge": {
      "local_phrase": "string",
      "phonetic_pronunciation": "string",
      "literal_meaning": "string",
      "perfect_moment_to_use": "string"
    }
  }
}`;

/** Escape user-supplied strings to prevent prompt injection. */
function escapePromptValue(raw: string): string {
  return raw.replace(/["\\\n]/g, ' ').trim();
}

/**
 * Build the user-turn prompt for a given location, vibe and time context.
 */
function buildPrompt(location: string, vibe: string, dateTimeSeason: string): string {
  const loc = escapePromptValue(location);
  return [
    `Generate a curated cultural discovery experience for a traveler visiting ${loc}.`,
    `Traveler's interest: ${vibe}`,
    `Current time/season context: ${dateTimeSeason}`,
    '',
    'Return a JSON object with this exact schema:',
    JSON_SCHEMA,
    '',
    'Rules:',
    `- Return ONLY the JSON object, no markdown fences or extra text.`,
    `- Every string must be original, vivid, and 100% specific to ${loc}.`,
    '- Recommendations must feel like genuine local discoveries.',
    '- Story segments must immerse in sensory details (sights, sounds, smells, textures).',
    '- Distance contexts should be realistic (walking minutes, landmarks).',
    `- The linguistic bridge must use a real local language/dialect appropriate to ${loc}.`,
  ].join('\n');
}

/* ------------------------------------------------------------------ */
/*  Response validation                                                 */
/* ------------------------------------------------------------------ */

/** Ensure the LLM response has all required top-level and nested fields. */
function validateApiResponse(data: unknown) {
  if (!data || typeof data !== 'object') {
    throw new Error('Response is not an object');
  }
  const d = data as Record<string, unknown>;

  if (typeof d.discovery_location !== 'string' || !d.discovery_location.trim()) {
    throw new Error('Missing or invalid discovery_location');
  }
  if (!Array.isArray(d.recommendations) || d.recommendations.length === 0) {
    throw new Error('Missing or empty recommendations');
  }

  const segs = d.story_segments as Record<string, unknown> | undefined;
  if (!segs || typeof segs !== 'object') {
    throw new Error('Missing story_segments');
  }
  for (const key of ['arrival', 'hidden_detail', 'living_echo']) {
    const seg = segs[key] as Record<string, unknown> | undefined;
    if (!seg || typeof seg !== 'object') {
      throw new Error(`Missing story segment: ${key}`);
    }
  }

  if (!d.wholesome_playbook || typeof d.wholesome_playbook !== 'object') {
    throw new Error('Missing wholesome_playbook');
  }

  return data as typeof fallbackDiscoverResponse;
}

/* ------------------------------------------------------------------ */
/*  AI provider wrappers                                                */
/* ------------------------------------------------------------------ */

/** Call OpenAI gpt-4o-mini with structured JSON output. */
async function tryOpenAI(location: string, vibe: string, dateTimeSeason: string) {
  if (!openai) throw new Error('OpenAI not configured');

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildPrompt(location, vibe, dateTimeSeason) },
    ],
    response_format: { type: 'json_object' },
    temperature: OPENAI_TEMPERATURE,
    max_tokens: OPENAI_MAX_TOKENS,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned empty response');
  return validateApiResponse(JSON.parse(text));
}

/** Iterate through GEMINI_MODELS until one succeeds. */
async function tryGemini(location: string, vibe: string, dateTimeSeason: string) {
  if (!genAI) throw new Error('Gemini not configured');

  const prompt = buildPrompt(location, vibe, dateTimeSeason);

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          temperature: GEMINI_TEMPERATURE,
          topP: GEMINI_TOP_P,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
      return validateApiResponse(JSON.parse(cleaned));
    } catch (e) {
      console.warn(`Gemini model ${modelName} failed:`, (e as Error).message);
    }
  }

  throw new Error('All Gemini models failed');
}

/* ------------------------------------------------------------------ */
/*  Response helpers                                                    */
/* ------------------------------------------------------------------ */

const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Robots-Tag': 'noindex',
};

/** Build a successful JSON Response. */
function ok(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: JSON_HEADERS });
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                        */
/* ------------------------------------------------------------------ */

/**
 * POST /api/discover
 *
 * Accepts { userLocation, userVibe, currentDateTimeSeason }.
 * Returns AI-generated travel experience with fallback chain:
 *   OpenAI → Gemini (4 models) → static fallback.
 */
export async function POST(request: Request) {
  try {
    const body: Record<string, unknown> = await request.json().catch(() => {
      throw new Error('Invalid JSON body');
    });
    const { userLocation, userVibe, currentDateTimeSeason } = validateDiscoverBody(body);

    /* Short-circuit for empty location — return fallback immediately. */
    if (!userLocation.trim()) {
      return ok({ success: true, data: fallbackDiscoverResponse });
    }

    /* Try OpenAI first (cheapest + highest quality). */
    if (openai) {
      try {
        const data = await tryOpenAI(userLocation, userVibe, currentDateTimeSeason);
        return ok({ success: true, data });
      } catch (e) {
        console.warn('OpenAI failed, trying Gemini:', (e as Error).message);
      }
    }

    /* Fallback to Gemini models. */
    if (genAI) {
      try {
        const data = await tryGemini(userLocation, userVibe, currentDateTimeSeason);
        return ok({ success: true, data });
      } catch (e) {
        console.warn('Gemini failed, using fallback:', (e as Error).message);
      }
    }

    /* No AI provider available. */
    console.warn('No AI provider available \u2014 returning fallback data');
    return ok({ success: true, data: fallbackDiscoverResponse });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Discover API error:', message);
    return ok({ success: true, data: fallbackDiscoverResponse });
  }
}
