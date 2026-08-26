import { useState, useEffect } from 'react';
import { ref, set, onValue, remove } from 'firebase/database';
import { database } from '../../lib/firebase';
import type { GrowthRecord, Gender } from '../../types';
import { calculateZScore, calculatePercentile } from '../../utils/growthCalculator';
import { removeUndefined } from '../../utils/firebaseData';

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
 * backed by Firebase. Login is mandatory; without a user it yields no records.
 */
export function useGrowthTracking(
  childId: string | null,
  user: { uid: string } | null,
  childGender?: Gender,
  childBirthday?: string
): UseGrowthTrackingResult {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    if (!childId || !user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const recordsRef = ref(database, `children/${childId}/growthRecords`);
    const unsubscribe = onValue(recordsRef, (snapshot) => {
      const data = snapshot.val();
      setRecords(data ? sortRecordsByDate(Object.values(data) as GrowthRecord[]) : []);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [childId, user]);

  const addRecord = async (record: Omit<GrowthRecord, 'id'>): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }
    validateRecord(record);
    const recordWithPercentiles = await calculatePercentiles(record, childGender, childBirthday);
    const newRecord: GrowthRecord = {
      ...recordWithPercentiles,
      id: crypto.randomUUID(),
    };
    const recordRef = ref(database, `children/${childId}/growthRecords/${newRecord.id}`);
    await set(recordRef, removeUndefined(newRecord));
  };

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
    const updated = { ...existing, ...updates };
    validateRecord(updated);
    const updatedWithPercentiles = await calculatePercentiles(updated, childGender, childBirthday);
    const recordRef = ref(database, `children/${childId}/growthRecords/${recordId}`);
    await set(recordRef, removeUndefined({ ...updatedWithPercentiles, id: recordId }));
  };

  const deleteRecord = async (recordId: string): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }
    const recordRef = ref(database, `children/${childId}/growthRecords/${recordId}`);
    await remove(recordRef);
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
