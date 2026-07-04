import { describe, it, expect } from 'vitest';
import { fallbackDiscoverResponse } from '@/lib/fallbackData';

describe('fallbackDiscoverResponse', () => {
  it('has required top-level fields', () => {
    expect(fallbackDiscoverResponse).toHaveProperty('discovery_location');
    expect(fallbackDiscoverResponse).toHaveProperty('recommendations');
    expect(fallbackDiscoverResponse).toHaveProperty('story_segments');
    expect(fallbackDiscoverResponse).toHaveProperty('wholesome_playbook');
  });

  it('has a non-empty discovery_location', () => {
    expect(fallbackDiscoverResponse.discovery_location.length).toBeGreaterThan(0);
  });

  it('has at least one recommendation', () => {
    expect(fallbackDiscoverResponse.recommendations.length).toBeGreaterThanOrEqual(1);
  });

  it('each recommendation has required fields', () => {
    for (const rec of fallbackDiscoverResponse.recommendations) {
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('type');
      expect(rec).toHaveProperty('distance_context');
      expect(rec).toHaveProperty('the_cultural_hook');
      expect(rec).toHaveProperty('why_for_you');
      expect(rec).toHaveProperty('interactive_local_tip');
      expect(typeof rec.title).toBe('string');
      expect(typeof rec.the_cultural_hook).toBe('string');
    }
  });

  it('has all three story segments', () => {
    const segs = fallbackDiscoverResponse.story_segments;
    expect(segs).toHaveProperty('arrival');
    expect(segs).toHaveProperty('hidden_detail');
    expect(segs).toHaveProperty('living_echo');
    expect(segs.arrival).toHaveProperty('ui_subtitle');
    expect(segs.arrival).toHaveProperty('narration_script');
    expect(segs.hidden_detail).toHaveProperty('ui_subtitle');
    expect(segs.hidden_detail).toHaveProperty('narration_script');
    expect(segs.living_echo).toHaveProperty('ui_subtitle');
    expect(segs.living_echo).toHaveProperty('narration_script');
  });

  it('has wholesome playbook with linguistic bridge', () => {
    const wp = fallbackDiscoverResponse.wholesome_playbook;
    expect(wp).toHaveProperty('community_spotlight');
    expect(wp).toHaveProperty('the_wholesome_angle');
    expect(wp).toHaveProperty('connection_micro_action');
    expect(wp).toHaveProperty('supporting_the_soul');
    expect(wp).toHaveProperty('linguistic_bridge');
    expect(wp.linguistic_bridge).toHaveProperty('local_phrase');
    expect(wp.linguistic_bridge).toHaveProperty('phonetic_pronunciation');
    expect(wp.linguistic_bridge).toHaveProperty('literal_meaning');
    expect(wp.linguistic_bridge).toHaveProperty('perfect_moment_to_use');
  });

  it('all string values are non-empty', () => {
    const strings: string[] = [
      fallbackDiscoverResponse.discovery_location,
      ...fallbackDiscoverResponse.recommendations.flatMap((r) => [
        r.title, r.type, r.distance_context, r.the_cultural_hook,
        r.why_for_you, r.interactive_local_tip,
      ]),
      fallbackDiscoverResponse.story_segments.arrival.ui_subtitle,
      fallbackDiscoverResponse.story_segments.arrival.narration_script,
      fallbackDiscoverResponse.story_segments.hidden_detail.ui_subtitle,
      fallbackDiscoverResponse.story_segments.hidden_detail.narration_script,
      fallbackDiscoverResponse.story_segments.living_echo.ui_subtitle,
      fallbackDiscoverResponse.story_segments.living_echo.narration_script,
      fallbackDiscoverResponse.wholesome_playbook.community_spotlight,
      fallbackDiscoverResponse.wholesome_playbook.the_wholesome_angle,
      fallbackDiscoverResponse.wholesome_playbook.connection_micro_action,
      fallbackDiscoverResponse.wholesome_playbook.supporting_the_soul,
      fallbackDiscoverResponse.wholesome_playbook.linguistic_bridge.local_phrase,
      fallbackDiscoverResponse.wholesome_playbook.linguistic_bridge.phonetic_pronunciation,
      fallbackDiscoverResponse.wholesome_playbook.linguistic_bridge.literal_meaning,
      fallbackDiscoverResponse.wholesome_playbook.linguistic_bridge.perfect_moment_to_use,
    ];

    for (const s of strings) {
      expect(s.length).toBeGreaterThan(0);
    }
  });
});
