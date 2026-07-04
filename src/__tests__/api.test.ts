import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDiscoverExperience } from '@/lib/api';

const mockResponse = {
  discovery_location: 'Test City, Testland',
  recommendations: [
    {
      title: 'Test Place',
      type: 'Artisan Workshop',
      distance_context: '5 min walk',
      the_cultural_hook: 'A deep cultural hook',
      why_for_you: 'Perfect for you',
      interactive_local_tip: 'Go at 3 PM',
    },
  ],
  story_segments: {
    arrival: { ui_subtitle: 'The Arrival', narration_script: 'You arrive and feel...' },
    hidden_detail: { ui_subtitle: 'Hidden Detail', narration_script: 'Look closely at...' },
    living_echo: { ui_subtitle: 'Living Echo', narration_script: 'Listen to...' },
  },
  wholesome_playbook: {
    community_spotlight: 'Meet Wayan',
    the_wholesome_angle: 'His story',
    connection_micro_action: 'Ask about ash',
    supporting_the_soul: 'Skip haggling',
    linguistic_bridge: {
      local_phrase: 'Suksma',
      phonetic_pronunciation: 'SOOK-sma',
      literal_meaning: 'Thank you',
      perfect_moment_to_use: 'After the kiln',
    },
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchDiscoverExperience', () => {
  it('returns a TravelExperience on successful API call', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockResponse }),
    } as Response);

    const result = await fetchDiscoverExperience({
      userLocation: 'Test City',
      userVibe: 'Craft & Heritage',
      currentDateTimeSeason: 'Afternoon',
    });

    expect(result.id).toMatch(/^discover-/);
    expect(result.destination).toBe('Test City, Testland');
    expect(result.vibe).toBe('Artisan Workshop');
    expect(result.hidden_gems.cultural_hook).toBe('A deep cultural hook');
    expect(result.sensory_time_machine).toHaveLength(3);
    expect(result.wholesome_playbook.community_spotlight).toBe('Meet Wayan');
  });

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(
      fetchDiscoverExperience({
        userLocation: 'Test City',
        userVibe: 'Craft & Heritage',
        currentDateTimeSeason: 'Afternoon',
      }),
    ).rejects.toThrow('API error: 500');
  });

  it('throws on unsuccessful API response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    } as Response);

    await expect(
      fetchDiscoverExperience({
        userLocation: 'Test City',
        userVibe: 'Craft & Heritage',
        currentDateTimeSeason: 'Afternoon',
      }),
    ).rejects.toThrow('Invalid API response structure');
  });

  it('throws on missing data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await expect(
      fetchDiscoverExperience({
        userLocation: 'Test City',
        userVibe: 'Craft & Heritage',
        currentDateTimeSeason: 'Afternoon',
      }),
    ).rejects.toThrow('Invalid API response structure');
  });

  it('throws on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await expect(
      fetchDiscoverExperience({
        userLocation: 'Test City',
        userVibe: 'Craft & Heritage',
        currentDateTimeSeason: 'Afternoon',
      }),
    ).rejects.toThrow('Network error');
  });

  it('handles location with special characters after sanitization', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockResponse }),
    } as Response);

    await fetchDiscoverExperience({
      userLocation: '  Paris <script>  ',
      userVibe: 'Craft & Heritage',
      currentDateTimeSeason: 'Afternoon',
    });

    const callBody = JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string);
    expect(callBody.userLocation).toBe('Paris script');
  });

  it('handles empty recommendations gracefully', async () => {
    const emptyRecs = {
      ...mockResponse,
      recommendations: [],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: emptyRecs }),
    } as Response);

    const result = await fetchDiscoverExperience({
      userLocation: 'Paris',
      userVibe: 'Craft & Heritage',
      currentDateTimeSeason: 'Afternoon',
    });

    expect(result.vibe).toBe('');
    expect(result.hidden_gems.cultural_hook).toBe('');
  });
});
