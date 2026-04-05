import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGrowthTracking } from './useGrowthTracking';
import type { GrowthRecord } from '../types';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  database: {},
  ref: vi.fn(),
  set: vi.fn(),
  onValue: vi.fn(),
  remove: vi.fn(),
}));

describe('useGrowthTracking', () => {
  const mockChildId = 'child123';
  const mockUser = { uid: 'user123' };
  const mockFamilyId = 'family123';

  const mockGrowthRecord: Omit<GrowthRecord, 'id'> = {
    childId: mockChildId,
    date: '2026-04-05',
    weight: 8.5,
    height: 72,
    headCircumference: 43.5,
    percentile: {
      weight: 50,
      height: 55,
      headCircumference: 48,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Guest Mode (LocalStorage)', () => {
    it('should initialize with empty records', () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      expect(result.current.records).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should add a growth record to LocalStorage', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      await act(async () => {
        await result.current.addRecord(mockGrowthRecord);
      });

      expect(result.current.records).toHaveLength(1);
      expect(result.current.records[0]).toMatchObject(mockGrowthRecord);
      expect(result.current.records[0].id).toBeDefined();
    });

    it('should persist records to LocalStorage', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      await act(async () => {
        await result.current.addRecord(mockGrowthRecord);
      });

      const storageKey = `growth-records-${mockChildId}`;
      const stored = localStorage.getItem(storageKey);
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });

    it('should update an existing record', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      // Add a record
      await act(async () => {
        await result.current.addRecord(mockGrowthRecord);
      });

      const recordId = result.current.records[0].id;

      // Update the record
      await act(async () => {
        await result.current.updateRecord(recordId, {
          weight: 9.0,
        });
      });

      expect(result.current.records[0].weight).toBe(9.0);
      expect(result.current.records[0].height).toBe(72); // Unchanged
    });

    it('should delete a record', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      // Add a record
      await act(async () => {
        await result.current.addRecord(mockGrowthRecord);
      });

      const recordId = result.current.records[0].id;

      // Delete the record
      await act(async () => {
        await result.current.deleteRecord(recordId);
      });

      expect(result.current.records).toHaveLength(0);
    });

    it('should load existing records from LocalStorage on mount', () => {
      const existingRecords: GrowthRecord[] = [
        {
          id: 'record1',
          ...mockGrowthRecord,
          date: '2026-03-01',
        },
        {
          id: 'record2',
          ...mockGrowthRecord,
          date: '2026-04-01',
        },
      ];

      localStorage.setItem(
        `growth-records-${mockChildId}`,
        JSON.stringify(existingRecords)
      );

      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      expect(result.current.records).toHaveLength(2);
      expect(result.current.records).toEqual(existingRecords);
    });

    it('should sort records by date (newest first)', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      await act(async () => {
        await result.current.addRecord({
          ...mockGrowthRecord,
          date: '2026-03-01',
        });
        await result.current.addRecord({
          ...mockGrowthRecord,
          date: '2026-01-01',
        });
        await result.current.addRecord({
          ...mockGrowthRecord,
          date: '2026-02-01',
        });
      });

      expect(result.current.records[0].date).toBe('2026-03-01');
      expect(result.current.records[1].date).toBe('2026-02-01');
      expect(result.current.records[2].date).toBe('2026-01-01');
    });
  });

  describe('Authenticated Mode (Firebase)', () => {
    it('should initialize with loading state', () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, mockUser as any, mockFamilyId)
      );

      expect(result.current.loading).toBe(true);
    });

    it('should add a record to Firebase', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, mockUser as any, mockFamilyId)
      );

      await act(async () => {
        await result.current.addRecord(mockGrowthRecord);
      });

      // Verify Firebase set was called
      const { set } = await import('../lib/firebase');
      expect(set).toHaveBeenCalled();
    });

    it('should return error when no childId provided', () => {
      const { result } = renderHook(() =>
        useGrowthTracking(null, mockUser as any, mockFamilyId)
      );

      expect(result.current.records).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Percentile Calculation', () => {
    it('should automatically calculate percentiles when adding a record', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      const recordWithoutPercentile = {
        childId: mockChildId,
        date: '2026-04-05',
        weight: 8.5,
        height: 72,
        headCircumference: 43.5,
        // No percentile provided
      };

      await act(async () => {
        await result.current.addRecord(recordWithoutPercentile as any);
      });

      // Percentiles should be calculated automatically
      expect(result.current.records[0].percentile).toBeDefined();
      expect(result.current.records[0].percentile?.weight).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully when adding record fails', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      // Mock localStorage.setItem to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      await expect(
        result.current.addRecord(mockGrowthRecord)
      ).rejects.toThrow();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Record Validation', () => {
    it('should reject records with invalid date format', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      const invalidRecord = {
        ...mockGrowthRecord,
        date: 'invalid-date',
      };

      await expect(
        result.current.addRecord(invalidRecord)
      ).rejects.toThrow('Invalid date format');
    });

    it('should reject records with negative measurements', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      const invalidRecord = {
        ...mockGrowthRecord,
        weight: -5,
      };

      await expect(
        result.current.addRecord(invalidRecord)
      ).rejects.toThrow('Invalid measurement');
    });

    it('should reject records with unrealistic measurements', async () => {
      const { result } = renderHook(() =>
        useGrowthTracking(mockChildId, null, null)
      );

      const invalidRecord = {
        ...mockGrowthRecord,
        weight: 50, // 50kg for a baby is unrealistic
      };

      await expect(
        result.current.addRecord(invalidRecord)
      ).rejects.toThrow('Unrealistic measurement');
    });
  });
});
