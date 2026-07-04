import { describe, it, expect } from 'vitest';
import { mockExperience } from '@/lib/mockData';

describe('mockExperience', () => {
  it('has required TravelExperience fields', () => {
    expect(mockExperience).toHaveProperty('id');
    expect(mockExperience).toHaveProperty('destination');
    expect(mockExperience).toHaveProperty('vibe');
    expect(mockExperience).toHaveProperty('hidden_gems');
    expect(mockExperience).toHaveProperty('sensory_time_machine');
    expect(mockExperience).toHaveProperty('wholesome_playbook');
  });

  it('has non-empty destination', () => {
    expect(mockExperience.destination.length).toBeGreaterThan(0);
  });

  it('hidden_gems has all required sub-fields', () => {
    expect(mockExperience.hidden_gems).toHaveProperty('cultural_hook');
    expect(mockExperience.hidden_gems).toHaveProperty('why_for_you');
    expect(mockExperience.hidden_gems).toHaveProperty('local_field_tip');
    expect(mockExperience.hidden_gems.cultural_hook.length).toBeGreaterThan(0);
    expect(mockExperience.hidden_gems.why_for_you.length).toBeGreaterThan(0);
    expect(mockExperience.hidden_gems.local_field_tip.length).toBeGreaterThan(0);
  });

  it('sensory_time_machine has exactly 3 steps', () => {
    expect(mockExperience.sensory_time_machine).toHaveLength(3);
  });

  it('each sensory step has title, description, and duration', () => {
    for (const step of mockExperience.sensory_time_machine) {
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('duration');
      expect(typeof step.title).toBe('string');
      expect(typeof step.description).toBe('string');
      expect(typeof step.duration).toBe('string');
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.description.length).toBeGreaterThan(0);
    }
  });

  it('wholesome_playbook has all required fields', () => {
    const wp = mockExperience.wholesome_playbook;
    expect(wp).toHaveProperty('community_spotlight');
    expect(wp).toHaveProperty('the_wholesome_angle');
    expect(wp).toHaveProperty('connection_micro_action');
    expect(wp).toHaveProperty('supporting_the_soul');
    expect(wp).toHaveProperty('parting_words_of_gratitude');
    expect(wp.parting_words_of_gratitude).toHaveProperty('local_phrase');
    expect(wp.parting_words_of_gratitude).toHaveProperty('phonetic');
    expect(wp.parting_words_of_gratitude).toHaveProperty('emotional_intent');
  });
});
