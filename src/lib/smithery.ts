import { SMITHERY_NAMESPACE } from './constants';

const SMITHERY_API = 'https://api.smithery.ai';

export const MCP_SERVERS = {
  maps: {
    qualifiedName: 'google-maps',
    mcpUrl: 'https://mapstools.googleapis.com/mcp',
    tools: ['search_places', 'geocode', 'place_details'],
  },
  flights: {
    qualifiedName: 'gvzq/flight-mcp',
    mcpUrl: 'https://server.smithery.ai/gvzq/flight-mcp',
    tools: ['search_flights', 'search_calendar', 'discover_flights', 'get_reference_data'],
  },
  weather: {
    qualifiedName: 'akaramanapp/weather-mcp-server',
    mcpUrl: 'https://server.smithery.ai/akaramanapp/weather-mcp-server',
    tools: ['get_current_weather', 'get_forecast'],
  },
  heritage: {
    qualifiedName: 'social/oral-heritage-index',
    mcpUrl: 'https://server.smithery.ai/social/oral-heritage-index',
    tools: ['search_stories', 'get_story', 'record_story'],
  },
};

export type McpServerKey = keyof typeof MCP_SERVERS;

function getApiKey(): string {
  const key = process.env.SMITHERY_API_KEY;
  if (!key) throw new Error('SMITHERY_API_KEY not configured');
  return key;
}

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getApiKey()}`,
  };
}

async function findOrCreateNamespace(): Promise<string> {
  const key = process.env.SMITHERY_NAMESPACE;
  if (key) return key;

  try {
    const res = await fetch(`${SMITHERY_API}/namespaces`, {
      headers: getHeaders(),
    });
    if (res.ok) {
      const data: { namespaces?: { name: string }[] } = await res.json();
      const namespaces = data.namespaces ?? [];
      if (namespaces.length > 0) return namespaces[0].name;
    }
  } catch {
    /* fall through */
  }

  try {
    await fetch(`${SMITHERY_API}/namespaces`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name: SMITHERY_NAMESPACE }),
    });
  } catch {
    /* namespace may already exist */
  }
  return SMITHERY_NAMESPACE;
}

async function findConnection(namespace: string, qualifiedName: string) {
  try {
    const res = await fetch(
      `${SMITHERY_API}/connect/${namespace}?name=${encodeURIComponent(qualifiedName)}`,
      { headers: getHeaders() },
    );
    if (res.ok) {
      const data: { connections?: { id: string }[] } = await res.json();
      const connections = data.connections ?? [];
      if (connections.length > 0) return connections[0];
    }
  } catch {
    /* not found */
  }
  return null;
}

async function createConnection(namespace: string, qualifiedName: string, mcpUrl: string) {
  const res = await fetch(`${SMITHERY_API}/connect/${namespace}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      name: qualifiedName,
      mcpUrl,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create connection: ${res.status} ${text}`);
  }
  return res.json() as Promise<{ id?: string }>;
}

async function callMcpTool(
  namespace: string,
  connectionId: string,
  tool: string,
  params: Record<string, unknown>,
) {
  const res = await fetch(
    `${SMITHERY_API}/connect/${namespace}/${connectionId}/mcp`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: { name: tool, arguments: params },
        id: 1,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MCP call failed: ${res.status} ${text}`);
  }

  const result: { error?: { message: string }; result?: { content?: unknown[] } } = await res.json();
  if (result.error) throw new Error(`MCP error: ${result.error.message}`);
  return result.result?.content ?? [];
}

export async function callTool(
  serverKey: McpServerKey,
  tool: string,
  params: Record<string, unknown> = {},
) {
  const server = MCP_SERVERS[serverKey];
  const namespace = await findOrCreateNamespace();

  const found = await findConnection(namespace, server.qualifiedName);
  const connection = found ?? await createConnection(namespace, server.qualifiedName, server.mcpUrl);

  return callMcpTool(namespace, (connection as { id: string }).id, tool, params);
}

export async function callMcpDirect(
  mcpUrl: string,
  tool: string,
  params: Record<string, unknown> = {},
) {
  const res = await fetch(mcpUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: tool, arguments: params },
      id: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Direct MCP call failed: ${res.status} ${text}`);
  }

  const result: { error?: { message: string }; result?: { content?: unknown[] } } = await res.json();
  if (result.error) throw new Error(`MCP error: ${result.error.message}`);
  return result.result?.content ?? [];
}
