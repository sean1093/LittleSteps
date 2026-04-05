import { useState, useEffect } from 'react';
import { ref, set, onValue, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import type { GrowthRecord, Gender } from '../types';
import { calculateZScore, calculatePercentile } from '../utils/growthCalculator';

interface UseGrowthTrackingResult {
  records: GrowthRecord[];
  loading: boolean;
  addRecord: (record: Omit<GrowthRecord, 'id'>) => Promise<void>;
  updateRecord: (
    recordId: string,
    updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>
  ) => Promise<void>;
  deleteRecord: (recordId: string) => Promise<void>;
}

/**
 * Hook for managing growth records (weight, height, head circumference)
 * Supports dual-mode: LocalStorage (guest) or Firebase (authenticated)
 */
export function useGrowthTracking(
  childId: string | null,
  user: { uid: string } | null,
  familyId: string | null,
  childGender?: Gender,
  childBirthday?: string
): UseGrowthTrackingResult {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const storageKey = childId ? `growth-records-${childId}` : '';

  // Load records on mount
  useEffect(() => {
    if (!childId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    if (user && familyId) {
      // Firebase mode: Real-time listener
      const recordsRef = ref(
        database,
        `families/${familyId}/children/${childId}/growthRecords`
      );

      const unsubscribe = onValue(recordsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const recordsArray = Object.values(data) as GrowthRecord[];
          setRecords(sortRecordsByDate(recordsArray));
        } else {
          setRecords([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage mode
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as GrowthRecord[];
          setRecords(sortRecordsByDate(parsed));
        }
      } catch (error) {
        console.error('Failed to load growth records from LocalStorage:', error);
      }
      setLoading(false);
    }
  }, [childId, user, familyId, storageKey]);

  /**
   * Add a new growth record
   */
  const addRecord = async (
    record: Omit<GrowthRecord, 'id'>
  ): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    // Validate record
    validateRecord(record);

    // Calculate percentiles if not provided and we have child info
    const recordWithPercentiles = await calculatePercentiles(
      record,
      childGender,
      childBirthday
    );

    const newRecord: GrowthRecord = {
      ...recordWithPercentiles,
      id: `growth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    if (user && familyId) {
      // Firebase mode
      const recordRef = ref(
        database,
        `families/${familyId}/children/${childId}/growthRecords/${newRecord.id}`
      );
      await set(recordRef, newRecord);
    } else {
      // LocalStorage mode - read latest to avoid race conditions
      let currentRecords: GrowthRecord[] = [];
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          currentRecords = JSON.parse(stored);
        }

        const updated = [...currentRecords, newRecord];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setRecords(sortRecordsByDate(updated));
      } catch (error) {
        console.error('Failed to save record to LocalStorage:', error);
        throw error;
      }
    }
  };

  /**
   * Update an existing record
   */
  const updateRecord = async (
    recordId: string,
    updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>
  ): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    const existing = records.find((r) => r.id === recordId);
    if (!existing) {
      throw new Error('Record not found');
    }

    // Merge updates with existing record
    const updated = { ...existing, ...updates };

    // Validate
    validateRecord(updated);

    // Recalculate percentiles if measurements changed
    const updatedWithPercentiles = await calculatePercentiles(
      updated,
      childGender,
      childBirthday
    );

    if (user && familyId) {
      // Firebase mode
      const recordRef = ref(
        database,
        `families/${familyId}/children/${childId}/growthRecords/${recordId}`
      );
      await set(recordRef, { ...updatedWithPercentiles, id: recordId });
    } else {
      // LocalStorage mode
      const updatedRecords = records.map((r) =>
        r.id === recordId ? { ...updatedWithPercentiles, id: recordId } : r
      );
      localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
      setRecords(sortRecordsByDate(updatedRecords));
    }
  };

  /**
   * Delete a record
   */
  const deleteRecord = async (recordId: string): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    if (user && familyId) {
      // Firebase mode
      const recordRef = ref(
        database,
        `families/${familyId}/children/${childId}/growthRecords/${recordId}`
      );
      await remove(recordRef);
    } else {
      // LocalStorage mode
      const filtered = records.filter((r) => r.id !== recordId);
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      setRecords(filtered);
    }
  };

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}

/**
 * Sort records by date (newest first)
 */
function sortRecordsByDate(records: GrowthRecord[]): GrowthRecord[] {
  return [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Validate a growth record
 */
function validateRecord(record: Omit<GrowthRecord, 'id'>): void {
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(record.date)) {
    throw new Error('Invalid date format: must be YYYY-MM-DD');
  }

  // Validate measurements
  if (record.weight !== undefined) {
    if (record.weight < 0) {
      throw new Error('Invalid measurement: weight cannot be negative');
    }
    if (record.weight > 50) {
      throw new Error('Unrealistic measurement: weight over 50kg for infant');
    }
  }

  if (record.height !== undefined) {
    if (record.height < 0) {
      throw new Error('Invalid measurement: height cannot be negative');
    }
    if (record.height > 150) {
      throw new Error('Unrealistic measurement: height over 150cm for infant');
    }
  }

  if (record.headCircumference !== undefined) {
    if (record.headCircumference < 0) {
      throw new Error(
        'Invalid measurement: head circumference cannot be negative'
      );
    }
    if (record.headCircumference > 70) {
      throw new Error(
        'Unrealistic measurement: head circumference over 70cm'
      );
    }
  }
}

/**
 * Calculate percentiles for measurements
 */
async function calculatePercentiles(
  record: Omit<GrowthRecord, 'id'>,
  gender?: Gender,
  birthday?: string
): Promise<Omit<GrowthRecord, 'id'>> {
  // If percentiles already provided, return as-is
  if (
    record.percentile &&
    (record.percentile.weight !== undefined ||
      record.percentile.height !== undefined ||
      record.percentile.headCircumference !== undefined)
  ) {
    return record;
  }

  // Need gender and birthday to calculate percentiles
  if (!gender || !birthday) {
    return record;
  }

  // Calculate age in months
  const birthDate = new Date(birthday);
  const recordDate = new Date(record.date);
  const ageMonths =
    (recordDate.getFullYear() - birthDate.getFullYear()) * 12 +
    (recordDate.getMonth() - birthDate.getMonth()) +
    (recordDate.getDate() - birthDate.getDate()) / 30; // Approximate

  const percentile: {
    weight?: number;
    height?: number;
    headCircumference?: number;
  } = {};

  try {
    if (record.weight !== undefined) {
      const zScore = calculateZScore(record.weight, ageMonths, 'weight', gender);
      percentile.weight = calculatePercentile(zScore);
    }

    if (record.height !== undefined) {
      const zScore = calculateZScore(record.height, ageMonths, 'height', gender);
      percentile.height = calculatePercentile(zScore);
    }

    if (record.headCircumference !== undefined) {
      const zScore = calculateZScore(
        record.headCircumference,
        ageMonths,
        'headCircumference',
        gender
      );
      percentile.headCircumference = calculatePercentile(zScore);
    }
  } catch (error) {
    console.warn('Failed to calculate percentiles:', error);
  }

  return {
    ...record,
    percentile,
  };
}
