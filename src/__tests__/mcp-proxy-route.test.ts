import { describe, it, expect } from 'vitest';
import { validateMcpBody, sanitizeString } from '@/lib/validation';

describe('MCP proxy route validation', () => {
  it('validates a complete MCP request', () => {
    const result = validateMcpBody({
      server: 'maps',
      tool: 'search_places',
      params: { query: 'ubud' },
    });
    expect(result.server).toBe('maps');
    expect(result.tool).toBe('search_places');
    expect(result.params.query).toBe('ubud');
  });

  it('rejects missing server', () => {
    expect(() =>
      validateMcpBody({ tool: 'search_places', params: {} }),
    ).toThrow('Missing or invalid server');
  });

  it('rejects empty server', () => {
    expect(() =>
      validateMcpBody({ server: '', tool: 'search_places', params: {} }),
    ).toThrow('Missing or invalid server');
  });

  it('rejects missing tool', () => {
    expect(() =>
      validateMcpBody({ server: 'maps', params: {} }),
    ).toThrow('Missing or invalid tool');
  });

  it('rejects empty tool', () => {
    expect(() =>
      validateMcpBody({ server: 'maps', tool: '', params: {} }),
    ).toThrow('Missing or invalid tool');
  });

  it('defaults params to empty object', () => {
    const result = validateMcpBody({ server: 'maps', tool: 'search_places' });
    expect(result.params).toEqual({});
  });

  it('sanitizes server name removing special characters', () => {
    const result = validateMcpBody({
      server: 'maps<script>',
      tool: 'search_places',
      params: {},
    });
    expect(result.server).toBe('mapsscript');
  });

  it('sanitizes query parameter', () => {
    const query = sanitizeString('  Ubud <script>Village  ');
    expect(query).toBe('Ubud scriptVillage');
  });

  it('validates all known server keys', () => {
    const servers = ['maps', 'flights', 'weather', 'heritage'];
    for (const server of servers) {
      const result = validateMcpBody({
        server,
        tool: 'search_places',
        params: {},
      });
      expect(result.server).toBe(server);
    }
  });
});
