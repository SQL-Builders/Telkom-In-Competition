import { describe, it, expect } from 'vitest';
import { getCompetitionById, formatDaysLeft, isDeadlineUrgent } from './competitions';

describe('Competitions Data Utilities', () => {
  describe('getCompetitionById', () => {
    it('should retrieve the competition if a valid ID is passed', () => {
      const comp = getCompetitionById(1);
      expect(comp).toBeDefined();
      expect(comp?.id).toBe(1);
    });

    it('should handle string input and retrieve the correct competition', () => {
      const comp = getCompetitionById('1');
      expect(comp).toBeDefined();
      expect(comp?.id).toBe(1);
    });

    it('should return undefined if an invalid ID is passed', () => {
      const comp = getCompetitionById(99999);
      expect(comp).toBeUndefined();
    });
  });

  describe('formatDaysLeft', () => {
    it('should return "Closed" for deadlines in the past', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(); // 5 days ago
      expect(formatDaysLeft(pastDate)).toBe('Closed');
    });

    it('should return "1 day left" for a deadline exactly 1 day in the future', () => {
      const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(); // 23 hours in future
      expect(formatDaysLeft(tomorrow)).toBe('1 day left');
    });

    it('should correctly format plural days left', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3.5).toISOString(); // 3.5 days in future
      expect(formatDaysLeft(futureDate)).toBe('4 days left');
    });
  });

  describe('isDeadlineUrgent', () => {
    it('should return true for deadlines within 7 days', () => {
      const soon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(); // 3 days in future
      expect(isDeadlineUrgent(soon)).toBe(true);
    });

    it('should return false for deadlines further than 7 days', () => {
      const far = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(); // 10 days in future
      expect(isDeadlineUrgent(far)).toBe(false);
    });
  });
});
