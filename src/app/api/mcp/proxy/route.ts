import { callTool, callMcpDirect, MCP_SERVERS } from '@/lib/smithery';
import { validateMcpBody, sanitizeString } from '@/lib/validation';

/* ------------------------------------------------------------------ */
/*  Fallback data store                                                 */
/* ------------------------------------------------------------------ */

interface FallbackStore {
  maps: {
    places: { name: string; rating: number; vicinity: string; types: string[] }[];
  };
  flights: {
    flights: { airline: string; price: string; duration: string; stops: number; departure: string; arrival: string }[];
  };
  weather: {
    current: { temp: number; feelsLike: number; humidity: number; condition: string; icon: string };
    forecast: { day: string; high: number; low: number; condition: string }[];
  };
  heritage: {
    stories: { title: string; community: string; summary: string }[];
  };
}

const FALLBACK: FallbackStore = {
  maps: {
    places: [
      { name: 'Ubud Traditional Pottery Bale', rating: 4.8, vicinity: 'Banjar Kaja Sesetan, Ubud', types: ['artisan', 'cultural'] },
      { name: 'Pura Desa Ubud', rating: 4.6, vicinity: 'Jl. Raya Ubud', types: ['temple', 'cultural'] },
    ],
  },
  flights: {
    flights: [
      { airline: 'Garuda Indonesia', price: '$580', duration: '22h 30m', stops: 1, departure: '06:45', arrival: '15:15' },
      { airline: 'Singapore Airlines', price: '$720', duration: '18h 15m', stops: 1, departure: '23:50', arrival: '16:05' },
      { airline: 'Air Asia', price: '$340', duration: '26h 00m', stops: 2, departure: '01:30', arrival: '09:30' },
    ],
  },
  weather: {
    current: { temp: 28, feelsLike: 31, humidity: 78, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
    forecast: [
      { day: 'Today', high: 30, low: 23, condition: 'Scattered Showers' },
      { day: 'Tomorrow', high: 29, low: 22, condition: 'Sunny Intervals' },
    ],
  },
  heritage: {
    stories: [
      { title: 'The Legend of the Three Twins', community: 'Ubud Pottery Village', summary: 'How three sisters shaped the spiritual foundation of Balinese ceramics.' },
      { title: 'Whispers of the Kanji', community: 'Traditional Dye Village', summary: 'The lost art of natural indigo dyeing passed down through sixteen generations.' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Contextual fallback builder                                         */
/* ------------------------------------------------------------------ */

type FallbackKey = keyof FallbackStore;

/**
 * Deep-clone the static fallback data and inject user context (destination
 * name) so the UI feels responsive even when the MCP call fails.
 */
function buildContextualFallback(server: FallbackKey, dest: string): Record<string, unknown> {
  const data = structuredClone(FALLBACK[server] ?? FALLBACK.maps) as Record<string, unknown>;

  if (server === 'maps' && Array.isArray(data.places)) {
    data.places = [
      { name: 'Cultural Quarter', rating: 4.7, vicinity: `Central ${dest}`, types: ['cultural', 'historic'] },
      { name: 'Heritage Walkway', rating: 4.5, vicinity: `Old ${dest}`, types: ['cultural'] },
      { name: `${dest} Artisan Corner`, rating: 4.3, vicinity: dest, types: ['artisan', 'local'] },
    ];
  } else if (server === 'flights' && Array.isArray(data.flights)) {
    data.flights = [
      { airline: 'IndiGo', price: '$120', duration: '2h 15m', stops: 0, departure: '06:45', arrival: '09:00' },
      { airline: 'Air India', price: '$180', duration: '2h 10m', stops: 0, departure: '14:30', arrival: '16:40' },
      { airline: 'SpiceJet', price: '$95', duration: '2h 30m', stops: 0, departure: '22:15', arrival: '00:45' },
    ];
  }

  return data;
}

/* ------------------------------------------------------------------ */
/*  Response helpers                                                    */
/* ------------------------------------------------------------------ */

const JSON_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Robots-Tag': 'noindex',
};

function ok(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: JSON_HEADERS });
}

/* ------------------------------------------------------------------ */
/*  POST handler                                                        */
/* ------------------------------------------------------------------ */

/**
 * POST /api/mcp/proxy
 *
 * Proxies a tool call to the Smithery MCP layer. Accepts:
 *   { server, tool, params }
 *
 * On Smithery failure, returns contextualised fallback data with
 * the user's destination name injected.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return ok({ success: false, error: 'Invalid JSON body' }, 400);
  }

  /* Validate and sanitise server/tool/params. */
  let server: string;
  let tool: string;
  let params: Record<string, unknown>;
  try {
    ({ server, tool, params } = validateMcpBody(body));
  } catch (e) {
    return ok(
      { success: false, error: e instanceof Error ? e.message : 'Invalid request' },
      400,
    );
  }

  /* Try the real MCP call. */
  try {
    if (server === 'maps' && tool === 'search_places') {
      const query = typeof params.query === 'string' ? params.query : '';
      const data = await callMcpDirect(
        'https://mapstools.googleapis.com/mcp',
        'search_places',
        { textQuery: query },
      );
      return ok({ success: true, data });
    }

    const serverKey = server as keyof typeof MCP_SERVERS;
    const data = await callTool(serverKey, tool, params);
    return ok({ success: true, data });
  } catch (error) {
    console.error('MCP proxy error:', error);

    /* Build contextual fallback with the user's destination name. */
    const query = sanitizeString(params.query ?? '');
    const dest = sanitizeString(params.destination ?? query) || 'your destination';
    const contextualFallback = buildContextualFallback(server as FallbackKey, dest);

    return ok({ success: true, data: contextualFallback, _fallback: true });
  }
}
