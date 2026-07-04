import { callTool, callMcpDirect, MCP_SERVERS } from '@/lib/smithery';

const FALLBACK: Record<string, unknown> = {
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { server, tool, params } = body;

    if (!server || !tool) {
      return Response.json({ success: false, error: 'Missing server or tool' }, { status: 400 });
    }

    if (server === 'maps' && tool === 'search_places') {
      const data = await callMcpDirect(
        'https://mapstools.googleapis.com/mcp',
        'search_places',
        { textQuery: params?.query ?? '' },
      );
      return Response.json({ success: true, data });
    }

    const serverKey = server as keyof typeof MCP_SERVERS;
    const data = await callTool(serverKey, tool, params ?? {});
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('MCP proxy error:', error);

    const { server: fallbackServer } = await request.json().catch(() => ({}));
    const key = (fallbackServer as string) ?? 'maps';

    return Response.json({
      success: true,
      data: FALLBACK[key] ?? FALLBACK.maps,
      _fallback: true,
    });
  }
}
